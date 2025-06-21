<template>
  <!-- Tab Listesi -->
  <div v-if="!selectedTab" class="split-view-tabs">
    <q-card v-for="tab in otherTabs" :key="tab.id" class="tab-card q-mb-sm">
      <q-card-section horizontal>
        <q-card-section class="tab-info">
          <div class="tab-title">
            <q-icon :name="tab.icon" size="18px" class="q-mr-sm" />
            {{ tab.title }}
          </div>
          <div class="tab-path text-caption text-grey">
            {{ tab.path }}
          </div>
        </q-card-section>

        <q-card-actions vertical class="justify-around">
          <q-btn flat round dense icon="bi-arrow-right" size="sm" @click="showTab(tab)" />
        </q-card-actions>
      </q-card-section>
    </q-card>

    <div v-if="otherTabs.length === 0" class="no-tabs">
      <q-icon name="bi-info-circle" size="24px" class="q-mb-sm" />
      <div>Başka açık sekme bulunmuyor</div>
    </div>
  </div>

  <!-- Seçili Tab İçeriği -->
  <div v-else class="split-view-content-container">
    <q-layout view="hHh LpR fFf" container>
      <q-page-container>
        <transition name="fade" mode="out-in">
          <component :is="currentComponent" v-if="currentComponent" />
          <div v-else class="no-component">
            <q-icon name="bi-exclamation-circle" size="24px" class="q-mb-sm" />
            <div>Sayfa bulunamadı</div>
          </div>
        </transition>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useRouter } from 'vue-router'

// Store ve router setup
const tabStore = useTabStore()
const router = useRouter()

// Emit tanımı
const emit = defineEmits(['show-tab'])

// Aktif olmayan sekmeleri computed olarak al
const otherTabs = computed(() => {
  const activeRoute = router.currentRoute.value.path
  return tabStore.tabs
    .filter(tab => tab.route !== activeRoute) // Ana sayfadaki aktif tab'i filtrele
    .map(tab => ({
      id: tab.id,
      title: tab.title || 'Başlıksız Sekme',
      path: tab.route,
      icon: tab.icon || 'bi-globe'
    }))
})

// Seçili sekme state'i
const selectedTab = ref(null)
const currentComponent = ref(null)

// Watch selectedTab değişimini izle ve komponenti güncelle
watch(selectedTab, async (newTab) => {
  if (newTab?.path) {
    const path = newTab.path.startsWith('/') ? newTab.path : `/${newTab.path}`
    // Router'dan ilgili route'u bul
    const matchedRoute = router.options.routes[0].children.find(route => route.path === path.slice(1))
    if (matchedRoute) {
      // Component'i yükle ve currentComponent'e ata
      const component = await matchedRoute.component()
      currentComponent.value = component.default || component
    } else {
      currentComponent.value = null
    }
    emit('show-tab', newTab)
  } else {
    currentComponent.value = null
  }
})

// Sekmeyi göster - sadece component'i güncelle
const showTab = (tab) => {
  selectedTab.value = tab
}

// Expose methods
defineExpose({
  backToList: () => {
    selectedTab.value = null
    emit('show-tab', null)
  }
})
</script>

<style lang="sass">
.split-view-tabs
  display: flex
  flex-direction: column
  gap: 8px

.tab-card
  border-radius: 8px
  box-shadow: 0 2px 4px rgba(0,0,0,0.05)
  transition: all 0.2s ease

  &:hover
    box-shadow: 0 4px 8px rgba(0,0,0,0.1)
    transform: translateY(-1px)

  .tab-info
    flex: 1
    padding: 12px
    min-width: 0

  .tab-title
    display: flex
    align-items: center
    font-weight: 500
    color: #202124
    margin-bottom: 4px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

    .q-icon
      color: #5f6368
      opacity: 0.87

  .tab-path
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    font-size: 12px

  .q-card-actions
    padding: 8px
    border-left: 1px solid rgba(0,0,0,0.12)

    .q-btn
      opacity: 0.7
      &:hover
        opacity: 1

.no-tabs
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 200px
  color: #5f6368
  opacity: 0.7
  text-align: center

.split-view-content-container
  flex: 1
  position: relative
  height: 100%
  background: #fff
  
  .q-layout
    width: 100%
    height: 100%

.fade-enter-active,
.fade-leave-active
  transition: opacity 0.15s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0

.no-component
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100%
  color: #5f6368
  opacity: 0.7
  text-align: center
</style> 