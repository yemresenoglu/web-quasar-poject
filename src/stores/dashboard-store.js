import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger.js'
import { getMockDashboardData } from 'src/data/index-page-mock-data.js'
import { dashboardApiModule } from 'src/api/modules/dashboard-api.js'

const logger = createLogger('DashboardStore')

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const currentDateTime = ref('')
  const currentDate = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // Backend data
  const userLocation = ref('')
  const processStats = ref([])
  const jobStatusStats = ref([])
  const announcementList = ref([])
  const chartData = ref({})

  // Timer reference
  let timer = null

  // Computed
  const summaryStats = computed(() => ({
    pendingJobs: processStats.value.reduce((sum, stat) => sum + (stat.pending || 0), 0),
    myJobs: processStats.value.reduce((sum, stat) => sum + (stat.assigned || 0), 0),
    sentJobs: processStats.value.reduce((sum, stat) => sum + (stat.sent || 0), 0),
  }))

  // Actions
  const updateDateTime = () => {
    const now = new Date()
    currentDateTime.value = now.toLocaleTimeString('tr-TR')
    currentDate.value = now.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      logger.info('Fetching dashboard data from backend')
      
      // Mock data kullanımı - geliştirme ortamında
      if (process.env.NODE_ENV === 'development') {
        logger.info('Using mock data for development')
        const mockData = getMockDashboardData()
        
        userLocation.value = mockData.userLocation
        processStats.value = mockData.processStats
        jobStatusStats.value = mockData.jobStatusStats
        announcementList.value = mockData.announcementList
        chartData.value = mockData.chartData
        
        logger.info('Mock dashboard data loaded successfully')
        return
      }
      
          // Gerçek API çağrısı
          const result = await dashboardApiModule.getDashboardData()
      
      if (result.success && result.data) {
        userLocation.value = result.data.userLocation || ''
        processStats.value = result.data.processStats || []
        jobStatusStats.value = result.data.jobStatusStats || []
        announcementList.value = result.data.announcements || []
        chartData.value = result.data.charts || {}
        
        logger.info('Dashboard data loaded successfully')
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      logger.error('Dashboard data fetch failed:', err)
      error.value = err.message
      
      // Hata durumunda mock data kullan
      logger.info('Falling back to mock data due to error')
      const mockData = getMockDashboardData()
      
      userLocation.value = mockData.userLocation
      processStats.value = mockData.processStats
      jobStatusStats.value = mockData.jobStatusStats
      announcementList.value = mockData.announcementList
      chartData.value = mockData.chartData
    } finally {
      isLoading.value = false
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
      ...announcement,
    })
    logger.info('New announcement added')
  }

  const removeAnnouncement = (id) => {
    const index = announcementList.value.findIndex((a) => a.id === id)
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
    fetchDashboardData()

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
    await fetchDashboardData()
    updateDateTime()
  }

  return {
    // State
    currentDateTime,
    currentDate,
    userLocation,
    isLoading,
    error,
    processStats,
    jobStatusStats,
    announcementList,
    chartData,

    // Computed
    summaryStats,

    // Actions
    updateDateTime,
    fetchDashboardData,
    updateProcessStats,
    updateJobStatusStats,
    addAnnouncement,
    removeAnnouncement,
    updateChartData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    refreshDashboard,
  }
})
