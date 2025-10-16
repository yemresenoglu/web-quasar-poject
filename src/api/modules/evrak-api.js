// Evrak API Module
// Evrak yönetimi ile ilgili tüm API çağrıları

import { createBaseApi } from '../base-api.js'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('EvrakAPI')

/**
 * Evrak API modülü
 * Evrak yükleme, listeleme, silme, onaylama işlemleri
 */
export const evrakApiModule = {
  /**
   * Hasar dosya evraklarını getir
   * @param {string} userOid - Kullanıcı OID
   * @param {string} dosyaNo - Dosya numarası
   * @param {Object} options - Seçenekler
   * @param {string} options.evrakTuru - Evrak türü filtresi
   * @param {string} options.durum - Durum filtresi
   * @param {boolean} options.sadeceAktif - Sadece aktif evraklar
   * @returns {Promise<Object>} Hasar dosya evrak response
   */
  async getHasarDosyaEvrak(userOid, dosyaNo, options = {}) {
    try {
      logger.info('Evrak API: Get hasar dosya evrak', { userOid, dosyaNo, options })

      const response = await createBaseApi().dispatch('getHasarDosyaEvrak', {
        userOid,
        dosyaNo,
        ...options,
      })

      if (response.success) {
        logger.info('Evrak API: Hasar dosya evrak retrieved successfully', {
          userOid,
          dosyaNo,
          count: response.data?.length || 0,
        })
      } else {
        logger.error('Evrak API: Get hasar dosya evrak failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Get hasar dosya evrak error', error)
      throw error
    }
  },

  /**
   * Evrak listesini getir
   * @param {string} dosyaNo - Dosya numarası
   * @returns {Promise<Object>} Evrak list response
   */
  async getEvrakList(dosyaNo) {
    try {
      logger.info('Evrak API: Get evrak list', { dosyaNo })

      const response = await createBaseApi().dispatch('getEvrakList', { dosyaNo })

      if (response.success) {
        logger.info('Evrak API: Evrak list retrieved successfully', {
          count: response.data?.length || 0,
        })
      } else {
        logger.error('Evrak API: Get evrak list failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Get evrak list error', error)
      throw error
    }
  },

  /**
   * Yeni evrak ekle
   * @param {string} userOid - Kullanıcı OID
   * @param {string} dosyaNo - Dosya numarası
   * @param {Object} evrakData - Evrak verileri
   * @param {string} evrakData.evrakTuru - Evrak türü
   * @param {string} evrakData.evrakAdi - Evrak adı
   * @param {File} evrakData.dosya - Evrak dosyası
   * @param {string} evrakData.aciklama - Açıklama
   * @returns {Promise<Object>} Add evrak response
   */
  async addEvrak(userOid, dosyaNo, evrakData) {
    try {
      logger.info('Evrak API: Add evrak', { userOid, dosyaNo, evrakTuru: evrakData.evrakTuru })

      // FormData oluştur (dosya yükleme için)
      const formData = new FormData()
      formData.append('userOid', userOid)
      formData.append('dosyaNo', dosyaNo)
      formData.append('evrakTuru', evrakData.evrakTuru)
      formData.append('evrakAdi', evrakData.evrakAdi)
      formData.append('dosya', evrakData.dosya)
      formData.append('aciklama', evrakData.aciklama || '')

      const response = await createBaseApi().dispatch('addEvrak', formData)

      if (response.success) {
        logger.info('Evrak API: Evrak added successfully', { userOid, dosyaNo })
      } else {
        logger.error('Evrak API: Add evrak failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Add evrak error', error)
      throw error
    }
  },

  /**
   * Evrak güncelle
   * @param {string} evrakId - Evrak ID
   * @param {Object} updateData - Güncellenecek veriler
   * @returns {Promise<Object>} Update evrak response
   */
  async updateEvrak(evrakId, updateData) {
    try {
      logger.info('Evrak API: Update evrak', { evrakId })

      const response = await createBaseApi().dispatch('updateEvrak', {
        evrakId,
        ...updateData,
      })

      if (response.success) {
        logger.info('Evrak API: Evrak updated successfully')
      } else {
        logger.error('Evrak API: Update evrak failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Update evrak error', error)
      throw error
    }
  },

  /**
   * Evrak sil
   * @param {string} evrakId - Evrak ID
   * @returns {Promise<Object>} Delete evrak response
   */
  async deleteEvrak(evrakId) {
    try {
      logger.info('Evrak API: Delete evrak', { evrakId })

      const response = await createBaseApi().dispatch('deleteEvrak', { evrakId })

      if (response.success) {
        logger.info('Evrak API: Evrak deleted successfully')
      } else {
        logger.error('Evrak API: Delete evrak failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Delete evrak error', error)
      throw error
    }
  },

  /**
   * Evrak onayla
   * @param {string} evrakId - Evrak ID
   * @param {string} onayDurumu - Onay durumu ('onaylandi', 'reddedildi')
   * @param {string} onayNotu - Onay notu
   * @returns {Promise<Object>} Approve evrak response
   */
  async approveEvrak(evrakId, onayDurumu, onayNotu = '') {
    try {
      logger.info('Evrak API: Approve evrak', { evrakId, onayDurumu })

      const response = await createBaseApi().dispatch('approveEvrak', {
        evrakId,
        onayDurumu,
        onayNotu,
      })

      if (response.success) {
        logger.info('Evrak API: Evrak approved successfully')
      } else {
        logger.error('Evrak API: Approve evrak failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Approve evrak error', error)
      throw error
    }
  },

  /**
   * Evrak türlerini getir
   * @returns {Promise<Object>} Evrak types response
   */
  async getEvrakTurleri() {
    try {
      logger.info('Evrak API: Get evrak types')

      const response = await createBaseApi().dispatch('getEvrakTurleri', {})

      if (response.success) {
        logger.info('Evrak API: Evrak types retrieved successfully')
      } else {
        logger.error('Evrak API: Get evrak types failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Get evrak types error', error)
      throw error
    }
  },

  /**
   * Evrak indir
   * @param {string} evrakId - Evrak ID
   * @returns {Promise<Blob>} Evrak dosyası
   */
  async downloadEvrak(evrakId) {
    try {
      logger.info('Evrak API: Download evrak', { evrakId })

      const response = await createBaseApi().dispatch('downloadEvrak', { evrakId })

      if (response.success) {
        logger.info('Evrak API: Evrak downloaded successfully')
        return response.data // Blob data
      } else {
        logger.error('Evrak API: Download evrak failed', response.error)
        throw new Error(response.error)
      }
    } catch (error) {
      logger.error('Evrak API: Download evrak error', error)
      throw error
    }
  },

  /**
   * Evrak önizleme URL'i getir
   * @param {string} evrakId - Evrak ID
   * @returns {Promise<Object>} Preview URL response
   */
  async getEvrakPreviewUrl(evrakId) {
    try {
      logger.info('Evrak API: Get evrak preview URL', { evrakId })

      const response = await createBaseApi().dispatch('getEvrakPreviewUrl', { evrakId })

      if (response.success) {
        logger.info('Evrak API: Evrak preview URL retrieved successfully')
      } else {
        logger.error('Evrak API: Get evrak preview URL failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Get evrak preview URL error', error)
      throw error
    }
  },

  /**
   * Toplu evrak yükleme
   * @param {string} dosyaNo - Dosya numarası
   * @param {FileList} dosyalar - Yüklenecek dosyalar
   * @returns {Promise<Object>} Bulk upload response
   */
  async bulkUploadEvrak(dosyaNo, dosyalar) {
    try {
      logger.info('Evrak API: Bulk upload evrak', { dosyaNo, dosyaSayisi: dosyalar.length })

      const formData = new FormData()
      formData.append('dosyaNo', dosyaNo)

      Array.from(dosyalar).forEach((dosya, index) => {
        formData.append(`dosyalar[${index}]`, dosya)
      })

      const response = await createBaseApi().dispatch('bulkUploadEvrak', formData)

      if (response.success) {
        logger.info('Evrak API: Bulk upload successful')
      } else {
        logger.error('Evrak API: Bulk upload failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Bulk upload error', error)
      throw error
    }
  },

  /**
   * Evrak arama
   * @param {Object} searchParams - Arama parametreleri
   * @param {string} searchParams.dosyaNo - Dosya numarası
   * @param {string} searchParams.evrakTuru - Evrak türü
   * @param {string} searchParams.evrakAdi - Evrak adı
   * @param {string} searchParams.durum - Durum
   * @param {Date} searchParams.baslangicTarihi - Başlangıç tarihi
   * @param {Date} searchParams.bitisTarihi - Bitiş tarihi
   * @returns {Promise<Object>} Search response
   */
  async searchEvrak(searchParams = {}) {
    try {
      logger.info('Evrak API: Search evrak', searchParams)

      const response = await createBaseApi().dispatch('searchEvrak', searchParams)

      if (response.success) {
        logger.info('Evrak API: Search successful', {
          count: response.data?.length || 0,
        })
      } else {
        logger.error('Evrak API: Search failed', response.error)
      }

      return response
    } catch (error) {
      logger.error('Evrak API: Search error', error)
      throw error
    }
  },
}

export default evrakApiModule
