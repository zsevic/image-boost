import React, { useState } from 'react';

// eslint-disable-next-line
const Home = () => {
  const [folderSelected, setFolderSelected] = useState(false);

  const handleFolderSelect = (): void => {
    setFolderSelected(true);
  };

  const handleUpscale = (): void => {
    alert('Upscaling images...');
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Image Boost</h1>
      <p className="mb-4">
        Please select a folder containing images to upscale, it shouldn&apos;t
        contain anything except PNG, JPG, JPEG and WEBP images
      </p>
      <div className="flex flex-col mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2"
          onClick={handleFolderSelect}
        >
          Select Folder
        </button>
        {folderSelected && (
          <p className="text-sm text-gray-600 mb-4">
            Folder selected: /path/to/your/folder
          </p>
        )}

        <p className="mb-4">
          {' '}
          The upscaled images will be saved as JPG images.
        </p>

        {folderSelected && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={handleUpscale}
          >
            Upscale Images
          </button>
        )}
        {folderSelected && (
          <p className="text-sm text-gray-600 mb-4">
            Folder with upscaled images: /path/to/your/folder_upscaled
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
