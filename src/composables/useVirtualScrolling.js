import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Virtual Scrolling Composable - Discord Style
 * 
 * Handles large lists efficiently by only rendering visible items
 * Similar to Discord's message virtualization
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.items - Array of items to virtualize
 * @param {Number} options.itemHeight - Height of each item in pixels
 * @param {Number} options.containerHeight - Height of scroll container
 * @param {Number} options.buffer - Buffer items to render outside viewport
 * @returns {Object} Virtual scrolling state and methods
 */
export function useVirtualScrolling(options = {}) {
  const {
    items = ref([]),
    itemHeight = 50,
    containerHeight = 400,
    buffer = 5
  } = options

  // State
  const scrollTop = ref(0)
  const containerRef = ref(null)
  const isScrolling = ref(false)
  const scrollTimeout = ref(null)

  // Performance optimizations
  const lastScrollTime = ref(0)
  const scrollVelocity = ref(0)

  // Computed properties
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.value.length
    )
    
    return {
      start: Math.max(0, start - buffer),
      end: Math.min(items.value.length, end + buffer)
    }
  })

  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.value.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
      offsetY: (start + index) * itemHeight
    }))
  })

  const totalHeight = computed(() => items.value.length * itemHeight)

  const offsetY = computed(() => visibleRange.value.start * itemHeight)

  // Methods
  const handleScroll = (event) => {
    const newScrollTop = event.target.scrollTop
    const currentTime = performance.now()
    
    // Calculate scroll velocity for performance insights
    if (lastScrollTime.value > 0) {
      const timeDelta = currentTime - lastScrollTime.value
      const scrollDelta = Math.abs(newScrollTop - scrollTop.value)
      scrollVelocity.value = scrollDelta / timeDelta
    }
    
    scrollTop.value = newScrollTop
    lastScrollTime.value = currentTime
    isScrolling.value = true

    // Clear previous timeout
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }

    // Set scrolling to false after scroll ends
    scrollTimeout.value = setTimeout(() => {
      isScrolling.value = false
      scrollVelocity.value = 0
    }, 150)
  }

  const scrollToItem = (index) => {
    if (!containerRef.value) return
    
    const targetScrollTop = index * itemHeight
    containerRef.value.scrollTop = targetScrollTop
  }

  const scrollToTop = () => {
    scrollToItem(0)
  }

  const scrollToBottom = () => {
    scrollToItem(items.value.length - 1)
  }

  // Performance monitoring
  const getPerformanceMetrics = () => {
    return {
      visibleItemCount: visibleItems.value.length,
      totalItemCount: items.value.length,
      renderRatio: visibleItems.value.length / items.value.length,
      scrollVelocity: scrollVelocity.value,
      isScrolling: isScrolling.value,
      memoryUsage: visibleItems.value.length * itemHeight // Approximate
    }
  }

  // Lifecycle
  const observeResize = () => {
    if (!containerRef.value) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        if (height !== containerHeight) {
          // Update container height if needed
          options.containerHeight = height
        }
      }
    })

    resizeObserver.observe(containerRef.value)
    
    return () => resizeObserver.disconnect()
  }

  let cleanup = null

  onMounted(() => {
    cleanup = observeResize()
  })

  onUnmounted(() => {
    if (cleanup) cleanup()
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
  })

  return {
    // Refs
    containerRef,
    
    // State
    scrollTop,
    isScrolling,
    
    // Computed
    visibleItems,
    visibleRange,
    totalHeight,
    offsetY,
    
    // Methods
    handleScroll,
    scrollToItem,
    scrollToTop,
    scrollToBottom,
    getPerformanceMetrics,
    
    // Performance data
    scrollVelocity
  }
} 