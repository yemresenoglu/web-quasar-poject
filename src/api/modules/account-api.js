// Account API Module
// Kullanıcı hesap işlemleri ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('AccountAPI')

/**
 * Account API modülü
 * Kullanıcı profil, department, task, ayarlar yönetimi
 */
export const accountApiModule = {
  /**
   * Kullanıcı profil bilgilerini getir
   * @returns {Promise<Object>} Profile response
   */
  async getUserProfile() {
    try {
      logger.info('Account API: Get user profile')
      
      const response = await createBaseApi().dispatch('getUserProfile', {})
      
      if (response.success) {
        logger.info('Account API: Profile retrieved successfully')
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
   * @param {Object} profileData - Profil verileri
   * @param {string} profileData.firstName - Ad
   * @param {string} profileData.lastName - Soyad
   * @param {string} profileData.email - E-posta
   * @param {string} profileData.phone - Telefon
   * @returns {Promise<Object>} Update profile response
   */
  async updateUserProfile(profileData) {
    try {
      logger.info('Account API: Update user profile')
      
      const response = await createBaseApi().dispatch('updateUserProfile', profileData)
      
      if (response.success) {
        logger.info('Account API: Profile updated successfully')
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
   * @param {Object} passwordData - Şifre verileri
   * @param {string} passwordData.currentPassword - Mevcut şifre
   * @param {string} passwordData.newPassword - Yeni şifre
   * @param {string} passwordData.confirmPassword - Şifre onayı
   * @returns {Promise<Object>} Change password response
   */
  async changePassword(passwordData) {
    try {
      logger.info('Account API: Change password')
      
      const response = await createBaseApi().dispatch('changePassword', passwordData)
      
      if (response.success) {
        logger.info('Account API: Password changed successfully')
      } else {
        logger.error('Account API: Change password failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Change password error', error)
      throw error
    }
  },

  /**
   * Department listesini getir
   * @returns {Promise<Object>} Departments response
   */
  async getDepartments() {
    try {
      logger.info('Account API: Get departments')
      
      const response = await createBaseApi().dispatch('getDepartments', {})
      
      if (response.success) {
        logger.info('Account API: Departments retrieved successfully')
      } else {
        logger.error('Account API: Get departments failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Get departments error', error)
      throw error
    }
  },

  /**
   * Task listesini getir
   * @returns {Promise<Object>} Tasks response
   */
  async getTaskList() {
    try {
      logger.info('Account API: Get task list')
      
      const response = await createBaseApi().dispatch('getTaskList', {})
      
      if (response.success) {
        logger.info('Account API: Task list retrieved successfully')
      } else {
        logger.error('Account API: Get task list failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Get task list error', error)
      throw error
    }
  },

  /**
   * Kullanıcı department seçimini güncelle
   * @param {string} departmentId - Department ID
   * @returns {Promise<Object>} Update department response
   */
  async updateUserDepartment(departmentId) {
    try {
      logger.info('Account API: Update user department', { departmentId })
      
      const response = await createBaseApi().dispatch('updateUserDepartment', {
        departmentId
      })
      
      if (response.success) {
        logger.info('Account API: User department updated successfully')
      } else {
        logger.error('Account API: Update user department failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Update user department error', error)
      throw error
    }
  },

  /**
   * Kullanıcı task seçimini güncelle
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Update task response
   */
  async updateUserTask(taskId) {
    try {
      logger.info('Account API: Update user task', { taskId })
      
      const response = await createBaseApi().dispatch('updateUserTask', {
        taskId
      })
      
      if (response.success) {
        logger.info('Account API: User task updated successfully')
      } else {
        logger.error('Account API: Update user task failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Update user task error', error)
      throw error
    }
  },

  /**
   * Kullanıcı ayarlarını getir
   * @returns {Promise<Object>} Settings response
   */
  async getUserSettings() {
    try {
      logger.info('Account API: Get user settings')
      
      const response = await createBaseApi().dispatch('getUserSettings', {})
      
      if (response.success) {
        logger.info('Account API: User settings retrieved successfully')
      } else {
        logger.error('Account API: Get user settings failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Get user settings error', error)
      throw error
    }
  },

  /**
   * Kullanıcı ayarlarını güncelle
   * @param {Object} settingsData - Ayarlar verileri
   * @param {string} settingsData.language - Dil
   * @param {string} settingsData.timezone - Saat dilimi
   * @param {string} settingsData.dateFormat - Tarih formatı
   * @param {string} settingsData.timeFormat - Saat formatı
   * @param {Object} settingsData.privacy - Gizlilik ayarları
   * @param {Object} settingsData.taskbar - Görev çubuğu ayarları
   * @returns {Promise<Object>} Update settings response
   */
  async updateUserSettings(settingsData) {
    try {
      logger.info('Account API: Update user settings')
      
      const response = await createBaseApi().dispatch('updateUserSettings', settingsData)
      
      if (response.success) {
        logger.info('Account API: User settings updated successfully')
      } else {
        logger.error('Account API: Update user settings failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Update user settings error', error)
      throw error
    }
  },

  /**
   * Dil ayarını güncelle
   * @param {string} language - Dil kodu (tr-TR, en-US)
   * @returns {Promise<Object>} Set language response
   */
  async setLanguage(language) {
    try {
      logger.info('Account API: Set language', { language })
      
      const response = await createBaseApi().dispatch('setLanguage', { language })
      
      if (response.success) {
        logger.info('Account API: Language set successfully')
      } else {
        logger.error('Account API: Set language failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Set language error', error)
      throw error
    }
  },

  /**
   * Kullanıcı yetkilerini getir
   * @returns {Promise<Object>} Permissions response
   */
  async getUserPermissions() {
    try {
      logger.info('Account API: Get user permissions')
      
      const response = await createBaseApi().dispatch('getUserPermissions', {})
      
      if (response.success) {
        logger.info('Account API: User permissions retrieved successfully')
      } else {
        logger.error('Account API: Get user permissions failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Get user permissions error', error)
      throw error
    }
  },

  /**
   * Kullanıcı aktivite geçmişini getir
   * @param {Object} filters - Filtre parametreleri
   * @param {Date} filters.baslangicTarihi - Başlangıç tarihi
   * @param {Date} filters.bitisTarihi - Bitiş tarihi
   * @param {number} filters.sayfa - Sayfa numarası
   * @param {number} filters.sayfaBoyutu - Sayfa boyutu
   * @returns {Promise<Object>} Activity history response
   */
  async getUserActivityHistory(filters = {}) {
    try {
      logger.info('Account API: Get user activity history', filters)
      
      const response = await createBaseApi().dispatch('getUserActivityHistory', filters)
      
      if (response.success) {
        logger.info('Account API: User activity history retrieved successfully')
      } else {
        logger.error('Account API: Get user activity history failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Account API: Get user activity history error', error)
      throw error
    }
  }
}

export default accountApiModule
