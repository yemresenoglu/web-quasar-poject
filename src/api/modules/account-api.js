// Account API Module
// Kullanıcı hesap işlemleri ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('AccountAPI')

/**
 * Account API modülü
 * Kullanıcı profil, şifre değiştirme işlemleri
 */
export const accountApiModule = {
  /**
   * Kullanıcı profil bilgilerini getir
   * @param {string} userOid - Kullanıcı OID
   * @returns {Promise<Object>} Profile response
   */
  async getUserProfile(userOid) {
    try {
      logger.info('Account API: Get user profile', { userOid })

      const response = await createBaseApi().dispatch('getUserProfile', { userOid })

      if (response.success) {
        logger.info('Account API: Profile retrieved successfully', { userOid })
      } else {
        logger.error('Account API: Get profile failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Account API: Get profile error', error)
      throw error
    }
  },

  /**
   * Kullanıcı profil bilgilerini güncelle
   * @param {string} userOid - Kullanıcı OID
   * @param {Object} profileData - Profil verileri
   * @param {string} profileData.firstName - Ad
   * @param {string} profileData.lastName - Soyad
   * @param {string} profileData.email - E-posta
   * @param {string} profileData.phone - Telefon
   * @returns {Promise<Object>} Update profile response
   */
  async updateUserProfile(userOid, profileData) {
    try {
      logger.info('Account API: Update user profile', { userOid })

      const response = await createBaseApi().dispatch('updateUserProfile', {
        userOid,
        ...profileData,
      })

      if (response.success) {
        logger.info('Account API: Profile updated successfully', { userOid })
      } else {
        logger.error('Account API: Update profile failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Account API: Update profile error', error)
      throw error
    }
  },

  /**
   * Şifre değiştir
   * @param {string} userOid - Kullanıcı OID
   * @param {Object} passwordData - Şifre verileri
   * @param {string} passwordData.currentPassword - Mevcut şifre
   * @param {string} passwordData.newPassword - Yeni şifre
   * @param {string} passwordData.confirmPassword - Şifre onayı
   * @returns {Promise<Object>} Change password response
   */
  async changePassword(userOid, passwordData) {
    try {
      logger.info('Account API: Change password', { userOid })

      const response = await createBaseApi().dispatch('changePassword', {
        userOid,
        ...passwordData,
      })

      if (response.success) {
        logger.info('Account API: Password changed successfully', { userOid })
      } else {
        logger.error('Account API: Change password failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Account API: Change password error', error)
      throw error
    }
  },
}

export default accountApiModule
