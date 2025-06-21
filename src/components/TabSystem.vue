<template>
  <div class="tab-system">
    <!-- Tab Bar -->
    <div class="tab-bar" @wheel="handleTabScroll">
      <div class="tab-container" ref="tabContainer">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-item', { 'active': activeTabId === tab.id, 'loading': tab.loading }]"
          @click="setActiveTab(tab.id)"
          @mousedown="handleTabMouseDown($event, tab.id)"
          @contextmenu="showTabContextMenu($event, tab)"
        >
          <!-- Tab Icon -->
          <div class="tab-icon">
            <q-icon 
              v-if="!tab.loading"
              :name="getTabIcon(tab)" 
              :color="getTabIconColor(tab)"
              size="16px"
            />
            <q-spinner 
              v-else
              size="16px" 
              color="primary"
            />
          </div>
          
          <!-- Tab Title -->
          <div class="tab-title" :title="tab.title">
            {{ tab.title }}
          </div>
          
          <!-- Tab Status Indicators -->
          <div class="tab-indicators">
            <q-icon 
              v-if="tab.hasUnsavedChanges"
              name="circle"
              size="8px"
              color="orange"
              class="unsaved-indicator"
            />
            <q-icon 
              v-if="tab.isSecure"
              name="lock"
              size="12px"
              color="green"
              class="secure-indicator"
            />
          </div>
          
          <!-- Close Button -->
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="close"
            class="tab-close-btn"
            @click.stop="closeTab(tab.id)"
            v-show="tabs.length > 1"
          />
        </div>
        
        <!-- Add New Tab Button -->
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="add"
          class="add-tab-btn"
          @click="showNewTabMenu"
        />
      </div>
      
      <!-- Tab Controls -->
      <div class="tab-controls">
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="keyboard_arrow_left"
          @click="scrollTabs('left')"
          :disable="!canScrollLeft"
        />
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="keyboard_arrow_right"
          @click="scrollTabs('right')"
          :disable="!canScrollRight"
        />
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="more_vert"
          @click="showTabsMenu"
        />
      </div>
    </div>
    
    <!-- Tab Content Area -->
    <div class="tab-content-area">
      <component
        v-for="tab in tabs"
        :key="tab.id"
        :is="getTabComponent(tab)"
        v-show="activeTabId === tab.id"
        :tab="tab"
        @update:title="updateTabTitle(tab.id, $event)"
        @update:loading="updateTabLoading(tab.id, $event)"
        @update:secure="updateTabSecure(tab.id, $event)"
      />
    </div>
    
    <!-- New Tab Menu -->
    <q-menu ref="newTabMenu" class="new-tab-menu">
      <q-list>
        <q-item clickable @click="createNewTab('vue')">
          <q-item-section avatar>
            <q-icon name="code" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vue Sayfası</q-item-label>
            <q-item-label caption>Yerel Vue.js sayfası aç</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable @click="createNewTab('web')">
          <q-item-section avatar>
            <q-icon name="language" color="blue" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Web Sayfası</q-item-label>
            <q-item-label caption>Dış web sitesi aç</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item clickable @click="createNewTab('edevlet')">
          <q-item-section avatar>
            <q-icon name="account_balance" color="red" />
          </q-item-section>
          <q-item-section>
            <q-item-label>e-Devlet</q-item-label>
            <q-item-label caption>e-Devlet kapısını aç</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable @click="createNewTab('sgk')">
          <q-item-section avatar>
            <q-icon name="local_hospital" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>SGK</q-item-label>
            <q-item-label caption>SGK web sitesini aç</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    
    <!-- Tab Context Menu -->
    <q-menu ref="tabContextMenu" class="tab-context-menu">
      <q-list>
        <q-item clickable @click="reloadTab(contextTab?.id)">
          <q-item-section avatar>
            <q-icon name="refresh" />
          </q-item-section>
          <q-item-section>Yenile</q-item-section>
        </q-item>
        
        <q-item clickable @click="duplicateTab(contextTab?.id)">
          <q-item-section avatar>
            <q-icon name="content_copy" />
          </q-item-section>
          <q-item-section>Kopyala</q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item clickable @click="closeTab(contextTab?.id)">
          <q-item-section avatar>
            <q-icon name="close" />
          </q-item-section>
          <q-item-section>Kapat</q-item-section>
        </q-item>
        
        <q-item clickable @click="closeOtherTabs(contextTab?.id)">
          <q-item-section avatar>
            <q-icon name="clear_all" />
          </q-item-section>
          <q-item-section>Diğerlerini Kapat</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useTabStore } from '../stores/tab-store'
import { storeToRefs } from 'pinia'

interface Tab {
  id: string
  title: string
  type: 'vue' | 'web' | 'edevlet' | 'sgk'
  url?: string
  component?: string
  loading: boolean
  hasUnsavedChanges: boolean
  isSecure: boolean
  favicon?: string
}

const tabStore = useTabStore()
const { tabs, activeTabId } = storeToRefs(tabStore)

const tabContainer = ref()
const newTabMenu = ref()
const tabContextMenu = ref()
const contextTab = ref<Tab | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const getTabIcon = (tab: Tab) => {
  switch (tab.type) {
    case 'vue': return 'code'
    case 'web': return 'language'
    case 'edevlet': return 'account_balance'
    case 'sgk': return 'local_hospital'
    default: return 'tab'
  }
}

const getTabIconColor = (tab: Tab) => {
  switch (tab.type) {
    case 'vue': return 'green'
    case 'web': return 'blue'
    case 'edevlet': return 'red'
    case 'sgk': return 'green'
    default: return 'grey'
  }
}

const getTabComponent = (tab: Tab) => {
  switch (tab.type) {
    case 'vue': return 'VuePageRenderer'
    case 'web': return 'WebPageRenderer'
    case 'edevlet': return 'EDevletRenderer'
    case 'sgk': return 'SGKRenderer'
    default: return 'DefaultRenderer'
  }
}

const setActiveTab = (tabId: string) => {
  tabStore.setActiveTab(tabId)
}

const closeTab = (tabId: string) => {
  if (tabs.value.length > 1) {
    tabStore.closeTab(tabId)
  }
}

const createNewTab = (type: Tab['type']) => {
  const newTab: Partial<Tab> = {
    type,
    loading: false,
    hasUnsavedChanges: false,
    isSecure: type === 'edevlet' || type === 'sgk'
  }
  
  switch (type) {
    case 'vue':
      newTab.title = 'Yeni Vue Sayfası'
      newTab.component = 'EmptyPage'
      break
    case 'web':
      newTab.title = 'Yeni Web Sayfası'
      newTab.url = 'about:blank'
      break
    case 'edevlet':
      newTab.title = 'e-Devlet'
      newTab.url = 'https://www.turkiye.gov.tr'
      break
    case 'sgk':
      newTab.title = 'SGK'
      newTab.url = 'https://www.sgk.gov.tr'
      break
  }
  
  tabStore.createTab(newTab as Tab)
  newTabMenu.value?.hide()
}

const showNewTabMenu = (event: MouseEvent) => {
  newTabMenu.value?.show(event)
}

const showTabContextMenu = (event: MouseEvent, tab: Tab) => {
  event.preventDefault()
  contextTab.value = tab
  tabContextMenu.value?.show(event)
}

const handleTabMouseDown = (event: MouseEvent, tabId: string) => {
  // Middle click to close tab
  if (event.button === 1) {
    event.preventDefault()
    closeTab(tabId)
  }
}

const handleTabScroll = (event: WheelEvent) => {
  event.preventDefault()
  const direction = event.deltaY > 0 ? 'right' : 'left'
  scrollTabs(direction)
}

const scrollTabs = (direction: 'left' | 'right') => {
  const container = tabContainer.value
  if (!container) return
  
  const scrollAmount = 200
  const newScrollLeft = direction === 'left' 
    ? container.scrollLeft - scrollAmount
    : container.scrollLeft + scrollAmount
  
  container.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
  })
  
  updateScrollButtons()
}

const updateScrollButtons = () => {
  const container = tabContainer.value
  if (!container) return
  
  canScrollLeft.value = container.scrollLeft > 0
  canScrollRight.value = container.scrollLeft < (container.scrollWidth - container.clientWidth)
}

const updateTabTitle = (tabId: string, title: string) => {
  tabStore.updateTab(tabId, { title })
}

const updateTabLoading = (tabId: string, loading: boolean) => {
  tabStore.updateTab(tabId, { loading })
}

const updateTabSecure = (tabId: string, isSecure: boolean) => {
  tabStore.updateTab(tabId, { isSecure })
}

const reloadTab = (tabId?: string) => {
  if (!tabId) return
  // Implement tab reload logic
  console.log('Reloading tab:', tabId)
}

const duplicateTab = (tabId?: string) => {
  if (!tabId) return
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab) {
    createNewTab(tab.type)
  }
}

const closeOtherTabs = (tabId?: string) => {
  if (!tabId) return
  tabs.value.forEach(tab => {
    if (tab.id !== tabId) {
      closeTab(tab.id)
    }
  })
}

const showTabsMenu = () => {
  // Show all tabs menu for quick navigation
  console.log('Showing tabs menu')
}

onMounted(() => {
  // Initialize with a default tab if none exist
  if (tabs.value.length === 0) {
    createNewTab('vue')
  }
  
  // Setup scroll listeners
  const container = tabContainer.value
  if (container) {
    container.addEventListener('scroll', updateScrollButtons)
    updateScrollButtons()
  }
})
</script>

<style lang="scss" scoped>
.tab-system {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--q-dark);
}

.tab-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 8px;
  height: 40px;
  overflow: hidden;
}

.tab-container {
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-width: 180px;
  max-width: 240px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px 8px 0 0;
  margin-right: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: rgba(25, 118, 210, 0.2);
    border-bottom-color: var(--q-primary);
  }
  
  &.loading {
    .tab-icon {
      animation: pulse 1.5s infinite;
    }
  }
}

.tab-icon {
  margin-right: 8px;
  flex-shrink: 0;
}

.tab-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.tab-indicators {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
}

.tab-close-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
  
  .tab-item:hover & {
    opacity: 1;
  }
}

.add-tab-btn {
  margin-left: 8px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
}

.tab-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.new-tab-menu,
.tab-context-menu {
  .q-item {
    min-height: 40px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// Dark mode adjustments
.body--dark {
  .tab-bar {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .tab-item {
    background: rgba(255, 255, 255, 0.03);
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    
    &.active {
      background: rgba(25, 118, 210, 0.15);
    }
  }
}
</style> 