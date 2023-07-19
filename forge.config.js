module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        bin: 'Electron Starter',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      config: {
        bin: 'Electron Starter',
      },
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'Electron Starter',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'Electron Starter',
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
          owner: 'delimitertech',
          name: 'electron-starter',
        },
        prerelease: true,
      },
    },
  ],
};
