import { app, BrowserWindow, Menu, ipcMain, shell, Notification } from 'electron'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow

// IPC Handlers
function setupIpcHandlers() {
  // Open external links
  ipcMain.handle('open-external', async (event, url) => {
    await shell.openExternal(url)
  })

  // Get app version
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // Get system info
  ipcMain.handle('get-system-info', () => {
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: Math.round(os.totalmem() / 1024 / 1024 / 1024), // GB
      hostname: os.hostname(),
      userInfo: os.userInfo()
    }
  })

  // Window controls
  ipcMain.handle('minimize-window', () => {
    if (mainWindow) mainWindow.minimize()
  })

  ipcMain.handle('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.handle('close-window', () => {
    if (mainWindow) mainWindow.close()
  })

  // Notifications
  ipcMain.handle('show-notification', (event, title, body) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show()
    }
  })

  // Simple store (you might want to use electron-store in production)
  const store = new Map()
  
  ipcMain.handle('set-store', (event, key, value) => {
    store.set(key, value)
    return true
  })

  ipcMain.handle('get-store', (event, key) => {
    return store.get(key)
  })
}

async function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    useContentSize: true,
    frame: false, // Remove default window frame
    titleBarStyle: 'hidden', // Hide title bar on all platforms
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true, // Enable webview support
      enableRemoteModule: false,
      sandbox: false, // WebView için gerekli
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      )
    }
  })

  // Custom menu
  if (process.env.DEV) {
    // Development menu
    const template = [
      {
        label: 'Geliştirme',
        submenu: [
          { role: 'reload', label: 'Yenile' },
          { role: 'forceReload', label: 'Zorla Yenile' },
          { role: 'toggleDevTools', label: 'Geliştirici Araçları' },
          { type: 'separator' },
          { role: 'quit', label: 'Çıkış' }
        ]
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    // Production menu - minimal
    Menu.setApplicationMenu(null)
  }

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Window state events
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-event', 'maximized')
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-event', 'unmaximized')
  })

  // Prevent external navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    
    if (parsedUrl.origin !== process.env.APP_URL) {
      event.preventDefault()
    }
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  setupIpcHandlers()
  createWindow()
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})
