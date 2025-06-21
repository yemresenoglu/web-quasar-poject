<template>
  <q-dialog v-model="isOpen" class="dynamic-theme-dialog">
    <q-card class="theme-manager">
      <!-- Header -->
      <q-card-section class="theme-manager__header">
        <div class="theme-manager__title">
          <q-btn flat round dense icon="bi-arrow-left" @click="goBack" v-if="currentView !== 'main'" />
          <span>{{ getTitle() }}</span>
        </div>
        <q-btn flat round dense icon="bi-x-lg" @click="close" />
      </q-card-section>

      <!-- Main View -->
      <q-card-section class="theme-manager__content" v-if="currentView === 'main'">
        <!-- Theme Mode Selection -->
        <div class="theme-section">
          <h6 class="theme-section__title">Mod</h6>
          <div class="theme-mode-selector">
            <q-btn
              v-for="theme in themeStore.predefinedThemes"
              :key="theme.name"
              flat
              no-caps
              :class="['theme-mode-btn', { active: themeStore.currentTheme === theme.name && !themeStore.currentWallpaper }]"
              @click="setTheme(theme.name)"
            >
              <q-icon :name="theme.icon" size="18px" />
              <span>{{ theme.label }}</span>
            </q-btn>
          </div>
        </div>

        <!-- Current Wallpaper Preview -->
        <div class="theme-section" v-if="themeStore.currentWallpaper">
          <h6 class="theme-section__title">Mevcut Duvar Kağıdı</h6>
          <div class="current-wallpaper">
            <div 
              class="wallpaper-preview"
              :style="{ 
                backgroundImage: themeStore.currentWallpaper.gradient || `url(${themeStore.currentWallpaper.thumbnail})`
              }"
            >
              <div class="wallpaper-overlay">
                <span class="wallpaper-name">{{ themeStore.currentWallpaper.name }}</span>
                <q-btn round flat dense icon="bi-x-lg" @click="clearWallpaper" class="remove-btn" />
              </div>
            </div>
          </div>
        </div>

        <!-- Wallpaper Collections -->
        <div class="theme-section">
          <h6 class="theme-section__title">Duvar Kağıdı Koleksiyonları</h6>
          <div class="collection-grid">
            <div 
              v-for="(collection, key) in themeStore.wallpaperCollections"
              :key="key"
              class="collection-card"
              @click="openCollection(key)"
            >
              <div 
                class="collection-preview"
                :style="{ 
                  backgroundImage: collection[0]?.gradient || `url(${collection[0]?.thumbnail})`
                }"
              >
                <div class="collection-overlay">
                  <span class="collection-name">{{ getCollectionName(key) }}</span>
                  <span class="collection-count">{{ collection.length }} resim</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Wheel -->
        <div class="theme-section">
          <h6 class="theme-section__title">Accent Rengi</h6>
          <div class="color-wheel-container">
            <div class="color-wheel">
              <q-btn
                v-for="color in themeStore.accentColors"
                :key="color.name"
                round
                flat
                :class="['color-btn', { active: themeStore.accentColor === color.value }]"
                :style="{ backgroundColor: color.value }"
                @click="setAccentColor(color.value)"
              >
                <q-tooltip>{{ color.label }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Custom Color Picker -->
        <div class="theme-section">
          <h6 class="theme-section__title">Özel Renk</h6>
          <div class="custom-color-picker">
            <q-color
              v-model="customColor"
              format-model="hex"
              @change="setCustomAccentColor"
              class="color-picker"
            />
          </div>
        </div>
      </q-card-section>

      <!-- Collection View -->
      <q-card-section class="theme-manager__content" v-if="currentView === 'collection'">
        <div class="wallpaper-grid">
          <div
            v-for="wallpaper in currentCollection"
            :key="wallpaper.id"
            class="wallpaper-item"
            @click="selectWallpaper(wallpaper)"
          >
            <div 
              class="wallpaper-thumbnail"
              :style="{ 
                backgroundImage: wallpaper.gradient || `url(${wallpaper.thumbnail})`
              }"
            >
              <div class="wallpaper-info">
                <span class="wallpaper-title">{{ wallpaper.name }}</span>
              </div>
              <div class="color-preview" v-if="wallpaper.colors">
                <div 
                  class="color-dot"
                  v-for="(color, key) in getFilteredColors(wallpaper.colors)"
                  :key="key"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="theme-manager__actions" v-if="currentView === 'main'">
        <q-btn 
          flat 
          color="primary" 
          label="Sıfırla" 
          @click="resetToDefault"
          v-if="themeStore.currentWallpaper || themeStore.accentColor !== '#1976d2'"
        />
        <q-spacer />
        <q-btn flat label="İptal" @click="close" />
        <q-btn color="primary" label="Temayı Uygula" @click="applyAndClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeStore } from 'src/stores/theme-store'

const themeStore = useThemeStore()

// Component state
const isOpen = ref(false)
const currentView = ref('main') // 'main', 'collection'
const selectedCollection = ref(null)
const customColor = ref('#1976d2')

// Computed
const currentCollection = computed(() => {
  if (!selectedCollection.value) return []
  return themeStore.getWallpapersByCategory(selectedCollection.value)
})

// Watch accent color changes
watch(() => themeStore.accentColor, (newColor) => {
  customColor.value = newColor
})

// Methods
const open = () => {
  isOpen.value = true
  currentView.value = 'main'
  customColor.value = themeStore.accentColor
}

const close = () => {
  isOpen.value = false
}

const goBack = () => {
  if (currentView.value === 'collection') {
    currentView.value = 'main'
    selectedCollection.value = null
  }
}

const getTitle = () => {
  switch (currentView.value) {
    case 'collection':
      return getCollectionName(selectedCollection.value)
    default:
      return 'Tema Galerisi'
  }
}

const getCollectionName = (key) => {
  const names = {
    classic: 'Klasik',
    modern: 'Modern',
    abstract: 'Soyut',
    nature: 'Doğa',
    minimal: 'Minimal'
  }
  return names[key] || key.charAt(0).toUpperCase() + key.slice(1)
}

const setTheme = (themeName) => {
  themeStore.setTheme(themeName)
}

const setAccentColor = (color) => {
  themeStore.setAccentColor(color)
  customColor.value = color
}

const setCustomAccentColor = (color) => {
  themeStore.setAccentColor(color)
}

const openCollection = (collectionKey) => {
  selectedCollection.value = collectionKey
  currentView.value = 'collection'
}

const selectWallpaper = async (wallpaper) => {
  await themeStore.setWallpaper(wallpaper)
  currentView.value = 'main'
}

const clearWallpaper = () => {
  themeStore.clearWallpaper()
}

const resetToDefault = () => {
  themeStore.clearWallpaper()
  themeStore.setAccentColor('#1976d2')
  themeStore.setTheme('light')
}

const applyAndClose = () => {
  close()
}

const getFilteredColors = (colors) => {
  if (!colors) return {}
  const filtered = {}
  Object.keys(colors).forEach(key => {
    if (key !== 'dominant') {
      filtered[key] = colors[key]
    }
  })
  return filtered
}

// Expose methods
defineExpose({
  open,
  close
})
</script>

<style lang="sass">
.dynamic-theme-dialog
  .q-dialog__inner
    padding: 0

.theme-manager
  width: 800px
  max-width: 90vw
  height: 600px
  max-height: 90vh
  display: flex
  flex-direction: column
  background: rgba(255, 255, 255, 0.95)
  backdrop-filter: blur(20px)
  border-radius: 16px
  overflow: hidden

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    padding: 16px 20px
    border-bottom: 1px solid rgba(0, 0, 0, 0.08)
    background: rgba(255, 255, 255, 0.8)

  &__title
    display: flex
    align-items: center
    gap: 12px
    font-size: 18px
    font-weight: 600
    color: #2c3e50

  &__content
    flex: 1
    padding: 20px
    overflow-y: auto
    
    // Custom scrollbar
    &::-webkit-scrollbar
      width: 4px
    
    &::-webkit-scrollbar-track
      background: transparent
    
    &::-webkit-scrollbar-thumb
      background: rgba(0, 0, 0, 0.2)
      border-radius: 2px
      
      &:hover
        background: rgba(0, 0, 0, 0.3)

  &__actions
    padding: 16px 20px
    border-top: 1px solid rgba(0, 0, 0, 0.08)
    background: rgba(255, 255, 255, 0.8)

.theme-section
  margin-bottom: 32px

  &__title
    margin: 0 0 16px 0
    font-size: 16px
    font-weight: 600
    color: #2c3e50

.theme-mode-selector
  display: flex
  gap: 8px
  background: rgba(0, 0, 0, 0.05)
  border-radius: 12px
  padding: 4px

.theme-mode-btn
  flex: 1
  display: flex
  flex-direction: column
  align-items: center
  gap: 4px
  padding: 12px 8px
  border-radius: 8px
  color: #64748b
  transition: all 0.2s ease

  &.active
    background: white
    color: #1976d2
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

  span
    font-size: 12px
    font-weight: 500

.current-wallpaper
  .wallpaper-preview
    width: 100%
    height: 120px
    border-radius: 12px
    background-size: cover
    background-position: center
    position: relative
    overflow: hidden

  .wallpaper-overlay
    position: absolute
    inset: 0
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7))
    display: flex
    align-items: flex-end
    justify-content: space-between
    padding: 16px

  .wallpaper-name
    color: white
    font-weight: 500
    font-size: 14px

  .remove-btn
    color: white
    background: rgba(255, 255, 255, 0.2)
    backdrop-filter: blur(10px)

.collection-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))
  gap: 16px

.collection-card
  cursor: pointer
  transition: transform 0.2s ease

  &:hover
    transform: translateY(-2px)

.collection-preview
  width: 100%
  height: 100px
  border-radius: 12px
  background-size: cover
  background-position: center
  position: relative
  overflow: hidden

.collection-overlay
  position: absolute
  inset: 0
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8))
  display: flex
  flex-direction: column
  justify-content: flex-end
  padding: 12px

.collection-name
  color: white
  font-weight: 600
  font-size: 13px
  margin-bottom: 2px

.collection-count
  color: rgba(255, 255, 255, 0.8)
  font-size: 11px

.color-wheel-container
  display: flex
  justify-content: center

.color-wheel
  display: grid
  grid-template-columns: repeat(6, 1fr)
  gap: 8px
  max-width: 300px

.color-btn
  width: 40px
  height: 40px
  border-radius: 50%
  border: 3px solid transparent
  transition: all 0.2s ease
  position: relative

  &:hover
    transform: scale(1.1)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2)

  &.active
    border-color: white
    box-shadow: 0 0 0 2px #1976d2, 0 4px 12px rgba(0, 0, 0, 0.3)
    transform: scale(1.1)

.custom-color-picker
  display: flex
  justify-content: center

.color-picker
  border-radius: 12px
  overflow: hidden

.wallpaper-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
  gap: 16px

.wallpaper-item
  cursor: pointer
  transition: transform 0.2s ease

  &:hover
    transform: translateY(-4px)

.wallpaper-thumbnail
  width: 100%
  height: 120px
  border-radius: 12px
  background-size: cover
  background-position: center
  position: relative
  overflow: hidden
  border: 2px solid transparent
  transition: all 0.2s ease

  &:hover
    border-color: #1976d2
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3)

.wallpaper-info
  position: absolute
  bottom: 0
  left: 0
  right: 0
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)
  padding: 12px
  color: white

.wallpaper-title
  font-size: 13px
  font-weight: 500

.color-preview
  position: absolute
  top: 8px
  right: 8px
  display: flex
  gap: 4px

.color-dot
  width: 12px
  height: 12px
  border-radius: 50%
  border: 1px solid rgba(255, 255, 255, 0.5)

// Dynamic theme styles
.dynamic-theme
  .theme-manager
    background: rgba(255, 255, 255, 0.1)
    color: white

    &__header,
    &__actions
      background: rgba(255, 255, 255, 0.1)
      border-color: rgba(255, 255, 255, 0.1)

    .theme-section__title
      color: white

    .theme-mode-btn
      color: rgba(255, 255, 255, 0.7)

      &.active
        background: rgba(255, 255, 255, 0.2)
        color: white

    .collection-name,
    .wallpaper-title
      color: white
</style> 