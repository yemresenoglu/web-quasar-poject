import axios from 'axios'
import { createLogger } from 'src/utils/logger.js'
import cookieManager from './cookieManager.js'

const logger = createLogger('API')

const API_CONFIG = {
  baseURL: 'http://10.81.98.63/sigorta',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive'
  }
}

const apiClient = axios.create(API_CONFIG)

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
      cookies: cookieManager.getCookieInfo()
    })
    
    return config
  },
  (error) => {
    logger.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime
    
    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders) {
      setCookieHeaders.forEach(cookieString => {
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
      url: response.config.url
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
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      cookieManager.removeCookie('JSESSIONID')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
export { API_CONFIG }
