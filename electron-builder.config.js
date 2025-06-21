/**
 * Electron Builder Configuration (VS Code Inspired)
 */

module.exports = {
  appId: 'com.yourcompany.yourapp',
  productName: 'Your Enterprise App',
  copyright: 'Copyright © 2024 Your Company',
  
  directories: {
    output: 'dist/electron',
    buildResources: 'build'
  },
  
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json'
  ],
  
  extraMetadata: {
    main: 'dist/electron/main.js'
  },
  
  // Windows Configuration
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32']
      },
      {
        target: 'portable',
        arch: ['x64', 'ia32']
      }
    ],
    icon: 'build/icon.ico',
    publisherName: 'Your Company',
    verifyUpdateCodeSignature: false
  },
  
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Your Enterprise App'
  },
  
  // macOS Configuration
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64']
      }
    ],
    icon: 'build/icon.icns',
    category: 'public.app-category.productivity',
    hardenedRuntime: true,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist'
  },
  
  dmg: {
    title: 'Your Enterprise App',
    icon: 'build/icon.icns',
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications'
      }
    ]
  },
  
  // Linux Configuration
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64', 'arm64']
      },
      {
        target: 'deb',
        arch: ['x64', 'arm64']
      },
      {
        target: 'rpm',
        arch: ['x64', 'arm64']
      }
    ],
    icon: 'build/icon.png',
    category: 'Office'
  },
  
  // Auto-updater
  publish: {
    provider: 'github',
    owner: 'your-username',
    repo: 'your-repo'
  },
  
  // Code Signing (for production)
  afterSign: 'scripts/notarize.js',
  
  // Compression
  compression: 'maximum',
  
  // Protocols
  protocols: [
    {
      name: 'Your App Protocol',
      schemes: ['yourapp']
    }
  ]
} 