import * as Sentry from '@sentry/electron';
import { type ChildProcessWithoutNullStreams } from 'child_process';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  type MessageBoxOptions,
  shell,
} from 'electron';
import logger from 'electron-log';
import prepareRenderer from 'electron-next';
import fs from 'fs';
import { unlink } from 'fs/promises';
import { glob } from 'glob';
import Jimp from 'jimp';
import { join } from 'path';
import { format } from 'url';
import { modelsPath } from './binaries';
import commands from './commands';
import { spawnUpscale } from './upscale';
import { getBatchArguments } from './utils';

if (require('electron-squirrel-startup') === true) app.quit();

Sentry.init({
  dsn: 'https://21f64d225af042bfa35731a0abd72c82@o390513.ingest.sentry.io/4505589747351552',
});

logger.initialize({ preload: true });

const childProcesses: Array<{
  process: ChildProcessWithoutNullStreams;
  kill: () => boolean;
}> = [];
let mainWindow: BrowserWindow;

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on('ready', async () => {
  await prepareRenderer('./renderer');

  mainWindow = new BrowserWindow({
    icon: join(__dirname, 'build', 'icon.png'),
    width: 650,
    height: 650,
    minWidth: 500,
    minHeight: 500,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);

  const url = app.isPackaged
    ? format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:8000';

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.setZoomFactor(1);
  });

  mainWindow
    .loadURL(url)
    .then((): void => {
      logger.info('Main window is loaded');
    })
    .catch((error): void => {
      logger.error('Loading main window failed', error);
    });
});

app.on('window-all-closed', app.quit);

logger.info(`App path: ${app.getAppPath()}`);

let folderPath: string | undefined;
let stopped = false;

ipcMain.handle(commands.SELECT_FOLDER, async () => {
  const { canceled, filePaths: folderPaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: folderPath,
  });

  if (canceled) {
    return null;
  }

  const [selectedFolder] = folderPaths;
  const selectedFolderPosix = selectedFolder.replace(/\\/g, '/');

  const inputDirFiles = await glob(selectedFolderPosix + '/**/*.*', {
    dot: true,
  });
  const imagesFiles = await glob(
    selectedFolderPosix + '/**/*.{png,jpg,jpeg,webp}',
    {
      dot: true,
    },
  );
  if (inputDirFiles.length === 0 && imagesFiles.length === 0) {
    const options: MessageBoxOptions = {
      type: 'error',
      title: 'Folder is empty',
      message: "The selected folder doesn't contain any images.",
    };
    dialog.showMessageBoxSync(mainWindow, options);
    return null;
  }
  if (inputDirFiles.length - imagesFiles.length !== 0) {
    const options: MessageBoxOptions = {
      type: 'error',
      title: 'Folder contains invalid files',
      message:
        'The selected folder should contain only PNG, JPG, JPEG and WEBP images.\nPlease check if there are any hidden files in the selected folder.',
    };
    dialog.showMessageBoxSync(mainWindow, options);
    return null;
  }

  folderPath = selectedFolder;
  return [selectedFolder, imagesFiles.length];
});

ipcMain.on(commands.OPEN_FOLDER, (_, payload) => {
  shell
    .openPath(payload)
    .then(() => {})
    .catch(() => {});
});

ipcMain.on(commands.STOP, () => {
  stopped = true;

  childProcesses.forEach((child) => child.kill());
});

// eslint-disable-next-line
ipcMain.on(commands.FOLDER_UPSCALE, async (_, payload) => {
  const inputDir = payload.batchFolderPath as string;

  const model = payload.model;
  const gpuId = payload.gpuId;
  const saveImageAs = payload.saveImageAs;
  const scale = payload.scaleFactor as string;

  const outputDir: string = payload.outputPath;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const upscaler = spawnUpscale(
    'realesrgan',
    getBatchArguments(
      inputDir,
      outputDir,
      modelsPath,
      model,
      gpuId,
      saveImageAs,
      scale,
    ),
  );

  childProcesses.push(upscaler);

  stopped = false;
  let failed = false;

  const onData = (data: any): void => {
    const stringifiedData: string = data.toString();
    mainWindow.webContents.send(
      commands.FOLDER_UPSCALE_PROGRESS,
      stringifiedData,
    );
    if (
      stringifiedData.includes('invalid gpu') ||
      stringifiedData.includes('failed')
    ) {
      logger.error('Unexpected error', stringifiedData);
      failed = true;
    }
  };

  const onError = (data: any): void => {
    mainWindow.webContents.send(
      commands.FOLDER_UPSCALE_PROGRESS,
      data.toString(),
    );
    failed = true;
  };

  const convertToJpg = async (filePath: string): Promise<void> => {
    const [file] = filePath.split('.');
    const image = await Jimp.read(filePath);
    image.quality(100).write(`${file}.jpg`);
  };

  const onExit = async (): Promise<void> => {
    const outputDirPosix = outputDir.replace(/\\/g, '/') + '/**/*.png';
    const files = await glob(outputDirPosix);
    await Promise.all(
      files.map(async (file) => {
        await convertToJpg(file);
      }),
    );
    await Promise.all(
      files.map(async (file) => {
        await unlink(file);
      }),
    );

    if (!failed && !stopped) {
      mainWindow.webContents.send(commands.FOLDER_UPSCALE_DONE, outputDir);
    }
  };

  upscaler.process.stderr.on('data', onData);
  upscaler.process.on('error', onError);
  // eslint-disable-next-line
  upscaler.process.on('exit', onExit);
});
