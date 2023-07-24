import React from 'react';

// eslint-disable-next-line
function ProgressBar({ progress, stopHandler }) {
  return (
    <div className="flex flex-col items-center justify-center bg-base-300/50">
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="rounded-full bg-base-300 px-2 py-1 font-bold">
          {progress}
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
