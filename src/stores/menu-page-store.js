import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { createLogger } from 'src/utils/logger.js'
import { getUserMenuData } from 'src/data/menu-mock-data.js'
// import { getMenuCategories } from 'src/data/menu-mock-data.js'
// import { menuApiModule } from 'src/api/modules/menu-api.js'
import { useAuthStore } from './auth-store.js'
import { useAccountStore } from './account-store.js'
import { shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

const logger = createLogger('MenuPageStore')

// API'den menü yapısını al
const buildMenuFromData = async (userOid) => {
  if (!userOid) {
    logger.error('UserOid is required for menu data')
    return []
  }

  try {
    logger.info('Fetching menu data from backend API', { userOid })

    // Kullanıcı bilgilerini al
    const authStore = useAuthStore()
    const accountStore = useAccountStore()

    const selectedBirimLabel =
      accountStore.userProfile?.selectedBirimLabel ||
      authStore.user?.selectedBirimLabel ||
      'Arabuluculuk'
    const selectedGörevLabel =
      accountStore.userProfile?.selectedGörevLabel ||
      authStore.user?.selectedGörevLabel ||
      'Arabulucu'

    // Environment-based API call strategy
    if (shouldUseMockData()) {
      logger.info('Using user-specific mock menu data for development', {
        userOid,
        selectedBirimLabel,
        selectedGörevLabel,
        environment: getEnvironmentInfo().environment,
      })

      const userMenuData = getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)

      logger.info('User-specific mock menu data loaded successfully:', {
        userOid,
        selectedBirimLabel,
        selectedGörevLabel,
        categoriesCount: userMenuData.length,
      })

      return userMenuData
    }

    // BACKEND INTEGRATION - Gerçek API çağrısı
    /*
    try {
      logger.info('Attempting backend getMenuData', { userOid })
      const result = await menuApiModule.getMenuData(userOid)
      
      if (result.success && result.data) {
        logger.info('Backend menu data loaded successfully', { 
          userOid, 
          categoriesCount: result.data?.categories?.length || 0 
        })
        return result.data.categories || []
      } else {
        logger.warn('Backend getMenuData failed, falling back to mock data', { 
          userOid, 
          error: result.error 
        })
        
        // Fallback to mock data
        const userMenuData = getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)
        return userMenuData
      }
    } catch (apiError) {
      logger.error('Backend API getMenuData error, falling back to mock data:', {
        error: apiError.message,
        userOid
      })
      
      // Fallback to mock data
      const userMenuData = getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)
      return userMenuData
    }
    */

    // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
    logger.info('Backend integration disabled - using mock data for getMenuData')
    const userMenuData = getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)
    return userMenuData
  } catch (error) {
    logger.error('Menu data fetch failed:', error, { userOid })

    // Hata durumunda kullanıcı bazlı mock data kullan
    logger.info('Using user-specific mock menu data due to error', { userOid })
    const authStore = useAuthStore()
    const accountStore = useAccountStore()

    const selectedBirimLabel =
      accountStore.userProfile?.selectedBirimLabel ||
      authStore.user?.selectedBirimLabel ||
      'Arabuluculuk'
    const selectedGörevLabel =
      accountStore.userProfile?.selectedGörevLabel ||
      authStore.user?.selectedGörevLabel ||
      'Arabulucu'

    return getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)
  }
}

export const useMenuPageStore = defineStore(
  'menu-page-store',
  () => {
    // ===== MENU DATA STATE =====
    const pinnedQuickAccessIds = ref([])

    // ===== UI STATE (menu-store'den taşındı) =====

    // Loading state
    const isLoading = ref(true)

    // Search state
    const searchQuery = ref('')

    // Context menu state
    const showContextMenu = ref(false)
    const selectedItem = ref(null)
    const hoveredItem = ref(null)
    const contextMenuPosition = ref({ x: 0, y: 0 })

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
    const loadMenuData = async (userOid) => {
      if (!userOid) {
        logger.error('UserOid is required for loading menu data')
        return
      }

      try {
        // Önce AuthStore'dan menu verilerini kontrol et
        const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')

        if (authUser.oid === userOid && authUser.menuItems && authUser.menuItems.length > 0) {
          logger.info('Loading menu data from AuthStore', { userOid }, 'store')
          originalMenuData.value.menu = authUser.menuItems
          return
        }

        // Eğer AuthStore'da yoksa, ayrı localStorage'dan kontrol et
        const storedMenuData = localStorage.getItem(`menu_data_${userOid}`)
        if (storedMenuData) {
          logger.info('Loading menu data from separate localStorage', { userOid }, 'store')
          const parsedData = JSON.parse(storedMenuData)
          originalMenuData.value.menu = parsedData
          return
        }
        const dynamicMenu = await buildMenuFromData(userOid)

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
              route: '/home/kullanim-kilavuzu',
              quickAccess: false,
            },
            {
              id: 'faq',
              translationKey: 'menuPage.items.faq',
              icon: 'bi bi-question-circle-fill',
              route: '/home/sss',
              quickAccess: false,
            },
            {
              id: 'support-requests',
              translationKey: 'menuPage.items.supportRequests',
              icon: 'bi bi-headset',
              route: '/home/destek-talepleri',
              quickAccess: false,
            },
            {
              id: 'training-videos',
              translationKey: 'menuPage.items.trainingVideos',
              icon: 'bi bi-play-circle',
              route: '/home/egitim-videolari',
              quickAccess: false,
            },
            {
              id: 'contact',
              translationKey: 'menuPage.items.contact',
              icon: 'bi bi-envelope',
              route: '/home/iletisim',
              quickAccess: false,
            },
          ],
        }

        originalMenuData.value.menu = [...dynamicMenu, helpSupportCategory]

        // AuthStore'daki user object'i güncelle (menu verilerini ekle)
        const authUserData = JSON.parse(localStorage.getItem('auth_user') || '{}')
        if (authUserData.oid === userOid) {
          authUserData.menuItems = originalMenuData.value.menu
          authUserData.menuTotalCount = originalMenuData.value.menu.length
          localStorage.setItem('auth_user', JSON.stringify(authUserData))
          logger.info('Menu data updated in AuthStore', { userOid }, 'store')
        }

        // Ayrı localStorage'a da kaydet (backward compatibility)
        localStorage.setItem(`menu_data_${userOid}`, JSON.stringify(originalMenuData.value.menu))

        logger.info('Menu data loaded successfully', {
          userOid,
          categoriesCount: originalMenuData.value.menu.length,
        })
      } catch (error) {
        logger.error('Menu data load failed:', error, { userOid })
      }
    }

    // İlk yükleme - userOid olmadan mock data ile başla
    // loadMenuData() // TODO: User login olduktan sonra çağrılacak

    // ===== COMPUTED PROPERTIES =====

    // Raw menu data - translation'lar component seviyesinde yapılacak
    const menuData = computed(() => originalMenuData.value.menu)

    /**
     * Context menu positioning styles
     * @returns {Object} CSS style object for context menu
     */
    const contextMenuStyle = computed(() => ({
      position: 'fixed',
      left: `${contextMenuPosition.value.x}px`,
      top: `${contextMenuPosition.value.y}px`,
      zIndex: 9999,
    }))

    const quickAccessItems = computed(() => {
      const allItems = []
      originalMenuData.value.menu.forEach((category) => {
        category.items.forEach((item) => {
          if (item.quickAccess === true) {
            allItems.push({
              ...item,
              // Translation component seviyesinde yapılacak
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

    const clearMenuCache = (userOid) => {
      try {
        // AuthStore'daki menu cache'ini temizle
        const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
        if (authUser.oid === userOid) {
          delete authUser.menuItems
          localStorage.setItem('auth_user', JSON.stringify(authUser))
        }

        // Ayrı menu cache'ini temizle
        localStorage.removeItem(`menu_data_${userOid}`)

        // Store state'ini temizle
        originalMenuData.value.menu = []

        logger.info('Menu cache cleared successfully', { userOid }, 'store')
      } catch (error) {
        logger.error('Failed to clear menu cache:', error, { userOid }, 'store')
      }
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

    // ===== UI ACTIONS (menu-store'den taşındı) =====

    // --- Loading Actions ---

    /**
     * Start loading simulation
     * @param {number} delay - Loading delay in ms (default: 600ms)
     */
    const startLoading = (delay = 600) => {
      isLoading.value = true
      logger.info('Menu loading started')

      setTimeout(() => {
        stopLoading()
      }, delay)
    }

    /**
     * Stop loading
     */
    const stopLoading = () => {
      isLoading.value = false
      logger.info('Menu loading completed')
    }

    /**
     * Set loading state directly
     * @param {boolean} state - Loading state
     */
    const setLoading = (state) => {
      isLoading.value = state
      logger.info('Menu loading state changed:', state)
    }

    // --- Search Actions ---

    /**
     * Set search query
     * @param {string} query - Search query string
     */
    const setSearchQuery = (query) => {
      searchQuery.value = query
      logger.info('Search query updated:', query)
    }

    /**
     * Clear search query
     */
    const clearSearch = () => {
      searchQuery.value = ''
      logger.info('Search cleared')
    }

    // --- Context Menu Actions ---

    /**
     * Open context menu at specific position
     * @param {MouseEvent} event - Mouse event
     * @param {Object} item - Menu item object
     */
    const openContextMenu = (event, item) => {
      // Sadece hover durumunda context menu aç
      if (hoveredItem.value && hoveredItem.value.id === item.id) {
        event.preventDefault() // Browser context menu'yu engelle
        selectedItem.value = item
        contextMenuPosition.value = {
          x: event.clientX,
          y: event.clientY,
        }
        showContextMenu.value = true
        logger.info('Context menu opened for item:', item.id, item.text)
      }
    }

    /**
     * Close context menu
     */
    const closeContextMenu = () => {
      showContextMenu.value = false
      selectedItem.value = null
      logger.info('Context menu closed')
    }

    /**
     * Handle global context menu
     * @param {MouseEvent} event - Mouse event
     */
    const handleGlobalContextMenu = (event) => {
      // Eğer menu item'lara hover yapılmışsa, global context menu'yu engelle
      if (hoveredItem.value) {
        event.preventDefault()
        return
      }

      // Normal browser context menu'ya izin ver
      logger.info('Global context menu: browser default')
    }

    // --- Item Interaction Actions ---

    /**
     * Handle item hover
     * @param {Object} item - Menu item object
     */
    const handleItemHover = (item) => {
      hoveredItem.value = item
    }

    /**
     * Handle item leave (mouse out)
     */
    const handleItemLeave = () => {
      hoveredItem.value = null
    }

    /**
     * Set selected item
     * @param {Object|null} item - Menu item object or null
     */
    const setSelectedItem = (item) => {
      selectedItem.value = item
      logger.info('Item selected:', item?.text || 'none')
    }

    /**
     * Set hovered item
     * @param {Object|null} item - Menu item object or null
     */
    const setHoveredItem = (item) => {
      hoveredItem.value = item
    }

    /**
     * Clear all selections
     */
    const clearSelection = () => {
      selectedItem.value = null
      hoveredItem.value = null
      logger.info('Selection cleared')
    }

    /**
     * Reset store to initial state
     */
    const resetStore = () => {
      isLoading.value = true
      searchQuery.value = ''
      showContextMenu.value = false
      selectedItem.value = null
      hoveredItem.value = null
      contextMenuPosition.value = { x: 0, y: 0 }
      logger.info('Menu store reset')
    }

    return {
      // Menu Data
      originalMenuData,
      menuData,
      quickAccessItems,
      pinnedQuickAccessItems,
      togglePinQuickAccess,
      isItemPinned,
      toggleQuickAccess,
      loadMenuData,
      clearMenuCache,

      // UI State
      isLoading,
      searchQuery,
      showContextMenu,
      selectedItem,
      hoveredItem,
      contextMenuPosition,

      // Computed
      contextMenuStyle,

      // UI Actions
      // Loading
      startLoading,
      stopLoading,
      setLoading,

      // Search
      setSearchQuery,
      clearSearch,

      // Context Menu
      openContextMenu,
      closeContextMenu,
      handleGlobalContextMenu,

      // Item Interactions
      handleItemHover,
      handleItemLeave,
      setSelectedItem,
      setHoveredItem,
      clearSelection,

      // Utility
      resetStore,
    }
  },
  {
    persist: {
      key: 'sompo-menu-page',
      storage: localStorage,
      paths: ['quickAccessItems', 'pinnedQuickAccessItems', 'pinnedQuickAccessIds'],
    },
  },
)
