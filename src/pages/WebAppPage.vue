<template>
  <q-page class="browser-page">
    <!-- Browser Navigation Bar -->
    <div class="browser-nav">
      <div class="nav-controls">
        <q-btn 
          flat 
          round 
          icon="bi-arrow-left" 
          size="sm"
          @click="goBack"
          :disable="!canGoBack"
          class="nav-btn"
        />
        <q-btn 
          flat 
          round 
          icon="bi-arrow-right" 
          size="sm"
          @click="goForward"
          :disable="!canGoForward"
          class="nav-btn"
        />
        <q-btn 
          flat 
          round 
          icon="bi-arrow-clockwise" 
          size="sm"
          @click="refresh"
          class="nav-btn"
        />
      </div>
      
      <div class="address-bar">
        <div class="url-container">
          <q-icon name="bi-shield-check" class="security-icon" />
          <span class="url-text">{{ currentUrl }}</span>
        </div>
      </div>
      
      <div class="browser-actions">
        <q-btn 
          flat 
          round 
          icon="bi-box-arrow-up-right" 
          size="sm"
          @click="openExternal"
          class="nav-btn"
          title="Harici Tarayıcıda Aç"
        />
        <q-btn 
          flat 
          round 
          icon="bi-three-dots" 
          size="sm"
          class="nav-btn"
        >
          <q-menu>
            <q-list>
              <q-item clickable @click="zoomIn">
                <q-item-section avatar>
                  <q-icon name="bi-zoom-in" />
                </q-item-section>
                <q-item-section>Yakınlaştır</q-item-section>
              </q-item>
              <q-item clickable @click="zoomOut">
                <q-item-section avatar>
                  <q-icon name="bi-zoom-out" />
                </q-item-section>
                <q-item-section>Uzaklaştır</q-item-section>
              </q-item>
              <q-item clickable @click="resetZoom">
                <q-item-section avatar>
                  <q-icon name="bi-arrow-clockwise" />
                </q-item-section>
                <q-item-section>Varsayılan Boyut</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <!-- Browser Content -->
    <div class="browser-content">
      <webview 
        v-if="isElectron"
        ref="webviewRef"
        :src="currentApp.url"
        class="browser-webview"
        allowpopups
        webpreferences="contextIsolation=true,webSecurity=false,allowRunningInsecureContent=true"
        @dom-ready="onDomReady"
        @did-start-loading="onStartLoading"
        @did-finish-load="onFinishLoad"
        @new-window="onNewWindow"
        @did-navigate="onNavigate"
        @did-navigate-in-page="onNavigateInPage"
      />
      <div v-else class="fallback-message">
        <q-icon name="bi-exclamation-triangle" size="48px" />
        <h3>Electron Gerekli</h3>
        <p>Bu özellik sadece Electron uygulamasında kullanılabilir.</p>
        <q-btn 
          color="primary" 
          @click="openExternal"
          label="Tarayıcıda Aç"
        />
      </div>
    </div>

    <!-- Loading Overlay -->
    <LoadingStates 
      v-if="isLoading" 
      type="overlay" 
      spinner-type="dots"
      message="Sayfa yükleniyor..."
      size="40px"
      color="primary"
      :blur="true"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoadingStates from '../components/LoadingStates.vue'

const route = useRoute()
const webviewRef = ref(null)
const isLoading = ref(true)
const canGoBack = ref(false)
const canGoForward = ref(false)
const currentUrl = ref('')
const zoomLevel = ref(1)

// Check if running in Electron
const isElectron = computed(() => {
  return typeof window !== 'undefined' && window.electronAPI
})

// Get app info from route params
const currentApp = computed(() => {
  return {
    id: route.params.appId,
    text: route.query.title || 'Web Uygulaması',
    icon: route.query.icon || 'bi-globe',
    url: route.query.url || 'about:blank'
  }
})

// Browser Navigation Functions
const goBack = () => {
  if (webviewRef.value && canGoBack.value) {
    webviewRef.value.goBack()
  }
}

const goForward = () => {
  if (webviewRef.value && canGoForward.value) {
    webviewRef.value.goForward()
  }
}

const refresh = () => {
  if (webviewRef.value) {
    isLoading.value = true
    webviewRef.value.reload()
  }
}

const openExternal = () => {
  if (isElectron.value && window.electronAPI) {
    window.electronAPI.openExternal(currentUrl.value || currentApp.value.url)
  } else {
    window.open(currentUrl.value || currentApp.value.url, '_blank')
  }
}

// Zoom Functions
const zoomIn = () => {
  if (webviewRef.value) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 3)
    webviewRef.value.setZoomFactor(zoomLevel.value)
  }
}

const zoomOut = () => {
  if (webviewRef.value) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
    webviewRef.value.setZoomFactor(zoomLevel.value)
  }
}

const resetZoom = () => {
  if (webviewRef.value) {
    zoomLevel.value = 1
    webviewRef.value.setZoomFactor(1)
  }
}

// Webview Event Handlers
const onDomReady = () => {
  console.log('Webview DOM ready')
  if (webviewRef.value) {
    updateNavigationState()
    
    // Set user agent when webview is ready
    try {
      webviewRef.value.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )
    } catch (err) {
      console.warn('Could not set user agent:', err)
    }
  }
}

const onStartLoading = () => {
  isLoading.value = true
}

const onFinishLoad = () => {
  isLoading.value = false
  updateNavigationState()
  
  // Optional: Inject responsive viewport if needed
  if (webviewRef.value) {
    try {
      webviewRef.value.executeJavaScript(`
        // Only add viewport if it doesn't exist and page seems to need it
        if (!document.querySelector('meta[name="viewport"]')) {
          const viewport = document.createElement('meta');
          viewport.name = 'viewport';
          viewport.content = 'width=device-width, initial-scale=1.0';
          document.head.appendChild(viewport);
        }
      `)
    } catch (err) {
      console.warn('Could not set viewport:', err)
    }
  }
}

const onNavigate = (event) => {
  currentUrl.value = event.url
  updateNavigationState()
}

const onNavigateInPage = (event) => {
  currentUrl.value = event.url
}

const onNewWindow = (event) => {
  // Handle popup windows
  if (isElectron.value && window.electronAPI) {
    window.electronAPI.openExternal(event.url)
  }
}

const updateNavigationState = () => {
  if (webviewRef.value) {
    canGoBack.value = webviewRef.value.canGoBack()
    canGoForward.value = webviewRef.value.canGoForward()
    currentUrl.value = webviewRef.value.getURL()
  }
}

onMounted(() => {
  currentUrl.value = currentApp.value.url
})
</script>

<style scoped>
.browser-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  overflow: hidden;
  padding: 0 !important;
  margin: 0 !important;
}

.browser-nav {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e1e5e9;
  padding: 8px 12px;
  height: 48px;
  flex-shrink: 0;
  gap: 12px;
}

.nav-controls {
  display: flex;
  gap: 4px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  color: #5f6368;
}

.nav-btn:hover {
  background: rgba(0,0,0,0.04);
}

.nav-btn:disabled {
  opacity: 0.4;
}

.address-bar {
  flex: 1;
  max-width: 600px;
}

.url-container {
  display: flex;
  align-items: center;
  background: #f1f3f4;
  border-radius: 24px;
  padding: 8px 16px;
  gap: 8px;
}

.security-icon {
  color: #34a853;
  font-size: 14px;
}

.url-text {
  font-size: 13px;
  color: #202124;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.browser-actions {
  display: flex;
  gap: 4px;
}

.browser-content {
  flex: 1;
  position: relative;
  background: #fff;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.browser-webview {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
  display: block;
}

.fallback-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #5f6368;
}

.fallback-message h3 {
  margin: 0;
  color: #202124;
}

.fallback-message p {
  margin: 0;
  text-align: center;
  opacity: 0.8;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 1000;
}

.loading-text {
  color: #5f6368;
  font-size: 14px;
}
</style> 