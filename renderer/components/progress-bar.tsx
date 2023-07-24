import React from 'react';
import Spinner from './icons/spinner';

// eslint-disable-next-line
function ProgressBar({ progress, stopHandler }) {
  return (
    <div className="absolute flex h-full w-full flex-col items-center justify-center bg-base-300/50 backdrop-blur-lg">
      <div className="flex flex-col items-center gap-2">
        <p className="rounded-full bg-base-300 px-2 py-1 font-bold">
          {progress}
        </p>
        <p className="rounded-full bg-base-300 px-2 py-1 text-sm font-medium">
          Doing the ImageBoost magic...
        </p>
        <button onClick={stopHandler} className="btn-primary btn">
          STOP
        </button>
      </div>
    </div>
  );
}

export default ProgressBar;
