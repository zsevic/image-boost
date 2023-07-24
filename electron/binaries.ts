import { app } from 'electron';
import { join, resolve } from 'path';
import getPlatform from './get-platform';

const rootDir = app.isPackaged ? process.resourcesPath : app.getAppPath();

const binariesPath = join(rootDir, 'resources', getPlatform(), 'bin');

const execPath = (execName: string): string =>
  resolve(join(binariesPath, execName));

const modelsPath = resolve(join(rootDir, 'resources', 'models'));

export { execPath, modelsPath };
