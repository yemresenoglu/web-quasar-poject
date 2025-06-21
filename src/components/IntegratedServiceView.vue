<template>
  <div v-if="store.isVisible && store.currentService" 
       class="integrated-service-view-container"
       :class="{ 'integrated-service-view-container--pinned': store.isPinned }">
    <div class="integrated-service-view__header">
      <div class="integrated-service-view__title">
        <q-icon :name="store.currentService.icon" size="16px" class="integrated-service-view__icon" />
        <span class="integrated-service-view__label">{{ store.currentService.text }}</span>
      </div>
      <div class="integrated-service-view__actions">
        <q-btn 
          flat 
          round 
          dense 
          :icon="store.isPinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'" 
          :class="['integrated-service-view__pin', { 'integrated-service-view__pin--active': store.isPinned }]"
          @click="store.togglePin"
        >
          <q-tooltip>{{ pinTooltip }}</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="bi-arrow-clockwise" class="integrated-service-view__reload" @click="handleReload">
          <q-tooltip>{{ reloadText }}</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="bi-x-lg" class="integrated-service-view__close" @click="store.hide">
          <q-tooltip>{{ closeText }}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="integrated-service-view__frame-container">
          <LoadingStates 
      v-if="isLoading" 
      type="spinner" 
      spinner-type="dots"
      :message="loadingText"
      size="40px"
      color="primary"
    />
      
      <!-- Webview for all services -->
      <webview 
        v-if="isElectron"
        ref="webviewRef"
        :src="store.currentService.url"
        class="integrated-service-view__webview"
        allowpopups
        webpreferences="contextIsolation=true,webSecurity=false,allowRunningInsecureContent=true"
        @dom-ready="handleWebviewLoad"
        @did-fail-load="handleWebviewError"
        @did-finish-load="handleWebviewFinishLoad"
      ></webview>
      
      <!-- Fallback message for non-Electron environments -->
      <div v-else class="integrated-service-view__fallback">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useI18n } from 'vue-i18n'
import LoadingStates from './LoadingStates.vue'

const { t } = useI18n()
const store = useIntegratedServiceViewStore()
const webviewRef = ref(null)
const isLoading = ref(true)
const isElectron = ref(false)

// Check if running in Electron
onMounted(() => {
  isElectron.value = window.electronAPI !== undefined
})

// Computed translations
const pinTooltip = computed(() => store.isPinned ? t('serviceView.unpin') : t('serviceView.pin'))
const reloadText = computed(() => t('serviceView.reload'))
const closeText = computed(() => t('serviceView.close'))
const loadingText = computed(() => t('serviceView.loading'))

const handleWebviewLoad = () => {
  console.log('Webview DOM ready')
}

const handleWebviewFinishLoad = () => {
  isLoading.value = false
  console.log('Webview finished loading')
}

const handleWebviewError = (event) => {
  console.warn('Webview load error:', event)
  isLoading.value = false
}

const handleReload = () => {
  isLoading.value = true
  
  if (isElectron.value && webviewRef.value) {
    // Reload webview
    webviewRef.value.reload()
  }
}

const openExternal = () => {
  if (isElectron.value && window.electronAPI) {
    window.electronAPI.openExternal(store.currentService.url)
  } else {
    window.open(store.currentService.url, '_blank')
  }
}

// Cleanup webview on unmount
onUnmounted(() => {
  if (webviewRef.value) {
    try {
      webviewRef.value.stop()
    } catch {
      // Ignore cleanup errors
    }
  }
})
</script>

<style lang="sass">
.integrated-service-view-container
  width: 444px
  height: 100%
  position: absolute
  background: #fefefe
  border-radius: 18px
  border: 1px solid rgba(0, 0, 0, 0.12)
  display: flex
  flex-direction: column
  overflow: hidden
  transition: all 0.3s ease

  &--pinned
    width: 100%
    height: 100%
    position: relative
    border-radius: 18px
    margin-right: 4px

.integrated-service-view
  &__frame-container
    position: relative
    flex: 1
    overflow: hidden

  &__loading
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    background: #fff
    z-index: 2

  &__loading-text
    margin-top: 8px
    color: #5f6368
    font-size: 14px

  &__webview
    width: 100%
    height: 100%
    border: none
    background: #fff
    border-radius: 8px

  &__fallback
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100%
    gap: 16px
    color: #5f6368
    padding: 32px

    h3
      margin: 0
      color: #202124

    p
      margin: 0
      text-align: center
      opacity: 0.8

  &__header
    height: 48px
    padding: 0 16px
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid rgba(0,0,0,0.08)

  &__title
    font-size: 16px
    font-weight: 500
    color: #5f6368
    display: flex
    align-items: center
    gap: 8px

  &__icon
    color: #5f6368
    opacity: 0.87

  &__label
    text-transform: capitalize

  &__actions
    display: flex
    align-items: center
    gap: 4px

  &__reload,
  &__close,
  &__pin
    min-height: 28px
    min-width: 28px
    padding: 4px
    border-radius: 4px
    font-size: 10px
    color: #5f6368
    opacity: 0.87

    &.q-btn
      &::before
        box-shadow: none !important
      &:hover
        background: rgba(0,0,0,0.1)
        .q-icon
          color: #202124

  &__pin
    &--active
      color: #202124
      opacity: 1

  &__reload
    .q-icon
      transform: rotate(60deg)
</style> 