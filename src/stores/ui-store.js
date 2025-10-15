import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Dark, LocalStorage, Notify } from 'quasar'
import { createLogger } from 'src/utils/logger.js'
import { 
  simulateUIApi,
  getMockNotifications,
  getMockUISettings,
  generateMockNotification
} from 'src/data/ui-mock-data.js'

const logger = createLogger('UIStore')

/**
 * UI Store
 * Manages UI state, dialogs, notifications, and global UI interactions
 */
export const useUIStore = defineStore('ui', () => {
  // State
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)
  const darkMode = ref(LocalStorage.getItem('darkMode') || false)
  const sompoMode = ref(LocalStorage.getItem('sompoMode') || false)
  
  // Dialog states
  const dialogs = ref({
    confirm: false,
    alert: false,
    info: false
  })
  
  const dialogData = ref({
    confirm: {
      title: '',
      message: '',
      confirmText: 'Onayla',
      cancelText: 'İptal',
      onConfirm: null,
      onCancel: null
    },
    alert: {
      title: '',
      message: '',
      type: 'info'
    },
    info: {
      title: '',
      content: '',
      actions: []
    }
  })

  // Actions
  const showNotification = (notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: 'info',
      position: 'top',
      timeout: 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    logger.info('Notification shown:', newNotification)
    
    // Auto remove after timeout
    if (newNotification.timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.timeout)
    }
    
    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
      logger.info('Notification removed:', id)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
    logger.info('All notifications cleared')
  }

  const setLoading = (state) => {
    loading.value = state
    logger.info('Loading state changed:', state)
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
    logger.info('Error set:', errorMessage)
  }

  const clearError = () => {
    error.value = null
    logger.info('Error cleared')
  }

  // Dialog actions
  const showConfirmDialog = (options) => {
    dialogData.value.confirm = {
      title: 'Onay Gerekli',
      message: 'Bu işlemi onaylıyor musunuz?',
      confirmText: 'Onayla',
      cancelText: 'İptal',
      ...options
    }
    dialogs.value.confirm = true
    logger.info('Confirm dialog shown')
  }

  const hideConfirmDialog = () => {
    dialogs.value.confirm = false
    logger.info('Confirm dialog hidden')
  }

  const confirmDialog = () => {
    if (dialogData.value.confirm.onConfirm) {
      dialogData.value.confirm.onConfirm()
    }
    hideConfirmDialog()
  }

  const cancelDialog = () => {
    if (dialogData.value.confirm.onCancel) {
      dialogData.value.confirm.onCancel()
    }
    hideConfirmDialog()
  }

  const showAlertDialog = (options) => {
    dialogData.value.alert = {
      title: 'Bilgi',
      message: '',
      type: 'info',
      ...options
    }
    dialogs.value.alert = true
    logger.info('Alert dialog shown')
  }

  const hideAlertDialog = () => {
    dialogs.value.alert = false
    logger.info('Alert dialog hidden')
  }

  const showInfoDialog = (options) => {
    dialogData.value.info = {
      title: 'Bilgi',
      content: '',
      actions: [],
      ...options
    }
    dialogs.value.info = true
    logger.info('Info dialog shown')
  }

  const hideInfoDialog = () => {
    dialogs.value.info = false
    logger.info('Info dialog hidden')
  }

  // Page Header actions
  const handlePrint = () => {
    logger.info('Print action triggered')
    window.print()
  }

  const handleDownload = () => {
    logger.info('Download action triggered')
    showNotification({
      message: 'İndirme işlemi başlatıldı',
      type: 'positive'
    })
  }

  const handleShare = () => {
    logger.info('Share action triggered')
    
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(error => {
        logger.error('Share failed:', error)
        showNotification({
          message: 'Paylaşım başarısız oldu',
          type: 'negative'
        })
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification({
          message: 'Link panoya kopyalandı',
          type: 'positive'
        })
      }).catch(error => {
        logger.error('Copy to clipboard failed:', error)
        showNotification({
          message: 'Link kopyalanamadı',
          type: 'negative'
        })
      })
    }
  }

  // Utility actions
  const showSuccess = (message) => {
    Notify.create({
      type: 'positive',
      message,
      icon: '✓', // Unicode checkmark
      position: 'top-right'
    })
    logger.info('Success notification:', message)
  }

  const showError = (message) => {
    Notify.create({
      type: 'negative',
      message,
      icon: '✕', // Unicode X mark
      position: 'top-right'
    })
    logger.info('Error notification:', message)
  }

  const showWarning = (message) => {
    Notify.create({
      type: 'warning',
      message,
      icon: '⚠', // Unicode warning
      position: 'top-right'
    })
    logger.info('Warning notification:', message)
  }

  const showInfo = (message) => {
    Notify.create({
      type: 'info',
      message,
      icon: 'ℹ', // Unicode info
      position: 'top-right'
    })
    logger.info('Info notification:', message)
  }

  // Dark Mode Actions
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    Dark.set(darkMode.value)
    LocalStorage.set('darkMode', darkMode.value)
    
    // Sompo mode'u kapat eğer dark mode açılırsa
    if (darkMode.value && sompoMode.value) {
      sompoMode.value = false
      LocalStorage.set('sompoMode', false)
      document.body.classList.remove('sompo-mode')
    }
    
    logger.info('Dark mode toggled:', { darkMode: darkMode.value })
  }

  const setDarkMode = (value) => {
    darkMode.value = value
    Dark.set(value)
    LocalStorage.set('darkMode', value)
    logger.info('Dark mode set:', { darkMode: value })
  }

  // Sompo Mode Actions
  const toggleSompoMode = () => {
    sompoMode.value = !sompoMode.value
    LocalStorage.set('sompoMode', sompoMode.value)
    
    // Dark mode'u kapat eğer sompo mode açılırsa
    if (sompoMode.value && darkMode.value) {
      darkMode.value = false
      Dark.set(false)
      LocalStorage.set('darkMode', false)
    }
    
    // Body class'ını güncelle
    if (sompoMode.value) {
      document.body.classList.add('sompo-mode')
    } else {
      document.body.classList.remove('sompo-mode')
    }
    
    logger.info('Sompo mode toggled:', { sompoMode: sompoMode.value })
  }

  const setSompoMode = (value) => {
    sompoMode.value = value
    LocalStorage.set('sompoMode', value)
    
    // Body class'ını güncelle
    if (value) {
      document.body.classList.add('sompo-mode')
    } else {
      document.body.classList.remove('sompo-mode')
    }
    
    logger.info('Sompo mode set:', { sompoMode: value })
  }

  // Initialize Dark mode on store creation
  Dark.set(darkMode.value)

  return {
    // State
    notifications,
    loading,
    error,
    darkMode,
    sompoMode,
    dialogs,
    dialogData,
    
    // Actions
    showNotification,
    removeNotification,
    clearNotifications,
    setLoading,
    setError,
    clearError,
    
    // Dialog actions
    showConfirmDialog,
    hideConfirmDialog,
    confirmDialog,
    cancelDialog,
    showAlertDialog,
    hideAlertDialog,
    showInfoDialog,
    hideInfoDialog,
    
    // Page Header actions
    handlePrint,
    handleDownload,
    handleShare,
    
    // Dark Mode actions
    toggleDarkMode,
    setDarkMode,
    
    // Sompo Mode actions
    toggleSompoMode,
    setSompoMode,
    
    // Utility actions
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
