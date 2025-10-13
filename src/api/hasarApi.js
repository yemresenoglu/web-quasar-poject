import apiClient from './index.js'
import { createLogger } from 'src/utils/logger.js'
import { v4 as uuidv4 } from 'uuid'

const logger = createLogger('HasarAPI')

const generateCallId = () => {
  return uuidv4().replace(/-/g, '').substring(0, 17)
}

const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 13; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const hasarApi = {
  
  async dispatch(cmd, payload = {}, options = {}) {
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.info('Development mode: Mock response for', { cmd, payload })
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return {
          success: true,
          data: { 
            message: `Mock response for ${cmd}`,
            cmd,
            payload,
            timestamp: new Date().toISOString()
          },
          status: 200
        }
      }

      const requestData = {
        cmd: cmd,
        callid: generateCallId(),
        token: generateToken(),
        jp: JSON.stringify(payload),
        ...options
      }

      logger.info('Dispatch request:', { cmd, payload, requestData })

      const response = await apiClient.post('/dispatch', requestData)
      
      logger.info('Dispatch response:', { cmd, status: response.status, data: response.data })
      
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } catch (error) {
      logger.error('Dispatch error:', { cmd, error: error.message })
      
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 0
      }
    }
  },

  async isDosyakapali(oidHsrDosya) {
    return this.dispatch('isDosyakapali', {
      oidHsrDosya: oidHsrDosya
    })
  },

  async searchHasarFiles(searchParams) {
    if (process.env.NODE_ENV === 'development') {
      logger.info('Using mock data for searchHasarFiles')
      return {
        success: true,
        data: {
          files: [
            {
              dosyaNo: '2025311003010',
              magdurNo: '1',
              policeNo: '123456789',
              hasarTarihi: '2025-01-10',
              hasarYeri: 'İstanbul',
              durum: 'Açık',
              victimNumber: 'M-2024-001',
              insuredName: 'Ahmet Yılmaz',
              victimName: 'Mehmet Demir',
              hasarSebebi: 'Trafik Kazası',
              hasarTutari: 15000
            },
            {
              dosyaNo: '2025311003011',
              magdurNo: '2',
              policeNo: '123456790',
              hasarTarihi: '2025-01-11',
              hasarYeri: 'Ankara',
              durum: 'Kapalı',
              victimNumber: 'M-2024-002',
              insuredName: 'Ayşe Kaya',
              victimName: 'Fatma Öz',
              hasarSebebi: 'Yangın',
              hasarTutari: 25000
            }
          ],
          total: 2
        }
      }
    }
    
    return this.dispatch('searchHasarFiles', searchParams)
  },

  async getHasarFileDetails(dosyaNo) {
    return this.dispatch('getHasarFileDetails', { dosyaNo })
  },

  async saveHasarFile(fileData) {
    return this.dispatch('saveHasarFile', fileData)
  },

  async addEvrak(dosyaNo, evrakData) {
    return this.dispatch('addEvrak', { dosyaNo, evrakData })
  },

  async getEvrakList(dosyaNo) {
    return this.dispatch('getEvrakList', { dosyaNo })
  },

  async updateDegerKaybi(dosyaNo, degerKaybiData) {
    return this.dispatch('updateDegerKaybi', { dosyaNo, ...degerKaybiData })
  },

  async getDashboardData() {
    return this.dispatch('getDashboardData', {})
  },

  async getUserProfile() {
    return this.dispatch('getUserProfile', {})
  },

  async updateUserProfile(profileData) {
    return this.dispatch('updateUserProfile', profileData)
  },

  async changePassword(passwordData) {
    return this.dispatch('changePassword', passwordData)
  },

  async login(loginData) {
    return this.dispatch('login', loginData)
  },

  async logout() {
    return this.dispatch('logout', {})
  },

  async checkSession() {
    return this.dispatch('checkSession', {})
  },

  async getMenuItems() {
    return this.dispatch('getMenuItems', {})
  },

  async getTaskList() {
    return this.dispatch('getTaskList', {})
  },

  async setLanguage(lang) {
    return this.dispatch('setLanguage', { language: lang })
  }
}

export default hasarApi
