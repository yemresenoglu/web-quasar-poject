<template>
  <q-dialog
    ref="dialogRef"
    class="tabs-dialog"
    transition-show="fade"
    transition-hide="fade"
    @hide="onDialogHide"
  >
    <q-card class="tabs-dialog__card">
      <!-- Header -->
      <q-card-section class="tabs-dialog__header">
        <div class="tabs-dialog__title">
          <q-icon name="bi-window-stack" size="24px" class="q-mr-sm" />
          Açık Sekmeler
        </div>
        <div class="tabs-dialog__actions">
          <q-btn
            flat
            round
            dense
            icon="bi-arrow-clockwise"
            @click="refreshTabs"
            class="q-mr-sm"
          >
            <q-tooltip>Yenile</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="bi-x-lg"
            @click="closeDialog"
          >
            <q-tooltip>Kapat</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Content -->
      <q-card-section class="tabs-dialog__content">
        <!-- Tab Grid -->
        <div class="tabs-dialog__grid">
          <q-card
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-card"
            :class="{ 'tab-card--active': tab.id === activeTabId }"
            @click="handleCardClick(tab)"
          >
            <!-- Card Head -->
            <q-card-section class="tab-card__head">
              <div class="tab-card__title">
                <q-icon :name="tab.icon" size="20px" class="q-mr-sm" />
                {{ tab.title || 'Başlıksız Sekme' }}
                <q-chip 
                  v-if="tab.type === 'external'" 
                  size="xs" 
                  color="blue" 
                  text-color="white"
                  class="q-ml-sm"
                >
                  Web
                </q-chip>
              </div>
              <div class="tab-card__actions">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="bi-x-lg"
                  @click.stop="closeTab(tab.id)"
                >
                  <q-tooltip>Kapat</q-tooltip>
                </q-btn>
              </div>
            </q-card-section>

            <!-- Card Body -->
            <q-separator />
            <q-card-section class="tab-card__body">
              <div class="tab-preview">
                <div class="tab-preview__content">
                  <div v-if="getComponent(tab.route)" class="tab-preview__wrapper">
                    <q-layout view="hHh LpR fFf" container class="tab-preview__layout">
                      <q-page-container>
                        <component 
                          :is="getComponent(tab.route)"
                          class="tab-preview__component"
                        />
                      </q-page-container>
                    </q-layout>
                  </div>
                  <div v-else-if="loadingComponents.has(tab.route)" class="tab-preview__loading">
                    <q-spinner color="primary" size="24px" />
                    <div class="text-caption q-mt-sm">Yükleniyor...</div>
                  </div>
                  <div v-else class="tab-preview__placeholder">
                    <q-icon name="bi-window" size="32px" class="q-mb-sm" />
                    <div class="text-caption">Önizleme Yok</div>
                  </div>
                </div>
                <div class="tab-preview__overlay" @click="handleCardClick(tab)" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Empty State -->
        <div v-if="tabs.length === 0" class="tabs-dialog__empty">
          <q-icon name="bi-info-circle" size="48px" class="q-mb-md" />
          <div class="text-h6 q-mb-sm">Açık Sekme Yok</div>
          <div class="text-body2 text-grey">
            Henüz açık sekme bulunmuyor. Yeni bir sekme açmak için menüyü kullanabilirsiniz.
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useRouter } from 'vue-router'
import { useDialogPluginComponent } from 'quasar'
import { markRaw } from 'vue'

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

// Emit events
defineEmits([...useDialogPluginComponent.emits])

const tabStore = useTabStore()
const router = useRouter()

// Computed properties
const tabs = computed(() => tabStore.tabs.filter(tab => tab.route !== '/tabs'))
const activeTabId = computed(() => tabStore.activeTabId)

// Component cache - reactive olarak tanımlıyorum
const componentCache = ref({})
const loadingComponents = ref(new Set())

// Component yükleme ve önbellekleme - reactive yapıyorum
const loadComponent = async (route) => {
  if (componentCache.value[route] || loadingComponents.value.has(route)) {
    return componentCache.value[route]
  }
  
  loadingComponents.value.add(route)
  
  try {
    const path = route.startsWith('/') ? route.slice(1) : route
    const matchedRoute = router.options.routes[0].children.find(r => r.path === path)
    
    if (matchedRoute) {
      const component = await matchedRoute.component()
      const componentInstance = component.default || component
      // markRaw kullanarak component'i reactive olmaktan çıkarıyoruz
      componentCache.value[route] = markRaw(componentInstance)
      loadingComponents.value.delete(route)
      return componentCache.value[route]
    }
  } catch (error) {
    console.error('Component yüklenirken hata:', error)
  }
  
  loadingComponents.value.delete(route)
  return null
}

// Component getter - reactive olarak çalışacak şekilde
const getComponent = (route) => {
  return componentCache.value[route] || null
}

// Component'leri önceden yükle
const preloadComponents = async () => {
  const promises = tabs.value.map(tab => loadComponent(tab.route))
  await Promise.all(promises)
}

// Methods
const handleCardClick = async (tab) => {
  console.log('Karta tıklandı:', tab)
  
  try {
    // Önce router yönlendirmesi yapalım
    await router.push(tab.route)
    console.log('Router yönlendirmesi başarılı:', tab.route)
    
    // Sonra tab'ı aktif hale getirelim
    tabStore.setActiveTab(tab.id)
    console.log('Tab aktif hale getirildi:', tab.id)
    
    // Dialog'u kapat
    closeDialog()
  } catch (error) {
    console.error('Yönlendirme sırasında hata:', error)
  }
}

const closeTab = (tabId) => {
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab) {
    delete componentCache.value[tab.route]
  }
  tabStore.closeTab(tabId)
}

const refreshTabs = () => {
  componentCache.value = {}
  // tabStore.$reset() // Bu satırı kaldırdım çünkü tüm tabları sıfırlıyor
}

const closeDialog = () => {
  onDialogCancel()
}

// İlk yüklemede tüm componentleri hazırla
onMounted(async () => {
  await preloadComponents()
})

// Tablar değiştiğinde yeni componentleri yükle
watch(tabs, async (newTabs) => {
  const newRoutes = newTabs
    .map(tab => tab.route)
    .filter(route => !componentCache.value[route])
  
  if (newRoutes.length > 0) {
    const promises = newRoutes.map(route => loadComponent(route))
    await Promise.all(promises)
  }
}, { immediate: true })
</script>

<style lang="sass">
.tabs-dialog
  // Dialog wrapper'ı için özel stiller
  :deep(.q-dialog__inner)
    padding: 24px !important
    
  :deep(.q-card)
    width: 90vw !important
    height: 85vh !important
    max-width: 1200px !important
    max-height: 800px !important
    min-width: 300px !important
    min-height: 400px !important

  .q-dialog__inner
    padding: 24px !important

  &__card
    width: 90vw !important
    height: 85vh !important
    max-width: 1200px !important
    max-height: 800px !important
    border-radius: 12px
    overflow: hidden

  &__header
    padding: 16px 24px
    display: flex
    align-items: center
    justify-content: space-between
    background: #fafafa
    border-bottom: 1px solid rgba(0,0,0,0.12)

  &__title
    display: flex
    align-items: center
    font-size: 20px
    font-weight: 500
    color: #202124

  &__actions
    display: flex
    align-items: center
    gap: 8px

  &__content
    padding: 24px
    height: calc(100% - 80px)
    overflow-y: auto

  &__grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(250px, 250px))
    gap: 24px
    padding: 8px
    justify-content: center

  &__empty
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 48px
    text-align: center
    color: #5f6368

.tab-card
  width: 250px
  height: 250px
  border-radius: 12px
  box-shadow: 0 2px 4px rgba(0,0,0,0.05)
  transition: all 0.2s ease
  cursor: pointer
  position: relative
  overflow: hidden
  display: flex
  flex-direction: column

  &--active
    border: 2px solid #1976d2
    background: rgba(25, 118, 210, 0.04)

  &:hover
    box-shadow: 0 4px 8px rgba(0,0,0,0.1)
    transform: translateY(-2px)

  // Card Head
  &__head
    padding: 12px 16px
    display: flex
    align-items: center
    justify-content: space-between
    background: #fafafa
    min-height: 52px
    flex-shrink: 0

  &__title
    display: flex
    align-items: center
    font-weight: 500
    color: #202124
    font-size: 14px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    flex: 1
    min-width: 0

    .q-icon
      color: #5f6368
      opacity: 0.87
      flex-shrink: 0

  &__actions
    margin-left: 8px

    .q-btn
      opacity: 0.7
      &:hover
        opacity: 1

  // Card Body
  &__body
    flex: 1
    padding: 0
    position: relative
    overflow: hidden
    background: #fff

.tab-preview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden

  &__content
    position: absolute
    top: 0
    left: 0
    width: 200%
    height: 200%
    transform: scale(0.5)
    transform-origin: 0 0
    z-index: 1

  &__wrapper
    width: 100%
    height: 100%
    position: relative

  &__layout
    width: 100%
    height: 100%
    
    .q-page-container
      padding: 0 !important
      
    :deep(.q-page)
      padding: 0 !important
      min-height: unset !important

  &__component
    width: 100%
    height: 100%
    pointer-events: none

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
    z-index: 3
    color: #5f6368

  &__placeholder
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    background: #fafafa
    z-index: 3
    color: #9e9e9e
    opacity: 0.7

  &__overlay
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: transparent
    z-index: 2
    cursor: pointer
    &:hover
      background: rgba(0, 0, 0, 0.02)
</style> 