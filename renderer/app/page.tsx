'use client';

import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { emailAtom, isLoggedInAtom, licenseKeyAtom } from '../atoms/login-atom';
import ProgressBar from '../components/progress-bar';
import Login from '../components/login';
import request from '../utils/request';
import commands from '../../electron/commands';
import { trackEvent } from '../utils/analytics';

const Home = (): React.JSX.Element => {
  const [outputPath, setOutputPath] = useState('');
  const [scaleFactor] = useState('4');
  const [progress, setProgress] = useState('');
  const [model] = useState('realesrgan-x4plus-anime');
  const [batchFolderPath, setBatchFolderPath] = useState('');
  const [upscaledBatchFolderPath, setUpscaledBatchFolderPath] = useState('');
  const [saveImageAs] = useState('png');
  const [numberOfImagesForUpscaling, setNumberOfImagesForUpscaling] =
    useState(0);
  const [numberOfUpscaledImages, setNumberOfUpscaledImages] = useState(-1);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom);
  const [isUpscaling, setIsUpscaling] = useState(false);

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
      setIsUpscaling(false);
      trackEvent('upscale-finished', 'upscale-finished');
    });
  }, []);

  const resetImagePaths = (): void => {
    setProgress('');

    setBatchFolderPath('');
    setUpscaledBatchFolderPath('');
    setNumberOfUpscaledImages(-1);
    setIsUpscaling(false);
  };

  useEffect(() => {
    if (progress.trim() === '0.00%') {
      setNumberOfUpscaledImages(numberOfUpscaledImages + 1);
    }
  }, [progress]);

  const selectFolderHandler = async (): Promise<void> => {
    resetImagePaths();

    const folderInfo = await window.electron.invoke(commands.SELECT_FOLDER);

    if (folderInfo !== null) {
      const [path, numberOfImages] = folderInfo;
      setNumberOfImagesForUpscaling(numberOfImages);
      setBatchFolderPath(path);
      setOutputPath(`${path as string}_upscaled`);
      trackEvent('selected-folder', 'selected-folder');
    } else {
      setBatchFolderPath('');
      setOutputPath('');
      setNumberOfImagesForUpscaling(0);
    }
  };

  const openUpscaledFolderHandler = (): void => {
    window.electron.send(commands.OPEN_FOLDER, upscaledBatchFolderPath);
    trackEvent('upscale-finished-open-folder', 'upscale-finished-open-folder');
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
      setIsUpscaling(true);
      trackEvent('upscale-start', 'upscale-start');
    } else {
      alert('Please select a folder with images to upscale');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      request
        .post('/licenses/verify', {
          email,
          licenseKey,
        })
        .then(() => {
          console.log('License verified');
        })
        .catch((error) => {
          if (error?.code === 'NETWORK_ERROR' || error?.code === 'ERR_NETWORK') {
            return;
          }
          if (error?.response?.status === 401) {
            setIsLoggedIn(false);
            setEmail('');
            setLicenseKey('');
            return;
          }
          console.error(error);
        });
    }
  }, [isLoggedIn]);

  const stopHandler = (): void => {
    window.electron.send(commands.STOP);
    resetImagePaths();
    trackEvent('upscale-stop', 'upscale-stop');
  };

  return !isLoggedIn ? (
    <Login />
  ) : (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Image Boost</h1>
      <p className="mb-2">
        Please select a folder containing images to upscale
      </p>
      <p className="mb-4">
        It should contain only PNG, JPG, JPEG and WEBP images
      </p>
      <div className="flex flex-col mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2 mx-5 disabled:bg-blue-200"
          disabled={isUpscaling}
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
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none mb-2 mx-5 disabled:bg-green-500"
            onClick={upscaleHandler}
            disabled={isUpscaling}
          >
            {isUpscaling ? <><svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin fill-green-600" viewBox="0 0 100 101" fill="none">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>Upscaling...</>
            : 'Upscale'}
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
              onClick={openUpscaledFolderHandler}
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
