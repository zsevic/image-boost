import { app, BrowserWindow } from 'electron';
import logger from 'electron-log';
import prepareRenderer from 'electron-next';
import { join } from 'path';
import { format } from 'url';

logger.initialize({ preload: true });

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on('ready', async () => {
  await prepareRenderer('./renderer');

  const mainWindow = new BrowserWindow({
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
