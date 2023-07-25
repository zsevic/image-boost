const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(process.cwd(), 'main', 'build', 'icon'),
    extraResource: ['resources'],
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
        options: {
          icon: path.join(process.cwd(), 'main', 'build', 'icon.png'),
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'Image Boost',
        icon: path.join(process.cwd(), 'main', 'build', 'icon.png'),
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
