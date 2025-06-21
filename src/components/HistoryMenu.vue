<template>
  <q-menu
    ref="menuRef"
    class="history-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"
  >
    <div class="history-menu__container">
      <!-- Header -->
      <div class="history-menu__header">
        <div class="history-menu__title">{{ $t('history.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="history-menu__close" 
          @click="closeMenu"
        />
      </div>
      <div class="history-menu__divider"></div>
      
      <q-scroll-area class="history-menu__scroll" visible>
        <div class="history-menu__content">
          <!-- Search -->
          <div class="history-menu__search">
            <q-input
              v-model="searchQuery"
              :placeholder="$t('history.search')"
              outlined
              dense
              class="history-menu__search-input"
            >
              <template v-slot:prepend>
                <q-icon name="bi-search" />
              </template>
              <template v-slot:append>
                <q-btn
                  v-if="searchQuery"
                  flat
                  round
                  dense
                  icon="bi-x"
                  @click="searchQuery = ''"
                />
              </template>
            </q-input>
          </div>

          <!-- Categories -->
          <div class="history-menu__categories">
            <q-btn-toggle
              v-model="activeCategory"
              toggle-color="primary"
              :options="categoryOptions"
              dense
              class="history-menu__category-toggle"
            />
          </div>

          <!-- History Items -->
          <div class="history-menu__section">
            <div class="history-menu__section-header">
              <div class="history-menu__section-title">
                {{ getCategoryTitle(activeCategory) }}
                <span class="history-menu__count">({{ filteredHistory.length }})</span>
              </div>
              <q-btn 
                flat 
                round 
                dense 
                icon="bi-trash" 
                size="sm"
                class="history-menu__clear-btn"
                @click="clearCategory"
              >
                <q-tooltip>{{ $t('history.clearCategory') }}</q-tooltip>
              </q-btn>
            </div>
            
            <div class="history-menu__list">
              <q-item 
                v-for="item in filteredHistory" 
                :key="item.id"
                clickable 
                v-ripple 
                class="history-menu__item"
                @click="navigateToItem(item)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon 
                    :name="getHistoryIcon(item.type)" 
                    size="16px" 
                    :color="getHistoryColor(item.type)"
                  />
                </q-item-section>
                <q-item-section>
                  <div class="history-menu__item-title">{{ item.title }}</div>
                  <div class="history-menu__item-subtitle">
                    {{ item.description || item.route }}
                  </div>
                  <div class="history-menu__item-time">
                    {{ formatTimeAgo(item.timestamp) }}
                  </div>
                </q-item-section>
                <q-item-section side>
                  <div class="history-menu__item-actions">
                    <q-btn
                      flat
                      round
                      dense
                      icon="bi-star"
                      size="sm"
                      @click.stop="addToFavorites(item)"
                    >
                      <q-tooltip>{{ $t('history.addToFavorites') }}</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="bi-x"
                      size="sm"
                      @click.stop="removeItem(item.id)"
                    >
                      <q-tooltip>{{ $t('history.remove') }}</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              
              <!-- Empty State -->
              <div v-if="filteredHistory.length === 0" class="history-menu__empty">
                <q-icon name="bi-clock-history" size="32px" class="q-mb-sm" />
                <div class="history-menu__empty-title">{{ $t('history.empty.title') }}</div>
                <div class="history-menu__empty-subtitle">{{ $t('history.empty.subtitle') }}</div>
              </div>
            </div>
          </div>

          <div class="history-menu__divider"></div>

          <!-- Quick Actions -->
          <div class="history-menu__section">
            <div class="history-menu__section-header">
              <div class="history-menu__section-title">{{ $t('history.quickActions') }}</div>
            </div>
            <div class="history-menu__list">
              <q-item 
                v-for="action in quickActions" 
                :key="action.id"
                clickable 
                v-ripple 
                class="history-menu__item"
                @click="handleQuickAction(action)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="action.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="history-menu__item-title">{{ action.title }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="history-menu__arrow" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="history-menu__divider"></div>

          <!-- Settings -->
          <div class="history-menu__section">
            <div class="history-menu__section-header">
              <div class="history-menu__section-title">{{ $t('history.settings') }}</div>
            </div>
            <div class="history-menu__list">
              <q-item clickable v-ripple class="history-menu__item">
                <q-item-section>
                  <div class="history-menu__item-title">{{ $t('history.enableTracking') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="enableTracking" dense class="history-menu__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="history-menu__item">
                <q-item-section>
                  <div class="history-menu__item-title">{{ $t('history.autoCleanup') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="autoCleanup" dense class="history-menu__toggle" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </q-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useHistoryStore } from 'src/stores/history-store'
import { useFavoritesStore } from 'src/stores/favorites-store'

const tabStore = useTabStore()
const historyStore = useHistoryStore()
const favoritesStore = useFavoritesStore()

const menuRef = ref(null)
const searchQuery = ref('')
const activeCategory = ref('all')
const enableTracking = ref(true)
const autoCleanup = ref(false)

// Category options
const categoryOptions = [
  { label: 'Tümü', value: 'all' },
  { label: 'Sayfalar', value: 'page' },
  { label: 'Dosyalar', value: 'file' },
  { label: 'İşlemler', value: 'operation' },
  { label: 'Aramalar', value: 'search' }
]

// Quick actions
const quickActions = ref([
  {
    id: 'mostVisited',
    title: 'En Çok Ziyaret Edilenler',
    icon: 'bi-graph-up',
    action: 'mostVisited'
  },
  {
    id: 'recentFiles',
    title: 'Son Dosyalar',
    icon: 'bi-file-earmark',
    action: 'recentFiles'
  },
  {
    id: 'exportHistory',
    title: 'Geçmişi Dışa Aktar',
    icon: 'bi-download',
    action: 'export'
  },
  {
    id: 'clearAll',
    title: 'Tüm Geçmişi Temizle',
    icon: 'bi-trash',
    action: 'clearAll'
  }
])

// Computed
const filteredHistory = computed(() => {
  let items = historyStore.history

  // Filter by category
  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.type === activeCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.route && item.route.toLowerCase().includes(query))
    )
  }

  return items.slice(0, 50) // Limit to 50 items for performance
})

// Methods
const closeMenu = () => {
  menuRef.value.hide()
}

const getCategoryTitle = (category) => {
  const categoryMap = {
    all: 'Tüm Geçmiş',
    page: 'Sayfa Geçmişi',
    file: 'Dosya Geçmişi',
    operation: 'İşlem Geçmişi',
    search: 'Arama Geçmişi'
  }
  return categoryMap[category] || 'Geçmiş'
}

const getHistoryIcon = (type) => {
  const iconMap = {
    page: 'bi-globe',
    file: 'bi-file-earmark',
    operation: 'bi-gear',
    search: 'bi-search',
    damage: 'bi-exclamation-triangle',
    payment: 'bi-credit-card',
    customer: 'bi-person',
    expert: 'bi-person-badge',
    service: 'bi-tools'
  }
  return iconMap[type] || 'bi-clock-history'
}

const getHistoryColor = (type) => {
  const colorMap = {
    page: 'blue',
    file: 'green',
    operation: 'orange',
    search: 'purple',
    damage: 'red',
    payment: 'teal',
    customer: 'indigo',
    expert: 'brown',
    service: 'cyan'
  }
  return colorMap[type] || 'grey'
}

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes}dk önce`
  if (hours < 24) return `${hours}sa önce`
  if (days < 7) return `${days}g önce`
  
  return date.toLocaleDateString('tr-TR')
}

const navigateToItem = (item) => {
  if (item.route) {
    tabStore.addTab({
      title: item.title,
      icon: getHistoryIcon(item.type),
      route: item.route
    })
    
    // Update visit count
    historyStore.incrementVisitCount(item.id)
  }
  closeMenu()
}

const addToFavorites = (item) => {
  if (item.route) {
    favoritesStore.addFavorite({
      title: item.title,
      route: item.route,
      icon: getHistoryIcon(item.type)
    })
  }
}

const removeItem = (id) => {
  historyStore.removeHistoryItem(id)
}

const clearCategory = () => {
  if (activeCategory.value === 'all') {
    historyStore.clearAllHistory()
  } else {
    historyStore.clearHistoryByType(activeCategory.value)
  }
}

const handleQuickAction = (action) => {
  switch (action.action) {
    case 'mostVisited':
      // Show most visited items
      activeCategory.value = 'all'
      break
    case 'recentFiles':
      activeCategory.value = 'file'
      break
    case 'export':
      historyStore.exportHistory()
      break
    case 'clearAll':
      historyStore.clearAllHistory()
      break
  }
  closeMenu()
}
</script>

<style lang="sass">
.history-menu
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

  &__search
    padding: 16px

  &__search-input
    .q-field__control
      border-radius: 8px

  &__categories
    padding: 0 16px 16px

  &__category-toggle
    width: 100%
    .q-btn
      font-size: 12px
      padding: 4px 8px

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

  &__count
    font-size: 12px
    opacity: 0.7

  &__clear-btn
    color: #5f6368
    opacity: 0.87
    &:hover
      opacity: 1
      background: rgba(0,0,0,0.04)

  &__toggle
    .q-toggle__inner
      font-size: 32px
    :deep(.q-toggle__thumb)
      top: 0.5rem
      width: 24px
      height: 24px
    :deep(.q-toggle__track)
      height: 16px

  &__list
    .history-menu__item
      min-height: 56px
      padding: 8px 16px
      color: #666
      font-size: 14px

      .q-item__section--avatar
        min-width: 40px
        .q-icon
          opacity: 0.87
          font-size: 16px

      .q-item__section--side
        min-width: 80px
        padding-left: 16px
        &:last-child
          padding-left: 8px

      &:hover
        background: rgba(0,0,0,0.04)
        color: #202124
        .history-menu__item-actions
          opacity: 1

  &__item-title
    font-weight: 500
    margin-bottom: 2px

  &__item-subtitle
    font-size: 12px
    color: #5f6368
    opacity: 0.8
    margin-bottom: 2px

  &__item-time
    font-size: 11px
    color: #5f6368
    opacity: 0.6

  &__item-actions
    display: flex
    gap: 4px
    opacity: 0
    transition: opacity 0.2s ease

    .q-btn
      opacity: 0.7
      &:hover
        opacity: 1

  &__arrow
    opacity: 0.6

  &__empty
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 32px 16px
    text-align: center
    color: #5f6368
    opacity: 0.7

  &__empty-title
    font-size: 14px
    font-weight: 500
    margin-bottom: 4px

  &__empty-subtitle
    font-size: 12px

.history-menu__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 