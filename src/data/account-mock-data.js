// Account Mock Data
// Kullanıcı hesap bilgileri, department ve task seçenekleri için mock veriler

export const mockAccountData = {
  // Mock kullanıcı profil bilgileri
  userProfile: {
    id: 'USER001',
    userCode: 'YEMRE001',
    firstName: 'Yunus Emre',
    lastName: 'Şenoğlu',
    email: 'yunus.senoglu@sompo.com',
    phone: '+90 532 123 45 67',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    
    // Kullanıcı yetkileri
    permissions: [
      'hasar_dosya_okuma',
      'hasar_dosya_yazma',
      'evrak_yukleme',
      'rapor_goruntuleme',
      'kullanici_profil_duzenleme'
    ],
    
    // Kullanıcı tercihleri
    preferences: {
      language: 'tr-TR',
      timezone: 'Europe/Istanbul',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h',
      currency: 'TRY'
    }
  },

  // Mock department listesi
  departmentItems: [
    {
      id: 'DEPT001',
      name: 'Hasar Uzmanı',
      code: 'HASAR_UZMAN',
      description: 'Hasar dosyalarını inceleyen ve değerlendiren uzmanlar',
      icon: 'bi bi-shield-check',
      color: 'primary',
      isActive: true,
      userCount: 25
    },
    {
      id: 'DEPT002',
      name: 'Eksper Atama',
      code: 'EKSPER_ATAMA',
      description: 'Hasar dosyalarına eksper ataması yapan birim',
      icon: 'bi bi-person-plus',
      color: 'secondary',
      isActive: true,
      userCount: 12
    },
    {
      id: 'DEPT003',
      name: 'Ödeme Onay',
      code: 'ODEME_ONAY',
      description: 'Hasar ödemelerini onaylayan birim',
      icon: 'bi bi-credit-card',
      color: 'positive',
      isActive: true,
      userCount: 8
    },
    {
      id: 'DEPT004',
      name: 'Raporlama',
      code: 'RAPORLAMA',
      description: 'Hasar raporları ve analizleri hazırlayan birim',
      icon: 'bi bi-graph-up',
      color: 'info',
      isActive: true,
      userCount: 15
    },
    {
      id: 'DEPT005',
      name: 'Müşteri Hizmetleri',
      code: 'MUSTERI_HIZMETLERI',
      description: 'Müşteri şikayetleri ve talepleri ile ilgilenen birim',
      icon: 'bi bi-headset',
      color: 'warning',
      isActive: false,
      userCount: 20
    }
  ],

  // Mock task listesi
  taskItems: [
    {
      id: 'TASK001',
      name: 'Hasar Dosya İnceleme',
      code: 'HASAR_INCELEME',
      description: 'Gelen hasar dosyalarını inceleme ve değerlendirme',
      icon: 'bi bi-file-earmark-medical',
      color: 'primary',
      priority: 'high',
      estimatedTime: '2-4 saat',
      isActive: true,
      pendingCount: 15
    },
    {
      id: 'TASK002',
      name: 'Eksper Atama',
      code: 'EKSPER_ATAMA',
      description: 'Hasar dosyalarına uygun eksper ataması yapma',
      icon: 'bi bi-person-plus',
      color: 'secondary',
      priority: 'medium',
      estimatedTime: '1-2 saat',
      isActive: true,
      pendingCount: 8
    },
    {
      id: 'TASK003',
      name: 'Ödeme Onayı',
      code: 'ODEME_ONAYI',
      description: 'Hasar ödemelerini kontrol etme ve onaylama',
      icon: 'bi bi-check-circle',
      color: 'positive',
      priority: 'high',
      estimatedTime: '1-3 saat',
      isActive: true,
      pendingCount: 12
    },
    {
      id: 'TASK004',
      name: 'Rapor Hazırlama',
      code: 'RAPOR_HAZIRLAMA',
      description: 'Aylık ve haftalık hasar raporları hazırlama',
      icon: 'bi bi-file-earmark-text',
      color: 'info',
      priority: 'low',
      estimatedTime: '3-5 saat',
      isActive: true,
      pendingCount: 3
    },
    {
      id: 'TASK005',
      name: 'Müşteri Görüşmesi',
      code: 'MUSTERI_GORUSMESI',
      description: 'Müşteri şikayetleri ve talepleri ile görüşme',
      icon: 'bi bi-telephone',
      color: 'warning',
      priority: 'medium',
      estimatedTime: '30-60 dakika',
      isActive: false,
      pendingCount: 5
    }
  ],

  // Mock hesap ayarları
  accountSettings: {
    language: 'tr-TR',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'TRY',
    
    // Gizlilik ayarları
    privacy: {
      profileVisibility: 'team', // 'public', 'team', 'private'
      activityTracking: true,
      dataSharing: false,
      emailNotifications: true,
      smsNotifications: false
    },
    
    // Görev çubuğu ayarları
    taskbar: {
      showTaskbar: true,
      autoHide: false,
      position: 'left', // Sadece 'left' pozisyonu desteklenir
      compactMode: false
    },
    
    // Tema ayarları
    theme: {
      mode: 'light', // 'light', 'dark', 'auto'
      primaryColor: '#1976d2',
      accentColor: '#ff4081'
    }
  },

  // Mock seçili değerler
  selectedValues: {
    departmentId: 'DEPT001', // Varsayılan olarak Hasar Uzmanı
    taskId: 'TASK001' // Varsayılan olarak Hasar Dosya İnceleme
  }
}

// Mock API response'ları
export const mockAccountResponses = {
  // Profil bilgileri başarılı response
  profileSuccess: {
    success: true,
    data: mockAccountData.userProfile,
    status: 200
  },

  // Profil güncelleme başarılı response
  profileUpdateSuccess: {
    success: true,
    data: {
      ...mockAccountData.userProfile,
      updatedAt: new Date().toISOString()
    },
    message: 'Profil başarıyla güncellendi',
    status: 200
  },

  // Department listesi başarılı response
  departmentsSuccess: {
    success: true,
    data: mockAccountData.departmentItems,
    status: 200
  },

  // Task listesi başarılı response
  tasksSuccess: {
    success: true,
    data: mockAccountData.taskItems,
    status: 200
  },

  // Hesap ayarları başarılı response
  settingsSuccess: {
    success: true,
    data: mockAccountData.accountSettings,
    status: 200
  },

  // Ayar güncelleme başarılı response
  settingsUpdateSuccess: {
    success: true,
    data: mockAccountData.accountSettings,
    message: 'Ayarlar başarıyla güncellendi',
    status: 200
  },

  // Şifre değiştirme başarılı response
  passwordChangeSuccess: {
    success: true,
    data: {
      message: 'Şifre başarıyla değiştirildi'
    },
    status: 200
  },

  // Hata response'ları
  profileError: {
    success: false,
    error: {
      code: 'PROFILE_NOT_FOUND',
      message: 'Kullanıcı profili bulunamadı'
    },
    status: 404
  },

  settingsError: {
    success: false,
    error: {
      code: 'SETTINGS_UPDATE_FAILED',
      message: 'Ayarlar güncellenirken hata oluştu'
    },
    status: 500
  },

  passwordError: {
    success: false,
    error: {
      code: 'INVALID_CURRENT_PASSWORD',
      message: 'Mevcut şifre hatalı'
    },
    status: 400
  }
}

// Mock validation fonksiyonları
export const mockAccountValidations = {
  // Profil alanları validation
  validateProfile: (profile) => {
    const errors = []
    
    if (!profile.firstName || profile.firstName.trim().length < 2) {
      errors.push('Ad en az 2 karakter olmalıdır')
    }
    
    if (!profile.lastName || profile.lastName.trim().length < 2) {
      errors.push('Soyad en az 2 karakter olmalıdır')
    }
    
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.push('Geçerli bir e-posta adresi giriniz')
    }
    
    if (!profile.phone || profile.phone.trim().length < 10) {
      errors.push('Telefon numarası en az 10 karakter olmalıdır')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },

  // Şifre validation
  validatePassword: (currentPassword, newPassword, confirmPassword) => {
    const errors = []
    
    if (!currentPassword) {
      errors.push('Mevcut şifre gereklidir')
    }
    
    if (!newPassword || newPassword.length < 6) {
      errors.push('Yeni şifre en az 6 karakter olmalıdır')
    }
    
    if (newPassword !== confirmPassword) {
      errors.push('Yeni şifreler eşleşmiyor')
    }
    
    if (currentPassword === newPassword) {
      errors.push('Yeni şifre mevcut şifreden farklı olmalıdır')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },

  // Department seçimi validation
  validateDepartment: (departmentId) => {
    const department = mockAccountData.departmentItems.find(d => d.id === departmentId)
    
    if (!department) {
      return { valid: false, message: 'Geçersiz department seçimi' }
    }
    
    if (!department.isActive) {
      return { valid: false, message: 'Seçilen department aktif değil' }
    }
    
    return { valid: true }
  },

  // Task seçimi validation
  validateTask: (taskId) => {
    const task = mockAccountData.taskItems.find(t => t.id === taskId)
    
    if (!task) {
      return { valid: false, message: 'Geçersiz görev seçimi' }
    }
    
    if (!task.isActive) {
      return { valid: false, message: 'Seçilen görev aktif değil' }
    }
    
    return { valid: true }
  }
}

// Mock API simulation fonksiyonları
export const simulateAccountApi = {
  // Profil bilgilerini getir
  fetchProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockAccountResponses.profileSuccess
  },

  // Profil güncelle
  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const validation = mockAccountValidations.validateProfile(profileData)
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        },
        status: 400
      }
    }
    
    return mockAccountResponses.profileUpdateSuccess
  },

  // Department listesini getir
  fetchDepartments: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockAccountResponses.departmentsSuccess
  },

  // Task listesini getir
  fetchTasks: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockAccountResponses.tasksSuccess
  },

  // Hesap ayarlarını getir
  fetchSettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockAccountResponses.settingsSuccess
  },

  // Ayar güncelle
  updateSettings: async (settingsData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockAccountResponses.settingsUpdateSuccess
  },

  // Şifre değiştir
  changePassword: async (passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const validation = mockAccountValidations.validatePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    )
    
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        },
        status: 400
      }
    }
    
    return mockAccountResponses.passwordChangeSuccess
  }
}

// Helper functions
export const getMockUserProfile = () => mockAccountData.userProfile
export const getMockDepartments = () => mockAccountData.departmentItems
export const getMockTasks = () => mockAccountData.taskItems
export const getMockAccountSettings = () => mockAccountData.accountSettings
export const getMockSelectedValues = () => mockAccountData.selectedValues

// API response formatında mock data
export const getMockAccountApiResponse = (endpoint) => {
  switch (endpoint) {
    case 'profile':
      return mockAccountResponses.profileSuccess
    case 'departments':
      return mockAccountResponses.departmentsSuccess
    case 'tasks':
      return mockAccountResponses.tasksSuccess
    case 'settings':
      return mockAccountResponses.settingsSuccess
    default:
      return mockAccountResponses.profileSuccess
  }
}

export default mockAccountData
