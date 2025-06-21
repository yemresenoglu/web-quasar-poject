<template>
  <q-menu
    ref="menuRef"
    class="notifications-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"
  >
    <div class="notifications-menu__container">
      <!-- Sabit header -->
      <div class="notifications-menu__header">
        <div class="notifications-menu__title">{{ $t('notifications.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="notifications-menu__close" 
          @click="closeMenu"
        />
      </div>
      <div class="notifications-menu__divider"></div>
      
      <q-scroll-area class="notifications-menu__scroll" visible>
        <div class="notifications-menu__content">
          <!-- Bildirimler Bölümü -->
          <div class="notifications-menu__section">
            <div class="notifications-menu__section-header">
              <div class="notifications-menu__section-title">{{ $t('notifications.recent') }}</div>
              <q-btn 
                flat 
                round 
                dense 
                icon="bi-check2-all" 
                size="sm"
                class="notifications-menu__mark-all-btn"
                :class="{ 'notifications-menu__mark-all-btn--disabled': unreadCount === 0 }"
                @click="unreadCount > 0 ? markAllAsRead() : null"
                no-caps
              >
                <q-tooltip>{{ $t('notifications.markAllAsRead') }}</q-tooltip>
              </q-btn>
            </div>
            <div class="notifications-menu__list">
              <q-item 
                v-for="notification in notifications" 
                :key="notification.id"
                clickable 
                v-ripple 
                class="notifications-menu__item"
                :class="{ 'notifications-menu__item--unread': !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon 
                    :name="getNotificationIcon(notification.type)" 
                    size="20px" 
                    :color="getNotificationColor(notification.type)"
                  />
                </q-item-section>
                <q-item-section>
                  <div class="notifications-menu__item-title">{{ notification.title }}</div>
                  <div class="notifications-menu__item-message">{{ notification.message }}</div>
                  <div class="notifications-menu__item-time">{{ formatTime(notification.createdAt) }}</div>
                </q-item-section>
                <q-item-section side>
                  <div class="notifications-menu__item-actions">
                    <q-btn
                      v-if="!notification.read"
                      flat
                      round
                      dense
                      icon="bi-circle-fill"
                      size="sm"
                      class="notifications-menu__unread-dot"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="bi-x-lg"
                      size="sm"
                      class="notifications-menu__delete-btn"
                      @click.stop="removeNotification(notification.id)"
                    >
                      <q-tooltip>{{ $t('notifications.remove') }}</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              
              <!-- Empty State -->
              <div v-if="notifications.length === 0" class="notifications-menu__empty">
                <q-icon name="bi-bell-slash" size="32px" class="q-mb-sm" />
                <div class="notifications-menu__empty-title">{{ $t('notifications.empty.title') }}</div>
                <div class="notifications-menu__empty-subtitle">{{ $t('notifications.empty.subtitle') }}</div>
              </div>
            </div>
          </div>

          <div class="notifications-menu__divider"></div>

          <!-- Filtreler Bölümü -->
          <div class="notifications-menu__section">
            <div class="notifications-menu__section-header">
              <div class="notifications-menu__section-title">{{ $t('notifications.filters') }}</div>
            </div>
            <div class="notifications-menu__list">
              <q-item 
                v-for="filter in filterOptions" 
                :key="filter.id"
                clickable 
                v-ripple 
                class="notifications-menu__item"
                :class="{ 'notifications-menu__item--active': activeFilter === filter.id }"
                @click="setFilter(filter.id)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="filter.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="notifications-menu__item-title">{{ $t(`notifications.filterOptions.${filter.id}`) }}</div>
                </q-item-section>
                <q-item-section side>
                  <div class="notifications-menu__filter-count">{{ getFilterCount(filter.id) }}</div>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="notifications-menu__divider"></div>

          <!-- Ayarlar Bölümü -->
          <div class="notifications-menu__section">
            <div class="notifications-menu__section-header">
              <div class="notifications-menu__section-title">{{ $t('notifications.settings') }}</div>
            </div>
            <div class="notifications-menu__list">
              <q-item clickable v-ripple class="notifications-menu__item">
                <q-item-section>
                  <div class="notifications-menu__item-title">{{ $t('notifications.enableSound') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="enableSound" dense class="notifications-menu__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="notifications-menu__item">
                <q-item-section>
                  <div class="notifications-menu__item-title">{{ $t('notifications.enableDesktop') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="enableDesktop" dense class="notifications-menu__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="notifications-menu__item" @click="clearAllNotifications">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-trash" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="notifications-menu__item-title">{{ $t('notifications.clearAll') }}</div>
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
import { useNotificationsStore } from 'src/stores/notifications-store'

const notificationsStore = useNotificationsStore()

const menuRef = ref(null)
const enableSound = ref(true)
const enableDesktop = ref(true)
const activeFilter = ref('all')

// Filter options
const filterOptions = ref([
  {
    id: 'all',
    icon: 'bi-list'
  },
  {
    id: 'unread',
    icon: 'bi-circle-fill'
  },
  {
    id: 'system',
    icon: 'bi-gear'
  },
  {
    id: 'damage',
    icon: 'bi-exclamation-triangle'
  },
  {
    id: 'payment',
    icon: 'bi-credit-card'
  }
])

// Computed
const notifications = computed(() => {
  let filtered = notificationsStore.notifications
  
  switch (activeFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read)
      break
    case 'system':
      filtered = filtered.filter(n => n.type === 'system')
      break
    case 'damage':
      filtered = filtered.filter(n => n.type === 'damage')
      break
    case 'payment':
      filtered = filtered.filter(n => n.type === 'payment')
      break
  }
  
  return filtered.slice(0, 20) // Son 20 bildirim
})

const unreadCount = computed(() => notificationsStore.unreadCount)

// Methods
const closeMenu = () => {
  menuRef.value.hide()
}

const handleNotificationClick = (notification) => {
  notificationsStore.markAsRead(notification.id)
  
  // Bildirime göre aksiyon al
  if (notification.action) {
    // Router yönlendirmesi veya başka aksiyon
    console.log('Notification action:', notification.action)
  }
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const removeNotification = (id) => {
  notificationsStore.removeNotification(id)
}

const clearAllNotifications = () => {
  notificationsStore.clearAllNotifications()
  closeMenu()
}

const setFilter = (filterId) => {
  activeFilter.value = filterId
}

const getFilterCount = (filterId) => {
  switch (filterId) {
    case 'all':
      return notificationsStore.notifications.length
    case 'unread':
      return notificationsStore.unreadCount
    case 'system':
      return notificationsStore.notifications.filter(n => n.type === 'system').length
    case 'damage':
      return notificationsStore.notifications.filter(n => n.type === 'damage').length
    case 'payment':
      return notificationsStore.notifications.filter(n => n.type === 'payment').length
    default:
      return 0
  }
}

const getNotificationIcon = (type) => {
  const iconMap = {
    system: 'bi-gear',
    damage: 'bi-exclamation-triangle',
    payment: 'bi-credit-card',
    info: 'bi-info-circle',
    success: 'bi-check-circle',
    warning: 'bi-exclamation-triangle',
    error: 'bi-x-circle'
  }
  return iconMap[type] || 'bi-bell'
}

const getNotificationColor = (type) => {
  const colorMap = {
    system: 'blue',
    damage: 'orange',
    payment: 'green',
    info: 'blue',
    success: 'green',
    warning: 'orange',
    error: 'red'
  }
  return colorMap[type] || 'grey'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes}dk önce`
  if (hours < 24) return `${hours}sa önce`
  if (days < 7) return `${days}g önce`
  
  return time.toLocaleDateString('tr-TR')
}
</script>

<style lang="sass">
.notifications-menu
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

  &__mark-all-btn
    color: #5f6368
    opacity: 0.87
    &:hover
      opacity: 1
      background: rgba(0,0,0,0.04)
    &--disabled
      opacity: 0.3
      pointer-events: none
      cursor: not-allowed

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
    .notifications-menu__item
      min-height: 56px
      padding: 12px 16px
      color: #666
      font-size: 14px
      border-left: 3px solid transparent
      transition: all 0.2s ease

      &--unread
        background: rgba(25, 118, 210, 0.04)
        border-left-color: #1976d2

      &--active
        background: rgba(0,0,0,0.04)
        color: #202124

      .q-item__section--avatar
        min-width: 40px
        .q-icon
          opacity: 0.87

      .q-item__section--side
        min-width: 60px
        padding-left: 16px

      &:hover
        background: rgba(0,0,0,0.04)
        color: #202124

  &__item-title
    font-weight: 500
    margin-bottom: 4px
    line-height: 1.2

  &__item-message
    font-size: 13px
    color: #5f6368
    opacity: 0.9
    margin-bottom: 4px
    line-height: 1.3
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical
    overflow: hidden

  &__item-time
    font-size: 11px
    color: #5f6368
    opacity: 0.7

  &__item-actions
    display: flex
    align-items: center
    gap: 4px

  &__unread-dot
    color: #1976d2
    font-size: 8px
    width: 16px
    height: 16px

  &__delete-btn
    color: #5f6368
    opacity: 0.6
    &:hover
      opacity: 1
      background: rgba(244, 67, 54, 0.1)
      color: #f44336

  &__filter-count
    background: rgba(0,0,0,0.1)
    border-radius: 12px
    padding: 2px 8px
    font-size: 11px
    color: #5f6368
    min-width: 20px
    text-align: center

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

.notifications-menu__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 