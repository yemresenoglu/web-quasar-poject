// Base URL Constants
const DEV_BASE_URL = 'http://10.81.98.63'
const LOCAL_BASE_URL = 'http://localhost:8080'
const PROD_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://api.sompo.com'

/**
 * Environment-based base URL selection
 * @returns {string} Base URL for current environment
 */
function getEnvironmentBaseUrl() {
  // Force mock data in development
  if (process.env.NODE_ENV === 'development') {
    return LOCAL_BASE_URL
  }

  // Production environment
  if (process.env.NODE_ENV === 'production') {
    return PROD_BASE_URL
  }

  // Default to local for other environments
  return LOCAL_BASE_URL
}

// API Configuration Constants
export const API_CONFIG = {
  // Development server URL (external)
  DEV_BASE_URL: DEV_BASE_URL,

  // Local backend API URL (Spring Boot backend)
  LOCAL_BASE_URL: LOCAL_BASE_URL,

  // Production backend API URL
  PROD_BASE_URL: PROD_BASE_URL,

  // Current environment - Backend API URL
  // Frontend runs on localhost:8086 (Quasar dev server)
  // Backend runs on localhost:8080 (Spring Boot)
  CURRENT_BASE_URL: getEnvironmentBaseUrl(),

  // API Endpoints
  ENDPOINTS: {
    DISPATCH: '/sigorta/dispatch',
    CAPTCHA: '/sigorta/simpleCaptcha.png',
    AUTH: '/api/auth',
    USER: '/api/user',
    DASHBOARD: '/api/dashboard',
    MENU: '/api/menu',
    HASAR: '/api/hasar',
    ACCOUNT: '/api/account',
  },

  // Environment Configuration
  ENVIRONMENT: {
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    USE_MOCK_DATA: process.env.VUE_APP_USE_MOCK_DATA === 'true',
    API_TIMEOUT: parseInt(process.env.VUE_APP_API_TIMEOUT) || 30000,
    ENABLE_LOGGING: process.env.VUE_APP_ENABLE_LOGGING === 'true',
  },
}

// Helper function to get full URL for an endpoint
export const getApiUrl = (endpoint = '') => {
  return `${API_CONFIG.CURRENT_BASE_URL}${endpoint}`
}

// Helper function to get base URL only
export const getBaseUrl = () => {
  return API_CONFIG.CURRENT_BASE_URL
}

// Helper function to get captcha URL
export const getCaptchaUrl = () => {
  return `${API_CONFIG.DEV_BASE_URL}${API_CONFIG.ENDPOINTS.CAPTCHA}`
}

// Helper function to check if should use mock data
export const shouldUseMockData = () => {
  return API_CONFIG.ENVIRONMENT.IS_DEVELOPMENT || API_CONFIG.ENVIRONMENT.USE_MOCK_DATA
}

// Helper function to get environment info
export const getEnvironmentInfo = () => {
  return {
    environment: process.env.NODE_ENV,
    baseUrl: API_CONFIG.CURRENT_BASE_URL,
    useMockData: shouldUseMockData(),
    timeout: API_CONFIG.ENVIRONMENT.API_TIMEOUT,
    enableLogging: API_CONFIG.ENVIRONMENT.ENABLE_LOGGING,
  }
}

// Backend Integration Helper Functions
export const backendHelpers = {
  /**
   * Check if backend is available
   * @returns {Promise<boolean>}
   */
  async checkBackendHealth() {
    try {
      const response = await fetch(`${API_CONFIG.CURRENT_BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000,
      })
      return response.ok
    } catch {
      return false
    }
  },

  /**
   * Get backend status information
   * @returns {Object}
   */
  getBackendStatus() {
    return {
      baseUrl: API_CONFIG.CURRENT_BASE_URL,
      environment: process.env.NODE_ENV,
      useMockData: shouldUseMockData(),
      endpoints: API_CONFIG.ENDPOINTS,
    }
  },
}
