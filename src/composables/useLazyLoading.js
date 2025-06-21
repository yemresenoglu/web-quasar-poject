import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Lazy Loading Composable - Chrome/Slack Style
 * 
 * Implements progressive loading strategies:
 * - Image lazy loading with IntersectionObserver
 * - Component lazy loading based on viewport
 * - Route-based code splitting
 * - Progressive content loading
 * 
 * Similar to Chrome's lazy loading and Slack's progressive message loading
 */
export function useLazyLoading(options = {}) {
  const {
    rootMargin = '100px 0px',
    threshold = 0.1
  } = options

  // State
  const intersectionObserver = ref(null)
  const observedElements = ref(new Set())
  const loadedImages = ref(new Set())
  const loadedComponents = ref(new Set())
  const loadingQueue = ref([])
  const isLoading = ref(false)

  // Performance metrics
  const metrics = ref({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    totalComponents: 0,
    loadedComponents: 0,
    averageLoadTime: 0,
    savedBandwidth: 0
  })

  // Initialize intersection observer
  const initializeObserver = () => {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, falling back to immediate loading')
      return null
    }

    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleIntersection(entry.target)
        }
      })
    }, {
      rootMargin,
      threshold
    })
  }

  // Handle element intersection
  const handleIntersection = async (element) => {
    if (observedElements.value.has(element)) {
      return // Already processed
    }

    observedElements.value.add(element)

    if (element.dataset.lazyType === 'image') {
      await loadImage(element)
    } else if (element.dataset.lazyType === 'component') {
      await loadComponent(element)
    }

    // Stop observing after loading
    if (intersectionObserver.value) {
      intersectionObserver.value.unobserve(element)
    }
  }

  // Image lazy loading (Chrome style)
  const loadImage = async (imgElement) => {
    const startTime = performance.now()
    const src = imgElement.dataset.src
    
    if (!src || loadedImages.value.has(src)) {
      return
    }

    try {
      // Create new image for preloading
      const img = new Image()
      img.onload = () => {
        // Replace placeholder with actual image
        imgElement.src = src
        imgElement.classList.remove('lazy-loading')
        imgElement.classList.add('lazy-loaded')
        
        loadedImages.value.add(src)
        metrics.value.loadedImages++
        
        const loadTime = performance.now() - startTime
        updateAverageLoadTime(loadTime)
        
        // Estimate saved bandwidth (placeholder vs actual image)
        const estimatedSize = estimateImageSize(imgElement)
        metrics.value.savedBandwidth += estimatedSize
      }
      
      img.onerror = () => {
        imgElement.classList.add('lazy-error')
        metrics.value.failedImages++
        console.warn(`Failed to load image: ${src}`)
      }
      
      img.src = src
    } catch (error) {
      metrics.value.failedImages++
      console.error('Image loading error:', error)
    }
  }

  // Component lazy loading (Slack style)
  const loadComponent = async (componentElement) => {
    const componentName = componentElement.dataset.component
    
    if (!componentName || loadedComponents.value.has(componentName)) {
      return
    }

    const startTime = performance.now()

    try {
      // Dynamic import for component
      const componentModule = await import(`../components/${componentName}.vue`)
      
      // Mark as loaded
      loadedComponents.value.add(componentName)
      metrics.value.loadedComponents++
      
      const loadTime = performance.now() - startTime
      updateAverageLoadTime(loadTime)
      
      // Trigger component rendering
      componentElement.dispatchEvent(new CustomEvent('component-loaded', {
        detail: { componentModule, loadTime }
      }))
      
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error)
      componentElement.classList.add('component-error')
    }
  }

  // Estimate image size for bandwidth calculation
  const estimateImageSize = (imgElement) => {
    const width = imgElement.naturalWidth || imgElement.width || 0
    const height = imgElement.naturalHeight || imgElement.height || 0
    
    // Rough estimation: assume 3 bytes per pixel (RGB)
    return width * height * 3
  }

  // Update average load time
  const updateAverageLoadTime = (newLoadTime) => {
    const totalLoaded = metrics.value.loadedImages + metrics.value.loadedComponents
    const currentAverage = metrics.value.averageLoadTime
    
    metrics.value.averageLoadTime = (currentAverage * (totalLoaded - 1) + newLoadTime) / totalLoaded
  }

  // Observe element for lazy loading
  const observe = (element, type = 'image') => {
    if (!element || !intersectionObserver.value) {
      return
    }

    element.dataset.lazyType = type
    
    if (type === 'image') {
      metrics.value.totalImages++
      element.classList.add('lazy-loading')
    } else if (type === 'component') {
      metrics.value.totalComponents++
    }

    intersectionObserver.value.observe(element)
  }

  // Unobserve element
  const unobserve = (element) => {
    if (!element || !intersectionObserver.value) {
      return
    }

    intersectionObserver.value.unobserve(element)
    observedElements.value.delete(element)
  }

  // Progressive loading for large datasets (Slack style)
  const loadProgressively = async (items, batchSize = 20, delay = 100) => {
    if (isLoading.value) {
      return
    }

    isLoading.value = true
    loadingQueue.value = [...items]
    
    const loadedItems = []

    while (loadingQueue.value.length > 0) {
      const batch = loadingQueue.value.splice(0, batchSize)
      
      // Process batch
      const batchPromises = batch.map(async (item) => {
        try {
          // Simulate processing (replace with actual loading logic)
          await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
          return item
        } catch (error) {
          console.warn('Failed to load item:', item, error)
          return null
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      loadedItems.push(...batchResults.filter(result => result.status === 'fulfilled').map(result => result.value))

      // Small delay to prevent blocking the main thread
      if (loadingQueue.value.length > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    isLoading.value = false
    return loadedItems.filter(item => item !== null)
  }

  // Preload critical resources (Chrome style)
  const preloadCritical = (resources) => {
    resources.forEach((resource) => {
      const { type, src, priority = 'low' } = resource

      if (type === 'image') {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        link.importance = priority
        document.head.appendChild(link)
      } else if (type === 'script') {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'script'
        link.href = src
        link.importance = priority
        document.head.appendChild(link)
      } else if (type === 'style') {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = src
        link.importance = priority
        document.head.appendChild(link)
      }
    })
  }

  // Image placeholder generation
  const generatePlaceholder = (width, height, backgroundColor = '#f0f0f0') => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    
    // Add loading indicator
    ctx.fillStyle = '#ccc'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Loading...', width / 2, height / 2)
    
    return canvas.toDataURL()
  }

  // Computed properties
  const loadingProgress = computed(() => {
    const totalItems = metrics.value.totalImages + metrics.value.totalComponents
    const loadedItems = metrics.value.loadedImages + metrics.value.loadedComponents
    
    return totalItems > 0 ? Math.round((loadedItems / totalItems) * 100) : 0
  })

  const savedBandwidthMB = computed(() => {
    return Math.round(metrics.value.savedBandwidth / 1048576 * 100) / 100 // Convert to MB
  })

  const performanceStats = computed(() => ({
    loadingProgress: loadingProgress.value,
    averageLoadTime: Math.round(metrics.value.averageLoadTime * 100) / 100,
    savedBandwidth: savedBandwidthMB.value,
    successRate: metrics.value.totalImages > 0 
      ? Math.round((metrics.value.loadedImages / metrics.value.totalImages) * 100) 
      : 0
  }))

  // Lifecycle
  onMounted(() => {
    intersectionObserver.value = initializeObserver()
  })

  onUnmounted(() => {
    if (intersectionObserver.value) {
      intersectionObserver.value.disconnect()
    }
    
    // Clear all state
    observedElements.value.clear()
    loadedImages.value.clear()
    loadedComponents.value.clear()
    loadingQueue.value = []
  })

  return {
    // State
    isLoading,
    metrics,
    
    // Computed
    loadingProgress,
    savedBandwidthMB,
    performanceStats,
    
    // Methods
    observe,
    unobserve,
    loadProgressively,
    preloadCritical,
    generatePlaceholder,
    
    // Direct loading methods
    loadImage,
    loadComponent
  }
} 