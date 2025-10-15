// Menu Mock Data
// Menü yapısı için gerçekçi test verileri

export const mockMenuData = {
  // Hasar Dosya kategorisi
  hasarDosya: {
    id: 'hasar-dosya',
    translationKey: 'menuPage.categories.hasarDosya',
    icon: 'bi bi-file-earmark-medical',
    items: [
      {
        id: 'hasar-dosya-sorgulama-arabulucu',
        translationKey: 'menuPage.items.hasarDosyaSorgulamaArabulucu',
        icon: 'bi bi-search',
        route: '/hasar-sorgula-arabulucu',
        quickAccess: true,
        description: 'Arabulucu olarak hasar dosyalarını sorgulayın'
      },
      {
        id: 'hasar-dosya-ekleme',
        translationKey: 'menuPage.items.hasarDosyaEkleme',
        icon: 'bi bi-plus-circle',
        route: '/hasar-dosya-ekle',
        quickAccess: false,
        description: 'Yeni hasar dosyası ekleyin'
      },
      {
        id: 'hasar-dosya-listesi',
        translationKey: 'menuPage.items.hasarDosyaListesi',
        icon: 'bi bi-list-ul',
        route: '/hasar-dosya-listesi',
        quickAccess: false,
        description: 'Tüm hasar dosyalarını görüntüleyin'
      },
      {
        id: 'hasar-dosya-raporlari',
        translationKey: 'menuPage.items.hasarDosyaRaporlari',
        icon: 'bi bi-file-earmark-bar-graph',
        route: '/hasar-dosya-raporlari',
        quickAccess: false,
        description: 'Hasar dosyası raporlarını inceleyin'
      }
    ]
  },

  // Evrak Yönetimi kategorisi
  evrakYonetimi: {
    id: 'evrak-yonetimi',
    translationKey: 'menuPage.categories.evrakYonetimi',
    icon: 'bi bi-folder',
    items: [
      {
        id: 'evrak-yukleme',
        translationKey: 'menuPage.items.evrakYukleme',
        icon: 'bi bi-cloud-upload',
        route: '/evrak-yukle',
        quickAccess: true,
        description: 'Yeni evrak yükleyin'
      },
      {
        id: 'evrak-listesi',
        translationKey: 'menuPage.items.evrakListesi',
        icon: 'bi bi-file-text',
        route: '/evrak-listesi',
        quickAccess: false,
        description: 'Tüm evrakları görüntüleyin'
      },
      {
        id: 'evrak-onay',
        translationKey: 'menuPage.items.evrakOnay',
        icon: 'bi bi-check-square',
        route: '/evrak-onay',
        quickAccess: false,
        description: 'Evrak onay işlemlerini yapın'
      }
    ]
  },

  // Raporlar kategorisi
  raporlar: {
    id: 'raporlar',
    translationKey: 'menuPage.categories.raporlar',
    icon: 'bi bi-graph-up',
    items: [
      {
        id: 'gunluk-rapor',
        translationKey: 'menuPage.items.gunlukRapor',
        icon: 'bi bi-calendar-day',
        route: '/raporlar/gunluk',
        quickAccess: false,
        description: 'Günlük işlem raporlarını görüntüleyin'
      },
      {
        id: 'aylik-rapor',
        translationKey: 'menuPage.items.aylikRapor',
        icon: 'bi bi-calendar-month',
        route: '/raporlar/aylik',
        quickAccess: false,
        description: 'Aylık performans raporlarını inceleyin'
      },
      {
        id: 'ozet-rapor',
        translationKey: 'menuPage.items.ozetRapor',
        icon: 'bi bi-file-earmark-text',
        route: '/raporlar/ozet',
        quickAccess: true,
        description: 'Özet raporları görüntüleyin'
      }
    ]
  },

  // Sistem Yönetimi kategorisi
  sistemYonetimi: {
    id: 'sistem-yonetimi',
    translationKey: 'menuPage.categories.sistemYonetimi',
    icon: 'bi bi-gear',
    items: [
      {
        id: 'kullanici-yonetimi',
        translationKey: 'menuPage.items.kullaniciYonetimi',
        icon: 'bi bi-people',
        route: '/sistem/kullanicilar',
        quickAccess: false,
        description: 'Kullanıcı hesaplarını yönetin'
      },
      {
        id: 'yetki-yonetimi',
        translationKey: 'menuPage.items.yetkiYonetimi',
        icon: 'bi bi-shield-check',
        route: '/sistem/yetkiler',
        quickAccess: false,
        description: 'Sistem yetkilerini yönetin'
      },
      {
        id: 'sistem-ayarlari',
        translationKey: 'menuPage.items.sistemAyarlari',
        icon: 'bi bi-sliders',
        route: '/sistem/ayarlar',
        quickAccess: false,
        description: 'Sistem ayarlarını düzenleyin'
      }
    ]
  }
}

// Menü kategorilerini dizi olarak döndüren fonksiyon
export const getMenuCategories = () => {
  return Object.values(mockMenuData)
}

// Belirli bir kategoriyi ID ile getiren fonksiyon
export const getMenuCategoryById = (categoryId) => {
  return mockMenuData[categoryId] || null
}

// Quick access öğelerini getiren fonksiyon
export const getQuickAccessItems = () => {
  const allItems = []
  
  Object.values(mockMenuData).forEach(category => {
    const quickAccessItems = category.items.filter(item => item.quickAccess)
    allItems.push(...quickAccessItems)
  })
  
  return allItems
}

// Belirli bir menü öğesini ID ile getiren fonksiyon
export const getMenuItemById = (itemId) => {
  for (const category of Object.values(mockMenuData)) {
    const item = category.items.find(item => item.id === itemId)
    if (item) {
      return item
    }
  }
  return null
}

// Menü arama fonksiyonu
export const searchMenuItems = (searchTerm) => {
  const results = []
  const term = searchTerm.toLowerCase()
  
  Object.values(mockMenuData).forEach(category => {
    category.items.forEach(item => {
      if (
        item.translationKey.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      ) {
        results.push({
          ...item,
          categoryName: category.translationKey
        })
      }
    })
  })
  
  return results
}

// API response formatında mock data
export const getMockMenuApiResponse = () => {
  return {
    success: true,
    data: getMenuCategories(),
    status: 200
  }
}

// Test için rastgele menü öğesi üretici
export const generateRandomMenuItem = () => {
  const categories = Object.keys(mockMenuData)
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const categoryItems = mockMenuData[randomCategory].items
  const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)]
  
  return {
    ...randomItem,
    categoryId: randomCategory
  }
}

export default mockMenuData
