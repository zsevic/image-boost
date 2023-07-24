import React, { useEffect, useState } from 'react';
import commands from '../../electron/commands';
import ProgressBar from '../components/progress-bar';

// eslint-disable-next-line
const Home = () => {
  const [outputPath, setOutputPath] = useState('');
  const [scaleFactor] = useState('4');
  const [progress, setProgress] = useState('');
  const [model] = useState('realesrgan-x4plus-anime');
  const [batchFolderPath, setBatchFolderPath] = useState('');
  const [upscaledBatchFolderPath, setUpscaledBatchFolderPath] = useState('');
  const [saveImageAs] = useState('png');
  const [numberOfImagesForUpscaling, setNumberOfImagesForUpscaling] =
    useState(0);
  const [numberOfUpscaledImages, setNumberOfUpscaledImages] = useState(0);

  useEffect(() => {
    const handleErrors = (data: string): void => {
      if (data.includes('invalid gpu')) {
        alert(
          'Error. Please make sure you have a Vulkan compatible GPU (Most modern GPUs support Vulkan). ImageBoost does not work with CPU or iGPU.',
        );
        resetImagePaths();
      } else if (data.includes('uncaughtException')) {
        alert(
          'ImageBoost encountered an error. Possibly, the ImageBoost binary failed to execute the commands properly.',
        );
        resetImagePaths();
      }
    };

    window.electron.on(commands.FOLDER_UPSCALE_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data);
      }
      handleErrors(data);
    });

    window.electron.on(commands.FOLDER_UPSCALE_DONE, (_, data: string) => {
      setProgress('');
      setUpscaledBatchFolderPath(data);
    });
  }, []);

  const resetImagePaths = (): void => {
    setProgress('');

    setBatchFolderPath('');
    setUpscaledBatchFolderPath('');
  };

  const selectFolderHandler = async (): Promise<void> => {
    resetImagePaths();

    const folderInfo = await window.electron.invoke(commands.SELECT_FOLDER);

    if (folderInfo !== null) {
      const [path, numberOfImages] = folderInfo;
      setNumberOfImagesForUpscaling(numberOfImages);
      setNumberOfUpscaledImages(0);
      setBatchFolderPath(path);
      setOutputPath(`${path as string}_upscaled`);
    } else {
      setBatchFolderPath('');
      setOutputPath('');
      setNumberOfUpscaledImages(0);
      setNumberOfImagesForUpscaling(0);
    }
  };

  const openFolderHandler = (): void => {
    window.electron.send(commands.OPEN_FOLDER, upscaledBatchFolderPath);
  };

  const upscaleHandler = (): void => {
    if (batchFolderPath !== '') {
      setProgress('Starting upscaling...');

      window.electron.send(commands.FOLDER_UPSCALE, {
        scaleFactor,
        batchFolderPath,
        outputPath,
        model,
        gpuId: null,
        saveImageAs,
      });
    } else {
      alert('Please select a folder with images to upscale');
    }
  };

  const stopHandler = (): void => {
    window.electron.send(commands.STOP);
    resetImagePaths();
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Image Boost</h1>
      <p className="mb-2">
        Please select a folder containing images to upscale
      </p>
      <p className="mb-4">
        It shouldn&apos;t contain anything except PNG, JPG, JPEG and WEBP images
      </p>
      <div className="flex flex-col mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2"
          // eslint-disable-next-line
          onClick={selectFolderHandler}
        >
          Select Folder
        </button>
        {upscaledBatchFolderPath.length === 0 && batchFolderPath.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Folder selected: {batchFolderPath}
          </p>
        )}

        <p className="mb-4">
          {' '}
          The upscaled images will be saved as JPG images.
        </p>

        {upscaledBatchFolderPath.length === 0 && batchFolderPath.length > 0 && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={upscaleHandler}
            disabled={progress.length > 0}
          >
            {progress.length > 0 ? 'Upscaling...' : 'Upscale'}
          </button>
        )}
        {progress.length > 0 && upscaledBatchFolderPath.length === 0 ? (
          <ProgressBar
            progress={progress}
            numberOfUpscaledImages={numberOfUpscaledImages}
            numberOfImagesForUpscaling={numberOfImagesForUpscaling}
            stopHandler={stopHandler}
          />
        ) : null}
        {upscaledBatchFolderPath.length === 0 && batchFolderPath.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Folder with upscaled images: {outputPath}
          </p>
        )}
        {upscaledBatchFolderPath.length > 0 && (
          <div className="pt-8 text-center">
            <p className="select-none py-4 font-bold text-3xl text-green-500">
              Upscaling is finished!
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={openFolderHandler}
            >
              Open Upscaled Folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
