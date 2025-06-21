import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  // State
  const history = ref([
    {
      id: 'hist_1',
      title: 'Ana Sayfa',
      description: 'Uygulamanın ana sayfası',
      route: '/',
      type: 'page',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      visitCount: 8,
      metadata: {
        duration: 120000, // 2 minutes
        actions: ['view', 'navigate']
      }
    },
    {
      id: 'hist_2',
      title: 'Hasar Bildirimi',
      description: 'Yeni hasar kaydı oluşturuldu - #HD2024001',
      route: '/hasar-bildirimi',
      type: 'damage',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      visitCount: 3,
      metadata: {
        duration: 300000, // 5 minutes
        actions: ['create', 'save'],
        damageNumber: 'HD2024001'
      }
    },
    {
      id: 'hist_3',
      title: 'Hasar Dosyaları',
      description: 'Hasar dosyalarını görüntüleme',
      route: '/hasar-dosyalari',
      type: 'page',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      visitCount: 12,
      metadata: {
        duration: 180000, // 3 minutes
        actions: ['view', 'filter', 'search']
      }
    },
    {
      id: 'hist_4',
      title: 'Eksper Raporu',
      description: 'EXP2024001.pdf dosyası açıldı',
      route: null,
      type: 'file',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      visitCount: 1,
      metadata: {
        fileName: 'EXP2024001.pdf',
        fileSize: '2.4 MB',
        fileType: 'pdf',
        actions: ['open', 'view']
      }
    },
    {
      id: 'hist_5',
      title: 'Ödeme İşlemi',
      description: 'Hasar ödemesi onaylandı - 15,000 TL',
      route: null,
      type: 'payment',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      visitCount: 1,
      metadata: {
        amount: 15000,
        currency: 'TL',
        paymentId: 'PAY2024001',
        actions: ['approve', 'process']
      }
    },
    {
      id: 'hist_6',
      title: 'Müşteri Arama',
      description: 'TC: 12345678901 için arama yapıldı',
      route: null,
      type: 'search',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      visitCount: 1,
      metadata: {
        searchQuery: '12345678901',
        searchType: 'customer',
        resultsCount: 1,
        actions: ['search']
      }
    },
    {
      id: 'hist_7',
      title: 'Servis Koordinasyonu',
      description: 'Anlaşmalı servis ataması yapıldı',
      route: null,
      type: 'service',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      visitCount: 1,
      metadata: {
        serviceId: 'SRV001',
        serviceName: 'Oto Tamir Servisi',
        actions: ['assign', 'notify']
      }
    }
  ])

  const settings = ref({
    enableTracking: true,
    autoCleanup: true,
    maxHistoryItems: 1000,
    cleanupDays: 30
  })

  // Computed
  const historyCount = computed(() => history.value.length)
  
  const recentHistory = computed(() => {
    return history.value
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20)
  })

  const mostVisited = computed(() => {
    return history.value
      .slice()
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10)
  })

  const historyByType = computed(() => {
    const grouped = {}
    history.value.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = []
      }
      grouped[item.type].push(item)
    })
    return grouped
  })

  const todayHistory = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return history.value.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= today
    })
  })

  const statistics = computed(() => {
    const stats = {
      total: history.value.length,
      today: todayHistory.value.length,
      byType: {},
      totalVisits: 0,
      averageVisits: 0
    }

    history.value.forEach(item => {
      if (!stats.byType[item.type]) {
        stats.byType[item.type] = 0
      }
      stats.byType[item.type]++
      stats.totalVisits += item.visitCount
    })

    stats.averageVisits = stats.total > 0 ? Math.round(stats.totalVisits / stats.total) : 0

    return stats
  })

  // Actions
  const addHistoryItem = (itemData) => {
    if (!settings.value.enableTracking) return

    // Check if item already exists (for pages)
    if (itemData.route) {
      const existingItem = history.value.find(item => item.route === itemData.route)
      if (existingItem) {
        // Update existing item
        existingItem.timestamp = new Date().toISOString()
        existingItem.visitCount++
        if (itemData.metadata) {
          existingItem.metadata = { ...existingItem.metadata, ...itemData.metadata }
        }
        return existingItem.id
      }
    }

    const newItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: itemData.title,
      description: itemData.description || '',
      route: itemData.route || null,
      type: itemData.type || 'page',
      timestamp: new Date().toISOString(),
      visitCount: 1,
      metadata: itemData.metadata || {}
    }
    
    history.value.unshift(newItem)
    
    // Auto cleanup if enabled
    if (settings.value.autoCleanup && history.value.length > settings.value.maxHistoryItems) {
      history.value = history.value.slice(0, settings.value.maxHistoryItems)
    }

    return newItem.id
  }

  const removeHistoryItem = (id) => {
    const index = history.value.findIndex(item => item.id === id)
    if (index !== -1) {
      history.value.splice(index, 1)
    }
  }

  const updateHistoryItem = (id, updates) => {
    const item = history.value.find(item => item.id === id)
    if (item) {
      Object.assign(item, updates)
      item.timestamp = new Date().toISOString()
    }
  }

  const incrementVisitCount = (id) => {
    const item = history.value.find(item => item.id === id)
    if (item) {
      item.visitCount++
      item.timestamp = new Date().toISOString()
    }
  }

  const clearAllHistory = () => {
    history.value = []
  }

  const clearHistoryByType = (type) => {
    history.value = history.value.filter(item => item.type !== type)
  }

  const clearOldHistory = (days = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    history.value = history.value.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= cutoffDate
    })
  }

  const searchHistory = (query) => {
    const searchTerm = query.toLowerCase()
    return history.value.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      (item.route && item.route.toLowerCase().includes(searchTerm))
    )
  }

  const getHistoryByRoute = (route) => {
    return history.value.filter(item => item.route === route)
  }

  const getHistoryByType = (type) => {
    return history.value.filter(item => item.type === type)
  }

  const getHistoryById = (id) => {
    return history.value.find(item => item.id === id)
  }

  const exportHistory = () => {
    const exportData = {
      history: history.value,
      settings: settings.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `history_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importHistory = (historyData) => {
    try {
      const importedData = JSON.parse(historyData)
      if (importedData.history && Array.isArray(importedData.history)) {
        // Merge with existing history, avoiding duplicates
        importedData.history.forEach(item => {
          const exists = history.value.find(h => h.id === item.id)
          if (!exists) {
            history.value.push(item)
          }
        })
        
        // Sort by timestamp
        history.value.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }
    } catch (error) {
      console.error('Geçmiş içe aktarılırken hata:', error)
    }
  }

  // Specific tracking methods
  const trackPageVisit = (title, route, description = '') => {
    return addHistoryItem({
      title,
      route,
      description,
      type: 'page',
      metadata: {
        actions: ['view']
      }
    })
  }

  const trackFileAccess = (fileName, fileType, fileSize = null) => {
    return addHistoryItem({
      title: fileName,
      description: `${fileName} dosyası açıldı`,
      type: 'file',
      metadata: {
        fileName,
        fileType,
        fileSize,
        actions: ['open']
      }
    })
  }

  const trackOperation = (title, description, operationType, metadata = {}) => {
    return addHistoryItem({
      title,
      description,
      type: operationType,
      metadata: {
        ...metadata,
        actions: ['execute']
      }
    })
  }

  const trackSearch = (query, searchType, resultsCount = 0) => {
    return addHistoryItem({
      title: `${searchType} Arama`,
      description: `"${query}" için arama yapıldı`,
      type: 'search',
      metadata: {
        searchQuery: query,
        searchType,
        resultsCount,
        actions: ['search']
      }
    })
  }

  // Settings
  const updateSettings = (newSettings) => {
    Object.assign(settings.value, newSettings)
  }

  return {
    // State
    history,
    settings,
    
    // Computed
    historyCount,
    recentHistory,
    mostVisited,
    historyByType,
    todayHistory,
    statistics,
    
    // Actions
    addHistoryItem,
    removeHistoryItem,
    updateHistoryItem,
    incrementVisitCount,
    clearAllHistory,
    clearHistoryByType,
    clearOldHistory,
    searchHistory,
    getHistoryByRoute,
    getHistoryByType,
    getHistoryById,
    exportHistory,
    importHistory,
    
    // Tracking methods
    trackPageVisit,
    trackFileAccess,
    trackOperation,
    trackSearch,
    
    // Settings
    updateSettings
  }
}) 