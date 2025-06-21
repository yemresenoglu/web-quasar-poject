import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Theme state
  const isDarkMode = ref(false)
  const accentColor = ref('#1976d2')
  const isHighContrast = ref(false)
  const currentTheme = ref('light')
  const currentWallpaper = ref(null)
  const dynamicColors = ref({
    primary: '#1976d2',
    secondary: '#26a69a',
    accent: '#9c27b0',
    surface: '#ffffff',
    background: '#fafafa'
  })

  // Wallpaper collections with CSS gradients as placeholders
  const wallpaperCollections = ref({
    classic: [
      {
        id: 'classic-1',
        name: 'Aurora',
        category: 'classic',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#ec4899',
          dominant: '#4c1d95'
        }
      },
      {
        id: 'classic-2',
        name: 'Ocean',
        category: 'classic',
        gradient: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
        colors: {
          primary: '#0ea5e9',
          secondary: '#06b6d4',
          accent: '#10b981',
          dominant: '#1e40af'
        }
      },
      {
        id: 'classic-3',
        name: 'Sunset',
        category: 'classic',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        colors: {
          primary: '#f97316',
          secondary: '#eab308',
          accent: '#ef4444',
          dominant: '#dc2626'
        }
      },
      {
        id: 'classic-4',
        name: 'Forest',
        category: 'classic',
        gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        colors: {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399',
          dominant: '#065f46'
        }
      }
    ],
    modern: [
      {
        id: 'modern-1',
        name: 'Neon',
        category: 'modern',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: {
          primary: '#8b5cf6',
          secondary: '#a855f7',
          accent: '#d946ef',
          dominant: '#7c3aed'
        }
      },
      {
        id: 'modern-2',
        name: 'Cyber',
        category: 'modern',
        gradient: 'linear-gradient(135deg, #0f0f23 0%, #2d1b69 50%, #11998e 100%)',
        colors: {
          primary: '#06b6d4',
          secondary: '#0891b2',
          accent: '#0e7490',
          dominant: '#155e75'
        }
      },
      {
        id: 'modern-3',
        name: 'Electric',
        category: 'modern',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: {
          primary: '#3b82f6',
          secondary: '#1d4ed8',
          accent: '#60a5fa',
          dominant: '#1e40af'
        }
      }
    ],
    abstract: [
      {
        id: 'abstract-1',
        name: 'Fluid',
        category: 'abstract',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        colors: {
          primary: '#ec4899',
          secondary: '#f472b6',
          accent: '#fb7185',
          dominant: '#e11d48'
        }
      },
      {
        id: 'abstract-2',
        name: 'Cosmic',
        category: 'abstract',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: {
          primary: '#8b5cf6',
          secondary: '#a855f7',
          accent: '#c084fc',
          dominant: '#7c3aed'
        }
      },
      {
        id: 'abstract-3',
        name: 'Plasma',
        category: 'abstract',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
        colors: {
          primary: '#f59e0b',
          secondary: '#f97316',
          accent: '#fb923c',
          dominant: '#ea580c'
        }
      }
    ]
  })

  // Predefined themes
  const predefinedThemes = ref([
    {
      name: 'light',
      label: 'Açık',
      icon: 'bi-sun',
      mode: 'light',
      colors: {
        primary: '#1976d2',
        secondary: '#26a69a',
        accent: '#9c27b0',
        background: '#ffffff',
        surface: '#f5f5f5'
      }
    },
    {
      name: 'dark',
      label: 'Koyu',
      icon: 'bi-moon',
      mode: 'dark',
      colors: {
        primary: '#3f51b5',
        secondary: '#4caf50',
        accent: '#ff5722',
        background: '#121212',
        surface: '#1e1e1e'
      }
    },
    {
      name: 'auto',
      label: 'Otomatik',
      icon: 'bi-circle-half',
      mode: 'auto',
      colors: {
        primary: '#1976d2',
        secondary: '#26a69a',
        accent: '#9c27b0',
        background: '#ffffff',
        surface: '#f5f5f5'
      }
    }
  ])

  // Available accent colors with more options
  const accentColors = ref([
    { name: 'blue', value: '#1976d2', label: 'Mavi' },
    { name: 'indigo', value: '#6366f1', label: 'İndigo' },
    { name: 'purple', value: '#9c27b0', label: 'Mor' },
    { name: 'pink', value: '#ec4899', label: 'Pembe' },
    { name: 'red', value: '#f44336', label: 'Kırmızı' },
    { name: 'orange', value: '#ff9800', label: 'Turuncu' },
    { name: 'amber', value: '#f59e0b', label: 'Amber' },
    { name: 'yellow', value: '#eab308', label: 'Sarı' },
    { name: 'lime', value: '#84cc16', label: 'Lime' },
    { name: 'green', value: '#4caf50', label: 'Yeşil' },
    { name: 'emerald', value: '#10b981', label: 'Zümrüt' },
    { name: 'teal', value: '#009688', label: 'Turkuaz' },
    { name: 'cyan', value: '#06b6d4', label: 'Cyan' }
  ])

  // Theme modes for dynamic themes
  const themeModes = ref(['light', 'dark', 'auto'])

  // Get all wallpapers
  const allWallpapers = computed(() => {
    return Object.values(wallpaperCollections.value).flat()
  })

  // Get wallpapers by category
  const getWallpapersByCategory = (category) => {
    return wallpaperCollections.value[category] || []
  }

  // Color analysis function (simplified)
  const analyzeImageColors = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Simple color extraction (in real app, use more sophisticated algorithm)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        let r = 0, g = 0, b = 0
        const sampleSize = 1000 // Sample every 1000th pixel for performance
        
        for (let i = 0; i < data.length; i += sampleSize * 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
        }
        
        const pixelCount = data.length / (sampleSize * 4)
        r = Math.round(r / pixelCount)
        g = Math.round(g / pixelCount)
        b = Math.round(b / pixelCount)

        const dominantColor = `rgb(${r}, ${g}, ${b})`
        
        // Generate complementary colors
        const colors = {
          primary: dominantColor,
          secondary: `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 40)})`,
          accent: `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 50)})`,
          dominant: dominantColor
        }

        resolve(colors)
      }
      img.src = imageUrl
    })
  }

  // Set wallpaper and extract colors
  const setWallpaper = async (wallpaper) => {
    currentWallpaper.value = wallpaper
    
    if (wallpaper.colors) {
      // Use predefined colors
      dynamicColors.value = { ...wallpaper.colors }
    } else {
      // Analyze image for colors
      try {
        const extractedColors = await analyzeImageColors(wallpaper.fullsize)
        dynamicColors.value = extractedColors
      } catch {
        console.warn('Color analysis failed, using default colors')
      }
    }
    
    applyDynamicTheme()
    saveTheme()
  }

  // Apply dynamic theme based on wallpaper
  const applyDynamicTheme = () => {
    const root = document.documentElement
    const body = document.body

    // Apply wallpaper or gradient
    if (currentWallpaper.value) {
      if (currentWallpaper.value.gradient) {
        // Use CSS gradient
        body.style.backgroundImage = currentWallpaper.value.gradient
      } else if (currentWallpaper.value.fullsize) {
        // Use image file
        body.style.backgroundImage = `url(${currentWallpaper.value.fullsize})`
      }
      body.style.backgroundSize = 'cover'
      body.style.backgroundPosition = 'center'
      body.style.backgroundRepeat = 'no-repeat'
      body.style.backgroundAttachment = 'fixed'
    } else {
      body.style.backgroundImage = 'none'
    }

    // Apply dynamic colors
    root.style.setProperty('--q-primary', dynamicColors.value.primary)
    root.style.setProperty('--q-secondary', dynamicColors.value.secondary)
    root.style.setProperty('--q-accent', accentColor.value)
    root.style.setProperty('--theme-primary', dynamicColors.value.primary)
    root.style.setProperty('--theme-secondary', dynamicColors.value.secondary)
    root.style.setProperty('--theme-accent', accentColor.value)
    root.style.setProperty('--theme-dominant', dynamicColors.value.dominant)

    // Add dynamic theme class
    body.classList.add('dynamic-theme')
  }

  // Apply predefined theme
  const applyPredefinedTheme = () => {
    const root = document.documentElement
    const body = document.body
    const selectedTheme = predefinedThemes.value.find(t => t.name === currentTheme.value)

    // Remove dynamic theme
    body.classList.remove('dynamic-theme')
    body.style.backgroundImage = 'none'
    currentWallpaper.value = null

    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto', 'high-contrast')

    // Apply theme class
    body.classList.add(`theme-${currentTheme.value}`)

    if (isHighContrast.value) {
      body.classList.add('high-contrast')
    }

    // Set CSS custom properties
    if (selectedTheme) {
      root.style.setProperty('--q-primary', selectedTheme.colors.primary)
      root.style.setProperty('--q-secondary', selectedTheme.colors.secondary)
      root.style.setProperty('--q-accent', accentColor.value)
      root.style.setProperty('--theme-background', selectedTheme.colors.background)
      root.style.setProperty('--theme-surface', selectedTheme.colors.surface)
      root.style.setProperty('--theme-primary', selectedTheme.colors.primary)
      root.style.setProperty('--theme-secondary', selectedTheme.colors.secondary)
      root.style.setProperty('--theme-accent', accentColor.value)
    }

    // Set dark mode flag
    if (selectedTheme.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isDarkMode.value = mediaQuery.matches
    } else {
      isDarkMode.value = selectedTheme.mode === 'dark'
    }
  }

  // Initialize theme from storage
  const initializeTheme = () => {
    if (window.electronAPI) {
      window.electronAPI.getStore('theme').then(savedTheme => {
        if (savedTheme) {
          currentTheme.value = savedTheme.name || 'light'
          isDarkMode.value = savedTheme.isDarkMode || false
          accentColor.value = savedTheme.accentColor || '#1976d2'
          isHighContrast.value = savedTheme.isHighContrast || false
          currentWallpaper.value = savedTheme.wallpaper || null
          if (savedTheme.dynamicColors) {
            dynamicColors.value = savedTheme.dynamicColors
          }
          
          if (currentWallpaper.value) {
            applyDynamicTheme()
          } else {
            applyPredefinedTheme()
          }
        }
      })
    } else {
      const savedTheme = localStorage.getItem('app-theme')
      if (savedTheme) {
        const theme = JSON.parse(savedTheme)
        currentTheme.value = theme.name || 'light'
        isDarkMode.value = theme.isDarkMode || false
        accentColor.value = theme.accentColor || '#1976d2'
        isHighContrast.value = theme.isHighContrast || false
        currentWallpaper.value = theme.wallpaper || null
        if (theme.dynamicColors) {
          dynamicColors.value = theme.dynamicColors
        }
      }
      
      if (currentWallpaper.value) {
        applyDynamicTheme()
      } else {
        applyPredefinedTheme()
      }
    }
  }

  // Save theme to storage
  const saveTheme = () => {
    const themeData = {
      name: currentTheme.value,
      isDarkMode: isDarkMode.value,
      accentColor: accentColor.value,
      isHighContrast: isHighContrast.value,
      wallpaper: currentWallpaper.value,
      dynamicColors: dynamicColors.value
    }

    if (window.electronAPI) {
      window.electronAPI.setStore('theme', themeData)
    } else {
      localStorage.setItem('app-theme', JSON.stringify(themeData))
    }
  }

  // Set predefined theme
  const setTheme = (themeName) => {
    currentTheme.value = themeName
    applyPredefinedTheme()
    saveTheme()
  }

  // Set accent color
  const setAccentColor = (color) => {
    accentColor.value = color
    if (currentWallpaper.value) {
      applyDynamicTheme()
    } else {
      applyPredefinedTheme()
    }
    saveTheme()
  }

  // Toggle high contrast
  const toggleHighContrast = () => {
    isHighContrast.value = !isHighContrast.value
    if (currentWallpaper.value) {
      applyDynamicTheme()
    } else {
      applyPredefinedTheme()
    }
    saveTheme()
  }

  // Clear wallpaper (return to predefined theme)
  const clearWallpaper = () => {
    currentWallpaper.value = null
    dynamicColors.value = {
      primary: '#1976d2',
      secondary: '#26a69a',
      accent: '#9c27b0',
      surface: '#ffffff',
      background: '#fafafa'
    }
    applyPredefinedTheme()
    saveTheme()
  }

  // Get current theme object
  const getCurrentTheme = () => {
    return predefinedThemes.value.find(t => t.name === currentTheme.value)
  }

  return {
    // State
    isDarkMode,
    accentColor,
    isHighContrast,
    currentTheme,
    currentWallpaper,
    dynamicColors,
    predefinedThemes,
    accentColors,
    wallpaperCollections,
    themeModes,
    
    // Computed
    allWallpapers,
    
    // Methods
    initializeTheme,
    saveTheme,
    setTheme,
    setAccentColor,
    toggleHighContrast,
    setWallpaper,
    clearWallpaper,
    applyDynamicTheme,
    applyPredefinedTheme,
    analyzeImageColors,
    getWallpapersByCategory,
    getCurrentTheme
  }
}) 