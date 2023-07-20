module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        bin: 'Image Boost',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      config: {
        bin: 'Image Boost',
      },
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'Image Boost',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'Image Boost',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'zsevic',
          name: 'image-boost',
        },
        prerelease: true,
      },
    },
  ],
};
