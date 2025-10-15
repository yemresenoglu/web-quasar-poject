import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createLogger } from 'src/utils/logger.js'
import { getMenuCategories } from 'src/data/menu-mock-data.js'
import { menuApiModule } from 'src/api/modules/menu-api.js'

const logger = createLogger('MenuPageStore')

// API'den menü yapısını al
const buildMenuFromData = async () => {
  try {
    logger.info('Fetching menu data from backend API')
    
    // Mock data kullanımı - geliştirme ortamında
    if (process.env.NODE_ENV === 'development') {
      logger.info('Using mock menu data for development')
      const mockCategories = getMenuCategories()
      logger.info('Mock menu data loaded successfully:', mockCategories.length, 'categories')
      return mockCategories
    }
    
    // TODO: Backend API'den menü verilerini al
    // const result = await menuApiModule.getMenuData()
    // return result.success ? result.data : []
    
    // Hata durumunda mock data kullan
    logger.info('Falling back to mock menu data')
    return getMenuCategories()
  } catch (error) {
    logger.error('Menu data fetch failed:', error)
    
    // Hata durumunda mock data kullan
    logger.info('Using mock menu data due to error')
    return getMenuCategories()
  }
}

export const useMenuPageStore = defineStore(
  'menu-page-store',
  () => {
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

    watch(
      pinnedQuickAccessIds,
      (newValue) => {
        try {
          localStorage.setItem('pinned-quick-access', JSON.stringify(newValue))
        } catch (error) {
          logger.error('Error saving pinned items:', error)
        }
      },
      { deep: true },
    )

    // Menü verilerini API'den al
    const originalMenuData = ref({
      menu: [],
    })

    // Menü verilerini yükle
    const loadMenuData = async () => {
      try {
        const dynamicMenu = await buildMenuFromData()
        
        // Yardım ve Destek kategorisini manuel ekle (static)
        const helpSupportCategory = {
          id: 'help-support',
          translationKey: 'menuPage.categories.helpSupport',
          icon: 'bi bi-question-circle',
          items: [
            {
              id: 'user-guide',
              translationKey: 'menuPage.items.userGuide',
              icon: 'bi bi-book',
              route: '/kullanim-kilavuzu',
              quickAccess: false,
            },
            {
              id: 'faq',
              translationKey: 'menuPage.items.faq',
              icon: 'bi bi-question-circle-fill',
              route: '/sss',
              quickAccess: false,
            },
            {
              id: 'support-requests',
              translationKey: 'menuPage.items.supportRequests',
              icon: 'bi bi-headset',
              route: '/destek-talepleri',
              quickAccess: false,
            },
            {
              id: 'training-videos',
              translationKey: 'menuPage.items.trainingVideos',
              icon: 'bi bi-play-circle',
              route: '/egitim-videolari',
              quickAccess: false,
            },
            {
              id: 'contact',
              translationKey: 'menuPage.items.contact',
              icon: 'bi bi-envelope',
              route: '/iletisim',
              quickAccess: false,
            },
          ],
        }
        
        originalMenuData.value.menu = [...dynamicMenu, helpSupportCategory]
      } catch (error) {
        logger.error('Menu data load failed:', error)
      }
    }

    // İlk yükleme
    loadMenuData()

    const translatedMenuData = computed(() => {
      return originalMenuData.value.menu.map((category) => ({
        ...category,
        // Eğer translationKey varsa çevir, yoksa text'i kullan
        text: category.translationKey ? t(category.translationKey) : category.text,
        items: category.items.map((item) => ({
          ...item,
          // Eğer translationKey varsa çevir, yoksa text'i kullan
          text: item.translationKey ? t(item.translationKey) : item.text,
        })),
      }))
    })

    const quickAccessItems = computed(() => {
      const allItems = []
      originalMenuData.value.menu.forEach((category) => {
        category.items.forEach((item) => {
          if (item.quickAccess === true) {
            allItems.push({
              ...item,
              text: item.translationKey ? t(item.translationKey) : item.text,
              pinned: pinnedQuickAccessIds.value.includes(item.id),
            })
          }
        })
      })
      return allItems
    })

    const pinnedQuickAccessItems = computed(() => {
      return quickAccessItems.value.filter((item) => item.pinned)
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
        const item = category.items.find((i) => i.id === itemId)
        if (item) {
          item.quickAccess = !item.quickAccess

          if (!item.quickAccess && pinnedQuickAccessIds.value.includes(itemId)) {
            const index = pinnedQuickAccessIds.value.indexOf(itemId)
            pinnedQuickAccessIds.value.splice(index, 1)
          }

          try {
            localStorage.setItem(
              'menu-quick-access',
              JSON.stringify(
                originalMenuData.value.menu.flatMap((cat) =>
                  cat.items.filter((i) => i.quickAccess).map((i) => i.id),
                ),
              ),
            )
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
          // TODO: Process quick access IDs from localStorage
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
      toggleQuickAccess,
    }
  },
  {
    persist: {
      key: 'sompo-menu-page',
      storage: localStorage,
      paths: ['quickAccessItems', 'pinnedQuickAccessItems'],
    },
  },
)
