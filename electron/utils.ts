export const getBatchArguments = (
  inputDir: string,
  outputDir: string,
  modelsPath: string,
  model: string,
  gpuId: string,
  saveImageAs: string,
  scale: string,
): string[] => {
  return [
    '-i',
    inputDir,
    '-o',
    outputDir,
    '-s',
    scale,
    '-m',
    modelsPath,
    '-n',
    model,
    gpuId !== '' ? '-g' : '',
    gpuId !== '' ? gpuId : '',
    '-f',
    saveImageAs,
  ];
};
