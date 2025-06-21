import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favorites = ref([
    {
      id: 'fav_1',
      title: 'Ana Sayfa',
      route: '/',
      icon: 'bi-house',
      createdAt: new Date().toISOString(),
      visitCount: 5
    },
    {
      id: 'fav_2',
      title: 'Menü',
      route: '/menu',
      icon: 'bi-grid',
      createdAt: new Date().toISOString(),
      visitCount: 3
    }
  ])

  // Computed
  const favoriteCount = computed(() => favorites.value.length)
  
  const recentFavorites = computed(() => {
    return favorites.value
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  const mostVisited = computed(() => {
    return favorites.value
      .slice()
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5)
  })

  // Actions
  const addFavorite = (favoriteData) => {
    const newFavorite = {
      id: `fav_${Date.now()}`,
      title: favoriteData.title,
      route: favoriteData.route,
      icon: favoriteData.icon || 'bi-globe',
      createdAt: new Date().toISOString(),
      visitCount: 0
    }
    
    // Check if already exists
    const exists = favorites.value.find(fav => fav.route === newFavorite.route)
    if (!exists) {
      favorites.value.push(newFavorite)
    }
  }

  const removeFavorite = (id) => {
    const index = favorites.value.findIndex(fav => fav.id === id)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
  }

  const updateFavorite = (id, updates) => {
    const favorite = favorites.value.find(fav => fav.id === id)
    if (favorite) {
      Object.assign(favorite, updates)
    }
  }

  const incrementVisitCount = (route) => {
    const favorite = favorites.value.find(fav => fav.route === route)
    if (favorite) {
      favorite.visitCount++
    }
  }

  const isFavorite = (route) => {
    return favorites.value.some(fav => fav.route === route)
  }

  const getFavoriteByRoute = (route) => {
    return favorites.value.find(fav => fav.route === route)
  }

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `favorites_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importFavorites = (favoritesData) => {
    try {
      const importedFavorites = JSON.parse(favoritesData)
      if (Array.isArray(importedFavorites)) {
        // Merge with existing favorites, avoiding duplicates
        importedFavorites.forEach(fav => {
          if (!isFavorite(fav.route)) {
            favorites.value.push({
              ...fav,
              id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            })
          }
        })
      }
    } catch (error) {
      console.error('Favoriler içe aktarılırken hata:', error)
    }
  }

  const clearAllFavorites = () => {
    favorites.value = []
  }

  return {
    // State
    favorites,
    
    // Computed
    favoriteCount,
    recentFavorites,
    mostVisited,
    
    // Actions
    addFavorite,
    removeFavorite,
    updateFavorite,
    incrementVisitCount,
    isFavorite,
    getFavoriteByRoute,
    exportFavorites,
    importFavorites,
    clearAllFavorites
  }
}) 