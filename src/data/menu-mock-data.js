// Menu Mock Data
// Menü yapısı için gerçekçi test verileri

// Kullanıcı bazlı menü verileri
export const getUserMenuData = (userOid, selectedBirimLabel, selectedGörevLabel) => {
  const baseMenu = getMenuCategories()

  // Kullanıcı ve rol bazlı menü filtreleme
  if (selectedBirimLabel === 'Arabuluculuk' && selectedGörevLabel === 'Arabulucu') {
    return baseMenu
      .map((category) => {
        if (category.id === 'hasar-dosya') {
          return {
            ...category,
            items: category.items.filter(
              (item) =>
                item.id === 'hasar-dosya-sorgulama-arabulucu' || item.id === 'hasar-dosya-listesi',
            ),
          }
        }
        if (category.id === 'evrak-yonetimi') {
          return {
            ...category,
            items: category.items.filter(
              (item) => item.id === 'evrak-yukleme' || item.id === 'evrak-listesi',
            ),
          }
        }
        if (category.id === 'raporlar') {
          return {
            ...category,
            items: category.items.filter((item) => item.id === 'arabuluculuk-raporlari'),
          }
        }
        return category
      })
      .filter((category) => category.items.length > 0)
  }

  if (selectedBirimLabel === 'Hasar Uzmanı' && selectedGörevLabel === 'Hasar Uzmanı') {
    return baseMenu.map((category) => {
      if (category.id === 'hasar-dosya') {
        return {
          ...category,
          items: category.items.filter((item) => item.id !== 'hasar-dosya-sorgulama-arabulucu'),
        }
      }
      return category
    })
  }

  // Varsayılan menü
  return baseMenu
}

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
        route: '/home/menu/hasar-sorgula-arabulucu',
        quickAccess: true,
        description: 'Arabulucu olarak hasar dosyalarını sorgulayın',
      },
      {
        id: 'hasar-dosya-ekleme',
        translationKey: 'menuPage.items.hasarDosyaEkleme',
        icon: 'bi bi-plus-circle',
        route: '/home/menu/hasar-dosya-ekle',
        quickAccess: false,
        description: 'Yeni hasar dosyası ekleyin',
      },
      {
        id: 'hasar-dosya-listesi',
        translationKey: 'menuPage.items.hasarDosyaListesi',
        icon: 'bi bi-list-ul',
        route: '/home/menu/hasar-dosya-listesi',
        quickAccess: false,
        description: 'Tüm hasar dosyalarını görüntüleyin',
      },
      {
        id: 'hasar-dosya-raporlari',
        translationKey: 'menuPage.items.hasarDosyaRaporlari',
        icon: 'bi bi-file-earmark-bar-graph',
        route: '/home/menu/hasar-dosya-raporlari',
        quickAccess: false,
        description: 'Hasar dosyası raporlarını inceleyin',
      },
    ],
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
        route: '/home/menu/evrak-yukle',
        quickAccess: true,
        description: 'Yeni evrak yükleyin',
      },
      {
        id: 'evrak-listesi',
        translationKey: 'menuPage.items.evrakListesi',
        icon: 'bi bi-file-text',
        route: '/home/menu/evrak-listesi',
        quickAccess: false,
        description: 'Tüm evrakları görüntüleyin',
      },
      {
        id: 'evrak-onay',
        translationKey: 'menuPage.items.evrakOnay',
        icon: 'bi bi-check-square',
        route: '/home/menu/evrak-onay',
        quickAccess: false,
        description: 'Evrak onay işlemlerini yapın',
      },
    ],
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
        route: '/home/menu/raporlar/gunluk',
        quickAccess: false,
        description: 'Günlük işlem raporlarını görüntüleyin',
      },
      {
        id: 'aylik-rapor',
        translationKey: 'menuPage.items.aylikRapor',
        icon: 'bi bi-calendar-month',
        route: '/home/menu/raporlar/aylik',
        quickAccess: false,
        description: 'Aylık performans raporlarını inceleyin',
      },
      {
        id: 'ozet-rapor',
        translationKey: 'menuPage.items.ozetRapor',
        icon: 'bi bi-file-earmark-text',
        route: '/home/menu/raporlar/ozet',
        quickAccess: true,
        description: 'Özet raporları görüntüleyin',
      },
    ],
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
        route: '/home/menu/sistem/kullanicilar',
        quickAccess: false,
        description: 'Kullanıcı hesaplarını yönetin',
      },
      {
        id: 'yetki-yonetimi',
        translationKey: 'menuPage.items.yetkiYonetimi',
        icon: 'bi bi-shield-check',
        route: '/home/menu/sistem/yetkiler',
        quickAccess: false,
        description: 'Sistem yetkilerini yönetin',
      },
      {
        id: 'sistem-ayarlari',
        translationKey: 'menuPage.items.sistemAyarlari',
        icon: 'bi bi-sliders',
        route: '/home/menu/sistem/ayarlar',
        quickAccess: false,
        description: 'Sistem ayarlarını düzenleyin',
      },
    ],
  },
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

  Object.values(mockMenuData).forEach((category) => {
    const quickAccessItems = category.items.filter((item) => item.quickAccess)
    allItems.push(...quickAccessItems)
  })

  return allItems
}

// Belirli bir menü öğesini ID ile getiren fonksiyon
export const getMenuItemById = (itemId) => {
  for (const category of Object.values(mockMenuData)) {
    const item = category.items.find((item) => item.id === itemId)
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

  Object.values(mockMenuData).forEach((category) => {
    category.items.forEach((item) => {
      if (
        item.translationKey.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      ) {
        results.push({
          ...item,
          categoryName: category.translationKey,
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
    status: 200,
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
    categoryId: randomCategory,
  }
}

export default mockMenuData
