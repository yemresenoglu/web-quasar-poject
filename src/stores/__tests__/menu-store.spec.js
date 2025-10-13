import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMenuStore } from '../menu-store'

describe('Menu Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const store = useMenuStore()

      expect(store.isLoading).toBe(true)
      expect(store.searchQuery).toBe('')
      expect(store.showContextMenu).toBe(false)
      expect(store.selectedItem).toBe(null)
      expect(store.hoveredItem).toBe(null)
      expect(store.contextMenuPosition).toEqual({ x: 0, y: 0 })
    })
  })

  describe('Loading Actions', () => {
    it('should start loading with default delay', () => {
      const store = useMenuStore()
      
      store.stopLoading() // First stop
      expect(store.isLoading).toBe(false)
      
      store.startLoading()
      expect(store.isLoading).toBe(true)
      
      vi.advanceTimersByTime(600)
      expect(store.isLoading).toBe(false)
    })

    it('should start loading with custom delay', () => {
      const store = useMenuStore()
      
      store.stopLoading()
      store.startLoading(1000)
      expect(store.isLoading).toBe(true)
      
      vi.advanceTimersByTime(999)
      expect(store.isLoading).toBe(true)
      
      vi.advanceTimersByTime(1)
      expect(store.isLoading).toBe(false)
    })

    it('should stop loading', () => {
      const store = useMenuStore()
      
      store.isLoading = true
      store.stopLoading()
      expect(store.isLoading).toBe(false)
    })

    it('should set loading state directly', () => {
      const store = useMenuStore()
      
      store.setLoading(false)
      expect(store.isLoading).toBe(false)
      
      store.setLoading(true)
      expect(store.isLoading).toBe(true)
    })
  })

  describe('Search Actions', () => {
    it('should set search query', () => {
      const store = useMenuStore()
      
      store.setSearchQuery('test query')
      expect(store.searchQuery).toBe('test query')
    })

    it('should clear search query', () => {
      const store = useMenuStore()
      
      store.setSearchQuery('test query')
      expect(store.searchQuery).toBe('test query')
      
      store.clearSearch()
      expect(store.searchQuery).toBe('')
    })

    it('should update search query multiple times', () => {
      const store = useMenuStore()
      
      store.setSearchQuery('first')
      expect(store.searchQuery).toBe('first')
      
      store.setSearchQuery('second')
      expect(store.searchQuery).toBe('second')
      
      store.setSearchQuery('third')
      expect(store.searchQuery).toBe('third')
    })
  })

  describe('Context Menu Actions', () => {
    it('should open context menu', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      const mockEvent = {
        clientX: 100,
        clientY: 200,
        preventDefault: vi.fn()
      }
      
      // Set hovered item first (requirement for context menu)
      store.setHoveredItem(mockItem)
      
      store.openContextMenu(mockEvent, mockItem)
      
      expect(store.showContextMenu).toBe(true)
      expect(store.selectedItem).toEqual(mockItem)
      expect(store.contextMenuPosition).toEqual({ x: 100, y: 200 })
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should not open context menu if item not hovered', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      const mockEvent = {
        clientX: 100,
        clientY: 200,
        preventDefault: vi.fn()
      }
      
      // Don't set hovered item
      store.openContextMenu(mockEvent, mockItem)
      
      expect(store.showContextMenu).toBe(false)
      expect(store.selectedItem).toBe(null)
    })

    it('should close context menu', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      const mockEvent = {
        clientX: 100,
        clientY: 200,
        preventDefault: vi.fn()
      }
      
      store.setHoveredItem(mockItem)
      store.openContextMenu(mockEvent, mockItem)
      
      expect(store.showContextMenu).toBe(true)
      expect(store.selectedItem).not.toBe(null)
      
      store.closeContextMenu()
      
      expect(store.showContextMenu).toBe(false)
      expect(store.selectedItem).toBe(null)
    })

    it('should prevent global context menu when item is hovered', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      const mockEvent = {
        preventDefault: vi.fn()
      }
      
      store.setHoveredItem(mockItem)
      store.handleGlobalContextMenu(mockEvent)
      
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should allow global context menu when no item is hovered', () => {
      const store = useMenuStore()
      const mockEvent = {
        preventDefault: vi.fn()
      }
      
      store.handleGlobalContextMenu(mockEvent)
      
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('Item Interaction Actions', () => {
    it('should handle item hover', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      store.handleItemHover(mockItem)
      expect(store.hoveredItem).toEqual(mockItem)
    })

    it('should handle item leave', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      store.handleItemHover(mockItem)
      expect(store.hoveredItem).toEqual(mockItem)
      
      store.handleItemLeave()
      expect(store.hoveredItem).toBe(null)
    })

    it('should set selected item', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      store.setSelectedItem(mockItem)
      expect(store.selectedItem).toEqual(mockItem)
    })

    it('should set hovered item', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      store.setHoveredItem(mockItem)
      expect(store.hoveredItem).toEqual(mockItem)
    })

    it('should clear selection', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      store.setSelectedItem(mockItem)
      store.setHoveredItem(mockItem)
      
      expect(store.selectedItem).toEqual(mockItem)
      expect(store.hoveredItem).toEqual(mockItem)
      
      store.clearSelection()
      
      expect(store.selectedItem).toBe(null)
      expect(store.hoveredItem).toBe(null)
    })
  })

  describe('Computed Properties', () => {
    it('should compute context menu style', () => {
      const store = useMenuStore()
      
      store.contextMenuPosition = { x: 150, y: 250 }
      
      const style = store.contextMenuStyle
      expect(style).toEqual({
        position: 'fixed',
        left: '150px',
        top: '250px',
        zIndex: 9999
      })
    })

    it('should update context menu style when position changes', () => {
      const store = useMenuStore()
      
      store.contextMenuPosition = { x: 100, y: 200 }
      expect(store.contextMenuStyle.left).toBe('100px')
      expect(store.contextMenuStyle.top).toBe('200px')
      
      store.contextMenuPosition = { x: 300, y: 400 }
      expect(store.contextMenuStyle.left).toBe('300px')
      expect(store.contextMenuStyle.top).toBe('400px')
    })
  })

  describe('Utility Actions', () => {
    it('should reset store to initial state', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      // Modify all values
      store.setLoading(false)
      store.setSearchQuery('test')
      store.setHoveredItem(mockItem)
      store.setSelectedItem(mockItem)
      store.showContextMenu = true
      store.contextMenuPosition = { x: 100, y: 200 }
      
      // Reset
      store.resetStore()
      
      // Verify reset
      expect(store.isLoading).toBe(true)
      expect(store.searchQuery).toBe('')
      expect(store.showContextMenu).toBe(false)
      expect(store.selectedItem).toBe(null)
      expect(store.hoveredItem).toBe(null)
      expect(store.contextMenuPosition).toEqual({ x: 0, y: 0 })
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle complete context menu workflow', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      const mockEvent = {
        clientX: 100,
        clientY: 200,
        preventDefault: vi.fn()
      }
      
      // 1. Hover item
      store.handleItemHover(mockItem)
      expect(store.hoveredItem).toEqual(mockItem)
      
      // 2. Open context menu
      store.openContextMenu(mockEvent, mockItem)
      expect(store.showContextMenu).toBe(true)
      expect(store.selectedItem).toEqual(mockItem)
      
      // 3. Close context menu
      store.closeContextMenu()
      expect(store.showContextMenu).toBe(false)
      expect(store.selectedItem).toBe(null)
      
      // 4. Leave item
      store.handleItemLeave()
      expect(store.hoveredItem).toBe(null)
    })

    it('should handle search with loading', () => {
      const store = useMenuStore()
      
      store.startLoading()
      expect(store.isLoading).toBe(true)
      
      store.setSearchQuery('search term')
      expect(store.searchQuery).toBe('search term')
      
      vi.advanceTimersByTime(600)
      expect(store.isLoading).toBe(false)
      
      store.clearSearch()
      expect(store.searchQuery).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null item in setSelectedItem', () => {
      const store = useMenuStore()
      const mockItem = { id: 1, text: 'Test Item' }
      
      store.setSelectedItem(mockItem)
      expect(store.selectedItem).toEqual(mockItem)
      
      store.setSelectedItem(null)
      expect(store.selectedItem).toBe(null)
    })

    it('should handle empty search query', () => {
      const store = useMenuStore()
      
      store.setSearchQuery('')
      expect(store.searchQuery).toBe('')
      
      store.setSearchQuery('   ')
      expect(store.searchQuery).toBe('   ')
    })

    it('should handle multiple context menu opens', () => {
      const store = useMenuStore()
      const mockItem1 = { id: 1, text: 'Item 1' }
      const mockItem2 = { id: 2, text: 'Item 2' }
      const mockEvent = {
        clientX: 100,
        clientY: 200,
        preventDefault: vi.fn()
      }
      
      // Open for item 1
      store.setHoveredItem(mockItem1)
      store.openContextMenu(mockEvent, mockItem1)
      expect(store.selectedItem).toEqual(mockItem1)
      
      // Open for item 2 (without closing first)
      mockEvent.clientX = 150
      mockEvent.clientY = 250
      store.setHoveredItem(mockItem2)
      store.openContextMenu(mockEvent, mockItem2)
      expect(store.selectedItem).toEqual(mockItem2)
      expect(store.contextMenuPosition).toEqual({ x: 150, y: 250 })
    })
  })
})

