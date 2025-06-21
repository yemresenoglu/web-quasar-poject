export interface ElectronAPI {
  platform: string
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  onWindowEvent: (callback: (event: any, data: string) => void) => void
  removeAllListeners: (channel: string) => void
  openExternal: (url: string) => Promise<void>
  getAppVersion: () => Promise<string>
  showNotification: (title: string, body: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {} 
  platform: string
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  onWindowEvent: (callback: (event: any, data: string) => void) => void
  removeAllListeners: (channel: string) => void
  openExternal: (url: string) => Promise<void>
  getAppVersion: () => Promise<string>
  showNotification: (title: string, body: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {} 