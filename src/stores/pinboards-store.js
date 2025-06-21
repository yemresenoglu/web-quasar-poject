import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePinboardsStore = defineStore('pinboards', () => {
  // State
  const pinboards = ref([
    {
      id: 'pb_1',
      title: 'Toplantı Notları',
      content: 'Haftalık ekip toplantısında alınan kararlar ve aksiyon maddeleri.',
      type: 'note',
      priority: 'normal',
      pinned: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pb_2',
      title: 'Rapor Hazırla',
      content: 'Aylık performans raporunu hazırla ve yöneticiye sun.',
      type: 'task',
      priority: 'high',
      pinned: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pb_3',
      title: 'Müşteri Görüşmesi',
      content: 'Yarın saat 14:00\'te müşteri ile görüşme randevusu var.',
      type: 'reminder',
      priority: 'urgent',
      pinned: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pb_4',
      title: 'Hasar Dosyası HSR-2024-001234',
      content: 'Eksper raporu bekleniyor. Müşteri ile iletişim kuruldu, belge talep edildi.',
      damageFileNumber: 'HSR-2024-001234',
      type: 'damage_note',
      priority: 'high',
      pinned: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pb_5',
      title: 'Saha İncelemesi',
      content: 'HSR-2024-001235 numaralı dosya için saha incelemesi yapılacak. Eksper ataması tamamlandı.',
      damageFileNumber: 'HSR-2024-001235',
      type: 'expert_task',
      priority: 'urgent',
      pinned: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pb_6',
      title: 'Önemli Doküman',
      content: 'https://example.com/important-document - Proje ile ilgili önemli doküman linki.',
      type: 'link',
      priority: 'normal',
      pinned: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ])

  // Computed
  const pinboardCount = computed(() => pinboards.value.length)
  
  const pinnedPinboards = computed(() => {
    return pinboards.value
      .filter(pinboard => pinboard.pinned)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  })

  const recentPinboards = computed(() => {
    return pinboards.value
      .slice()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
  })

  const pinboardsByType = computed(() => {
    return {
      notes: pinboards.value.filter(p => p.type === 'note'),
      tasks: pinboards.value.filter(p => p.type === 'task'),
      reminders: pinboards.value.filter(p => p.type === 'reminder'),
      links: pinboards.value.filter(p => p.type === 'link')
    }
  })

  const highPriorityPinboards = computed(() => {
    return pinboards.value.filter(p => p.priority === 'high')
  })

  // Actions
  const addPinboard = (pinboardData) => {
    const newPinboard = {
      id: `pin_${Date.now()}`,
      title: pinboardData.title,
      content: pinboardData.content,
      damageFileNumber: pinboardData.damageFileNumber || '',
      type: pinboardData.type || 'damage_note',
      priority: pinboardData.priority || 'normal',
      pinned: pinboardData.pinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    pinboards.value.unshift(newPinboard)
    return newPinboard
  }

  const removePinboard = (id) => {
    const index = pinboards.value.findIndex(pinboard => pinboard.id === id)
    if (index !== -1) {
      pinboards.value.splice(index, 1)
    }
  }

  const updatePinboard = (id, updates) => {
    const pinboard = pinboards.value.find(p => p.id === id)
    if (pinboard) {
      Object.assign(pinboard, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const togglePin = (id) => {
    const pinboard = pinboards.value.find(p => p.id === id)
    if (pinboard) {
      pinboard.pinned = !pinboard.pinned
      pinboard.updatedAt = new Date().toISOString()
    }
  }

  const setPriority = (id, priority) => {
    const pinboard = pinboards.value.find(p => p.id === id)
    if (pinboard) {
      pinboard.priority = priority
      pinboard.updatedAt = new Date().toISOString()
    }
  }

  const getPinboardById = (id) => {
    return pinboards.value.find(p => p.id === id)
  }

  const getPinboardsByType = (type) => {
    return pinboards.value.filter(p => p.type === type)
  }

  const searchPinboards = (query) => {
    const searchTerm = query.toLowerCase()
    return pinboards.value.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.content.toLowerCase().includes(searchTerm)
    )
  }

  const duplicatePinboard = (id) => {
    const original = getPinboardById(id)
    if (original) {
      const duplicate = {
        ...original,
        id: `pin_${Date.now()}`,
        title: `${original.title} (Kopya)`,
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      pinboards.value.unshift(duplicate)
      return duplicate
    }
  }

  const exportPinboards = () => {
    const dataStr = JSON.stringify(pinboards.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `pinboards_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importPinboards = (pinboardsData) => {
    try {
      const importedPinboards = JSON.parse(pinboardsData)
      if (Array.isArray(importedPinboards)) {
        // Merge with existing pinboards
        importedPinboards.forEach(pinboard => {
          const newPinboard = {
            ...pinboard,
            id: `pin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: pinboard.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          pinboards.value.push(newPinboard)
        })
      }
    } catch (error) {
      console.error('Pinboards içe aktarılırken hata:', error)
    }
  }

  const clearAllPinboards = () => {
    pinboards.value = []
  }

  const clearCompletedTasks = () => {
    pinboards.value = pinboards.value.filter(p => {
      if (p.type === 'task') {
        // Check if task is completed (contains ✓ symbols)
        return !p.content.includes('✓') || p.content.includes('□')
      }
      return true
    })
  }

  const getStatistics = () => {
    return {
      total: pinboards.value.length,
      pinned: pinnedPinboards.value.length,
      byType: {
        notes: pinboardsByType.value.notes.length,
        tasks: pinboardsByType.value.tasks.length,
        reminders: pinboardsByType.value.reminders.length,
        links: pinboardsByType.value.links.length
      },
      byPriority: {
        high: pinboards.value.filter(p => p.priority === 'high').length,
        normal: pinboards.value.filter(p => p.priority === 'normal').length,
        low: pinboards.value.filter(p => p.priority === 'low').length
      }
    }
  }

  return {
    // State
    pinboards,
    
    // Computed
    pinboardCount,
    pinnedPinboards,
    recentPinboards,
    pinboardsByType,
    highPriorityPinboards,
    
    // Actions
    addPinboard,
    removePinboard,
    updatePinboard,
    togglePin,
    setPriority,
    getPinboardById,
    getPinboardsByType,
    searchPinboards,
    duplicatePinboard,
    exportPinboards,
    importPinboards,
    clearAllPinboards,
    clearCompletedTasks,
    getStatistics
  }
}) 