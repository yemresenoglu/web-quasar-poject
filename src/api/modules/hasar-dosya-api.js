// Hasar Dosya API Module
// Hasar dosya işlemleri ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'
import { getMockSearchResponse, searchByDosyaNo } from 'src/data/mock-hasar-dosya-data.js'

const logger = createLogger('HasarDosyaAPI')

/**
 * Hasar Dosya API modülü
 * Hasar dosya CRUD işlemleri, arama, filtreleme
 */
export const hasarDosyaApiModule = {
  /**
   * Hasar dosyalarını ara
   * @param {Object} searchParams - Arama parametreleri
   * @param {string} searchParams.dosyaNo - Dosya numarası
   * @param {string} searchParams.plaka - Plaka
   * @param {string} searchParams.ruhsatSahibi - Ruhsat sahibi
   * @param {string} searchParams.hasarTuru - Hasar türü
   * @param {string} searchParams.durum - Durum
   * @param {Date} searchParams.baslangicTarihi - Başlangıç tarihi
   * @param {Date} searchParams.bitisTarihi - Bitiş tarihi
   * @param {number} searchParams.sayfa - Sayfa numarası
   * @param {number} searchParams.sayfaBoyutu - Sayfa boyutu
   * @returns {Promise<Object>} Search response
   */
  async searchHasarFiles(searchParams = {}) {
    try {
      logger.info('Hasar Dosya API: Search files', searchParams)
      
      // Mock data kullanımı - geliştirme ortamında
      if (process.env.NODE_ENV === 'development') {
        logger.info('Using mock hasar dosya data for development')
        
        const { dosyaNo, victimNumber } = searchParams
        const mockResponse = getMockSearchResponse(dosyaNo, victimNumber)
        
        logger.info('Mock search successful', { 
          count: mockResponse.data.files.length,
          dosyaNo,
          victimNumber
        })
        
        return mockResponse
      }
      
      // Gerçek API çağrısı
      const response = await createBaseApi().dispatch('searchHasarFiles', searchParams)
      
      if (response.success) {
        logger.info('Hasar Dosya API: Search successful', { 
          count: response.data?.length || 0 
        })
      } else {
        logger.error('Hasar Dosya API: Search failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Search error', error)
      
      // Hata durumunda mock data döndür
      logger.info('Falling back to mock data due to error')
      const { dosyaNo, victimNumber } = searchParams
      return getMockSearchResponse(dosyaNo, victimNumber)
    }
  },

  /**
   * Hasar dosya detaylarını getir
   * @param {string} dosyaNo - Dosya numarası
   * @returns {Promise<Object>} File details response
   */
  async getHasarFileDetails(dosyaNo) {
    try {
      logger.info('Hasar Dosya API: Get file details', { dosyaNo })
      
      const response = await createBaseApi().dispatch('getHasarFileDetails', { dosyaNo })
      
      if (response.success) {
        logger.info('Hasar Dosya API: File details retrieved successfully')
      } else {
        logger.error('Hasar Dosya API: Get file details failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Get file details error', error)
      throw error
    }
  },

  /**
   * Yeni hasar dosyası oluştur
   * @param {Object} fileData - Dosya verileri
   * @param {string} fileData.dosyaNo - Dosya numarası
   * @param {string} fileData.plaka - Plaka
   * @param {string} fileData.ruhsatSahibi - Ruhsat sahibi
   * @param {string} fileData.hasarTuru - Hasar türü
   * @param {Date} fileData.hasarTarihi - Hasar tarihi
   * @param {string} fileData.aciklama - Açıklama
   * @returns {Promise<Object>} Create response
   */
  async createHasarFile(fileData) {
    try {
      logger.info('Hasar Dosya API: Create file', { dosyaNo: fileData.dosyaNo })
      
      const response = await createBaseApi().dispatch('createHasarFile', fileData)
      
      if (response.success) {
        logger.info('Hasar Dosya API: File created successfully')
      } else {
        logger.error('Hasar Dosya API: Create file failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Create file error', error)
      throw error
    }
  },

  /**
   * Hasar dosyasını güncelle
   * @param {string} dosyaNo - Dosya numarası
   * @param {Object} updateData - Güncellenecek veriler
   * @returns {Promise<Object>} Update response
   */
  async updateHasarFile(dosyaNo, updateData) {
    try {
      logger.info('Hasar Dosya API: Update file', { dosyaNo })
      
      const response = await createBaseApi().dispatch('updateHasarFile', {
        dosyaNo,
        ...updateData
      })
      
      if (response.success) {
        logger.info('Hasar Dosya API: File updated successfully')
      } else {
        logger.error('Hasar Dosya API: Update file failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Update file error', error)
      throw error
    }
  },

  /**
   * Hasar dosyasını sil
   * @param {string} dosyaNo - Dosya numarası
   * @returns {Promise<Object>} Delete response
   */
  async deleteHasarFile(dosyaNo) {
    try {
      logger.info('Hasar Dosya API: Delete file', { dosyaNo })
      
      const response = await createBaseApi().dispatch('deleteHasarFile', { dosyaNo })
      
      if (response.success) {
        logger.info('Hasar Dosya API: File deleted successfully')
      } else {
        logger.error('Hasar Dosya API: Delete file failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Delete file error', error)
      throw error
    }
  },

  /**
   * Dosya kapanış durumunu kontrol et
   * @param {string} oidHsrDosya - Hasar dosya OID
   * @returns {Promise<Object>} Check response
   */
  async isDosyakapali(oidHsrDosya) {
    try {
      logger.info('Hasar Dosya API: Check file closure', { oidHsrDosya })
      
      const response = await createBaseApi().dispatch('isDosyakapali', {
        oidHsrDosya
      })
      
      if (response.success) {
        logger.info('Hasar Dosya API: File closure check successful')
      } else {
        logger.error('Hasar Dosya API: File closure check failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: File closure check error', error)
      throw error
    }
  },

  /**
   * Hasar dosyasını kapat
   * @param {string} dosyaNo - Dosya numarası
   * @param {string} kapanisNedeni - Kapanış nedeni
   * @returns {Promise<Object>} Close response
   */
  async closeHasarFile(dosyaNo, kapanisNedeni) {
    try {
      logger.info('Hasar Dosya API: Close file', { dosyaNo })
      
      const response = await createBaseApi().dispatch('closeHasarFile', {
        dosyaNo,
        kapanisNedeni
      })
      
      if (response.success) {
        logger.info('Hasar Dosya API: File closed successfully')
      } else {
        logger.error('Hasar Dosya API: Close file failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Close file error', error)
      throw error
    }
  },

  /**
   * Hasar türlerini getir
   * @returns {Promise<Object>} Hasar types response
   */
  async getHasarTurleri() {
    try {
      logger.info('Hasar Dosya API: Get hasar types')
      
      const response = await createBaseApi().dispatch('getHasarTurleri', {})
      
      if (response.success) {
        logger.info('Hasar Dosya API: Hasar types retrieved successfully')
      } else {
        logger.error('Hasar Dosya API: Get hasar types failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Get hasar types error', error)
      throw error
    }
  },

  /**
   * Durumları getir
   * @returns {Promise<Object>} Statuses response
   */
  async getDurumlar() {
    try {
      logger.info('Hasar Dosya API: Get statuses')
      
      const response = await createBaseApi().dispatch('getDurumlar', {})
      
      if (response.success) {
        logger.info('Hasar Dosya API: Statuses retrieved successfully')
      } else {
        logger.error('Hasar Dosya API: Get statuses failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Get statuses error', error)
      throw error
    }
  },

  /**
   * Hasar dosya istatistiklerini getir
   * @param {Object} filters - Filtre parametreleri
   * @returns {Promise<Object>} Statistics response
   */
  async getHasarFileStatistics(filters = {}) {
    try {
      logger.info('Hasar Dosya API: Get statistics', filters)
      
      const response = await createBaseApi().dispatch('getHasarFileStatistics', filters)
      
      if (response.success) {
        logger.info('Hasar Dosya API: Statistics retrieved successfully')
      } else {
        logger.error('Hasar Dosya API: Get statistics failed', response.error)
      }
      
      return response
    } catch (error) {
      logger.error('Hasar Dosya API: Get statistics error', error)
      throw error
    }
  }
}

export default hasarDosyaApiModule
