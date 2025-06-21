<template>
  <div class="web-page-renderer">
    <!-- Address Bar -->
    <div class="address-bar">
      <div class="nav-controls">
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="arrow_back"
          :disable="!canGoBack"
          @click="goBack"
          class="nav-btn"
        />
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="arrow_forward"
          :disable="!canGoForward"
          @click="goForward"
          class="nav-btn"
        />
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="refresh"
          @click="reload"
          class="nav-btn"
        />
      </div>
      
      <div class="url-input-container">
        <div class="security-indicator">
          <q-icon
            :name="securityIcon"
            :color="securityColor"
            size="16px"
            class="security-icon"
          />
        </div>
        
        <q-input
          v-model="urlInput"
          placeholder="URL girin..."
          dense
          borderless
          class="url-input"
          @keydown.enter="navigateToUrl"
          @focus="selectUrl"
        >
          <template #append>
            <q-btn
              flat
              dense
              round
              size="sm"
              icon="search"
              @click="navigateToUrl"
            />
          </template>
        </q-input>
      </div>
      
      <div class="page-controls">
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="home"
          @click="goHome"
          class="nav-btn"
        />
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="more_vert"
          @click="showPageMenu"
          class="nav-btn"
        />
      </div>
    </div>
    
    <!-- Loading Progress -->
    <q-linear-progress
      v-show="isLoading"
      :value="loadingProgress"
      color="primary"
      size="2px"
      class="loading-bar"
    />
    
    <!-- WebView Container -->
    <div class="webview-container" ref="webviewContainer">
      <webview
        ref="webview"
        :src="currentUrl"
        class="webview"
        allowpopups
        @dom-ready="onDomReady"
        @did-start-loading="onStartLoading"
        @did-stop-loading="onStopLoading"
        @did-fail-load="onFailLoad"
        @page-title-updated="onTitleUpdate"
        @page-favicon-updated="onFaviconUpdate"
        @new-window="onNewWindow"
        @console-message="onConsoleMessage"
      />
      
      <!-- Error Overlay -->
      <div v-if="hasError" class="error-overlay">
        <div class="error-content">
          <q-icon name="error_outline" size="4rem" color="negative" />
          <h3>Sayfa Yüklenemedi</h3>
          <p>{{ errorMessage }}</p>
          <div class="error-actions">
            <q-btn
              color="primary"
              @click="reload"
              icon="refresh"
              label="Tekrar Dene"
            />
            <q-btn
              flat
              @click="goHome"
              icon="home"
              label="Ana Sayfa"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Page Menu -->
    <q-menu ref="pageMenu" class="page-menu">
      <q-list>
        <q-item clickable @click="copyUrl">
          <q-item-section avatar>
            <q-icon name="content_copy" />
          </q-item-section>
          <q-item-section>URL'yi Kopyala</q-item-section>
        </q-item>
        
        <q-item clickable @click="openInBrowser">
          <q-item-section avatar>
            <q-icon name="open_in_new" />
          </q-item-section>
          <q-item-section>Tarayıcıda Aç</q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item clickable @click="viewSource">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>Kaynak Kodu</q-item-section>
        </q-item>
        
        <q-item clickable @click="openDevTools">
          <q-item-section avatar>
            <q-icon name="bug_report" />
          </q-item-section>
          <q-item-section>Geliştirici Araçları</q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item clickable @click="clearCache">
          <q-item-section avatar>
            <q-icon name="clear_all" />
          </q-item-section>
          <q-item-section>Önbelleği Temizle</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useQuasar } from 'quasar'

interface Props {
  tab: {
    id: string
    url?: string
    title: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:title': [title: string]
  'update:loading': [loading: boolean]
  'update:secure': [secure: boolean]
}>()

const $q = useQuasar()
const webview = ref()
const webviewContainer = ref()
const pageMenu = ref()

const urlInput = ref(props.tab.url || '')
const currentUrl = ref(props.tab.url || 'about:blank')
const isLoading = ref(false)
const loadingProgress = ref(0)
const hasError = ref(false)
const errorMessage = ref('')
const canGoBack = ref(false)
const canGoForward = ref(false)
const isSecure = ref(false)

const securityIcon = computed(() => {
  if (hasError.value) return 'error'
  if (isSecure.value) return 'lock'
  if (currentUrl.value.startsWith('https://')) return 'lock'
  if (currentUrl.value.startsWith('http://')) return 'lock_open'
  return 'info'
})

const securityColor = computed(() => {
  if (hasError.value) return 'negative'
  if (isSecure.value) return 'positive'
  if (currentUrl.value.startsWith('https://')) return 'positive'
  if (currentUrl.value.startsWith('http://')) return 'warning'
  return 'grey'
})

const navigateToUrl = () => {
  let url = urlInput.value.trim()
  
  if (!url) return
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Check if it looks like a domain
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url
    } else {
      // Treat as search query
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}`
    }
  }
  
  currentUrl.value = url
  hasError.value = false
  
  if (webview.value) {
    webview.value.loadURL(url)
  }
}

const goBack = () => {
  if (webview.value && canGoBack.value) {
    webview.value.goBack()
  }
}

const goForward = () => {
  if (webview.value && canGoForward.value) {
    webview.value.goForward()
  }
}

const reload = () => {
  hasError.value = false
  if (webview.value) {
    webview.value.reload()
  }
}

const goHome = () => {
  const homeUrl = 'https://www.google.com'
  urlInput.value = homeUrl
  currentUrl.value = homeUrl
  navigateToUrl()
}

const selectUrl = () => {
  nextTick(() => {
    const input = document.querySelector('.url-input input') as HTMLInputElement
    if (input) {
      input.select()
    }
  })
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    $q.notify({
      message: 'URL kopyalandı',
      type: 'positive',
      position: 'top-right',
      timeout: 2000
    })
  } catch (error) {
    console.error('URL kopyalanamadı:', error)
  }
}

const openInBrowser = () => {
  if (window.electronAPI) {
    window.electronAPI.openExternal(currentUrl.value)
  }
}

const viewSource = () => {
  if (webview.value) {
    webview.value.openDevTools()
  }
}

const openDevTools = () => {
  if (webview.value) {
    webview.value.openDevTools()
  }
}

const clearCache = () => {
  if (webview.value) {
    webview.value.clearStorageData({
      storages: ['cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage']
    })
    $q.notify({
      message: 'Önbellek temizlendi',
      type: 'positive',
      position: 'top-right',
      timeout: 2000
    })
  }
}

const showPageMenu = (event: MouseEvent) => {
  pageMenu.value?.show(event)
}

// WebView Event Handlers
const onDomReady = () => {
  if (webview.value) {
    canGoBack.value = webview.value.canGoBack()
    canGoForward.value = webview.value.canGoForward()
  }
}

const onStartLoading = () => {
  isLoading.value = true
  loadingProgress.value = 0
  hasError.value = false
  emit('update:loading', true)
  
  // Simulate progress
  const progressInterval = setInterval(() => {
    loadingProgress.value += 0.1
    if (loadingProgress.value >= 0.9) {
      clearInterval(progressInterval)
    }
  }, 100)
}

const onStopLoading = () => {
  isLoading.value = false
  loadingProgress.value = 1
  emit('update:loading', false)
  
  if (webview.value) {
    urlInput.value = webview.value.getURL()
    currentUrl.value = webview.value.getURL()
    canGoBack.value = webview.value.canGoBack()
    canGoForward.value = webview.value.canGoForward()
    
    // Check if HTTPS
    const isHttps = currentUrl.value.startsWith('https://')
    isSecure.value = isHttps
    emit('update:secure', isHttps)
  }
}

const onFailLoad = (event: any) => {
  isLoading.value = false
  hasError.value = true
  errorMessage.value = event.errorDescription || 'Bilinmeyen hata'
  emit('update:loading', false)
}

const onTitleUpdate = (event: any) => {
  const title = event.title || 'Web Sayfası'
  emit('update:title', title)
}

const onFaviconUpdate = (event: any) => {
  // Handle favicon update
  console.log('Favicon updated:', event.favicons)
}

const onNewWindow = (event: any) => {
  // Handle new window requests
  event.preventDefault()
  
  // Open in new tab instead
  if (window.electronAPI) {
    window.electronAPI.createTab({
      type: 'web',
      url: event.url,
      title: 'Yeni Sekme'
    })
  }
}

const onConsoleMessage = (event: any) => {
  // Log console messages for debugging
  console.log(`WebView Console [${event.level}]:`, event.message)
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey) {
    switch (event.key) {
      case 'r':
        event.preventDefault()
        reload()
        break
      case 'l':
        event.preventDefault()
        selectUrl()
        break
      case 'u':
        event.preventDefault()
        viewSource()
        break
    }
  }
  
  if (event.key === 'F5') {
    event.preventDefault()
    reload()
  }
  
  if (event.key === 'F12') {
    event.preventDefault()
    openDevTools()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  // Initialize webview
  nextTick(() => {
    if (props.tab.url && props.tab.url !== 'about:blank') {
      navigateToUrl()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for tab URL changes
watch(() => props.tab.url, (newUrl) => {
  if (newUrl && newUrl !== currentUrl.value) {
    urlInput.value = newUrl
    currentUrl.value = newUrl
    navigateToUrl()
  }
})
</script>

<style lang="scss" scoped>
.web-page-renderer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--q-dark);
}

.address-bar {
  display: flex;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 8px;
}

.nav-controls {
  display: flex;
  gap: 4px;
}

.nav-btn {
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
  
  &:disabled {
    opacity: 0.3;
  }
}

.url-input-container {
  display: flex;
  align-items: center;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0 12px;
  min-height: 36px;
}

.security-indicator {
  margin-right: 8px;
}

.url-input {
  flex: 1;
  
  :deep(.q-field__control) {
    min-height: 32px;
  }
  
  :deep(.q-field__native) {
    font-size: 14px;
  }
}

.page-controls {
  display: flex;
  gap: 4px;
}

.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.webview-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.webview {
  width: 100%;
  height: 100%;
  border: none;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.error-content {
  text-align: center;
  padding: 40px;
  
  h3 {
    margin: 16px 0;
    color: var(--q-negative);
  }
  
  p {
    margin-bottom: 24px;
    opacity: 0.7;
  }
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.page-menu {
  .q-item {
    min-height: 40px;
  }
}

// Dark mode adjustments
.body--dark {
  .address-bar {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .url-input-container {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style> 