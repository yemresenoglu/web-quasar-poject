import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger.js'
import { getMockDashboardData } from 'src/data/index-page-mock-data.js'
// import { dashboardApiModule } from 'src/api/modules/dashboard-api.js'
import { shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

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

  const fetchDashboardData = async (userOid) => {
    if (!userOid) {
      logger.error('UserOid is required for dashboard data')
      error.value = 'User OID is required'
      return
    }

    // Demo user için de mock data kullan
    const isDemoUser = userOid === 'DEMO_USER'

    isLoading.value = true
    error.value = null

    try {
      logger.info('Fetching dashboard data from backend', { userOid })

      // Environment-based API call strategy
      if (shouldUseMockData() || isDemoUser) {
        logger.info('Using mock data for development/demo', {
          userOid,
          isDemoUser,
          environment: getEnvironmentInfo().environment,
        })
        const mockData = getMockDashboardData()

        userLocation.value = mockData.userLocation
        processStats.value = mockData.processStats
        jobStatusStats.value = mockData.jobStatusStats
        announcementList.value = mockData.announcementList
        chartData.value = mockData.chartData

        console.log('📊 Mock chartData loaded:', chartData.value)

        logger.info('Mock dashboard data loaded successfully', { userOid })
        return
      }

      // BACKEND INTEGRATION - Gerçek API çağrısı
      /*
      try {
        logger.info('Attempting backend getDashboardData', { userOid })
        const result = await dashboardApiModule.getDashboardData(userOid)
        
        if (result.success && result.data) {
          userLocation.value = result.data.userLocation || ''
          processStats.value = result.data.processStats || []
          jobStatusStats.value = result.data.jobStatusStats || []
          announcementList.value = result.data.announcements || []
          chartData.value = result.data.charts || {}
          
          logger.info('Dashboard data loaded successfully (Backend)', { userOid })
        } else {
          logger.warn('Backend getDashboardData failed, falling back to mock data', {
            error: result.error,
            userOid
          })
          throw new Error(result.error || 'Backend dashboard data fetch failed')
        }
      } catch (apiError) {
        logger.error('Backend API getDashboardData error, falling back to mock data:', {
          error: apiError.message,
          userOid
        })
        throw apiError
      }
      */

      // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
      logger.info('Backend integration disabled - using mock data for getDashboardData')
      const mockData = getMockDashboardData()

      userLocation.value = mockData.userLocation
      processStats.value = mockData.processStats
      jobStatusStats.value = mockData.jobStatusStats
      announcementList.value = mockData.announcementList
      chartData.value = mockData.chartData

      console.log('📊 Mock chartData loaded:', chartData.value)
    } catch (err) {
      logger.error('Dashboard data fetch failed:', err, { userOid })
      error.value = err.message

      // Hata durumunda mock data kullan
      logger.info('Falling back to mock data due to error', { userOid })
      const mockData = getMockDashboardData()

      userLocation.value = mockData.userLocation
      processStats.value = mockData.processStats
      jobStatusStats.value = mockData.jobStatusStats
      announcementList.value = mockData.announcementList
      chartData.value = mockData.chartData

      console.log('📊 Fallback chartData loaded:', chartData.value)
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

  const startRealTimeUpdates = (userOid) => {
    if (timer) return

    updateDateTime()
    timer = setInterval(updateDateTime, 1000)
    fetchDashboardData(userOid)

    logger.info('Real-time updates started', { userOid })
  }

  const stopRealTimeUpdates = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
      logger.info('Real-time updates stopped')
    }
  }

  const refreshDashboard = async (userOid) => {
    await fetchDashboardData(userOid)
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
