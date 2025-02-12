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
      <div v-if="isLoading" class="integrated-service-view__loading">
        <q-spinner color="primary" size="2em" />
        <div class="integrated-service-view__loading-text">{{ loadingText }}</div>
      </div>
      <iframe
        ref="iframeRef"
        :src="store.currentService.url"
        frameborder="0"
        class="integrated-service-view__iframe"
        referrerpolicy="no-referrer"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        @load="handleIframeLoad"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useIntegratedServiceViewStore()
const iframeRef = ref(null)
const isLoading = ref(true)

// Computed translations
const pinTooltip = computed(() => store.isPinned ? t('serviceView.unpin') : t('serviceView.pin'))
const reloadText = computed(() => t('serviceView.reload'))
const closeText = computed(() => t('serviceView.close'))
const loadingText = computed(() => t('serviceView.loading'))

const handleIframeLoad = () => {
  isLoading.value = false
}

const handleReload = () => {
  isLoading.value = true
  if (iframeRef.value) {
    iframeRef.value.src = store.currentService.url
  }
}
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

  &__iframe
    width: 100%
    height: 100%
    border: none
    background: #fff
    border-radius: 8px

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