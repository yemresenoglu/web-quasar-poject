import { defineStore } from 'pinia'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('DashboardStore')

/**
 * Dashboard Store
 * Manages dashboard data, statistics, charts, and real-time updates
 */
export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const currentDateTime = ref('')
  const currentDate = ref('')
  const userLocation = ref('')
  const isLoading = ref(false)
  
  // Process statistics
  const processStats = ref([
    {
      id: 'deger-kaybi-arabuluculuk',
      name: 'Değer Kaybı Arabuluculuk',
      icon: 'bi-graph-down-arrow',
      color: 'negative',
      pending: 20,
      assigned: 15,
      sent: 12
    },
    {
      id: 'agir-hasar-pert-arabuluculuk',
      name: 'Ağır Hasar Pert Arabuluculuk',
      icon: 'bi-exclamation-triangle-fill',
      color: 'warning',
      pending: 16,
      assigned: 11,
      sent: 8
    },
    {
      id: 'bedeni-hasar-ihtiyari-arabuluculuk',
      name: 'Bedeni Hasar İhtiyari Arabuluculuk',
      icon: 'bi-star-fill',
      color: 'secondary',
      pending: 28,
      assigned: 18,
      sent: 13
    }
  ])

  // Job status statistics
  const jobStatusStats = ref([
    {
      icon: 'bi-box-arrow-up',
      color: 'primary',
      count: '24',
      label: 'Bugün Gönderilen'
    },
    {
      icon: 'bi-inbox',
      color: 'secondary',
      count: '18',
      label: 'Bugün Alınan'
    },
    {
      icon: 'bi-hourglass-split',
      color: 'warning',
      count: '12',
      label: 'Onay Bekleyen'
    },
    {
      icon: 'bi-check-circle',
      color: 'positive',
      count: '35',
      label: 'Tamamlanan'
    },
    {
      icon: 'bi-file-text',
      color: 'info',
      count: '42',
      label: 'Aktif Dosyalar'
    },
    {
      icon: 'bi-scales',
      color: 'accent',
      count: '28',
      label: 'Eksper Atamaları'
    }
  ])

  // Announcements
  const announcementList = ref([
    {
      id: 1,
      title: 'Sistem Bakım Bildirimi',
      description: '15 Aralık 2024 tarihinde 02:00-04:00 saatleri arasında sistem bakımı yapılacaktır.',
      category: 'maintenance',
      priority: 'high',
      icon: 'bi-tools',
      date: '15 Aralık 2024'
    },
    {
      id: 2,
      title: 'Güvenlik Güncellemesi',
      description: 'Sistem güvenliği için önemli güncellemeler yapılmıştır.',
      category: 'security',
      priority: 'medium',
      icon: 'bi-shield-check',
      date: '12 Aralık 2024'
    },
    {
      id: 3,
      title: 'Performans İyileştirmeleri',
      description: 'Dashboard performansı artırılmış ve yeni özellikler eklenmiştir.',
      category: 'update',
      priority: 'low',
      icon: 'bi-graph-up-arrow',
      date: '10 Aralık 2024'
    }
  ])

  // Chart data
  const chartData = ref({
    workStatus: {
      labels: ['Bekleyen', 'Devam Eden', 'Tamamlanan'],
      datasets: [{
        data: [24, 15, 18],
        backgroundColor: ['#FF9800', '#2196F3', '#4CAF50'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    weeklyTrend: {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [{
        label: 'Tamamlanan İşler',
        data: [12, 15, 18, 14, 20, 8, 5],
        borderColor: '#2196F3',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }, {
        label: 'Yeni İşler',
        data: [10, 13, 16, 12, 18, 6, 8],
        borderColor: '#FF9800',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#FF9800',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    workloadByProcess: {
      labels: [
        'Değer Kaybı Arabuluculuk',
        'Ağır Hasar Pert Arabuluculuk',
        'Bedeni Hasar İhtiyari Arabuluculuk'
      ],
      datasets: [{
        label: 'Bekleyen',
        data: [20, 16, 28],
        backgroundColor: 'rgba(255, 152, 0, 0.85)',
        hoverBackgroundColor: '#FF9800',
        borderWidth: 0,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 6,
          bottomRight: 6
        },
        barPercentage: 0.8
      }, {
        label: 'Atanmış',
        data: [15, 11, 18],
        backgroundColor: 'rgba(33, 150, 243, 0.85)',
        hoverBackgroundColor: '#2196F3',
        borderWidth: 0,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 6,
          bottomRight: 6
        },
        barPercentage: 0.8
      }, {
        label: 'Gönderilen',
        data: [12, 8, 13],
        backgroundColor: 'rgba(76, 175, 80, 0.85)',
        hoverBackgroundColor: '#4CAF50',
        borderWidth: 0,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 6,
          bottomRight: 6
        },
        barPercentage: 0.8
      }]
    }
  })

  // Timer reference
  let timer = null

  // Computed
  const summaryStats = computed(() => ({
    pendingJobs: 24,
    myJobs: 18,
    sentJobs: 7
  }))

  const isOnline = computed(() => {
    return userLocation.value && userLocation.value !== 'Konum alınamıyor'
  })

  // Actions
  const updateDateTime = () => {
    const now = new Date()
    currentDateTime.value = now.toLocaleTimeString('tr-TR')
    currentDate.value = now.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getUserLocation = async () => {
    try {
      logger.info('Getting user location')
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
      })
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=tr`
      )
      const data = await response.json()
      
      userLocation.value = data.address.city || data.address.town || data.address.county || data.address.state || 'Bilinmeyen Konum'
      logger.info('Location retrieved successfully')
    } catch (error) {
      logger.error('Location error:', error)
      if (error.code === 1) {
        userLocation.value = 'Konum izni verilmedi'
      } else if (error.code === 2) {
        userLocation.value = 'Konum alınamıyor'
      } else if (error.code === 3) {
        userLocation.value = 'Konum zaman aşımı'
      } else {
        userLocation.value = 'Konum servisi kullanılamıyor'
      }
    }
  }

  const updateProcessStats = (newStats) => {
    processStats.value = newStats
    logger.info('Process stats updated')
  }

  const updateJobStatusStats = (newStats) => {
    jobStatusStats.value = newStats
    logger.info('Job status stats updated')
  }

  const addAnnouncement = (announcement) => {
    announcementList.value.unshift({
      id: Date.now(),
      ...announcement
    })
    logger.info('New announcement added')
  }

  const removeAnnouncement = (id) => {
    const index = announcementList.value.findIndex(a => a.id === id)
    if (index > -1) {
      announcementList.value.splice(index, 1)
      logger.info('Announcement removed')
    }
  }

  const updateChartData = (chartType, newData) => {
    if (chartData.value[chartType]) {
      chartData.value[chartType] = { ...chartData.value[chartType], ...newData }
      logger.info(`Chart data updated for ${chartType}`)
    }
  }

  const startRealTimeUpdates = () => {
    if (timer) return
    
    updateDateTime()
    timer = setInterval(updateDateTime, 1000)
    getUserLocation()
    
    logger.info('Real-time updates started')
  }

  const stopRealTimeUpdates = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
      logger.info('Real-time updates stopped')
    }
  }

  const refreshDashboard = async () => {
    isLoading.value = true
    try {
      logger.info('Refreshing dashboard data')
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update data
      updateDateTime()
      await getUserLocation()
      
      logger.info('Dashboard refreshed successfully')
    } catch (error) {
      logger.error('Dashboard refresh failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    currentDateTime,
    currentDate,
    userLocation,
    isLoading,
    processStats,
    jobStatusStats,
    announcementList,
    chartData,
    
    // Computed
    summaryStats,
    isOnline,
    
    // Actions
    updateDateTime,
    getUserLocation,
    updateProcessStats,
    updateJobStatusStats,
    addAnnouncement,
    removeAnnouncement,
    updateChartData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    refreshDashboard
  }
})
