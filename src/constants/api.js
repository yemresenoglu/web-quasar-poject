// API Configuration Constants
export const API_CONFIG = {
  // Development server URL (external)
  DEV_BASE_URL: 'http://10.81.98.63',
  
  // Local backend API URL (Spring Boot backend)
  LOCAL_BASE_URL: 'http://localhost:8080',
  
  // Current environment - Backend API URL
  // Frontend runs on localhost:8086 (Quasar dev server)
  // Backend runs on localhost:8080 (Spring Boot)
  CURRENT_BASE_URL: 'http://localhost:8080', // Change this to switch environments
  
  // API Endpoints
  ENDPOINTS: {
    DISPATCH: '/sigorta/dispatch',
    CAPTCHA: '/sigorta/simpleCaptcha.png'
  }
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
