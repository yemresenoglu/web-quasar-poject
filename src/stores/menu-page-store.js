import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createLogger } from 'src/utils/logger.js'
import menuDataJson from '/menu-data.json'

const logger = createLogger('MenuPageStore')

// menu-data.json'dan menü yapısını oluştur
const buildMenuFromData = () => {
  const categories = []
  
  // Yeni JSON yapısından kategorileri al
  menuDataJson.categories.forEach(category => {
    const categoryData = {
      id: category.id,
      text: category.title,
      icon: category.icon,
      items: []
    }
    
    // Alt kategorilerden tüm öğeleri düzleştir
    category.subCategories.forEach(subCat => {
      subCat.items.forEach(item => {
        categoryData.items.push({
          id: item.id,
          text: item.title,
          icon: 'bi bi-file-text',
          route: item.route || `/${item.id}`,
          quickAccess: false,
          description: item.description,
          subCategory: subCat.title // Alt kategori bilgisini koru
        })
      })
    })
    
    // Elemanları A-Z'ye göre sırala
    categoryData.items.sort((a, b) => {
      return a.text.localeCompare(b.text, 'tr', { sensitivity: 'base' })
    })
    
    if (categoryData.items.length > 0) {
      categories.push(categoryData)
    }
  })
  
  // Kategorileri A-Z'ye göre sırala
  categories.sort((a, b) => {
    return a.text.localeCompare(b.text, 'tr', { sensitivity: 'base' })
  })
  
  return categories
}

export const useMenuPageStore = defineStore('menu-page-store', () => {
  const { t } = useI18n()

  const pinnedQuickAccessIds = ref([])

  const loadPinnedItems = () => {
    try {
      const stored = localStorage.getItem('pinned-quick-access')
      if (stored) {
        pinnedQuickAccessIds.value = JSON.parse(stored)
      }
    } catch (error) {
      logger.error('Error loading pinned items:', error)
    }
  }

  loadPinnedItems()

  watch(pinnedQuickAccessIds, (newValue) => {
    try {
      localStorage.setItem('pinned-quick-access', JSON.stringify(newValue))
    } catch (error) {
      logger.error('Error saving pinned items:', error)
    }
  }, { deep: true })

  // menu-data.json'dan menüyü oluştur
  const dynamicMenu = buildMenuFromData()
  
  // Yardım ve Destek kategorisini manuel ekle
  const helpSupportCategory = {
    id: 'help-support',
    translationKey: 'menuPage.categories.helpSupport',
    icon: "bi bi-question-circle",
    items: [
      { id: 'user-guide', translationKey: 'menuPage.items.userGuide', icon: "bi bi-book", route: '/kullanim-kilavuzu', quickAccess: false },
      { id: 'faq', translationKey: 'menuPage.items.faq', icon: "bi bi-question-circle-fill", route: '/sss', quickAccess: false },
      { id: 'support-requests', translationKey: 'menuPage.items.supportRequests', icon: "bi bi-headset", route: '/destek-talepleri', quickAccess: false },
      { id: 'training-videos', translationKey: 'menuPage.items.trainingVideos', icon: "bi bi-play-circle", route: '/egitim-videolari', quickAccess: false },
      { id: 'contact', translationKey: 'menuPage.items.contact', icon: "bi bi-envelope", route: '/iletisim', quickAccess: false }
    ]
  }

  const originalMenuData = ref({
    menu: [...dynamicMenu, helpSupportCategory]
  })

  const translatedMenuData = computed(() => {
    return originalMenuData.value.menu.map(category => ({
      ...category,
      // Eğer translationKey varsa çevir, yoksa text'i kullan
      text: category.translationKey ? t(category.translationKey) : category.text,
      items: category.items.map(item => ({
        ...item,
        // Eğer translationKey varsa çevir, yoksa text'i kullan
        text: item.translationKey ? t(item.translationKey) : item.text
      }))
    }))
  })

  const quickAccessItems = computed(() => {
    const allItems = []
    originalMenuData.value.menu.forEach(category => {
      category.items.forEach(item => {
        if (item.quickAccess === true) {
          allItems.push({
            ...item,
            text: item.translationKey ? t(item.translationKey) : item.text,
            pinned: pinnedQuickAccessIds.value.includes(item.id)
          })
        }
      })
    })
    return allItems
  })

  const pinnedQuickAccessItems = computed(() => {
    return quickAccessItems.value.filter(item => item.pinned)
  })

  const togglePinQuickAccess = (itemId) => {
    const index = pinnedQuickAccessIds.value.indexOf(itemId)
    if (index > -1) {
      pinnedQuickAccessIds.value.splice(index, 1)
    } else {
      pinnedQuickAccessIds.value.push(itemId)
    }
  }

  const isItemPinned = (itemId) => {
    return pinnedQuickAccessIds.value.includes(itemId)
  }

  const toggleQuickAccess = (itemId) => {
    for (const category of originalMenuData.value.menu) {
      const item = category.items.find(i => i.id === itemId)
      if (item) {
        item.quickAccess = !item.quickAccess
        
        if (!item.quickAccess && pinnedQuickAccessIds.value.includes(itemId)) {
          const index = pinnedQuickAccessIds.value.indexOf(itemId)
          pinnedQuickAccessIds.value.splice(index, 1)
        }
        
        try {
          localStorage.setItem('menu-quick-access', JSON.stringify(
            originalMenuData.value.menu.flatMap(cat => 
              cat.items
                .filter(i => i.quickAccess)
                .map(i => i.id)
            )
          ))
        } catch (error) {
          logger.error('Error saving quick access items:', error)
        }
        
        break
      }
    }
  }

  const loadQuickAccessState = () => {
    try {
      const stored = localStorage.getItem('menu-quick-access')
      if (stored) {
        const quickAccessIds = JSON.parse(stored)
        
      }
    } catch (error) {
      logger.error('Error loading quick access state:', error)
    }
  }

  loadQuickAccessState()

  return {
    originalMenuData,
    translatedMenuData,
    quickAccessItems,
    pinnedQuickAccessItems,
    togglePinQuickAccess,
    isItemPinned,
    toggleQuickAccess
  }
}, {
  persist: {
    key: 'sompo-menu-page',
    storage: localStorage,
    paths: ['quickAccessItems', 'pinnedQuickAccessItems']
  }
})