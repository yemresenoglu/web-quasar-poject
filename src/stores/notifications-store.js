import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref([
    {
      id: 'notif_1',
      title: 'Yeni Hasar Bildirimi',
      message: 'HSR-2024-001 numaralı hasar dosyası oluşturuldu ve eksper ataması bekleniyor.',
      type: 'damage',
      read: false,
      createdAt: new Date(Date.now() - 300000).toISOString(), // 5 dakika önce
      action: '/hasar-bildirimi'
    },
    {
      id: 'notif_2',
      title: 'Ödeme Onayı',
      message: 'HSR-2024-002 numaralı hasar dosyası için 15.000 TL tutarında ödeme onayı bekliyor.',
      type: 'payment',
      read: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 dakika önce
      action: '/hasar-dosyalari'
    },
    {
      id: 'notif_3',
      title: 'Sistem Güncellemesi',
      message: 'Sistem bakımı nedeniyle 23:00-01:00 saatleri arasında hizmet kesintisi yaşanabilir.',
      type: 'system',
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 saat önce
      action: null
    },
    {
      id: 'notif_4',
      title: 'Eksper Raporu Tamamlandı',
      message: 'HSR-2024-003 numaralı hasar dosyası için eksper raporu tamamlanmıştır.',
      type: 'damage',
      read: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 saat önce
      action: '/hasar-takibi'
    },
    {
      id: 'notif_5',
      title: 'Yeni Müşteri Talebi',
      message: 'Ahmet Yılmaz adlı müşteriden yeni bir destek talebi geldi.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 saat önce
      action: null
    }
  ])

  // Computed
  const notificationCount = computed(() => notifications.value.length)
  
  const unreadCount = computed(() => {
    return notifications.value.filter(notification => !notification.read).length
  })

  const recentNotifications = computed(() => {
    return notifications.value
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  })

  const unreadNotifications = computed(() => {
    return notifications.value.filter(notification => !notification.read)
  })

  // Actions
  const addNotification = (notificationData) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      action: notificationData.action || null
    }
    
    notifications.value.unshift(newNotification)
    
    // Maksimum 100 bildirim tut
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100)
    }
  }

  const markAsRead = (id) => {
    const notification = notifications.value.find(notif => notif.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAsUnread = (id) => {
    const notification = notifications.value.find(notif => notif.id === id)
    if (notification) {
      notification.read = false
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(notif => notif.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const clearReadNotifications = () => {
    notifications.value = notifications.value.filter(notification => !notification.read)
  }

  const getNotificationById = (id) => {
    return notifications.value.find(notif => notif.id === id)
  }

  const getNotificationsByType = (type) => {
    return notifications.value.filter(notif => notif.type === type)
  }

  // Bildirim türlerine göre sayıları
  const getCountByType = (type) => {
    return notifications.value.filter(notif => notif.type === type).length
  }

  const getUnreadCountByType = (type) => {
    return notifications.value.filter(notif => notif.type === type && !notif.read).length
  }

  // Bildirim gönderme helper'ları
  const sendDamageNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'damage',
      action
    })
  }

  const sendPaymentNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'payment',
      action
    })
  }

  const sendSystemNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'system',
      action
    })
  }

  const sendInfoNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'info',
      action
    })
  }

  const sendSuccessNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'success',
      action
    })
  }

  const sendWarningNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'warning',
      action
    })
  }

  const sendErrorNotification = (title, message, action = null) => {
    addNotification({
      title,
      message,
      type: 'error',
      action
    })
  }

  return {
    // State
    notifications,
    
    // Computed
    notificationCount,
    unreadCount,
    recentNotifications,
    unreadNotifications,
    
    // Actions
    addNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    clearReadNotifications,
    getNotificationById,
    getNotificationsByType,
    getCountByType,
    getUnreadCountByType,
    
    // Helper methods
    sendDamageNotification,
    sendPaymentNotification,
    sendSystemNotification,
    sendInfoNotification,
    sendSuccessNotification,
    sendWarningNotification,
    sendErrorNotification
  }
}) 