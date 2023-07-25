import React from 'react';
import { getNumberWithOrdinal } from '../utils';

interface ProgressBarProps {
  progress: string;
  stopHandler: () => void;
  numberOfUpscaledImages: number;
  numberOfImagesForUpscaling: number;
}

function ProgressBar(props: ProgressBarProps): React.JSX.Element {
  const {
    numberOfImagesForUpscaling,
    numberOfUpscaledImages,
    progress,
    stopHandler,
  } = props;

  return (
    <div className="flex flex-col items-center justify-center bg-base-300/50">
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="m-2">
          {progress.includes('%') ? numberOfUpscaledImages : 0} out of{' '}
          {numberOfImagesForUpscaling} images upscaled
        </p>
        <p className="rounded-full bg-base-300 px-2 py-1 font-bold">
          {progress.includes('%')
            ? `${progress} of ${
                numberOfUpscaledImages + 1
              }${getNumberWithOrdinal(
                numberOfUpscaledImages + 1,
              )} image finished`
            : progress}
        </p>
        <button
          onClick={stopHandler}
          className="bg-red-500 text-white font-bold p-2 mb-4 rounded"
        >
          STOP
        </button>
      </div>
    </div>
  );
}

export default ProgressBar;
