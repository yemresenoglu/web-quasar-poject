import axios from 'axios'
import { createLogger } from 'src/utils/logger.js'
import cookieManager from './cookieManager.js'
import { getBaseUrl, API_CONFIG, shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

const logger = createLogger('API')

// Dynamic API Configuration based on environment
const createApiConfig = () => {
  const envInfo = getEnvironmentInfo()

  return {
    baseURL: getBaseUrl(),
    timeout: envInfo.timeout,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate',
      Connection: 'keep-alive',
      // Backend integration headers
      'X-Requested-With': 'XMLHttpRequest',
      'X-Environment': envInfo.environment,
      'X-Mock-Data': shouldUseMockData() ? 'true' : 'false',
    },
  }
}

const DYNAMIC_API_CONFIG = createApiConfig()

const apiClient = axios.create(DYNAMIC_API_CONFIG)

apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }

    const cookieHeader = cookieManager.getCookieHeader()
    if (cookieHeader) {
      config.headers.Cookie = cookieHeader
    }

    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.data = new URLSearchParams(config.data).toString()
    }

    logger.info('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      cookies: cookieManager.getCookieInfo(),
    })

    return config
  },
  (error) => {
    logger.error('API Request Error:', error)
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime

    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookieString) => {
        const [nameValue] = cookieString.split(';')
        const [name, value] = nameValue.split('=')
        if (name && value) {
          cookieManager.setCookie(name, value)
        }
      })
    }

    logger.info('API Response:', {
      status: response.status,
      duration: `${duration}ms`,
      url: response.config.url,
    })

    return response
  },
  (error) => {
    const duration = error.config?.metadata?.startTime
      ? new Date() - error.config.metadata.startTime
      : 0

    logger.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      duration: `${duration}ms`,
      url: error.config?.url,
    })

    if (error.response?.status === 401) {
      cookieManager.removeCookie('JSESSIONID')
    }

    return Promise.reject(error)
  },
)

export default apiClient
export { API_CONFIG, DYNAMIC_API_CONFIG }

// Backend Integration Utilities
export const apiIntegrationUtils = {
  /**
   * Check if backend is available
   * @returns {Promise<boolean>}
   */
  async checkBackendHealth() {
    try {
      const response = await apiClient.get('/health')
      return response.status === 200
    } catch (error) {
      logger.warn('Backend health check failed:', error.message)
      return false
    }
  },

  /**
   * Get current API configuration
   * @returns {Object}
   */
  getCurrentConfig() {
    return {
      baseURL: DYNAMIC_API_CONFIG.baseURL,
      timeout: DYNAMIC_API_CONFIG.timeout,
      useMockData: shouldUseMockData(),
      environment: getEnvironmentInfo().environment,
    }
  },

  /**
   * Switch to backend mode (disable mock data)
   * @returns {void}
   */
  enableBackendMode() {
    // This would require restarting the app or dynamic config reload
    logger.info('Backend mode activation requires app restart')
  },

  /**
   * Switch to mock mode (enable mock data)
   * @returns {void}
   */
  enableMockMode() {
    // This would require restarting the app or dynamic config reload
    logger.info('Mock mode activation requires app restart')
  },
}
