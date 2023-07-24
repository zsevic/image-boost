import { type ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { execPath } from './binaries';

export const spawnUpscale = (
  binaryName: string,
  command: string[],
): {
  process: ChildProcessWithoutNullStreams;
  kill: () => boolean;
} => {
  const spawnedProcess = spawn(execPath(binaryName), command, {
    cwd: undefined,
    detached: false,
  });

  return {
    process: spawnedProcess,
    kill: () => spawnedProcess.kill(),
  };
};
