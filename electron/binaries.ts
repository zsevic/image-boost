/* 
  appRootDir is the resources directory inside the unpacked electron app temp directory.
  resources contains app.asar file, that contains the main and renderer files.
  We're putting resources/{os}/bin from project inside resources/bin of electron. Same for the models directory as well.
*/

import { join, dirname, resolve } from 'path';
import getPlatform from './get-platform';
import { app } from 'electron';

const appRootDir = app.getAppPath();

const binariesPath = app.isPackaged
  ? join(dirname(appRootDir), 'bin')
  : join(appRootDir, 'resources', getPlatform(), 'bin');

const execPath = (execName: string): string =>
  resolve(join(binariesPath, execName));

const modelsPath = app.isPackaged
  ? resolve(join(dirname(appRootDir), 'models'))
  : resolve(join(appRootDir, 'resources', 'models'));

export { execPath, modelsPath };
