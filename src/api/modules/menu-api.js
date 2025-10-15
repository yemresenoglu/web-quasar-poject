// Menu API Module
// Menü yönetimi ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('MenuAPI')

/**
 * Menu API modülü
 * Menü yapısı, quick access, arama işlemleri
 */
export const menuApiModule = {
  /**
   * Menü yapısını getir
   * @returns {Promise<Object>} Menu structure response
   */
  async getMenuData() {
    try {
      logger.info('Menu API: Get menu data')
      
      const response = await createBaseApi().dispatch('getMenuItems', {})
      
      if (response.success) {
        logger.info('Menu API: Menu data retrieved successfully')
      } else {
        logger.error('Menu API: Get menu data failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Get menu data error', error)
      throw error
    }
  },

  /**
   * Menü kategorilerini getir
   * @returns {Promise<Object>} Menu categories response
   */
  async getMenuCategories() {
    try {
      logger.info('Menu API: Get menu categories')
      
      const response = await createBaseApi().dispatch('getMenuCategories', {})
      
      if (response.success) {
        logger.info('Menu API: Menu categories retrieved successfully')
      } else {
        logger.error('Menu API: Get menu categories failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Get menu categories error', error)
      throw error
    }
  },

  /**
   * Menü öğelerini getir
   * @param {string} categoryId - Kategori ID
   * @returns {Promise<Object>} Menu items response
   */
  async getMenuItems(categoryId = null) {
    try {
      logger.info('Menu API: Get menu items', { categoryId })
      
      const response = await createBaseApi().dispatch('getMenuItems', { categoryId })
      
      if (response.success) {
        logger.info('Menu API: Menu items retrieved successfully')
      } else {
        logger.error('Menu API: Get menu items failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Get menu items error', error)
      throw error
    }
  },

  /**
   * Quick access öğelerini getir
   * @returns {Promise<Object>} Quick access items response
   */
  async getQuickAccessItems() {
    try {
      logger.info('Menu API: Get quick access items')
      
      const response = await createBaseApi().dispatch('getQuickAccessItems', {})
      
      if (response.success) {
        logger.info('Menu API: Quick access items retrieved successfully')
      } else {
        logger.error('Menu API: Get quick access items failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Get quick access items error', error)
      throw error
    }
  },

  /**
   * Menü öğesini quick access'e ekle
   * @param {string} itemId - Menü öğe ID
   * @returns {Promise<Object>} Add to quick access response
   */
  async addToQuickAccess(itemId) {
    try {
      logger.info('Menu API: Add to quick access', { itemId })
      
      const response = await createBaseApi().dispatch('addToQuickAccess', { itemId })
      
      if (response.success) {
        logger.info('Menu API: Item added to quick access successfully')
      } else {
        logger.error('Menu API: Add to quick access failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Add to quick access error', error)
      throw error
    }
  },

  /**
   * Menü öğesini quick access'ten kaldır
   * @param {string} itemId - Menü öğe ID
   * @returns {Promise<Object>} Remove from quick access response
   */
  async removeFromQuickAccess(itemId) {
    try {
      logger.info('Menu API: Remove from quick access', { itemId })
      
      const response = await createBaseApi().dispatch('removeFromQuickAccess', { itemId })
      
      if (response.success) {
        logger.info('Menu API: Item removed from quick access successfully')
      } else {
        logger.error('Menu API: Remove from quick access failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Remove from quick access error', error)
      throw error
    }
  },

  /**
   * Menü arama
   * @param {string} searchTerm - Arama terimi
   * @returns {Promise<Object>} Menu search response
   */
  async searchMenu(searchTerm) {
    try {
      logger.info('Menu API: Search menu', { searchTerm })
      
      const response = await createBaseApi().dispatch('searchMenu', { searchTerm })
      
      if (response.success) {
        logger.info('Menu API: Menu search successful', { 
          resultCount: response.data?.length || 0 
        })
      } else {
        logger.error('Menu API: Menu search failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Menu search error', error)
      throw error
    }
  },

  /**
   * Menü öğesi detaylarını getir
   * @param {string} itemId - Menü öğe ID
   * @returns {Promise<Object>} Menu item details response
   */
  async getMenuItemDetails(itemId) {
    try {
      logger.info('Menu API: Get menu item details', { itemId })
      
      const response = await createBaseApi().dispatch('getMenuItemDetails', { itemId })
      
      if (response.success) {
        logger.info('Menu API: Menu item details retrieved successfully')
      } else {
        logger.error('Menu API: Get menu item details failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Get menu item details error', error)
      throw error
    }
  },

  /**
   * Menü öğesi kullanım istatistiklerini getir
   * @param {string} itemId - Menü öğe ID
   * @param {Object} filters - Filtre parametreleri
   * @param {Date} filters.baslangicTarihi - Başlangıç tarihi
   * @param {Date} filters.bitisTarihi - Bitiş tarihi
   * @returns {Promise<Object>} Menu item statistics response
   */
  async getMenuItemStatistics(itemId, filters = {}) {
    try {
      logger.info('Menu API: Get menu item statistics', { itemId, filters })
      
      const response = await createBaseApi().dispatch('getMenuItemStatistics', {
        itemId,
        ...filters
      })
      
      if (response.success) {
        logger.info('Menu API: Menu item statistics retrieved successfully')
      } else {
        logger.error('Menu API: Get menu item statistics failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Menu API: Get menu item statistics error', error)
      throw error
    }
  },

  /**
   * Menü öğesi kullanım kaydı oluştur
   * @param {string} itemId - Menü öğe ID
   * @param {string} action - Yapılan işlem ('click', 'open', 'search')
   * @returns {Promise<Object>} Log menu usage response
   */
  async logMenuItemUsage(itemId, action) {
    try {
      logger.info('Menu API: Log menu item usage', { itemId, action })
      
      const response = await createBaseApi().dispatch('logMenuItemUsage', {
        itemId,
        action,
        timestamp: new Date().toISOString()
      })
      
      if (response.success) {
        logger.info('Menu API: Menu item usage logged successfully')
      } else {
        logger.warn('Menu API: Log menu item usage failed', response.error)
        // Bu hata kritik değil, sadece log
      }
      
      return response
    } catch (error) {
      logger.warn('Menu API: Log menu item usage error', error)
      // Bu hata kritik değil, sadece log
      return { success: false, error: error.message }
    }
  }
}

export default menuApiModule
