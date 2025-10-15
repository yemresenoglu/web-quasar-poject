// Dashboard API Module
// Dashboard ve raporlama ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('DashboardAPI')

/**
 * Dashboard API modülü
 * Dashboard verileri, istatistikler, raporlar
 */
export const dashboardApiModule = {
  /**
   * Dashboard ana verilerini getir
   * @returns {Promise<Object>} Dashboard data response
   */
  async getDashboardData() {
    try {
      logger.info('Dashboard API: Get dashboard data')
      
      const response = await createBaseApi().dispatch('getDashboardData', {})
      
      if (response.success) {
        logger.info('Dashboard API: Dashboard data retrieved successfully')
      } else {
        logger.error('Dashboard API: Get dashboard data failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get dashboard data error', error)
      throw error
    }
  },

  /**
   * Hasar istatistiklerini getir
   * @param {Object} filters - Filtre parametreleri
   * @param {Date} filters.baslangicTarihi - Başlangıç tarihi
   * @param {Date} filters.bitisTarihi - Bitiş tarihi
   * @param {string} filters.departmentId - Department ID
   * @param {string} filters.hasarTuru - Hasar türü
   * @returns {Promise<Object>} Statistics response
   */
  async getHasarStatistics(filters = {}) {
    try {
      logger.info('Dashboard API: Get hasar statistics', filters)
      
      const response = await createBaseApi().dispatch('getHasarStatistics', filters)
      
      if (response.success) {
        logger.info('Dashboard API: Hasar statistics retrieved successfully')
      } else {
        logger.error('Dashboard API: Get hasar statistics failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get hasar statistics error', error)
      throw error
    }
  },

  /**
   * Performans raporlarını getir
   * @param {Object} filters - Filtre parametreleri
   * @param {string} filters.raporTuru - Rapor türü ('gunluk', 'haftalik', 'aylik')
   * @param {Date} filters.baslangicTarihi - Başlangıç tarihi
   * @param {Date} filters.bitisTarihi - Bitiş tarihi
   * @returns {Promise<Object>} Performance report response
   */
  async getPerformanceReports(filters = {}) {
    try {
      logger.info('Dashboard API: Get performance reports', filters)
      
      const response = await createBaseApi().dispatch('getPerformanceReports', filters)
      
      if (response.success) {
        logger.info('Dashboard API: Performance reports retrieved successfully')
      } else {
        logger.error('Dashboard API: Get performance reports failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get performance reports error', error)
      throw error
    }
  },

  /**
   * Grafik verilerini getir
   * @param {Object} options - Grafik seçenekleri
   * @param {string} options.grafikTuru - Grafik türü ('pie', 'line', 'bar')
   * @param {string} options.veriTuru - Veri türü ('hasar', 'evrak', 'eksper')
   * @param {Object} options.filters - Filtre parametreleri
   * @returns {Promise<Object>} Chart data response
   */
  async getChartData(options = {}) {
    try {
      logger.info('Dashboard API: Get chart data', options)
      
      const response = await createBaseApi().dispatch('getChartData', options)
      
      if (response.success) {
        logger.info('Dashboard API: Chart data retrieved successfully')
      } else {
        logger.error('Dashboard API: Get chart data failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get chart data error', error)
      throw error
    }
  },

  /**
   * Duyuruları getir
   * @param {Object} filters - Filtre parametreleri
   * @param {number} filters.sayfa - Sayfa numarası
   * @param {number} filters.sayfaBoyutu - Sayfa boyutu
   * @param {boolean} filters.sadeceAktif - Sadece aktif duyurular
   * @returns {Promise<Object>} Announcements response
   */
  async getAnnouncements(filters = {}) {
    try {
      logger.info('Dashboard API: Get announcements', filters)
      
      const response = await createBaseApi().dispatch('getAnnouncements', filters)
      
      if (response.success) {
        logger.info('Dashboard API: Announcements retrieved successfully')
      } else {
        logger.error('Dashboard API: Get announcements failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get announcements error', error)
      throw error
    }
  },

  /**
   * Kullanıcı konum bilgisini getir
   * @returns {Promise<Object>} User location response
   */
  async getUserLocation() {
    try {
      logger.info('Dashboard API: Get user location')
      
      const response = await createBaseApi().dispatch('getUserLocation', {})
      
      if (response.success) {
        logger.info('Dashboard API: User location retrieved successfully')
      } else {
        logger.error('Dashboard API: Get user location failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get user location error', error)
      throw error
    }
  },

  /**
   * İş durumu istatistiklerini getir
   * @param {Object} filters - Filtre parametreleri
   * @param {string} filters.userId - Kullanıcı ID
   * @param {string} filters.departmentId - Department ID
   * @returns {Promise<Object>} Job status statistics response
   */
  async getJobStatusStatistics(filters = {}) {
    try {
      logger.info('Dashboard API: Get job status statistics', filters)
      
      const response = await createBaseApi().dispatch('getJobStatusStatistics', filters)
      
      if (response.success) {
        logger.info('Dashboard API: Job status statistics retrieved successfully')
      } else {
        logger.error('Dashboard API: Get job status statistics failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get job status statistics error', error)
      throw error
    }
  },

  /**
   * Süreç istatistiklerini getir
   * @param {Object} filters - Filtre parametreleri
   * @param {Date} filters.baslangicTarihi - Başlangıç tarihi
   * @param {Date} filters.bitisTarihi - Bitiş tarihi
   * @returns {Promise<Object>} Process statistics response
   */
  async getProcessStatistics(filters = {}) {
    try {
      logger.info('Dashboard API: Get process statistics', filters)
      
      const response = await createBaseApi().dispatch('getProcessStatistics', filters)
      
      if (response.success) {
        logger.info('Dashboard API: Process statistics retrieved successfully')
      } else {
        logger.error('Dashboard API: Get process statistics failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get process statistics error', error)
      throw error
    }
  },

  /**
   * Özet rapor oluştur
   * @param {Object} reportOptions - Rapor seçenekleri
   * @param {string} reportOptions.raporTuru - Rapor türü
   * @param {Object} reportOptions.filters - Filtre parametreleri
   * @param {string} reportOptions.format - Format ('pdf', 'excel', 'csv')
   * @returns {Promise<Object>} Summary report response
   */
  async generateSummaryReport(reportOptions = {}) {
    try {
      logger.info('Dashboard API: Generate summary report', reportOptions)
      
      const response = await createBaseApi().dispatch('generateSummaryReport', reportOptions)
      
      if (response.success) {
        logger.info('Dashboard API: Summary report generated successfully')
      } else {
        logger.error('Dashboard API: Generate summary report failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Generate summary report error', error)
      throw error
    }
  },

  /**
   * Dashboard widget'larını getir
   * @returns {Promise<Object>} Dashboard widgets response
   */
  async getDashboardWidgets() {
    try {
      logger.info('Dashboard API: Get dashboard widgets')
      
      const response = await createBaseApi().dispatch('getDashboardWidgets', {})
      
      if (response.success) {
        logger.info('Dashboard API: Dashboard widgets retrieved successfully')
      } else {
        logger.error('Dashboard API: Get dashboard widgets failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Dashboard API: Get dashboard widgets error', error)
      throw error
    }
  }
}

export default dashboardApiModule
