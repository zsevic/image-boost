import { type ChildProcessWithoutNullStreams } from 'child_process';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
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
    width: 600,
    height: 600,
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
const defaultModels = ['realesrgan-x4plus-anime'];
let customModelsFolderPath: string | undefined;
let outputFolderPath: string | undefined;
let saveOutputFolder;
let stopped = false;

ipcMain.handle(commands.SELECT_FOLDER, async () => {
  const { canceled, filePaths: folderPaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: folderPath,
  });

  if (canceled) {
    return null;
  } else {
    folderPath = folderPaths[0];
    return folderPaths[0];
  }
});

ipcMain.on(commands.OPEN_FOLDER, (_, payload) => {
  shell
    .openPath(payload)
    .then(() => {})
    .catch(() => {});
});

ipcMain.on(commands.STOP, () => {
  stopped = true;

  childProcesses.forEach((child) => {
    child.kill();
  });
});

// eslint-disable-next-line
ipcMain.on(commands.FOLDER_UPSCALE, async (_, payload) => {
  const model = payload.model;
  const gpuId = payload.gpuId;
  const saveImageAs = payload.saveImageAs;
  const scale = payload.scale as string;

  const inputDir = payload.batchFolderPath;

  let outputDir: string = payload.outputPath;

  if (
    saveOutputFolder !== '' &&
    outputFolderPath !== undefined &&
    outputFolderPath !== ''
  ) {
    outputDir = outputFolderPath;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const isDefaultModel = defaultModels.includes(model);

  const upscaler = spawnUpscale(
    'realesrgan',
    getBatchArguments(
      inputDir,
      outputDir,
      isDefaultModel ? modelsPath : customModelsFolderPath ?? modelsPath,
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
      data.toString(),
    );
    if (
      stringifiedData.includes('invalid gpu') ||
      stringifiedData.includes('failed')
    ) {
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
  const onClose = (): void => {
    if (!failed && !stopped) {
      mainWindow.webContents.send(commands.FOLDER_UPSCALE_DONE, outputDir);
    }
  };

  const convertToJpg = async (filePath): Promise<void> => {
    const [file] = filePath.split('.');
    const image = await Jimp.read(filePath);
    image.write(`${file as string}.jpg`);
  };

  const onExit = async (): Promise<void> => {
    const filesGlob = outputDir + '/**/*.png';
    const files = await glob(filesGlob);
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
  };

  upscaler.process.stderr.on('data', onData);
  upscaler.process.on('error', onError);
  // eslint-disable-next-line
  upscaler.process.on('exit', onExit);
  upscaler.process.on('close', onClose);
});
