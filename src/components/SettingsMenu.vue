<template>
  <q-menu
    ref="menuRef"
    class="settings-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"
  >
    <div class="settings-menu__container">
      <!-- Header -->
      <div class="settings-menu__header">
        <div class="settings-menu__title">{{ $t('settings.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="settings-menu__close" 
          @click="closeMenu"
        />
      </div>
      <div class="settings-menu__divider"></div>
      
      <q-scroll-area class="settings-menu__scroll" visible>
        <div class="settings-menu__content">
          <!-- Genel Ayarlar -->
          <div class="settings-menu__section">
            <div class="settings-menu__section-header">
              <div class="settings-menu__section-title">{{ $t('settings.general.title') }}</div>
            </div>
            <div class="settings-menu__list">
              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-translate" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.language') }}</div>
                  <div class="settings-menu__item-subtitle">{{ currentLanguage }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-select
                    v-model="selectedLanguage"
                    :options="languageOptions"
                    emit-value
                    map-options
                    dense
                    borderless
                    class="settings-menu__select"
                    @update:model-value="changeLanguage"
                  />
                </q-item-section>
              </q-item>

              <!-- Theme Selection -->
              <q-item class="settings-menu__item theme-item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-palette" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.appearance.theme') }}</div>
                  <div class="theme-selection">
                    <q-btn
                      v-for="theme in themeStore.predefinedThemes"
                      :key="theme.name"
                      flat
                      no-caps
                      size="sm"
                      :class="['theme-btn', { active: themeStore.currentTheme === theme.name }]"
                      @click="themeStore.setTheme(theme.name)"
                    >
                      <q-icon :name="theme.icon" size="14px" class="q-mr-xs" />
                      {{ theme.label }}
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              
              <!-- Accent Color -->
              <q-item class="settings-menu__item color-item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-droplet" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.appearance.accentColor') }}</div>
                  <div class="color-selection">
                    <q-btn
                      v-for="color in themeStore.accentColors"
                      :key="color.name"
                      flat
                      round
                      dense
                      size="sm"
                      :class="['color-btn', { active: themeStore.accentColor === color.value }]"
                      :style="{ backgroundColor: color.value }"
                      @click="themeStore.setAccentColor(color.value)"
                    >
                      <q-tooltip>{{ color.label }}</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              
              <!-- High Contrast -->
              <q-item clickable v-ripple class="settings-menu__item" @click="themeStore.toggleHighContrast">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-contrast" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.appearance.highContrast') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="themeStore.isHighContrast" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>

              <!-- Theme Gallery Button -->
              <q-item clickable v-ripple class="settings-menu__item" @click="openThemeGallery">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-images" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">Tema Galerisi</div>
                  <div class="settings-menu__item-subtitle">Duvar kağıdı ve gelişmiş tema ayarları</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="settings-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-speedometer2" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.performance.title') }}</div>
                  <div class="settings-menu__item-subtitle">{{ $t('settings.performance.subtitle') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="performanceMode" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="settings-menu__divider"></div>

          <!-- Bildirim Ayarları -->
          <div class="settings-menu__section">
            <div class="settings-menu__section-header">
              <div class="settings-menu__section-title">{{ $t('settings.notificationSettings.title') }}</div>
            </div>
            <div class="settings-menu__list">
              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-volume-up" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.notificationSettings.sound') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="soundNotifications" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-display" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.notificationSettings.desktop') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="desktopNotifications" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-envelope" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.notificationSettings.email') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="emailNotifications" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="settings-menu__divider"></div>

          <!-- Gizlilik ve Güvenlik -->
          <div class="settings-menu__section">
            <div class="settings-menu__section-header">
              <div class="settings-menu__section-title">{{ $t('settings.privacySettings.title') }}</div>
            </div>
            <div class="settings-menu__list">
              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-shield-check" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.privacySettings.dataCollection') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="dataCollection" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-clock-history" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.privacySettings.historyTracking') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="historyTracking" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-key" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.privacySettings.autoLogin') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="autoLogin" dense class="settings-menu__toggle" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="settings-menu__divider"></div>

          <!-- Veri Yönetimi -->
          <div class="settings-menu__section">
            <div class="settings-menu__section-header">
              <div class="settings-menu__section-title">{{ $t('settings.data.title') }}</div>
            </div>
            <div class="settings-menu__list">
              <q-item clickable v-ripple class="settings-menu__item" @click="exportData">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-download" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.data.export') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="settings-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item" @click="importData">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-upload" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.data.import') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="settings-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item" @click="clearData">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-trash" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.data.clear') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="settings-menu__arrow" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="settings-menu__divider"></div>

          <!-- Hakkında -->
          <div class="settings-menu__section">
            <div class="settings-menu__section-header">
              <div class="settings-menu__section-title">{{ $t('settings.aboutSection.title') }}</div>
            </div>
            <div class="settings-menu__list">
              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-info-circle" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.aboutSection.version') }}</div>
                  <div class="settings-menu__item-subtitle">v1.0.0</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-question-circle" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.aboutSection.help') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="settings-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="settings-menu__item">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-bug" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="settings-menu__item-title">{{ $t('settings.aboutSection.feedback') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="settings-menu__arrow" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
    
    <!-- Dynamic Theme Manager -->
    <DynamicThemeManager ref="themeManager" />
  </q-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useThemeStore } from 'src/stores/theme-store'
import DynamicThemeManager from './DynamicThemeManager.vue'

const { t, locale } = useI18n()
const $q = useQuasar()
const themeStore = useThemeStore()

const menuRef = ref(null)
const themeManager = ref(null)

// Language settings
const selectedLanguage = ref(locale.value)
const languageOptions = [
  { label: 'Türkçe', value: 'tr-TR' },
  { label: 'English', value: 'en-US' }
]

// Theme settings (removed - now using themeStore)

// Settings state
const performanceMode = ref(false)
const soundNotifications = ref(true)
const desktopNotifications = ref(true)
const emailNotifications = ref(false)
const dataCollection = ref(true)
const historyTracking = ref(true)
const autoLogin = ref(false)

// Computed
const currentLanguage = computed(() => {
  const lang = languageOptions.find(l => l.value === selectedLanguage.value)
  return lang ? lang.label : 'Türkçe'
})

// currentTheme computed removed - using themeStore instead

// Methods
const closeMenu = () => {
  menuRef.value.hide()
}

const openThemeGallery = () => {
  themeManager.value.open()
}

const changeLanguage = (newLanguage) => {
  locale.value = newLanguage
  $q.notify({
    message: t('settings.messages.languageChanged'),
    type: 'positive',
    position: 'top'
  })
}

// changeTheme function removed - using themeStore.setTheme instead

const exportData = () => {
  // Export all application data
  const data = {
    settings: {
      language: selectedLanguage.value,
      theme: {
        currentTheme: themeStore.currentTheme,
        accentColor: themeStore.accentColor,
        isHighContrast: themeStore.isHighContrast
      },
      performance: performanceMode.value,
      notifications: {
        sound: soundNotifications.value,
        desktop: desktopNotifications.value,
        email: emailNotifications.value
      },
      privacy: {
        dataCollection: dataCollection.value,
        historyTracking: historyTracking.value,
        autoLogin: autoLogin.value
      }
    },
    timestamp: new Date().toISOString()
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `app_settings_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  $q.notify({
    message: t('settings.messages.dataExported'),
    type: 'positive',
    position: 'top'
  })
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.settings) {
            // Apply imported settings
            if (data.settings.language) selectedLanguage.value = data.settings.language
            if (data.settings.theme) {
              if (data.settings.theme.currentTheme) themeStore.setTheme(data.settings.theme.currentTheme)
              if (data.settings.theme.accentColor) themeStore.setAccentColor(data.settings.theme.accentColor)
              if (data.settings.theme.isHighContrast !== undefined) themeStore.isHighContrast = data.settings.theme.isHighContrast
            }
            if (data.settings.performance !== undefined) performanceMode.value = data.settings.performance
            
            $q.notify({
              message: t('settings.messages.dataImported'),
              type: 'positive',
              position: 'top'
            })
          }
        } catch {
          $q.notify({
            message: t('settings.messages.importError'),
            type: 'negative',
            position: 'top'
          })
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const clearData = () => {
  $q.dialog({
    title: t('settings.data.clearConfirm.title'),
    message: t('settings.data.clearConfirm.message'),
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Clear all application data
    localStorage.clear()
    sessionStorage.clear()
    
    $q.notify({
      message: t('settings.messages.dataCleared'),
      type: 'positive',
      position: 'top'
    })
    
    // Reload page after clearing data
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  })
}
</script>

<style lang="sass">
.settings-menu
  height: calc(100% - 52px)
  border-radius: 18px
  max-height: none !important

  &__container
    height: 100%
    display: flex
    flex-direction: column
    background: #fefefe

  &__header
    height: 48px
    padding: 0 16px
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid rgba(0,0,0,0.08)

  &__close
    margin-right: -8px
    min-height: 28px
    min-width: 28px
    padding: 4px
    border-radius: 0
    font-size: 11px
    color: #5f6368
    opacity: 0.87

    &:hover
      background: rgba(0,0,0,0.04)
      color: #202124

  &__scroll
    flex: 1
    width: 444px
    padding-right: 8px
    
    // Vertical scrollbar
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
    
    // Horizontal scrollbar
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
    
    :deep(.q-scrollarea__content)
      padding-right: 8px

  &__title
    font-size: 16px
    font-weight: 500
    color: #5f6368
    text-transform: capitalize

  &__divider
    height: 1px
    background: rgba(0,0,0,0.08)

  &__section
    padding: 8px 0

  &__section-header
    padding: 0 16px
    height: 40px
    display: flex
    align-items: center
    justify-content: space-between
    margin: 0

  &__section-title
    color: #5f6368
    font-size: 16px
    font-weight: 500
    text-transform: capitalize
    padding: 0

  &__list
    .settings-menu__item
      min-height: 40px
      padding: 8px 16px
      color: #666
      font-size: 14px

      .q-item__section--avatar
        min-width: 40px
        .q-icon
          color: #5f6368
          opacity: 0.87
          font-size: 16px

      .q-item__section--side
        min-width: 40px
        padding-left: 16px
        &:last-child
          padding-left: 8px
        .q-icon
          color: #5f6368
          opacity: 0.87
          font-size: 16px

      &:hover
        background: rgba(0,0,0,0.04)
        color: #202124
        .q-item__section--side .q-icon
          opacity: 1

  &__item-title
    font-weight: 500
    margin-bottom: 2px

  &__item-subtitle
    font-size: 12px
    color: #5f6368
    opacity: 0.8

  &__select
    min-width: 100px
    .q-field__control
      height: 24px
    .q-field__native
      font-size: 12px

  &__toggle
    .q-toggle__inner
      font-size: 32px
    :deep(.q-toggle__thumb)
      top: 0.5rem
      width: 24px
      height: 24px
    :deep(.q-toggle__track)
      height: 16px

  &__arrow
    opacity: 0.6

  // Theme specific items
  .theme-item, .color-item
    min-height: auto !important
    padding: 12px 16px !important
    
    .settings-menu__item-title
      margin-bottom: 8px
      font-weight: 500

  .theme-selection
    display: flex
    gap: 4px
    flex-wrap: wrap

  .theme-btn
    border-radius: 6px
    padding: 6px 12px
    font-size: 12px
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.1)
    
    &:hover
      background: rgba(0,0,0,0.05)
    
    &.active
      background: var(--q-primary)
      color: white
      border-color: var(--q-primary)
      
      .q-icon
        color: white

  .color-selection
    display: flex
    gap: 6px
    flex-wrap: wrap

  .color-btn
    width: 24px
    height: 24px
    border-radius: 50%
    position: relative
    transition: all 0.2s ease
    border: 2px solid transparent
    
    &:hover
      transform: scale(1.1)
      box-shadow: 0 2px 6px rgba(0,0,0,0.2)
    
    &.active
      border-color: var(--theme-text-primary)
      transform: scale(1.1)
      
      &::after
        content: '✓'
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        color: white
        font-size: 10px
        font-weight: bold
        text-shadow: 0 0 2px rgba(0,0,0,0.5)

.settings-menu__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 