<template>
  <q-menu
    ref="menuRef"
    class="favorites-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"
  >
    <div class="favorites-menu__container">
      <!-- Sabit header -->
      <div class="favorites-menu__header">
        <div class="favorites-menu__title">{{ $t('favorites.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="favorites-menu__close" 
          @click="closeMenu"
        />
      </div>
      <div class="favorites-menu__divider"></div>
      
      <q-scroll-area class="favorites-menu__scroll" visible>
        <div class="favorites-menu__content">
          <!-- Favoriler Bölümü -->
          <div class="favorites-menu__section">
            <div class="favorites-menu__section-header">
              <div class="favorites-menu__section-title">{{ $t('favorites.pages') }}</div>
              <q-btn 
                flat 
                round 
                dense 
                icon="bi-plus-lg" 
                size="sm"
                class="favorites-menu__add-btn"
                @click="showAddDialog = true"
              >
                <q-tooltip>{{ $t('favorites.addPage') }}</q-tooltip>
              </q-btn>
            </div>
            <div class="favorites-menu__list">
              <q-item 
                v-for="favorite in favorites" 
                :key="favorite.id"
                clickable 
                v-ripple 
                class="favorites-menu__item"
                @click="navigateToFavorite(favorite)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="favorite.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="favorites-menu__item-title">{{ favorite.title }}</div>
                  <div class="favorites-menu__item-subtitle">{{ favorite.route }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    icon="bi-star-fill"
                    size="sm"
                    class="favorites-menu__star-btn"
                    @click.stop="removeFavorite(favorite.id)"
                  >
                    <q-tooltip>{{ $t('favorites.remove') }}</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
              
              <!-- Empty State -->
              <div v-if="favorites.length === 0" class="favorites-menu__empty">
                <q-icon name="bi-heart" size="32px" class="q-mb-sm" />
                <div class="favorites-menu__empty-title">{{ $t('favorites.empty.title') }}</div>
                <div class="favorites-menu__empty-subtitle">{{ $t('favorites.empty.subtitle') }}</div>
              </div>
            </div>
          </div>

          <div class="favorites-menu__divider"></div>

          <!-- Hızlı Erişim Bölümü -->
          <div class="favorites-menu__section">
            <div class="favorites-menu__section-header">
              <div class="favorites-menu__section-title">{{ $t('favorites.quickAccess') }}</div>
            </div>
            <div class="favorites-menu__list">
              <q-item 
                v-for="quickItem in quickAccessItems" 
                :key="quickItem.id"
                clickable 
                v-ripple 
                class="favorites-menu__item"
                @click="handleQuickAccess(quickItem)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="quickItem.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="favorites-menu__item-title">{{ quickItem.title }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="favorites-menu__arrow" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="favorites-menu__divider"></div>

          <!-- Ayarlar Bölümü -->
          <div class="favorites-menu__section">
            <div class="favorites-menu__section-header">
              <div class="favorites-menu__section-title">{{ $t('favorites.settings') }}</div>
            </div>
            <div class="favorites-menu__list">
              <q-item clickable v-ripple class="favorites-menu__item">
                <q-item-section>
                  <div class="favorites-menu__item-title">{{ $t('favorites.showInSidebar') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="showInSidebar" dense class="favorites-menu__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="favorites-menu__item">
                <q-item-section>
                  <div class="favorites-menu__item-title">{{ $t('favorites.autoAdd') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="autoAddFavorites" dense class="favorites-menu__toggle" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>

    <!-- Add Favorite Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card class="favorites-add-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('favorites.addDialog.title') }}</div>
          <q-space />
          <q-btn icon="bi-x-lg" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newFavorite.title"
            :label="$t('favorites.addDialog.titleLabel')"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newFavorite.route"
            :label="$t('favorites.addDialog.routeLabel')"
            outlined
            class="q-mb-md"
          />
          <q-select
            v-model="newFavorite.icon"
            :options="iconOptions"
            :label="$t('favorites.addDialog.iconLabel')"
            outlined
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup />
          <q-btn 
            color="primary" 
            :label="$t('actions.add')" 
            @click="addFavorite"
            :disable="!newFavorite.title || !newFavorite.route"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useFavoritesStore } from 'src/stores/favorites-store'

const tabStore = useTabStore()
const favoritesStore = useFavoritesStore()

const menuRef = ref(null)
const showAddDialog = ref(false)
const showInSidebar = ref(true)
const autoAddFavorites = ref(false)

// New favorite form
const newFavorite = ref({
  title: '',
  route: '',
  icon: 'bi-globe'
})

// Icon options for selection
const iconOptions = [
  { label: 'Globe', value: 'bi-globe' },
  { label: 'House', value: 'bi-house' },
  { label: 'Grid', value: 'bi-grid' },
  { label: 'File', value: 'bi-file-text' },
  { label: 'Settings', value: 'bi-gear' },
  { label: 'User', value: 'bi-person' },
  { label: 'Chart', value: 'bi-bar-chart' },
  { label: 'Calendar', value: 'bi-calendar' }
]

// Quick access items
const quickAccessItems = ref([
  {
    id: 'recent',
    title: 'Son Ziyaret Edilenler',
    icon: 'bi-clock-history',
    action: 'recent'
  },
  {
    id: 'mostVisited',
    title: 'En Çok Ziyaret Edilenler',
    icon: 'bi-graph-up',
    action: 'mostVisited'
  },
  {
    id: 'exportFavorites',
    title: 'Favorileri Dışa Aktar',
    icon: 'bi-download',
    action: 'export'
  },
  {
    id: 'importFavorites',
    title: 'Favorileri İçe Aktar',
    icon: 'bi-upload',
    action: 'import'
  }
])

// Computed
const favorites = computed(() => favoritesStore.favorites)

// Methods
const closeMenu = () => {
  menuRef.value.hide()
}

const navigateToFavorite = (favorite) => {
  tabStore.addTab({
    title: favorite.title,
    icon: favorite.icon,
    route: favorite.route
  })
  closeMenu()
}

const addFavorite = () => {
  favoritesStore.addFavorite({
    title: newFavorite.value.title,
    route: newFavorite.value.route,
    icon: newFavorite.value.icon
  })
  
  // Reset form
  newFavorite.value = {
    title: '',
    route: '',
    icon: 'bi-globe'
  }
  
  showAddDialog.value = false
}

const removeFavorite = (id) => {
  favoritesStore.removeFavorite(id)
}

const handleQuickAccess = (item) => {
  switch (item.action) {
    case 'recent':
      console.log('Son ziyaret edilenler')
      break
    case 'mostVisited':
      console.log('En çok ziyaret edilenler')
      break
    case 'export':
      favoritesStore.exportFavorites()
      break
    case 'import':
      // File input trigger
      console.log('Favorileri içe aktar')
      break
  }
  closeMenu()
}
</script>

<style lang="sass">
.favorites-menu
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

  &__add-btn
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
    .favorites-menu__item
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

  &__star-btn
    color: #ffc107
    &:hover
      background: rgba(255, 193, 7, 0.1)

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

.favorites-add-dialog
  min-width: 400px

.favorites-menu__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 