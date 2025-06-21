import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppDataStore } from './app-data-store'

/**
 * Tab Store - Manages application tabs and WebView caching
 * 
 * Features:
 * - Internal tabs (Vue Router pages)
 * - External tabs (WebView content)
 * - WebView state caching for seamless tab switching
 * - Session persistence
 * - Memory management for cached WebViews
 */
export const useTabStore = defineStore('tab', () => {
  // Dependencies
  const router = useRouter()
  const route = useRoute()
  const appDataStore = useAppDataStore()
  
  // State
  const activeTab = ref(null)
  const tabs = ref([])
  
  // WebView caching configuration (Chrome style memory management)
  const webviewCache = ref(new Map())
  const MAX_CACHED_WEBVIEWS = 5
  const MEMORY_PRESSURE_THRESHOLD = 0.8 // 80% memory usage

  // Computed properties
  const activeTabId = computed(() => activeTab.value)

  // Performance monitoring is integrated into cache management and tab operations

  /**
   * Route watcher - Updates active tab when route changes
   */
  watch(
    () => route.path,
    (newPath) => {
      const matchingTab = tabs.value.find(tab => tab.route === newPath)
      if (matchingTab) {
        activeTab.value = matchingTab.id
      }
    }
  )

  /**
   * Creates a new tab or activates existing one
   * @param {Object} tabConfig - Tab configuration
   * @param {string} tabConfig.title - Tab title
   * @param {string} tabConfig.icon - Tab icon (optional)
   * @param {string} tabConfig.route - Tab route
   * @param {string} tabConfig.type - Tab type ('vue' | 'web' | 'edevlet' | 'sgk')
   * @param {string} tabConfig.url - URL for external tabs (optional)
   * @param {string} tabConfig.component - Component name for Vue tabs (optional)
   * @returns {Object} Created or existing tab
   */
  const addTab = ({ title, icon, route, type = 'vue', url = null, component = null }) => {
    // Check if tab already exists
    const existingTab = tabs.value.find(tab => 
      (tab.route === route && type === 'vue') || 
      (tab.url === url && type !== 'vue')
    )
    if (existingTab) {
      setActiveTab(existingTab.id)
      if (type === 'vue' && route) {
        router.push(route)
      }
      return existingTab
    }

    // Create new tab
    const newTab = createNewTab({ title, icon, route, type, url, component })
    
    // Persist tab for session restoration
    persistTab(newTab)
    
    tabs.value.push(newTab)
    setActiveTab(newTab.id)
    
    if (type === 'vue' && route) {
      router.push(route)
    }
    
    return newTab
  }

  /**
   * Creates a new tab (modern UI version)
   * @param {Object} tabData - Tab data
   * @returns {Object} Created tab
   */
  const createTab = (tabData) => {
    const newTab = {
      id: generateTabId(),
      title: tabData.title || 'Yeni Sekme',
      type: tabData.type || 'vue',
      url: tabData.url,
      component: tabData.component,
      route: tabData.route,
      loading: false,
      hasUnsavedChanges: false,
      isSecure: tabData.type === 'edevlet' || tabData.type === 'sgk' || (tabData.url && tabData.url.startsWith('https://')),
      favicon: null,
      createdAt: new Date(),
      lastAccessed: new Date()
    }
    
    tabs.value.push(newTab)
    setActiveTab(newTab.id)
    
    return newTab
  }

  /**
   * Updates tab properties
   * @param {string} tabId - Tab ID
   * @param {Object} updates - Properties to update
   */
  const updateTab = (tabId, updates) => {
    const tab = findTab(tabId)
    if (tab) {
      Object.assign(tab, updates, { lastAccessed: new Date() })
      persistTab(tab)
    }
  }

  /**
   * Closes a tab and handles cleanup
   * @param {string} tabId - ID of tab to close
   */
  const closeTab = (tabId) => {
    const tabIndex = findTabIndex(tabId)
    if (tabIndex === -1) return

    const tab = tabs.value[tabIndex]
    
    // Clean up external tab resources
    if (tab.type === 'external') {
      removeCachedWebview(tabId)
    }
    
    tabs.value.splice(tabIndex, 1)
    
    // Handle active tab change if closed tab was active
    if (activeTab.value === tabId) {
      handleActiveTabClosure(tabIndex)
    }
  }

  /**
   * Sets the active tab
   * @param {string} tabId - ID of tab to activate
   */
  const setActiveTab = (tabId) => {
    const tab = findTab(tabId)
    if (!tab) return

    // Deactivate previous tab
    deactivatePreviousTab()
    
    // Activate new tab
    activateTab(tab, tabId)
  }

  /**
   * Updates tab data
   * @param {string} tabId - Tab ID
   * @param {Object} data - Data to update
   */
  const updateTabData = (tabId, data) => {
    const tab = findTab(tabId)
    if (tab) {
      Object.assign(tab, data)
      persistTab(tab)
    }
  }

  /**
   * Deactivates current active tab
   */
  const deactivateTab = () => {
    activeTab.value = null
  }

  // WebView Cache Management

  /**
   * Caches WebView state for external tabs
   * @param {string} tabId - Tab ID
   * @param {Object} webviewData - WebView state data
   */
  const cacheWebview = (tabId, webviewData) => {
    // Implement LRU cache management
    if (webviewCache.value.size >= MAX_CACHED_WEBVIEWS) {
      removeOldestCachedWebview()
    }
    
    webviewCache.value.set(tabId, {
      ...webviewData,
      cachedAt: Date.now()
    })
  }

  /**
   * Retrieves cached WebView data
   * @param {string} tabId - Tab ID
   * @returns {Object|undefined} Cached WebView data
   */
  const getCachedWebview = (tabId) => {
    return webviewCache.value.get(tabId)
  }

  /**
   * Removes WebView from cache
   * @param {string} tabId - Tab ID
   */
  const removeCachedWebview = (tabId) => {
    webviewCache.value.delete(tabId)
  }

  /**
   * Clears entire WebView cache
   */
  const clearWebviewCache = () => {
    webviewCache.value.clear()
  }

  /**
   * Gets list of active WebView IDs
   * @returns {Array<string>} Array of cached WebView tab IDs
   */
  const getActiveWebviews = () => {
    return Array.from(webviewCache.value.keys())
  }

  // Getters

  /**
   * Finds tab by route
   * @param {string} routePath - Route path
   * @returns {Object|undefined} Tab object
   */
  const getTabByRoute = (routePath) => {
    return tabs.value.find(tab => tab.route === routePath)
  }

  /**
   * Gets currently active tab
   * @returns {Object|undefined} Active tab object
   */
  const getActiveTab = () => {
    return findTab(activeTab.value)
  }

  /**
   * Restores tabs from session storage
   * @todo Implement session restoration logic
   */
  const restoreTabsFromSession = () => {
    // Implementation depends on session restoration requirements
    console.info('Session restoration not yet implemented')
  }

  // Helper Functions

  /**
   * Creates a new tab object
   * @private
   */
  const createNewTab = ({ title, icon, route, type, url }) => {
    return {
      id: `tab_${Date.now()}`,
      title,
      icon: icon || (type === 'external' ? 'bi-globe' : 'bi-file-text'),
      route,
      type,
      url: url || null,
      closeable: true,
      lastAccessed: Date.now(),
      isActive: false
    }
  }

  /**
   * Persists tab to session storage
   * @private
   */
  const persistTab = (tab) => {
    try {
      appDataStore.setSessionData(`tab_${tab.id}`, tab)
    } catch (error) {
      console.warn(`Failed to persist tab ${tab.id}:`, error)
    }
  }

  /**
   * Finds tab by ID
   * @private
   */
  const findTab = (tabId) => {
    return tabs.value.find(tab => tab.id === tabId)
  }

  /**
   * Finds tab index by ID
   * @private
   */
  const findTabIndex = (tabId) => {
    return tabs.value.findIndex(tab => tab.id === tabId)
  }

  /**
   * Deactivates the previously active tab
   * @private
   */
  const deactivatePreviousTab = () => {
    const previousActive = tabs.value.find(tab => tab.isActive)
    if (previousActive) {
      previousActive.isActive = false
      updateTabData(previousActive.id, { isActive: false })
    }
  }

  /**
   * Activates a tab
   * @private
   */
  const activateTab = (tab, tabId) => {
    activeTab.value = tabId
    tab.isActive = true
    tab.lastAccessed = Date.now()
    updateTabData(tabId, { 
      isActive: true, 
      lastAccessed: Date.now() 
    })
  }

  /**
   * Handles active tab closure by selecting appropriate replacement
   * @private
   */
  const handleActiveTabClosure = (closedTabIndex) => {
    const remainingTabs = tabs.value
    if (remainingTabs.length > 0) {
      const newActiveIndex = Math.max(0, closedTabIndex - 1)
      const newActiveTab = remainingTabs[newActiveIndex]
      setActiveTab(newActiveTab.id)
      router.push(newActiveTab.route)
    } else {
      activeTab.value = null
      router.push('/')
    }
  }

  /**
   * Removes oldest cached WebView based on LRU policy
   * @private
   */
  const removeOldestCachedWebview = () => {
    const oldestEntry = Array.from(webviewCache.value.entries())
      .sort(([, a], [, b]) => a.cachedAt - b.cachedAt)[0]
    
    if (oldestEntry) {
      webviewCache.value.delete(oldestEntry[0])
    }
  }

  /**
   * Chrome-style memory pressure detection and cleanup
   */
  const handleMemoryPressure = () => {
    if ('memory' in performance) {
      const memory = performance.memory
      const memoryPressure = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      
      if (memoryPressure > MEMORY_PRESSURE_THRESHOLD) {
        // Aggressive cleanup when memory pressure is high
        const cacheSize = webviewCache.value.size
        const targetReduction = Math.ceil(cacheSize * 0.4) // Remove 40% of cache
        
        const sortedEntries = Array.from(webviewCache.value.entries())
          .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
        
        for (let i = 0; i < targetReduction && i < sortedEntries.length; i++) {
          webviewCache.value.delete(sortedEntries[i][0])
        }
        
        console.info(`Memory pressure detected. Cleaned up ${targetReduction} WebViews`)
      }
    }
  }

  /**
   * Tab hibernation (Opera One style)
   * Suspends inactive tabs to save memory
   */
  const hibernateInactiveTabs = () => {
    const now = Date.now()
    const HIBERNATION_THRESHOLD = 300000 // 5 minutes of inactivity
    
    tabs.value.forEach(tab => {
      if (!tab.isActive && (now - tab.lastAccessed) > HIBERNATION_THRESHOLD) {
        if (tab.type === 'external' && webviewCache.value.has(tab.id)) {
          // Mark for hibernation but keep in cache
          const cacheData = webviewCache.value.get(tab.id)
          cacheData.hibernated = true
          cacheData.hibernatedAt = now
        }
      }
    })
  }

  /**
   * Generates unique tab ID
   * @private
   */
  const generateTabId = () => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Public API
  return {
    // State
    tabs,
    activeTab,
    activeTabId,
    
    // Tab Management
    addTab,
    createTab,
    updateTab,
    closeTab,
    setActiveTab,
    deactivateTab,
    updateTabData,
    
    // Getters
    getTabByRoute,
    getActiveTab,
    
    // Session Management
    restoreTabsFromSession,
    
    // WebView Caching
    cacheWebview,
    getCachedWebview,
    removeCachedWebview,
    clearWebviewCache,
    getActiveWebviews,
    webviewCache: computed(() => webviewCache.value),
    
    // Performance Management
    handleMemoryPressure,
    hibernateInactiveTabs
  }
}) 