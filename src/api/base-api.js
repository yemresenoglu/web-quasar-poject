// Base API
// Tüm API modülleri için ortak base fonksiyonlar

import apiClient from './index.js'
import { createLogger } from 'src/utils/logger.js'
import { v4 as uuidv4 } from 'uuid'

const logger = createLogger('BaseAPI')

/**
 * Call ID oluşturucu
 * @returns {string} Unique call ID
 */
const generateCallId = () => {
  return uuidv4().replace(/-/g, '').substring(0, 17)
}

/**
 * Base API client oluşturucu
 * @returns {Object} Base API client
 */
export const createBaseApi = () => {
  return {
    /**
     * Dispatch API çağrısı
     * @param {string} cmd - Komut adı
     * @param {Object} payload - Gönderilecek veri
     * @param {Object} options - Ek seçenekler
     * @returns {Promise<Object>} API response
     */
    async dispatch(cmd, payload = {}, options = {}) {
      try {
        const requestData = {
          cmd: cmd,
          callid: generateCallId(),
          jp: JSON.stringify(payload),
          ...options,
        }

        logger.info('Base API Dispatch:', { cmd, payload, requestData })

        const response = await apiClient.post('/dispatch', requestData)

        logger.info('Base API Response:', { 
          cmd, 
          status: response.status, 
          data: response.data 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
        }
      } catch (error) {
        logger.error('Base API Error:', { cmd, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    },

    /**
     * GET isteği
     * @param {string} endpoint - Endpoint
     * @param {Object} params - Query parametreleri
     * @returns {Promise<Object>} API response
     */
    async get(endpoint, params = {}) {
      try {
        logger.info('Base API GET:', { endpoint, params })

        const response = await apiClient.get(endpoint, { params })

        logger.info('Base API GET Response:', { 
          endpoint, 
          status: response.status, 
          data: response.data 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
        }
      } catch (error) {
        logger.error('Base API GET Error:', { endpoint, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    },

    /**
     * POST isteği
     * @param {string} endpoint - Endpoint
     * @param {Object} data - Gönderilecek veri
     * @param {Object} config - Axios config
     * @returns {Promise<Object>} API response
     */
    async post(endpoint, data = {}, config = {}) {
      try {
        logger.info('Base API POST:', { endpoint, data })

        const response = await apiClient.post(endpoint, data, config)

        logger.info('Base API POST Response:', { 
          endpoint, 
          status: response.status, 
          data: response.data 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
        }
      } catch (error) {
        logger.error('Base API POST Error:', { endpoint, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    },

    /**
     * PUT isteği
     * @param {string} endpoint - Endpoint
     * @param {Object} data - Gönderilecek veri
     * @param {Object} config - Axios config
     * @returns {Promise<Object>} API response
     */
    async put(endpoint, data = {}, config = {}) {
      try {
        logger.info('Base API PUT:', { endpoint, data })

        const response = await apiClient.put(endpoint, data, config)

        logger.info('Base API PUT Response:', { 
          endpoint, 
          status: response.status, 
          data: response.data 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
        }
      } catch (error) {
        logger.error('Base API PUT Error:', { endpoint, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    },

    /**
     * DELETE isteği
     * @param {string} endpoint - Endpoint
     * @param {Object} config - Axios config
     * @returns {Promise<Object>} API response
     */
    async delete(endpoint, config = {}) {
      try {
        logger.info('Base API DELETE:', { endpoint })

        const response = await apiClient.delete(endpoint, config)

        logger.info('Base API DELETE Response:', { 
          endpoint, 
          status: response.status, 
          data: response.data 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
        }
      } catch (error) {
        logger.error('Base API DELETE Error:', { endpoint, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    },

    /**
     * Dosya yükleme isteği
     * @param {string} endpoint - Endpoint
     * @param {FormData} formData - Form data
     * @param {Object} config - Axios config
     * @returns {Promise<Object>} API response
     */
    async upload(endpoint, formData, config = {}) {
      try {
        logger.info('Base API Upload:', { endpoint })

        const uploadConfig = {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...config.headers
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            logger.info('Upload Progress:', { endpoint, percentCompleted })
          },
          ...config
        }

        const response = await apiClient.post(endpoint, formData, uploadConfig)

        logger.info('Base API Upload Response:', { 
          endpoint, 
          status: response.status, 
          data: response.data 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
        }
      } catch (error) {
        logger.error('Base API Upload Error:', { endpoint, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    },

    /**
     * Dosya indirme isteği
     * @param {string} endpoint - Endpoint
     * @param {Object} params - Query parametreleri
     * @param {Object} config - Axios config
     * @returns {Promise<Object>} API response
     */
    async download(endpoint, params = {}, config = {}) {
      try {
        logger.info('Base API Download:', { endpoint, params })

        const downloadConfig = {
          responseType: 'blob',
          ...config
        }

        const response = await apiClient.get(endpoint, { 
          params, 
          ...downloadConfig 
        })

        logger.info('Base API Download Response:', { 
          endpoint, 
          status: response.status 
        })

        return {
          success: true,
          data: response.data,
          status: response.status,
          headers: response.headers
        }
      } catch (error) {
        logger.error('Base API Download Error:', { endpoint, error: error.message })

        return {
          success: false,
          error: error.message,
          status: error.response?.status || 0,
          details: error.response?.data || null
        }
      }
    }
  }
}

/**
 * API modülü factory fonksiyonu
 * @param {string} moduleName - Modül adı
 * @returns {Object} API modülü instance'ı
 */
export const createApiModule = (moduleName) => {
  const baseApi = createBaseApi()
  
  return {
    ...baseApi,
    moduleName,
    
    /**
     * Modül adı ile dispatch
     * @param {string} cmd - Komut adı
     * @param {Object} payload - Gönderilecek veri
     * @param {Object} options - Ek seçenekler
     * @returns {Promise<Object>} API response
     */
    async moduleDispatch(cmd, payload = {}, options = {}) {
      const fullCmd = `${moduleName}_${cmd}`
      return baseApi.dispatch(fullCmd, payload, options)
    }
  }
}

/**
 * API response helper fonksiyonları
 */
export const apiHelpers = {
  /**
   * Response başarılı mı kontrol et
   * @param {Object} response - API response
   * @returns {boolean} Başarılı mı
   */
  isSuccess: (response) => {
    return response && response.success === true
  },

  /**
   * Response'dan data al
   * @param {Object} response - API response
   * @param {*} defaultValue - Varsayılan değer
   * @returns {*} Response data
   */
  getData: (response, defaultValue = null) => {
    return apiHelpers.isSuccess(response) ? response.data : defaultValue
  },

  /**
   * Response'dan error al
   * @param {Object} response - API response
   * @param {string} defaultValue - Varsayılan hata mesajı
   * @returns {string} Error message
   */
  getError: (response, defaultValue = 'Bilinmeyen hata') => {
    return !apiHelpers.isSuccess(response) ? (response.error || defaultValue) : null
  },

  /**
   * Response'dan status al
   * @param {Object} response - API response
   * @returns {number} HTTP status
   */
  getStatus: (response) => {
    return response ? response.status : 0
  }
}

export default createBaseApi
