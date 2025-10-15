// Modüler Hasar API
// Tüm API modüllerini tek bir noktadan yönetir

import { createLogger } from 'src/utils/logger.js'

// API Modüllerini import et
import authApiModule from './modules/auth-api.js'
import hasarDosyaApiModule from './modules/hasar-dosya-api.js'
import evrakApiModule from './modules/evrak-api.js'
import accountApiModule from './modules/account-api.js'
import dashboardApiModule from './modules/dashboard-api.js'
import menuApiModule from './modules/menu-api.js'

const logger = createLogger('HasarAPI')

/**
 * Ana Hasar API
 * Tüm modülleri tek bir interface'de toplar
 */
export const hasarApi = {
  // ===== AUTH MODULE =====
  ...authApiModule,
  
  // ===== HASAR DOSYA MODULE =====
  ...hasarDosyaApiModule,
  
  // ===== EVRAK MODULE =====
  ...evrakApiModule,
  
  // ===== ACCOUNT MODULE =====
  ...accountApiModule,
  
  // ===== DASHBOARD MODULE =====
  ...dashboardApiModule,
  
  // ===== MENU MODULE =====
  ...menuApiModule,

}

export default hasarApi
