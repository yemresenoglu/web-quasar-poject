import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('MenuStore')

/**
 * Menu Store
 * MenuPage.vue için merkezi state management
 * Manages search, context menu, loading, and menu interactions
 */
export const useMenuStore = defineStore('menu', () => {
  // ===== STATE =====
  
  // Loading state
  const isLoading = ref(true)
  
  // Search state
  const searchQuery = ref('')
  
  // Context menu state
  const showContextMenu = ref(false)
  const selectedItem = ref(null)
  const hoveredItem = ref(null)
  const contextMenuPosition = ref({ x: 0, y: 0 })
  
  // ===== COMPUTED =====
  
  /**
   * Context menu positioning styles
   * @returns {Object} CSS style object for context menu
   */
  const contextMenuStyle = computed(() => ({
    position: 'fixed',
    left: `${contextMenuPosition.value.x}px`,
    top: `${contextMenuPosition.value.y}px`,
    zIndex: 9999
  }))
  
  // ===== ACTIONS =====
  
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
        y: event.clientY
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
  
  // --- Utility Actions ---
  
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
    // State
    isLoading,
    searchQuery,
    showContextMenu,
    selectedItem,
    hoveredItem,
    contextMenuPosition,
    
    // Computed
    contextMenuStyle,
    
    // Actions
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
    resetStore
  }
})
