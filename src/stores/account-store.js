import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAccountStore = defineStore('account', () => {
  // Kullanıcı profil bilgileri
  const userProfile = ref({
    id: 'user_001',
    firstName: 'Yunus Emre',
    lastName: 'Kullanıcı',
    email: 'yunus.emre@example.com',
    phone: '+90 555 123 45 67',
    department: 'Hasar İşlemleri',
    position: 'Hasar Uzmanı',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: ['damage_view', 'damage_edit', 'customer_view', 'reports_view']
  })

  // Hesap ayarları
  const accountSettings = ref({
    language: 'tr-TR',
    theme: 'light',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'TRY',
    notifications: {
      email: true,
      sms: true,
      push: true,
      desktop: true
    },
    privacy: {
      profileVisibility: 'team',
      activityTracking: true,
      dataSharing: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  })

  // Kullanıcı istatistikleri
  const userStats = ref({
    totalDamageFiles: 156,
    completedTasks: 89,
    pendingApprovals: 12,
    monthlyActivity: 245,
    averageResponseTime: '2.5 saat',
    successRate: 94.5
  })

  // Son aktiviteler
  const recentActivities = ref([
    {
      id: 'act_1',
      type: 'damage_report',
      title: 'Hasar Dosyası Oluşturuldu',
      description: 'HSR-2024-001234 numaralı hasar dosyası',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      icon: 'bi-file-plus'
    },
    {
      id: 'act_2',
      type: 'payment_approval',
      title: 'Ödeme Onaylandı',
      description: '15.000 TL tutarında ödeme',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      icon: 'bi-check-circle'
    },
    {
      id: 'act_3',
      type: 'expert_assignment',
      title: 'Eksper Atandı',
      description: 'Ahmet Yılmaz - HSR-2024-001230',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      icon: 'bi-person-plus'
    }
  ])

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

  // Actions
  const updateProfile = (profileData) => {
    userProfile.value = { ...userProfile.value, ...profileData }
  }

  const updateSettings = (settingsData) => {
    accountSettings.value = { ...accountSettings.value, ...settingsData }
  }

  const updateNotificationSettings = (notificationData) => {
    accountSettings.value.notifications = { 
      ...accountSettings.value.notifications, 
      ...notificationData 
    }
  }

  const updatePrivacySettings = (privacyData) => {
    accountSettings.value.privacy = { 
      ...accountSettings.value.privacy, 
      ...privacyData 
    }
  }

  const updateSecuritySettings = (securityData) => {
    accountSettings.value.security = { 
      ...accountSettings.value.security, 
      ...securityData 
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

  const enableTwoFactorAuth = async () => {
    // Simüle edilmiş 2FA etkinleştirme
    console.log('2FA etkinleştiriliyor...')
    accountSettings.value.security.twoFactorAuth = true
    return { success: true, qrCode: 'data:image/png;base64,example' }
  }

  const disableTwoFactorAuth = async () => {
    // Simüle edilmiş 2FA devre dışı bırakma
    console.log('2FA devre dışı bırakılıyor...')
    accountSettings.value.security.twoFactorAuth = false
    return { success: true }
  }

  const logout = () => {
    // Çıkış işlemi
    console.log('Çıkış yapılıyor...')
    // Router'a yönlendirme burada yapılabilir
  }

  const exportAccountData = () => {
    const accountData = {
      profile: userProfile.value,
      settings: accountSettings.value,
      stats: userStats.value,
      activities: recentActivities.value
    }
    
    const dataStr = JSON.stringify(accountData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `account_data_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const addActivity = (activityData) => {
    const newActivity = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...activityData
    }
    recentActivities.value.unshift(newActivity)
    
    // Son 50 aktiviteyi tut
    if (recentActivities.value.length > 50) {
      recentActivities.value = recentActivities.value.slice(0, 50)
    }
  }

  const clearActivities = () => {
    recentActivities.value = []
  }

  return {
    // State
    userProfile,
    accountSettings,
    userStats,
    recentActivities,
    
    // Computed
    fullName,
    initials,
    isOnline,
    
    // Actions
    updateProfile,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateSecuritySettings,
    changePassword,
    enableTwoFactorAuth,
    disableTwoFactorAuth,
    logout,
    exportAccountData,
    addActivity,
    clearActivities
  }
}) 