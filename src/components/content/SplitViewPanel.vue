<template>
  <div 
    v-if="splitViewStore.isVisible" 
    class="split-view-layout"
    :style="splitViewStyle"
  >
    <div class="split-view-header">
      <div class="split-view-title">
        <q-icon name="bi-layout-split" size="16px" class="q-mr-sm" />
        <span>Açık Sekmeler</span>
      </div>
      <div class="split-view-actions">
        <q-btn 
          v-if="hasSelectedTab"
          flat 
          round 
          dense 
          icon="bi-arrow-left" 
          @click="contentRef?.backToList()"
          class="q-mr-sm"
        />
        <q-btn flat round dense icon="bi-x" @click="handleClose" />
      </div>
    </div>
    <div class="split-view-content">
      <SplitViewContent
        ref="contentRef"
        :tabs="otherTabs"
        @close-tab="closeTab"
        @show-tab="handleTabChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSplitViewStore } from 'src/stores/split-view-store'
import { useTabStore } from 'src/stores/tab-store'
import SplitViewContent from './SplitViewContent.vue'

const props = defineProps({
  leftPanelWidth: {
    type: Number,
    required: true
  }
})

const splitViewStore = useSplitViewStore()
const tabStore = useTabStore()
const contentRef = ref(null)

// Seçili sekme durumunu takip et
const hasSelectedTab = ref(false)

// Sekme seçildiğinde veya geri dönüldüğünde güncelle
const handleTabChange = (tab) => {
  hasSelectedTab.value = !!tab
}

// Aktif olmayan sekmeleri getir
const otherTabs = computed(() => {
  return tabStore.tabs
    .filter(tab => tab.id !== tabStore.activeTabId)
    .map(tab => ({
      id: tab.id,
      title: tab.title || 'Başlıksız Sekme',
      path: tab.route || '/',
      icon: getTabIcon(tab.route || '/')
    }))
})

// Sekme ikonunu belirle
const getTabIcon = (path) => {
  const iconMap = {
    '/': 'bi-house',
    '/menu': 'bi-grid',
    '/hasar-bildirimi': 'bi-exclamation-triangle',
    '/hasar-takibi': 'bi-search',
    '/hasar-dosyalari': 'bi-folder'
  }
  return iconMap[path] || 'bi-window'
}

// Sekmeyi kapat
const closeTab = (tabId) => {
  tabStore.closeTab(tabId)
}

const splitViewStyle = computed(() => ({
  width: `calc(${props.leftPanelWidth}% - 50px)`
}))

const handleClose = () => {
  contentRef.value?.backToList()
  splitViewStore.hide()
}
</script>

<style lang="sass">
.split-view-layout
  position: absolute
  top: 52px
  left: 52px
  bottom: 0
  z-index: 900
  transition: width 0.1s ease-out
  background: #fefefe
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 18px
  overflow: hidden
  display: flex
  flex-direction: column

.split-view-header
  height: 48px
  padding: 0 16px
  display: flex
  align-items: center
  justify-content: space-between
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)
  background: #fff

  .split-view-title
    display: flex
    align-items: center
    font-size: 14px
    font-weight: 500
    color: #202124

  .split-view-actions
    display: flex
    align-items: center
    gap: 8px

.split-view-content
  flex: 1
  overflow: hidden
  display: flex
  flex-direction: column

  &:has(.split-view-tabs)
    padding: 16px
    overflow: auto

  &:has(.split-view-content-container)
    padding: 0

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