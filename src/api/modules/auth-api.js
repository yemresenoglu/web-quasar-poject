// Auth API Module
// Authentication ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('AuthAPI')

/**
 * Auth API modülü
 * Login, logout, session yönetimi ve kullanıcı bilgileri
 */
export const authApiModule = {
  /**
   * Kullanıcı girişi
   * @param {Object} loginData - Giriş bilgileri
   * @param {string} loginData.userCode - Kullanıcı kodu
   * @param {string} loginData.password - Şifre
   * @param {string} loginData.captcha - Captcha kodu
   * @returns {Promise<Object>} Login response
   */
  async login(loginData) {
    try {
      logger.info('Auth API: Login attempt', { userCode: loginData.userCode })
      
      const response = await createBaseApi().dispatch('login', loginData)
      
      if (response.success) {
        logger.info('Auth API: Login successful')
      } else {
        logger.error('Auth API: Login failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Login error', error)
      throw error
    }
  },

  /**
   * Kullanıcı çıkışı
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      logger.info('Auth API: Logout attempt')
      
      const response = await createBaseApi().dispatch('logout', {})
      
      if (response.success) {
        logger.info('Auth API: Logout successful')
      } else {
        logger.warn('Auth API: Logout failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Logout error', error)
      throw error
    }
  },

  /**
   * Oturum kontrolü
   * @returns {Promise<Object>} Session check response
   */
  async checkSession() {
    try {
      logger.info('Auth API: Session check')
      
      const response = await createBaseApi().dispatch('checkSession', {})
      
      if (response.success) {
        logger.info('Auth API: Session valid')
      } else {
        logger.warn('Auth API: Session invalid', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Session check error', error)
      throw error
    }
  },

  /**
   * Token yenileme
   * @returns {Promise<Object>} Token refresh response
   */
  async refreshToken() {
    try {
      logger.info('Auth API: Token refresh')
      
      const response = await createBaseApi().dispatch('refreshToken', {})
      
      if (response.success) {
        logger.info('Auth API: Token refreshed successfully')
      } else {
        logger.error('Auth API: Token refresh failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Token refresh error', error)
      throw error
    }
  },

  /**
   * Kullanıcı bilgilerini getir
   * @returns {Promise<Object>} User info response
   */
  async getUserInfo() {
    try {
      logger.info('Auth API: Get user info')
      
      const response = await createBaseApi().dispatch('getUserInfo', {})
      
      if (response.success) {
        logger.info('Auth API: User info retrieved successfully')
      } else {
        logger.error('Auth API: Get user info failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Get user info error', error)
      throw error
    }
  },

  /**
   * Captcha getir
   * @returns {Promise<Object>} Captcha response
   */
  async getCaptcha() {
    try {
      logger.info('Auth API: Get captcha')
      
      const response = await createBaseApi().dispatch('getCaptcha', {})
      
      if (response.success) {
        logger.info('Auth API: Captcha retrieved successfully')
      } else {
        logger.error('Auth API: Get captcha failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Get captcha error', error)
      throw error
    }
  },

  /**
   * Şifre sıfırlama talebi
   * @param {string} userCode - Kullanıcı kodu
   * @param {string} email - E-posta adresi
   * @returns {Promise<Object>} Password reset response
   */
  async requestPasswordReset(userCode, email) {
    try {
      logger.info('Auth API: Password reset request', { userCode })
      
      const response = await createBaseApi().dispatch('requestPasswordReset', {
        userCode,
        email
      })
      
      if (response.success) {
        logger.info('Auth API: Password reset request successful')
      } else {
        logger.error('Auth API: Password reset request failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Password reset request error', error)
      throw error
    }
  },

  /**
   * Şifre sıfırlama onayı
   * @param {string} token - Reset token
   * @param {string} newPassword - Yeni şifre
   * @returns {Promise<Object>} Password reset confirm response
   */
  async confirmPasswordReset(token, newPassword) {
    try {
      logger.info('Auth API: Password reset confirm')
      
      const response = await createBaseApi().dispatch('confirmPasswordReset', {
        token,
        newPassword
      })
      
      if (response.success) {
        logger.info('Auth API: Password reset confirmed successfully')
      } else {
        logger.error('Auth API: Password reset confirm failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Auth API: Password reset confirm error', error)
      throw error
    }
  }
}

export default authApiModule
