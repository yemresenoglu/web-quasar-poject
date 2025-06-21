<template>
  <div class="modern-sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Activity Bar -->
    <div class="activity-bar">
      <div class="activity-items">
        <div
          v-for="item in activityItems"
          :key="item.id"
          :class="['activity-item', { 'active': activeView === item.id }]"
          @click="setActiveView(item.id)"
          :title="item.title"
        >
          <q-icon :name="item.icon" size="24px" />
          <div v-if="item.badge" class="activity-badge">
            {{ item.badge }}
          </div>
        </div>
      </div>
      
      <div class="activity-bottom">
        <div
          class="activity-item"
          @click="toggleCollapse"
          title="Kenar Çubuğunu Gizle/Göster"
        >
          <q-icon :name="isCollapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_left'" size="20px" />
        </div>
        
        <div
          class="activity-item"
          @click="openSettings"
          title="Ayarlar"
        >
          <q-icon name="settings" size="20px" />
        </div>
      </div>
    </div>
    
    <!-- Sidebar Content -->
    <div v-if="!isCollapsed" class="sidebar-content">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="sidebar-title">
          {{ getCurrentViewTitle() }}
        </div>
        <div class="sidebar-actions">
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="more_horiz"
            @click="showViewMenu"
          />
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="sidebar-body">
        <!-- Explorer View -->
        <div v-if="activeView === 'explorer'" class="view-content">
          <div class="section">
            <div class="section-header" @click="toggleSection('favorites')">
              <q-icon 
                :name="sections.favorites.expanded ? 'expand_more' : 'chevron_right'" 
                size="16px" 
              />
              <span>Favoriler</span>
              <q-btn
                flat
                dense
                round
                size="xs"
                icon="add"
                @click.stop="addFavorite"
                class="section-action"
              />
            </div>
            <div v-if="sections.favorites.expanded" class="section-content">
              <div
                v-for="favorite in favorites"
                :key="favorite.id"
                class="tree-item"
                @click="openFavorite(favorite)"
                @contextmenu="showFavoriteMenu($event, favorite)"
              >
                <q-icon :name="favorite.icon" size="16px" :color="favorite.color" />
                <span class="item-label">{{ favorite.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-header" @click="toggleSection('recent')">
              <q-icon 
                :name="sections.recent.expanded ? 'expand_more' : 'chevron_right'" 
                size="16px" 
              />
              <span>Son Açılanlar</span>
            </div>
            <div v-if="sections.recent.expanded" class="section-content">
              <div
                v-for="recent in recentItems"
                :key="recent.id"
                class="tree-item"
                @click="openRecent(recent)"
              >
                <q-icon :name="getRecentIcon(recent)" size="16px" />
                <span class="item-label">{{ recent.name }}</span>
                <span class="item-meta">{{ formatDate(recent.lastAccessed) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Search View -->
        <div v-if="activeView === 'search'" class="view-content">
          <div class="search-container">
            <q-input
              v-model="searchQuery"
              placeholder="Ara..."
              dense
              borderless
              class="search-input"
              @keydown.enter="performSearch"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
              <template #append>
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="tune"
                  @click="showSearchOptions"
                />
              </template>
            </q-input>
          </div>
          
          <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-header">
              {{ searchResults.length }} sonuç bulundu
            </div>
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="search-result-item"
              @click="openSearchResult(result)"
            >
              <q-icon :name="result.icon" size="16px" />
              <div class="result-content">
                <div class="result-title">{{ result.title }}</div>
                <div class="result-description">{{ result.description }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Extensions View -->
        <div v-if="activeView === 'extensions'" class="view-content">
          <div class="extensions-header">
            <q-input
              v-model="extensionSearchQuery"
              placeholder="Eklenti ara..."
              dense
              borderless
              class="extension-search"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          
          <div class="extensions-list">
            <div
              v-for="extension in filteredExtensions"
              :key="extension.id"
              class="extension-item"
            >
              <div class="extension-icon">
                <q-icon :name="extension.icon" size="32px" :color="extension.color" />
              </div>
              <div class="extension-info">
                <div class="extension-name">{{ extension.name }}</div>
                <div class="extension-description">{{ extension.description }}</div>
                <div class="extension-actions">
                  <q-btn
                    v-if="!extension.installed"
                    size="sm"
                    color="primary"
                    @click="installExtension(extension)"
                    label="Yükle"
                  />
                  <q-btn
                    v-else
                    size="sm"
                    flat
                    @click="uninstallExtension(extension)"
                    label="Kaldır"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Settings View -->
        <div v-if="activeView === 'settings'" class="view-content">
          <div class="settings-section">
            <h4>Görünüm</h4>
            <div class="setting-item">
              <q-toggle
                v-model="settings.darkMode"
                label="Koyu Tema"
                @update:model-value="updateSetting('darkMode', $event)"
              />
            </div>
            <div class="setting-item">
              <q-toggle
                v-model="settings.compactMode"
                label="Kompakt Mod"
                @update:model-value="updateSetting('compactMode', $event)"
              />
            </div>
          </div>
          
          <div class="settings-section">
            <h4>Davranış</h4>
            <div class="setting-item">
              <q-toggle
                v-model="settings.autoSave"
                label="Otomatik Kaydet"
                @update:model-value="updateSetting('autoSave', $event)"
              />
            </div>
            <div class="setting-item">
              <q-toggle
                v-model="settings.notifications"
                label="Bildirimler"
                @update:model-value="updateSetting('notifications', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

interface ActivityItem {
  id: string
  title: string
  icon: string
  badge?: number
}

interface FavoriteItem {
  id: string
  name: string
  icon: string
  color: string
  url: string
  type: 'vue' | 'web' | 'edevlet' | 'sgk'
}

interface RecentItem {
  id: string
  name: string
  type: 'vue' | 'web' | 'edevlet' | 'sgk'
  lastAccessed: Date
}

interface SearchResult {
  id: string
  title: string
  description: string
  icon: string
  type: string
}

interface Extension {
  id: string
  name: string
  description: string
  icon: string
  color: string
  installed: boolean
}

const $q = useQuasar()
const isCollapsed = ref(false)
const activeView = ref('explorer')
const searchQuery = ref('')
const extensionSearchQuery = ref('')

const activityItems: ActivityItem[] = [
  { id: 'explorer', title: 'Gezgin', icon: 'folder_open' },
  { id: 'search', title: 'Ara', icon: 'search' },
  { id: 'extensions', title: 'Eklentiler', icon: 'extension', badge: 2 },
  { id: 'settings', title: 'Ayarlar', icon: 'settings' }
]

const sections = ref({
  favorites: { expanded: true },
  recent: { expanded: true }
})

const favorites = ref<FavoriteItem[]>([
  {
    id: '1',
    name: 'e-Devlet Kapısı',
    icon: 'account_balance',
    color: 'red',
    url: 'https://www.turkiye.gov.tr',
    type: 'edevlet'
  },
  {
    id: '2',
    name: 'SGK',
    icon: 'local_hospital',
    color: 'green',
    url: 'https://www.sgk.gov.tr',
    type: 'sgk'
  },
  {
    id: '3',
    name: 'Google',
    icon: 'language',
    color: 'blue',
    url: 'https://www.google.com',
    type: 'web'
  }
])

const recentItems = ref<RecentItem[]>([
  {
    id: '1',
    name: 'Ana Sayfa',
    type: 'vue',
    lastAccessed: new Date()
  },
  {
    id: '2',
    name: 'e-Devlet',
    type: 'edevlet',
    lastAccessed: new Date(Date.now() - 3600000)
  }
])

const searchResults = ref<SearchResult[]>([])

const extensions = ref<Extension[]>([
  {
    id: '1',
    name: 'Web Inspector',
    description: 'Web sayfalarını incele ve debug et',
    icon: 'bug_report',
    color: 'orange',
    installed: true
  },
  {
    id: '2',
    name: 'Theme Manager',
    description: 'Özel temalar oluştur ve yönet',
    icon: 'palette',
    color: 'purple',
    installed: false
  }
])

const settings = ref({
  darkMode: true,
  compactMode: false,
  autoSave: true,
  notifications: true
})

const filteredExtensions = computed(() => {
  if (!extensionSearchQuery.value) return extensions.value
  
  const query = extensionSearchQuery.value.toLowerCase()
  return extensions.value.filter(ext =>
    ext.name.toLowerCase().includes(query) ||
    ext.description.toLowerCase().includes(query)
  )
})

const setActiveView = (viewId: string) => {
  activeView.value = viewId
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleSection = (sectionId: keyof typeof sections.value) => {
  sections.value[sectionId].expanded = !sections.value[sectionId].expanded
}

const getCurrentViewTitle = () => {
  const item = activityItems.find(item => item.id === activeView.value)
  return item?.title || 'Bilinmeyen'
}

const openFavorite = (favorite: FavoriteItem) => {
  // Open favorite in new tab
  console.log('Opening favorite:', favorite)
}

const addFavorite = () => {
  // Add current page to favorites
  console.log('Adding to favorites')
}

const openRecent = (recent: RecentItem) => {
  // Open recent item
  console.log('Opening recent:', recent)
}

const getRecentIcon = (recent: RecentItem) => {
  switch (recent.type) {
    case 'vue': return 'code'
    case 'web': return 'language'
    case 'edevlet': return 'account_balance'
    case 'sgk': return 'local_hospital'
    default: return 'description'
  }
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'Az önce'
  if (hours < 24) return `${hours} saat önce`
  
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // Simulate search
  searchResults.value = [
    {
      id: '1',
      title: 'e-Devlet Giriş',
      description: 'e-Devlet kapısına giriş sayfası',
      icon: 'account_balance',
      type: 'web'
    },
    {
      id: '2',
      title: 'SGK Hizmetleri',
      description: 'SGK online hizmetler',
      icon: 'local_hospital',
      type: 'web'
    }
  ]
}

const openSearchResult = (result: SearchResult) => {
  console.log('Opening search result:', result)
}

const installExtension = (extension: Extension) => {
  extension.installed = true
  $q.notify({
    message: `${extension.name} yüklendi`,
    type: 'positive',
    position: 'top-right'
  })
}

const uninstallExtension = (extension: Extension) => {
  extension.installed = false
  $q.notify({
    message: `${extension.name} kaldırıldı`,
    type: 'info',
    position: 'top-right'
  })
}

const updateSetting = (key: string, value: any) => {
  console.log(`Setting ${key} to ${value}`)
  // Apply setting changes
}

const openSettings = () => {
  activeView.value = 'settings'
}

const showViewMenu = () => {
  console.log('Showing view menu')
}

const showSearchOptions = () => {
  console.log('Showing search options')
}

const showFavoriteMenu = (event: MouseEvent, favorite: FavoriteItem) => {
  event.preventDefault()
  console.log('Showing favorite menu for:', favorite)
}

onMounted(() => {
  // Load saved settings
  console.log('Sidebar mounted')
})
</script>

<style lang="scss" scoped>
.modern-sidebar {
  display: flex;
  height: 100%;
  background: var(--q-dark);
  transition: width 0.3s ease;
  width: 300px;
  
  &.collapsed {
    width: 48px;
  }
}

.activity-bar {
  width: 48px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 4px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: rgba(25, 118, 210, 0.2);
    border-left: 2px solid var(--q-primary);
  }
}

.activity-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--q-negative);
  color: white;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.sidebar-title {
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.view-content {
  height: 100%;
}

.section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 8px 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  gap: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
}

.section-action {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  .section-header:hover & {
    opacity: 1;
  }
}

.section-content {
  padding-left: 16px;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  gap: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.item-label {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: 11px;
  opacity: 0.6;
}

.search-container {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0 12px;
}

.search-results {
  padding: 8px;
}

.results-header {
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 8px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  gap: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.result-content {
  flex: 1;
}

.result-title {
  font-size: 13px;
  font-weight: 500;
}

.result-description {
  font-size: 11px;
  opacity: 0.6;
}

.extensions-header {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.extension-search {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0 12px;
}

.extensions-list {
  padding: 8px;
}

.extension-item {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.02);
  gap: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.extension-icon {
  flex-shrink: 0;
}

.extension-info {
  flex: 1;
}

.extension-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.extension-description {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.settings-section {
  margin-bottom: 24px;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.8;
  }
}

.setting-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
}

// Dark mode adjustments
.body--dark {
  .modern-sidebar {
    background: #1e1e1e;
  }
  
  .activity-bar {
    background: #2d2d30;
  }
  
  .sidebar-header {
    background: rgba(255, 255, 255, 0.01);
  }
}
</style> 