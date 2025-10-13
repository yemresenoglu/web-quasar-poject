import { defineStore } from '#q-app/wrappers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export { useAccountStore } from './account-store'
export { useMenuPageStore } from './menu-page-store'
export { useAuthStore } from './auth-store'
export { useDashboardStore } from './dashboard-store'
export { useUIStore } from './ui-store'
export { useMenuStore } from './menu-store'


export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia()
  
  // Register persisted state plugin
  pinia.use(piniaPluginPersistedstate)
  
  return pinia
})
