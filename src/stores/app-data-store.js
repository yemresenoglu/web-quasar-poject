import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppDataStore = defineStore('app-data', () => {
  // Central app state
  const appData = ref({
    user: null,
    settings: {},
    cache: {},
    sessionData: {},
    windowState: {
      bounds: null,
      isMaximized: false,
      isFullscreen: false
    }
  })

  // Cache for webview data
  const webviewCache = ref(new Map())
  
  // Session storage for temporary data
  const sessionStorage = ref(new Map())

  // Persistent storage using localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(`app_${key}`, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  const loadFromStorage = (key, defaultValue = null) => {
    try {
      const stored = localStorage.getItem(`app_${key}`)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return defaultValue
    }
  }

  // WebView data management
  const setWebviewData = (url, data) => {
    webviewCache.value.set(url, {
      ...data,
      timestamp: Date.now()
    })
    
    // Also save to persistent storage for important data
    saveToStorage(`webview_${btoa(url)}`, data)
  }

  const getWebviewData = (url) => {
    const cached = webviewCache.value.get(url)
    if (cached) return cached
    
    // Try to load from persistent storage
    const stored = loadFromStorage(`webview_${btoa(url)}`)
    if (stored) {
      webviewCache.value.set(url, stored)
      return stored
    }
    
    return null
  }

  // Session data management (temporary, not persisted)
  const setSessionData = (key, data) => {
    sessionStorage.value.set(key, data)
  }

  const getSessionData = (key) => {
    return sessionStorage.value.get(key)
  }

  // User data management
  const setUser = (userData) => {
    appData.value.user = userData
    saveToStorage('user', userData)
  }

  const getUser = () => {
    if (!appData.value.user) {
      appData.value.user = loadFromStorage('user')
    }
    return appData.value.user
  }

  // Settings management
  const setSetting = (key, value) => {
    appData.value.settings[key] = value
    saveToStorage('settings', appData.value.settings)
  }

  const getSetting = (key, defaultValue = null) => {
    if (Object.keys(appData.value.settings).length === 0) {
      appData.value.settings = loadFromStorage('settings', {})
    }
    return appData.value.settings[key] ?? defaultValue
  }

  // Window state management (Electron specific)
  const setWindowState = (state) => {
    appData.value.windowState = { ...appData.value.windowState, ...state }
    saveToStorage('windowState', appData.value.windowState)
  }

  const getWindowState = () => {
    if (!appData.value.windowState.bounds) {
      appData.value.windowState = loadFromStorage('windowState', appData.value.windowState)
    }
    return appData.value.windowState
  }

  // IPC Communication helpers (for Electron)
  const sendToMain = (channel, data) => {
    if (window.electronAPI) {
      return window.electronAPI.sendToMain(channel, data)
    }
    console.warn('Electron API not available')
  }

  const onMainMessage = (channel, callback) => {
    if (window.electronAPI) {
      return window.electronAPI.onMainMessage(channel, callback)
    }
    console.warn('Electron API not available')
  }

  // Cache cleanup
  const clearOldCache = () => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    
    for (const [url, data] of webviewCache.value.entries()) {
      if (data.timestamp < oneHourAgo) {
        webviewCache.value.delete(url)
      }
    }
  }

  // Performance monitoring
  const logPerformance = (action, data = {}) => {
    const performanceData = {
      action,
      timestamp: Date.now(),
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      } : null,
      ...data
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      if (process.env.DEV) {
        console.info('Performance metrics collected:', performanceData)
      }
    }
    
    // Store recent performance data
    const perfHistory = getSessionData('performance_history') || []
    perfHistory.push(performanceData)
    
    // Keep only last 100 entries
    if (perfHistory.length > 100) {
      perfHistory.splice(0, perfHistory.length - 100)
    }
    
    setSessionData('performance_history', perfHistory)
  }

  // Hybrid system analytics
  const trackPageTransition = (from, to, type) => {
    logPerformance('page_transition', {
      from,
      to,
      type, // 'internal' or 'external'
      transitionTime: Date.now()
    })
  }

  // Initialize store
  const initialize = () => {
    // Load initial data
    getUser()
    getSetting('theme', 'light')
    getWindowState()
    
    // Setup cache cleanup
    setInterval(clearOldCache, 30 * 60 * 1000) // Every 30 minutes
    
    // Log initialization
    logPerformance('app_initialize')
  }

  // Computed properties
  const isLoggedIn = computed(() => !!appData.value.user)
  const currentTheme = computed(() => getSetting('theme', 'light'))

  return {
    // State
    appData,
    
    // WebView management
    setWebviewData,
    getWebviewData,
    
    // Session management
    setSessionData,
    getSessionData,
    
    // User management
    setUser,
    getUser,
    isLoggedIn,
    
    // Settings management
    setSetting,
    getSetting,
    currentTheme,
    
    // Window state
    setWindowState,
    getWindowState,
    
    // IPC helpers
    sendToMain,
    onMainMessage,
    
    // Utilities
    saveToStorage,
    loadFromStorage,
    clearOldCache,
    initialize,
    
    // Analytics
    logPerformance,
    trackPageTransition
  }
}) 