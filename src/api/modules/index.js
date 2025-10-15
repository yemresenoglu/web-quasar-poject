// API Modules Index
// Tüm API modüllerini tek yerden export eder

// Modülleri import et
import authApiModule from './auth-api.js'
import hasarDosyaApiModule from './hasar-dosya-api.js'
import evrakApiModule from './evrak-api.js'
import accountApiModule from './account-api.js'
import dashboardApiModule from './dashboard-api.js'
import menuApiModule from './menu-api.js'

// Base API'yi de export et
export { createBaseApi, createApiModule, apiHelpers } from '../base-api.js'

// Tüm modülleri export et
export {
  authApiModule,
  hasarDosyaApiModule,
  evrakApiModule,
  accountApiModule,
  dashboardApiModule,
  menuApiModule
}

// Default export olarak tüm modülleri içeren obje
export default {
  auth: authApiModule,
  hasarDosya: hasarDosyaApiModule,
  evrak: evrakApiModule,
  account: accountApiModule,
  dashboard: dashboardApiModule,
  menu: menuApiModule
}
