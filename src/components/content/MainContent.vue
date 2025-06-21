<template>
  <!-- WebView container for external content (Electron only) -->
  <div 
    v-if="isElectronMode"
    v-show="shouldShowWebView"
    class="webview-container"
    :style="webviewContainerStyle"
  >
    <div class="webview-frame-container">
      <!-- Cached WebViews for external tabs -->
      <webview 
        v-for="tab in externalTabs"
        :key="tab.id"
        :ref="(el) => handleWebviewRef(tab.id, el)"
        :src="tab.url"
        v-show="isActiveTab(tab.id)"
        class="webview-content"
        allowpopups
        webpreferences="contextIsolation=true,webSecurity=false,allowRunningInsecureContent=true"
        @dom-ready="() => handleWebviewReady(tab.id)"
        @did-finish-load="() => handleWebviewLoad(tab.id)"
        @did-navigate="(event) => handleWebviewNavigate(tab.id, event)"
        @did-navigate-in-page="(event) => handleWebviewNavigate(tab.id, event)"
      />
    </div>
  </div>

  <!-- Vue Router content for internal pages -->
  <q-scroll-area 
    v-show="!shouldShowWebView"
    class="content-scroll"
    :style="contentScrollStyle"
  >
    <div class="content-layout">
      <router-view />
    </div>
  </q-scroll-area>
</template>

<script setup>
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useSplitViewStore } from 'src/stores/split-view-store'
import { useTabStore } from 'src/stores/tab-store'
import { usePerformanceMonitor } from 'src/composables/usePerformanceMonitor'

/**
 * Props
 */
const props = defineProps({
  leftPanelWidth: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  }
})

/**
 * Composables & Stores
 */
const route = useRoute()
const integratedServiceStore = useIntegratedServiceViewStore()
const splitViewStore = useSplitViewStore()
const tabStore = useTabStore()
const performanceMonitor = usePerformanceMonitor()

/**
 * Reactive state
 */
const webviewRefs = ref(new Map())
const isElectronMode = ref(false)

/**
 * Computed properties
 */
const externalTabs = computed(() => {
  const externals = tabStore.tabs.filter(tab => tab.type === 'external')
  // Debug: Log when external tabs change
  console.log('External tabs updated:', externals.map(t => ({ id: t.id, title: t.title, url: t.url })))
  return externals
})

const shouldShowWebView = computed(() => {
  if (!isElectronMode.value) return false
  
  const activeTab = tabStore.tabs.find(tab => tab.id === tabStore.activeTabId)
  return activeTab?.type === 'external'
})

const contentScrollStyle = computed(() => 
  integratedServiceStore.isPinned || splitViewStore.isVisible
    ? {
        width: `${100 - props.leftPanelWidth}%`,
        left: `${props.leftPanelWidth + 0.5}%`
      }
    : {}
)

const webviewContainerStyle = computed(() => {
  const baseStyle = {
    position: 'absolute',
    inset: '52px 0px 0px 52px',
    background: '#fff',
    zIndex: 1000
  }
  
  if (integratedServiceStore.isPinned || splitViewStore.isVisible) {
    return {
      ...baseStyle,
      width: `${100 - props.leftPanelWidth}%`,
      left: `${props.leftPanelWidth + 0.5}%`
    }
  }
  
  return baseStyle
})

/**
 * WebView management methods
 */
const handleWebviewRef = (tabId, element) => {
  if (element) {
    webviewRefs.value.set(tabId, element)
  } else {
    webviewRefs.value.delete(tabId)
  }
}

const isActiveTab = (tabId) => {
  const isActive = tabStore.activeTabId === tabId
  // Debug: Log tab visibility changes
  if (process.env.DEV) {
    console.log(`Tab ${tabId} visibility:`, isActive ? 'VISIBLE' : 'HIDDEN', 'Active tab:', tabStore.activeTabId)
  }
  return isActive
}

/**
 * WebView event handlers
 */
const handleWebviewReady = (tabId) => {
  const webviewElement = webviewRefs.value.get(tabId)
  if (!webviewElement) return

  // Inject custom styling for better UX
  injectWebviewStyles(webviewElement)
}

const handleWebviewLoad = (tabId) => {
  const tab = tabStore.tabs.find(t => t.id === tabId)
  const webviewElement = webviewRefs.value.get(tabId)
  
  if (tab && webviewElement) {
    cacheWebviewState(tabId, tab, webviewElement)
    
    // Track WebView memory usage for performance monitoring
    performanceMonitor.trackWebViewMemory(tabId, {
      url: tab.url,
      title: tab.title,
      memoryEstimate: estimateWebViewMemory(webviewElement)
    })
  }
}

const handleWebviewNavigate = (tabId, event) => {
  const webviewElement = webviewRefs.value.get(tabId)
  if (webviewElement) {
    updateWebviewCache(tabId, event.url)
  }
}

/**
 * Helper methods
 */
const injectWebviewStyles = (webviewElement) => {
  try {
    webviewElement.executeJavaScript(`
      const style = document.createElement('style');
      style.textContent = \`
        * {
          scrollbar-width: thin !important;
          scrollbar-color: #9e9e9e transparent !important;
        }
        
        *::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent !important;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #9e9e9e !important;
          border-radius: 4px !important;
          opacity: 0.6 !important;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: #757575 !important;
          opacity: 0.8 !important;
        }
      \`;
      document.head.appendChild(style);
    `)
  } catch (error) {
    console.warn(`Failed to inject styles for webview ${webviewElement}:`, error)
  }
}

const cacheWebviewState = (tabId, tab, webviewElement) => {
  try {
    tabStore.cacheWebview(tabId, {
      url: tab.url,
      title: tab.title,
      lastAccessed: Date.now(),
      canGoBack: webviewElement.canGoBack(),
      canGoForward: webviewElement.canGoForward()
    })
  } catch (error) {
    console.warn(`Failed to cache webview state for tab ${tabId}:`, error)
  }
}

const updateWebviewCache = (tabId, currentUrl) => {
  try {
    const cachedData = tabStore.getCachedWebview(tabId) || {}
    tabStore.cacheWebview(tabId, {
      ...cachedData,
      currentUrl,
      lastAccessed: Date.now()
    })
  } catch (error) {
    console.warn(`Failed to update cache for tab ${tabId}:`, error)
  }
}

const estimateWebViewMemory = (webviewElement) => {
  try {
    // Estimate memory usage based on DOM complexity
    const documentSize = webviewElement.getWebContents?.().getTitle?.()?.length || 0
    return Math.max(documentSize * 10, 1024) // Minimum 1KB
  } catch {
    return 1024 // Default 1KB
  }
}

const cleanupWebviews = () => {
  try {
    webviewRefs.value.forEach((webviewElement, tabId) => {
      try {
        if (webviewElement && typeof webviewElement.stop === 'function') {
          webviewElement.stop()
        }
      } catch (error) {
        console.warn(`Failed to cleanup webview for tab ${tabId}:`, error)
      }
    })
    webviewRefs.value.clear()
    
    // Clear performance tracking
    performanceMonitor.clearMetrics()
  } catch (error) {
    console.error('Failed to cleanup webviews:', error)
  }
}

/**
 * Lifecycle hooks
 */
onMounted(() => {
  isElectronMode.value = typeof window !== 'undefined' && !!window.electronAPI
})

onUnmounted(() => {
  cleanupWebviews()
})

/**
 * Watchers
 */
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath !== oldPath && process.env.DEV) {
      console.info(`Route changed from ${oldPath} to ${newPath}`)
    }
  }
)
</script>

<style lang="sass">
.content-scroll
  position: absolute
  top: 52px
  left: 52px
  right: 0
  bottom: 0
  background: #fefefe
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 18px
  overflow: hidden
  z-index: 800
  transition: width 0.1s ease-out, left 0.1s ease-out

  // Custom scrollbar styling
  .q-scrollarea__thumb--v
    width: 4px !important
    right: 4px
    background: #9e9e9e !important
    opacity: 0.6 !important
    &:hover
      opacity: 0.8 !important
      background: #757575 !important
      
  .q-scrollarea__bar--v
    width: 4px !important
    right: 4px !important
    background: transparent !important
    opacity: 0.4 !important

  .q-scrollarea__thumb--h
    height: 4px !important
    bottom: 4px
    background: #9e9e9e !important
    opacity: 0.6 !important
    &:hover
      opacity: 0.8 !important
      background: #757575 !important
      
  .q-scrollarea__bar--h
    height: 4px !important
    bottom: 4px !important
    background: transparent !important
    opacity: 0.4 !important

  :deep(.q-scrollarea__container)
    height: 100%
    
  :deep(.q-scrollarea__content)
    padding-right: 8px

// WebView container styling
.webview-container
  position: absolute
  background: #fefefe
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 18px
  display: flex
  flex-direction: column
  overflow: hidden
  
  &[style*="display: none"]
    display: none !important

.webview-frame-container
  position: relative
  flex: 1
  overflow: hidden

.webview-content
  width: 100%
  height: 100%
  border: none
  background: #fff
  border-radius: 18px
  
  // Custom scrollbar injection
  :deep(*::-webkit-scrollbar)
    width: 4px !important
    height: 4px !important
    
  :deep(*::-webkit-scrollbar-track)
    background: transparent !important
    
  :deep(*::-webkit-scrollbar-thumb)
    background: #9e9e9e !important
    border-radius: 4px !important
    opacity: 0.6 !important
    
    &:hover
      background: #757575 !important
      opacity: 0.8 !important
</style> 