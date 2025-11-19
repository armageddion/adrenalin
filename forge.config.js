const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    // Ensure native modules are unpacked to avoid issues at runtime
    extraResource: [
      './db/schema.sqlite',
      './db/seed.sqlite'
    ]
  },
  // Add force rebuild to ensure C++ compilation targets the specific Electron version
  rebuildConfig: {
    force: true,
    onlyModules: ['better-sqlite3']
  },
  makers: [
    // ... existing makers ...
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Armageddion',
        description: 'Adrenalin CRM application'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'armageddion',
          name: 'adrenalin'
        },
        prerelease: true,
        draft: false
      }
    }
  ]
};