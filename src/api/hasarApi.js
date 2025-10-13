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
      const requestData = {
        cmd: cmd,
        callid: generateCallId(),
        token: generateToken(),
        jp: JSON.stringify(payload),
        ...options,
      }

      logger.info('Dispatch request:', { cmd, payload, requestData })

      const response = await apiClient.post('/dispatch', requestData)

      logger.info('Dispatch response:', { cmd, status: response.status, data: response.data })

      return {
        success: true,
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      logger.error('Dispatch error:', { cmd, error: error.message })

      return {
        success: false,
        error: error.message,
        status: error.response?.status || 0,
      }
    }
  },

  async isDosyakapali(oidHsrDosya) {
    return this.dispatch('isDosyakapali', {
      oidHsrDosya: oidHsrDosya,
    })
  },

  async searchHasarFiles(searchParams) {
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
  },
}

export default hasarApi
