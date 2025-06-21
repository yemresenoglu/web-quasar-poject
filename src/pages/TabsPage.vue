<template>
  <q-page class="tabs-page">
    <!-- Header -->
    <div class="tabs-page__header">
      <div class="tabs-page__title">
        <q-icon name="bi-window-stack" size="24px" class="q-mr-sm" />
        Açık Sekmeler
      </div>
      <div class="tabs-page__actions">
        <q-btn
          flat
          round
          dense
          icon="bi-arrow-clockwise"
          @click="refreshTabs"
        >
          <q-tooltip>Yenile</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Content -->
    <div class="tabs-page__content">
      <!-- Tab Grid -->
      <div class="tabs-page__grid">
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
                <Suspense>
                  <template #default>
                    <component 
                      v-if="getComponent(tab.route)"
                      :is="getComponent(tab.route)"
                      class="tab-preview__component"
                    />
                  </template>
                  <template #fallback>
                    <div class="tab-preview__loading">
                      <q-spinner color="primary" size="24px" />
                    </div>
                  </template>
                </Suspense>
              </div>
              <div class="tab-preview__overlay" @click="handleCardClick(tab)" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="tabs.length === 0" class="tabs-page__empty">
        <q-icon name="bi-info-circle" size="48px" class="q-mb-md" />
        <div class="text-h6 q-mb-sm">Açık Sekme Yok</div>
        <div class="text-body2 text-grey">
          Henüz açık sekme bulunmuyor. Yeni bir sekme açmak için menüyü kullanabilirsiniz.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useRouter } from 'vue-router'

const tabStore = useTabStore()
const router = useRouter()

// Computed properties
const tabs = computed(() => tabStore.tabs.filter(tab => tab.route !== '/tabs'))
const activeTabId = computed(() => tabStore.activeTabId)

// Component cache
const componentCache = ref({})

// Component yükleme ve önbellekleme
const loadComponent = async (route) => {
  if (componentCache.value[route]) {
    return componentCache.value[route]
  }

  try {
    const path = route.startsWith('/') ? route.slice(1) : route
    const matchedRoute = router.options.routes[0].children.find(r => r.path === path)
    
    if (matchedRoute) {
      const component = await matchedRoute.component()
      const componentInstance = component.default || component
      componentCache.value[route] = componentInstance
      return componentInstance
    }
  } catch (error) {
    console.error('Component yüklenirken hata:', error)
  }
  
  return null
}

// Component getter
const getComponent = (route) => {
  if (!componentCache.value[route]) {
    loadComponent(route)
  }
  return componentCache.value[route]
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
  tabStore.$reset()
}

// İlk yüklemede tüm componentleri hazırla
onMounted(() => {
  tabs.value.forEach(tab => {
    loadComponent(tab.route)
  })
})

// Tablar değiştiğinde yeni componentleri yükle
watch(tabs, (newTabs) => {
  newTabs.forEach(tab => {
    if (!componentCache.value[tab.route]) {
      loadComponent(tab.route)
    }
  })
})
</script>

<style lang="sass">
.tabs-page
  padding: 24px

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 24px

  &__title
    display: flex
    align-items: center
    font-size: 20px
    font-weight: 500
    color: #202124

  &__content
    max-width: 1200px
    margin: 0 auto

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
    align-items: center
    justify-content: center
    background: #fff
    z-index: 3

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