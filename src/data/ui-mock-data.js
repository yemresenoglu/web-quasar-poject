// UI Mock Data
// UI bileşenleri, bildirimler, dialog'lar ve genel UI ayarları için mock veriler

export const mockUIData = {
  // Mock bildirimler
  notifications: [
    {
      id: 'NOTIF001',
      type: 'info',
      title: 'Yeni Hasar Dosyası',
      message: '2025311003010 numaralı hasar dosyası sisteme eklendi',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      priority: 'medium',
      category: 'hasar'
    },
    {
      id: 'NOTIF002',
      type: 'success',
      title: 'Evrak Onaylandı',
      message: 'Poliçe belgesi başarıyla onaylandı',
      timestamp: '2024-01-15T09:45:00Z',
      read: false,
      priority: 'low',
      category: 'evrak'
    },
    {
      id: 'NOTIF003',
      type: 'warning',
      title: 'Eksper Atama Gerekli',
      message: '5 hasar dosyası için eksper ataması bekleniyor',
      timestamp: '2024-01-15T08:20:00Z',
      read: true,
      priority: 'high',
      category: 'eksper'
    },
    {
      id: 'NOTIF004',
      type: 'error',
      title: 'Sistem Bakımı',
      message: 'Sistem 22:00-02:00 saatleri arasında bakımda olacak',
      timestamp: '2024-01-14T18:00:00Z',
      read: true,
      priority: 'medium',
      category: 'sistem'
    }
  ],

  // Mock dialog şablonları
  dialogs: {
    confirm: {
      title: 'Onay Gerekli',
      message: 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Devam Et',
      cancelText: 'İptal',
      type: 'warning'
    },
    alert: {
      title: 'Bilgi',
      message: 'İşlem başarıyla tamamlandı',
      type: 'success'
    },
    info: {
      title: 'Detay Bilgisi',
      content: 'Bu alan hakkında detaylı bilgi...',
      actions: [
        { label: 'Tamam', color: 'primary' },
        { label: 'Kapat', color: 'secondary' }
      ]
    }
  },

  // Mock UI ayarları
  uiSettings: {
    theme: {
      mode: 'light', // 'light', 'dark', 'auto'
      primaryColor: '#1976d2',
      accentColor: '#ff4081',
      fontSize: 'medium', // 'small', 'medium', 'large'
      compactMode: false
    },
    
    layout: {
      sidebarCollapsed: false,
      taskbarPosition: 'left',
      showBreadcrumbs: true,
      showPageTitle: true,
      animations: true
    },
    
    notifications: {
      enabled: true,
      soundEnabled: true,
      desktopNotifications: true,
      emailNotifications: false,
      autoMarkAsRead: false,
      retentionDays: 30
    },
    
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true
    }
  },

  // Mock loading states
  loadingStates: {
    global: false,
    auth: false,
    menu: false,
    dashboard: false,
    hasar: false,
    evrak: false,
    account: false
  },

  // Mock error states
  errorStates: {
    global: null,
    auth: null,
    menu: null,
    dashboard: null,
    hasar: null,
    evrak: null,
    account: null
  },

  // Mock breadcrumb data
  breadcrumbs: [
    { label: 'Ana Sayfa', path: '/', icon: 'bi bi-house' },
    { label: 'Menü', path: '/menu', icon: 'bi bi-grid' },
    { label: 'Hasar Dosya Sorgula', path: '/hasar-dosya-sorgula-arabulucu', icon: 'bi bi-search' }
  ],

  // Mock page titles
  pageTitles: {
    '/': 'Ana Sayfa',
    '/menu': 'Menü',
    '/login': 'Giriş Yap',
    '/account': 'Hesabım',
    '/hasar-dosya-sorgula-arabulucu': 'Hasar Dosya Sorgula (Arabulucu)',
    '/hasar-dosya-ekle': 'Hasar Dosya Ekle',
    '/evrak-yukle': 'Evrak Yükle',
    '/raporlar/gunluk': 'Günlük Rapor'
  },

  // Mock context menu items
  contextMenuItems: [
    {
      id: 'open',
      label: 'Aç',
      icon: 'bi bi-folder-open',
      action: 'open'
    },
    {
      id: 'openNewTab',
      label: 'Yeni Sekmede Aç',
      icon: 'bi bi-box-arrow-up-right',
      action: 'openNewTab'
    },
    {
      id: 'pin',
      label: 'Sabitle',
      icon: 'bi bi-pin',
      action: 'pin'
    },
    {
      id: 'unpin',
      label: 'Sabitlemeyi Kaldır',
      icon: 'bi bi-pin-angle',
      action: 'unpin'
    },
    {
      id: 'separator',
      type: 'separator'
    },
    {
      id: 'refresh',
      label: 'Yenile',
      icon: 'bi bi-arrow-clockwise',
      action: 'refresh'
    }
  ],

  // Mock quick actions
  quickActions: [
    {
      id: 'qa001',
      label: 'Yeni Hasar Dosyası',
      icon: 'bi bi-plus-circle',
      color: 'primary',
      action: '/hasar-dosya-ekle',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'qa002',
      label: 'Evrak Yükle',
      icon: 'bi bi-cloud-upload',
      color: 'secondary',
      action: '/evrak-yukle',
      shortcut: 'Ctrl+U'
    },
    {
      id: 'qa003',
      label: 'Rapor Oluştur',
      icon: 'bi bi-file-earmark-text',
      color: 'positive',
      action: '/raporlar/gunluk',
      shortcut: 'Ctrl+R'
    }
  ]
}

// Mock API response'ları
export const mockUIResponses = {
  // Bildirimler başarılı response
  notificationsSuccess: {
    success: true,
    data: mockUIData.notifications,
    unreadCount: mockUIData.notifications.filter(n => !n.read).length,
    status: 200
  },

  // UI ayarları başarılı response
  uiSettingsSuccess: {
    success: true,
    data: mockUIData.uiSettings,
    status: 200
  },

  // Ayar güncelleme başarılı response
  settingsUpdateSuccess: {
    success: true,
    data: mockUIData.uiSettings,
    message: 'UI ayarları başarıyla güncellendi',
    status: 200
  },

  // Bildirim okundu işaretleme başarılı response
  markNotificationReadSuccess: {
    success: true,
    data: { message: 'Bildirim okundu olarak işaretlendi' },
    status: 200
  },

  // Hata response'ları
  settingsUpdateError: {
    success: false,
    error: {
      code: 'SETTINGS_UPDATE_FAILED',
      message: 'UI ayarları güncellenirken hata oluştu'
    },
    status: 500
  },

  notificationsError: {
    success: false,
    error: {
      code: 'NOTIFICATIONS_FETCH_FAILED',
      message: 'Bildirimler yüklenirken hata oluştu'
    },
    status: 500
  }
}

// Mock validation fonksiyonları
export const mockUIValidations = {
  // Bildirim validation
  validateNotification: (notification) => {
    const errors = []
    
    if (!notification.title || notification.title.trim().length === 0) {
      errors.push('Bildirim başlığı gereklidir')
    }
    
    if (!notification.message || notification.message.trim().length === 0) {
      errors.push('Bildirim mesajı gereklidir')
    }
    
    if (!['info', 'success', 'warning', 'error'].includes(notification.type)) {
      errors.push('Geçersiz bildirim türü')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },

  // UI ayar validation
  validateUISettings: (settings) => {
    const errors = []
    
    if (!['light', 'dark', 'auto'].includes(settings.theme?.mode)) {
      errors.push('Geçersiz tema modu')
    }
    
    if (!['small', 'medium', 'large'].includes(settings.theme?.fontSize)) {
      errors.push('Geçersiz font boyutu')
    }
    
    if (typeof settings.notifications?.enabled !== 'boolean') {
      errors.push('Bildirim ayarı boolean olmalıdır')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Mock API simulation fonksiyonları
export const simulateUIApi = {
  // Bildirimleri getir
  fetchNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockUIResponses.notificationsSuccess
  },

  // UI ayarlarını getir
  fetchUISettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockUIResponses.uiSettingsSuccess
  },

  // UI ayarlarını güncelle
  updateUISettings: async (settings) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const validation = mockUIValidations.validateUISettings(settings)
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
    
    return mockUIResponses.settingsUpdateSuccess
  },

  // Bildirim okundu işaretle
  markNotificationRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockUIResponses.markNotificationReadSuccess
  },

  // Tüm bildirimleri okundu işaretle
  markAllNotificationsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockUIResponses.markNotificationReadSuccess
  },

  // Bildirim sil
  deleteNotification: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUIResponses.markNotificationReadSuccess
  }
}

// Helper functions
export const getMockNotifications = () => mockUIData.notifications
export const getMockUISettings = () => mockUIData.uiSettings
export const getMockDialogs = () => mockUIData.dialogs
export const getMockBreadcrumbs = () => mockUIData.breadcrumbs
export const getMockContextMenuItems = () => mockUIData.contextMenuItems
export const getMockQuickActions = () => mockUIData.quickActions

// API response formatında mock data
export const getMockUIApiResponse = (endpoint) => {
  switch (endpoint) {
    case 'notifications':
      return mockUIResponses.notificationsSuccess
    case 'settings':
      return mockUIResponses.uiSettingsSuccess
    default:
      return mockUIResponses.uiSettingsSuccess
  }
}

// Mock notification generator
export const generateMockNotification = (type = 'info', category = 'sistem') => {
  const types = ['info', 'success', 'warning', 'error']
  const categories = ['hasar', 'evrak', 'eksper', 'sistem', 'kullanici']
  const titles = {
    hasar: ['Yeni Hasar Dosyası', 'Hasar Dosyası Güncellendi', 'Hasar Dosyası Onaylandı'],
    evrak: ['Evrak Yüklendi', 'Evrak Onaylandı', 'Evrak Reddedildi'],
    eksper: ['Eksper Atandı', 'Eksper Raporu Geldi', 'Eksper Atama Bekleniyor'],
    sistem: ['Sistem Bakımı', 'Sistem Güncellemesi', 'Sistem Hatası'],
    kullanici: ['Yeni Kullanıcı', 'Kullanıcı Güncellendi', 'Kullanıcı Silindi']
  }
  
  const messages = {
    hasar: ['Yeni hasar dosyası sisteme eklendi', 'Hasar dosyası güncellendi', 'Hasar dosyası onaylandı'],
    evrak: ['Evrak başarıyla yüklendi', 'Evrak onaylandı', 'Evrak reddedildi'],
    eksper: ['Eksper ataması yapıldı', 'Eksper raporu geldi', 'Eksper ataması bekleniyor'],
    sistem: ['Sistem bakımı başlayacak', 'Sistem güncellendi', 'Sistem hatası oluştu'],
    kullanici: ['Yeni kullanıcı eklendi', 'Kullanıcı bilgileri güncellendi', 'Kullanıcı hesabı silindi']
  }
  
  const selectedType = type || types[Math.floor(Math.random() * types.length)]
  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)]
  const titleOptions = titles[selectedCategory] || titles.sistem
  const messageOptions = messages[selectedCategory] || messages.sistem
  
  return {
    id: `NOTIF_${Date.now()}`,
    type: selectedType,
    title: titleOptions[Math.floor(Math.random() * titleOptions.length)],
    message: messageOptions[Math.floor(Math.random() * messageOptions.length)],
    timestamp: new Date().toISOString(),
    read: false,
    priority: selectedType === 'error' ? 'high' : selectedType === 'warning' ? 'medium' : 'low',
    category: selectedCategory
  }
}

export default mockUIData
