import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DEPARTMENT_ITEMS, TASK_ITEMS } from 'src/constants/account.js'

export const useAccountStore = defineStore('account', () => {
  // Kullanıcı profil bilgileri
  const userProfile = ref({
    id: 'user_001',
    firstName: 'Yunus Emre',
    lastName: 'Şenoğlu',
    userCode: 'YUNUSEMRE',
    email: 'yunus.emre@example.com',
    department: 'arabuluculuk',
    // Avatar URL - null olursa fallback icon gösterilir
    avatar: 'https://media.licdn.com/dms/image/v2/C4D03AQHtT8fKVk8foA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1661509946851?e=2147483647&v=beta&t=yYQ3hHGIOSIIcEJP44U-U8IRxZ7YS2Fh8H0XKuc8Cy8',
    // avatar: null, // Test için: null yapılırsa account_circle icon gösterilir
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: ['damage_view', 'damage_edit', 'customer_view', 'reports_view']
  })

  // Seçili department ve task state'leri
  const selectedDepartmentId = ref('arabuluculuk')
  const selectedTaskId = ref('task-1')

  // Department ve task items (constants'tan geliyor)
  const departmentItems = ref(DEPARTMENT_ITEMS.map(item => ({ ...item })))
  const taskItems = ref(TASK_ITEMS.map(item => ({ ...item })))

  // Hesap ayarları
  const accountSettings = ref({
    language: 'tr-TR',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'TRY',
    privacy: {
      profileVisibility: 'team',
      activityTracking: true,
      dataSharing: false
    },
    taskbar: {
      showTaskbar: true,
      autoHide: false,
      position: 'left' // Sadece 'left' pozisyonu desteklenir
    }
  })

  // Computed properties
  const fullName = computed(() => `${userProfile.value.firstName} ${userProfile.value.lastName}`)
  
  const initials = computed(() => {
    const first = userProfile.value.firstName.charAt(0).toUpperCase()
    const last = userProfile.value.lastName.charAt(0).toUpperCase()
    return `${first}${last}`
  })

  const isOnline = computed(() => {
    const lastLogin = new Date(userProfile.value.lastLogin)
    const now = new Date()
    const diffMinutes = (now - lastLogin) / (1000 * 60)
    return diffMinutes < 5 // Son 5 dakika içinde aktifse online
  })

  // Seçili task'ın adını döndür
  const selectedTaskName = computed(() => {
    const selectedTask = taskItems.value.find(task => task.id === selectedTaskId.value)
    return selectedTask ? selectedTask.name : null
  })

  // Seçili department'ın adını döndür
  const selectedDepartmentName = computed(() => {
    const selectedDept = departmentItems.value.find(dept => dept.id === selectedDepartmentId.value)
    return selectedDept ? selectedDept.name : null
  })

  // Actions
  const updateProfile = (profileData) => {
    userProfile.value = { ...userProfile.value, ...profileData }
  }

  const updateSettings = (settingsData) => {
    accountSettings.value = { ...accountSettings.value, ...settingsData }
  }

  const updatePrivacySettings = (privacyData) => {
    accountSettings.value.privacy = { 
      ...accountSettings.value.privacy, 
      ...privacyData 
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    // Parametrelerin geçerliliğini kontrol et
    if (!currentPassword || !newPassword) {
      return { success: false, message: 'Mevcut şifre ve yeni şifre gereklidir' }
    }
    
    if (newPassword.length < 6) {
      return { success: false, message: 'Yeni şifre en az 6 karakter olmalıdır' }
    }
    
    // Aynı şifre kontrolü
    if (currentPassword === newPassword) {
      return { success: false, message: 'Yeni şifre mevcut şifre ile aynı olamaz' }
    }
    
    // Simüle edilmiş şifre değiştirme
    console.log('Şifre değiştiriliyor...', { 
      currentPasswordLength: currentPassword.length, 
      newPasswordLength: newPassword.length 
    })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Şifre başarıyla değiştirildi' })
      }, 1000)
    })
  }
  
  /**
   * Check if user has specific permission
   * @param {string} permission - Permission key
   * @returns {boolean} Has permission
   */
  const hasPermission = (permission) => {
    return userProfile.value.permissions?.includes(permission) ?? false
  }

  const logout = () => {
    // Çıkış işlemi
    console.log('Çıkış yapılıyor...')
    // Router'a yönlendirme burada yapılabilir
  }

  // Department seçimi
  const selectDepartment = (departmentId) => {
    selectedDepartmentId.value = departmentId
    userProfile.value.department = departmentId
    
    // Department items'ları güncelle
    departmentItems.value.forEach(dept => {
      dept.selected = dept.id === departmentId
    })
  }

  // Task seçimi (radio button mantığı - sadece bir tane seçilebilir)
  const selectTask = (taskId) => {
    selectedTaskId.value = taskId
    
    // Task items'ları güncelle
    taskItems.value.forEach(task => {
      task.completed = task.id === taskId
    })
  }

  // Task durumunu toggle et
  const toggleTaskStatus = (taskId) => {
    const task = taskItems.value.find(t => t.id === taskId)
    if (task) {
      if (task.completed) {
        // Eğer görev zaten seçiliyse, seçimi kaldır
        task.completed = false
        selectedTaskId.value = null
      } else {
        // Diğer tüm görevleri kapat ve sadece bu görevi seç
        taskItems.value.forEach(t => t.completed = false)
        task.completed = true
        selectedTaskId.value = taskId
      }
    }
  }

  // Taskbar ayarlarını güncelle
  const updateTaskbarSettings = (taskbarData) => {
    accountSettings.value.taskbar = {
      ...accountSettings.value.taskbar,
      ...taskbarData
    }
  }

  // Taskbar görünürlüğünü toggle et
  const toggleTaskbarVisibility = () => {
    accountSettings.value.taskbar.showTaskbar = !accountSettings.value.taskbar.showTaskbar
  }

  // Taskbar otomatik gizleme toggle
  const toggleTaskbarAutoHide = () => {
    accountSettings.value.taskbar.autoHide = !accountSettings.value.taskbar.autoHide
  }

  // Taskbar konumunu değiştir - sadece left pozisyonu desteklenir
  const setTaskbarPosition = (position) => {
    if (position === 'left') {
      accountSettings.value.taskbar.position = position
    }
  }

  return {
    // State
    userProfile,
    accountSettings,
    selectedDepartmentId,
    selectedTaskId,
    departmentItems,
    taskItems,
    
    // Computed
    fullName,
    initials,
    isOnline,
    selectedTaskName,
    selectedDepartmentName,
    
    // Actions
    updateProfile,
    updateSettings,
    updatePrivacySettings,
    changePassword,
    hasPermission,
    logout,
    selectDepartment,
    selectTask,
    toggleTaskStatus,
    updateTaskbarSettings,
    toggleTaskbarVisibility,
    toggleTaskbarAutoHide,
    setTaskbarPosition
  }
}, {
  persist: {
    key: 'sompo-account',
    storage: localStorage,
    paths: ['userProfile', 'accountSettings', 'selectedDepartmentId', 'selectedTaskId']
  }
}) 