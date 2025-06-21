<template>
  <q-layout view="lHh lpR fFf" role="application" class="modern-layout">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Ana içeriğe atla</a>
    
    <!-- Modern Header with integrated controls -->
    <q-header class="modern-header" elevated>
      <div class="header-content">
        <!-- App Title -->
        <div class="app-title">
          <q-icon name="apps" size="24px" class="app-icon" />
          <span>Enterprise Desktop App</span>
        </div>
        
        <!-- Global Actions -->
        <div class="global-actions">
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="search"
            @click="showCommandPalette"
            title="Komut Paleti (Ctrl+Shift+P)"
          />
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="notifications"
            @click="showNotifications"
            title="Bildirimler"
          >
            <q-badge v-if="notificationCount > 0" color="red" floating>
              {{ notificationCount }}
            </q-badge>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="account_circle"
            @click="showAccountMenu"
            title="Hesap"
          />
        </div>
      </div>
    </q-header>
    
    <!-- Main Content Container -->
    <q-page-container class="main-container">
      <div class="app-content">
        <!-- Modern Sidebar -->
        <ModernSidebar class="main-sidebar" />
        
        <!-- Content Area -->
        <div id="main-content" class="content-area">
          <!-- Tab System -->
          <TabSystem class="tab-system" />
        </div>
      </div>
      
      <!-- Command Palette -->
      <CommandPalette ref="commandPalette" />
      
      <!-- Notifications Panel -->
      <q-drawer
        v-model="showNotificationsPanel"
        side="right"
        overlay
        behavior="mobile"
        width="350"
        class="notifications-drawer"
      >
        <div class="notifications-content">
          <div class="notifications-header">
            <h3>Bildirimler</h3>
            <q-btn
              flat
              dense
              round
              size="sm"
              icon="close"
              @click="showNotificationsPanel = false"
            />
          </div>
          
          <div class="notifications-list">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
            >
              <q-icon :name="notification.icon" :color="notification.color" size="20px" />
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
                <div class="notification-time">{{ formatNotificationTime(notification.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-drawer>
      
      <!-- Account Menu -->
      <q-menu ref="accountMenu" class="account-menu">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ userInitials }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ userName }}</q-item-label>
              <q-item-label caption>{{ userEmail }}</q-item-label>
            </q-item-section>
          </q-item>
          
          <q-separator />
          
          <q-item clickable @click="openProfile">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Profil</q-item-section>
          </q-item>
          
          <q-item clickable @click="openSettings">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Ayarlar</q-item-section>
          </q-item>
          
          <q-separator />
          
          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Çıkış Yap</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModernSidebar from 'src/components/ModernSidebar.vue'
import TabSystem from 'src/components/TabSystem.vue'
import CommandPalette from 'src/components/CommandPalette.vue'

const commandPalette = ref()
const accountMenu = ref()
const showNotificationsPanel = ref(false)

// User data
const userName = ref('Kullanıcı Adı')
const userEmail = ref('kullanici@example.com')
const userInitials = computed(() => {
  return userName.value.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Notifications
const notificationCount = ref(3)
const notifications = ref([
  {
    id: 1,
    title: 'Sistem Güncellemesi',
    message: 'Yeni güncelleme mevcut',
    icon: 'system_update',
    color: 'blue',
    timestamp: new Date(),
    read: false
  },
  {
    id: 2,
    title: 'e-Devlet Bildirimi',
    message: 'Yeni belge geldi',
    icon: 'account_balance',
    color: 'red',
    timestamp: new Date(Date.now() - 3600000),
    read: false
  }
])

const showCommandPalette = () => {
  commandPalette.value?.show()
}

const showNotifications = () => {
  showNotificationsPanel.value = true
}

const showAccountMenu = (event) => {
  accountMenu.value?.show(event)
}

const formatNotificationTime = (timestamp) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'Az önce'
  if (hours < 24) return `${hours} saat önce`
  
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}

const openProfile = () => {
  console.log('Opening profile')
}

const openSettings = () => {
  console.log('Opening settings')
}

const logout = () => {
  console.log('Logging out')
}
</script>

<style lang="scss" scoped>
.modern-layout {
  height: 100vh;
  overflow: hidden;
}

.modern-header {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 48px;
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 16px;
  }
  
  .app-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
    
    .app-icon {
      color: var(--q-primary);
    }
  }
  
  .global-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.main-container {
  height: calc(100vh - 48px);
  overflow: hidden;
}

.app-content {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.main-sidebar {
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.content-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tab-system {
  flex: 1;
  overflow: hidden;
}

.notifications-drawer {
  .notifications-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .notifications-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .notifications-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }
  
  .notification-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.03);
    gap: 12px;
    transition: background 0.2s ease;
    
    &.unread {
      background: rgba(25, 118, 210, 0.1);
      border-left: 3px solid var(--q-primary);
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .notification-message {
    font-size: 13px;
    opacity: 0.8;
    margin-bottom: 4px;
  }
  
  .notification-time {
    font-size: 11px;
    opacity: 0.6;
  }
}

.account-menu {
  .q-item {
    min-height: 48px;
  }
}

// Skip to content link
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--q-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  
  &:focus {
    top: 6px;
  }
}

// Dark mode adjustments
.body--dark {
  .modern-header {
    background: rgba(20, 20, 20, 0.95);
  }
  
  .notification-item {
    background: rgba(255, 255, 255, 0.02);
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>

<style lang="sass">
// Global styles
#q-app
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d)
  color: #ffffff

*
  -ms-overflow-style: none
  scrollbar-width: none

::-webkit-scrollbar
  display: none
</style>