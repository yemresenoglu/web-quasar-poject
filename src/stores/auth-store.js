import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger.js'
import cookieManager from 'src/api/cookieManager.js'
import {
  simulateLogin,
  simulateLogout,
  simulateGetUserUnit,
  simulateGetUserTask,
  // getMockUser,
  // getMockSession,
  // getMockCaptcha,
  // getCaptchaKontrolDurum
} from 'src/data/auth-mock-data.js'
import { getUserMenuData } from 'src/data/menu-mock-data.js'
// import { authApiModule } from 'src/api/modules/auth-api.js'
// import { menuApiModule } from 'src/api/modules/menu-api.js'
import { useAccountStore } from './account-store.js'
import { shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

const logger = createLogger('AuthStore')

/**
 * Authentication Store
 * Manages user authentication state and login/logout operations
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const isAuthenticated = ref(false)
    const user = ref(null)
    const loginAttempts = ref(0)
    const lastLoginAttempt = ref(null)
    const sessionTimeout = ref(null)

    // Login form state
    const loginForm = ref({
      userCode: '',
      password: '',
      captcha: '',
    })

    // UI state
    const isLoading = ref(false)
    const showPassword = ref(false)

    // Computed
    const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)

    const userDisplayName = computed(() => {
      if (!user.value) return ''
      return `${user.value.kullaniciAd} ${user.value.soyad}`.trim() || user.value.userCode
    })

    const isSessionValid = computed(() => {
      if (!sessionTimeout.value) return false
      return new Date() < new Date(sessionTimeout.value)
    })

    // Actions
    /**
     * Attempts to authenticate user with credentials - 3 aşamalı login
     * @param {string} userCode - User code
     * @param {string} password - Password
     * @param {string} captcha - Captcha code
     * @returns {Promise<{success: boolean, message: string, user?: object}>}
     */
    const login = async (userCode, password, captcha) => {
      try {
        isLoading.value = true
        logger.info('Login attempt started', { userCode })

        // Check login attempts
        const now = new Date()
        if (loginAttempts.value >= 3) {
          const timeDiff = now - lastLoginAttempt.value
          if (timeDiff < 300000) {
            // 5 minutes
            throw new Error('Too many login attempts. Please try again in 5 minutes.')
          } else {
            loginAttempts.value = 0 // Reset attempts after 5 minutes
          }
        }

        // AŞAMA 1: Login - Kullanıcı kodu ve şifre ile giriş
        let loginResult

        // Environment-based API call strategy
        if (shouldUseMockData()) {
          logger.info('Using mock data for login - Stage 1', {
            environment: getEnvironmentInfo().environment,
          })
          loginResult = await simulateLogin(userCode, password, captcha)
        } else {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend login - Stage 1', { userCode })
          loginResult = await authApiModule.login({ userCode, password, captcha })
          
          if (!loginResult.success) {
            logger.warn('Backend login failed, falling back to mock data', { 
              error: loginResult.error,
              userCode 
            })
            loginResult = await simulateLogin(userCode, password, captcha)
          }
        } catch (apiError) {
          logger.error('Backend API login error, falling back to mock data:', {
            error: apiError.message,
            userCode
          })
          loginResult = await simulateLogin(userCode, password, captcha)
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - using mock data for login - Stage 1')
          loginResult = await simulateLogin(userCode, password, captcha)
        }

        if (!loginResult.success) {
          // Failed login
          loginAttempts.value++
          lastLoginAttempt.value = now

          logger.warn('Login failed - Stage 1', {
            userCode,
            attempts: loginAttempts.value,
            error: loginResult.error,
          })

          throw new Error(loginResult.error || 'Invalid user code or password')
        }

        // Login başarılı, kullanıcı bilgilerini al
        const loginData = loginResult.data
        logger.info('Login successful - Stage 1', { userCode, oid: loginData.oid })

        // AŞAMA 2: Kullanıcı birim bilgilerini getir
        let unitResult

        if (shouldUseMockData()) {
          logger.info('Getting user unit data - Stage 2 (Mock)')
          unitResult = await simulateGetUserUnit(loginData.oid)
        } else {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend getUserUnit - Stage 2', { userOid: loginData.oid })
          unitResult = await authApiModule.getUserUnit(loginData.oid)
          
          if (!unitResult.success) {
            logger.warn('Backend getUserUnit failed, falling back to mock data', {
              error: unitResult.error,
              userOid: loginData.oid
            })
            unitResult = await simulateGetUserUnit(loginData.oid)
          }
        } catch (apiError) {
          logger.error('Backend API getUserUnit error, falling back to mock data:', {
            error: apiError.message,
            userOid: loginData.oid
          })
          unitResult = await simulateGetUserUnit(loginData.oid)
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - using mock data for getUserUnit - Stage 2')
          unitResult = await simulateGetUserUnit(loginData.oid)
        }

        if (!unitResult.success) {
          logger.warn('Failed to get user unit data - Stage 2', {
            userOid: loginData.oid,
            error: unitResult.error,
          })
          throw new Error('Kullanıcı birim bilgileri alınamadı')
        }

        const unitData = unitResult.data
        logger.info('User unit data retrieved - Stage 2', {
          defaultBirimOid: unitData.defaultBirimOid,
          selectedBirimOid: unitData.selectedBirimOid,
        })

        // AŞAMA 3: Görev bilgilerini getir
        let taskResult

        if (shouldUseMockData()) {
          logger.info('Getting user task data - Stage 3 (Mock)')
          taskResult = await simulateGetUserTask(loginData.oid)
        } else {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend getUserTask - Stage 3', { userOid: loginData.oid })
          taskResult = await authApiModule.getUserTask(loginData.oid)
          
          if (!taskResult.success) {
            logger.warn('Backend getUserTask failed, falling back to mock data', {
              error: taskResult.error,
              userOid: loginData.oid
            })
            taskResult = await simulateGetUserTask(loginData.oid)
          }
        } catch (apiError) {
          logger.error('Backend API getUserTask error, falling back to mock data:', {
            error: apiError.message,
            userOid: loginData.oid
          })
          taskResult = await simulateGetUserTask(loginData.oid)
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - using mock data for getUserTask - Stage 3')
          taskResult = await simulateGetUserTask(loginData.oid)
        }

        if (!taskResult.success) {
          logger.warn('Failed to get user task data - Stage 3', {
            userOid: loginData.oid,
            error: taskResult.error,
          })
          throw new Error('Görev bilgileri alınamadı')
        }

        const taskData = taskResult.data
        logger.info('User task data retrieved - Stage 3', {
          defaultGörevOid: taskData.defaultGörevOid,
          selectedGörevOid: taskData.selectedGörevOid,
        })

        // AŞAMA 4: Kullanıcı menu verilerini getir
        let menuResult
        if (process.env.NODE_ENV === 'development') {
          logger.info('Getting user menu data - Stage 4')
          // Mock menu data'yı kullanıcı bilgilerine göre oluştur
          const userMenuData = getUserMenuData(
            loginData.oid,
            unitData.selectedBirimLabel,
            taskData.selectedGörevLabel,
          )
          menuResult = {
            success: true,
            data: {
              menuItems: userMenuData,
              totalCount: userMenuData.length,
            },
          }
        } else {
          try {
            // menuResult = await menuApiModule.getMenuData(loginData.oid)
            // Mock data kullan - backend entegrasyonu için yorum satırını kaldır
            const userMenuData = getUserMenuData(
              loginData.oid,
              unitData.selectedBirimLabel,
              taskData.selectedGörevLabel,
            )
            menuResult = {
              success: true,
              data: { categories: userMenuData },
            }
          } catch (apiError) {
            logger.error('API getMenuData failed, falling back to mock data:', apiError)
            const userMenuData = getUserMenuData(
              loginData.oid,
              unitData.selectedBirimLabel,
              taskData.selectedGörevLabel,
            )
            menuResult = {
              success: true,
              data: {
                menuItems: userMenuData,
                totalCount: userMenuData.length,
              },
            }
          }
        }

        if (!menuResult.success) {
          logger.warn('Failed to get user menu data - Stage 4', {
            userOid: loginData.oid,
            error: menuResult.error,
          })
          throw new Error('Kullanıcı menü verileri alınamadı')
        }

        const menuData = menuResult.data
        logger.info('User menu data retrieved - Stage 4', {
          menuItemsCount: menuData.totalCount || menuData.menuItems?.length || 0,
        })

        // Tüm verileri birleştir ve user object oluştur
        const userData = {
          // Login'den gelen veriler
          oid: loginData.oid,
          kullaniciAd: loginData.kullaniciAd,
          soyad: loginData.soyad,
          eposta: loginData.eposta,
          aktifMi: loginData.aktifMi,

          // Default birim bilgileri
          defaultBirimOid: unitData.defaultBirimOid,
          defaultBirimLabel: unitData.defaultBirimLabel,
          defaultBirimAciklama: unitData.defaultBirimAciklama,

          // Seçili birim bilgileri (başlangıçta default ile aynı)
          selectedBirimOid: unitData.selectedBirimOid,
          selectedBirimLabel: unitData.selectedBirimLabel,
          selectedBirimAciklama: unitData.selectedBirimAciklama,

          // Default görev bilgileri
          defaultGörevOid: taskData.defaultGörevOid,
          defaultGörevLabel: taskData.defaultGörevLabel,
          defaultGörevAciklama: taskData.defaultGörevAciklama,

          // Seçili görev bilgileri (başlangıçta default ile aynı)
          selectedGörevOid: taskData.selectedGörevOid,
          selectedGörevLabel: taskData.selectedGörevLabel,
          selectedGörevAciklama: taskData.selectedGörevAciklama,

          // Menu verileri
          menuItems: menuData.menuItems || [],
          menuTotalCount: menuData.totalCount || 0,

          // Legacy support - eski field isimleri için backward compatibility
          birimOid: unitData.defaultBirimOid,
          birimLabel: unitData.defaultBirimLabel,
          birimAciklama: unitData.defaultBirimAciklama,
          görevOid: taskData.defaultGörevOid,
          görevLabel: taskData.defaultGörevLabel,
          görevAciklama: taskData.defaultGörevAciklama,

          // Ek bilgiler
          userCode: userCode,
          lastLogin: now.toISOString(),
          permissions: ['damage_view', 'damage_edit', 'customer_view', 'reports_view'], // Default permissions
        }

        // Update state
        isAuthenticated.value = true
        user.value = userData
        loginAttempts.value = 0
        lastLoginAttempt.value = null
        sessionTimeout.value = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString() // 8 hours

        // Store in localStorage for persistence
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_token', 'backend_token_' + Date.now())
        localStorage.setItem('auth_session_timeout', sessionTimeout.value)

        // Menu verilerini ayrı olarak da localStorage'a kaydet
        localStorage.setItem(`menu_data_${userData.oid}`, JSON.stringify(menuData.menuItems || []))

        // Set language cookie
        cookieManager.setUserSessionLang('tr')

        // Sync AccountStore with user data
        const accountStore = useAccountStore()
        accountStore.syncFromAuthStore(userData)

        // Mock data'yı initialize et
        accountStore.initializeMockData()

        // Reset form
        loginForm.value = {
          userCode: '',
          password: '',
          captcha: '',
        }

        logger.info('Complete login successful - All 4 stages completed', {
          userCode,
          oid: userData.oid,
          defaultBirimLabel: userData.defaultBirimLabel,
          selectedBirimLabel: userData.selectedBirimLabel,
          defaultGörevLabel: userData.defaultGörevLabel,
          selectedGörevLabel: userData.selectedGörevLabel,
          menuItemsCount: userData.menuTotalCount,
        })

        return {
          success: true,
          message: 'Login successful',
          user: userData,
        }
      } catch (error) {
        logger.error('Login error:', error)
        return {
          success: false,
          message: error.message || 'Login failed',
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Logs out the current user
     * @returns {void}
     */
    const logout = async () => {
      try {
        logger.info('Logout initiated', { userCode: user.value?.userCode })

        // Environment-based logout strategy
        if (shouldUseMockData()) {
          logger.info('Using mock data for logout', {
            environment: getEnvironmentInfo().environment,
          })
          await simulateLogout()
        } else {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend logout', { userCode: user.value?.userCode })
          const logoutResult = await authApiModule.logout()
          
          if (!logoutResult.success) {
            logger.warn('Backend logout failed, falling back to mock data', {
              error: logoutResult.error,
              userCode: user.value?.userCode
            })
            await simulateLogout()
          }
        } catch (error) {
          logger.error('Backend API logout error, falling back to mock data:', {
            error: error.message,
            userCode: user.value?.userCode
          })
          await simulateLogout()
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - using mock data for logout')
          await simulateLogout()
        }

        // Clear state
        isAuthenticated.value = false
        user.value = null
        sessionTimeout.value = null

        // Clear localStorage - tüm auth ve user verilerini temizle
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_session_timeout')
        localStorage.removeItem('sompo-auth')

        // Menu verilerini de temizle (artık AuthStore'da tutuluyor)
        if (user.value?.oid) {
          localStorage.removeItem(`menu_data_${user.value.oid}`)
        }

        // AccountStore verilerini temizle
        localStorage.removeItem('account_departmentItems')
        localStorage.removeItem('account_taskItems')
        localStorage.removeItem('account_userProfile')

        // Menu quick access verilerini temizle
        localStorage.removeItem('menu-quick-access')

        // Dashboard cache'ini temizle
        localStorage.removeItem('dashboard_data')
        localStorage.removeItem('dashboard_charts')

        // Clear cookies
        cookieManager.clearAllCookies()

        logger.info('Logout completed')
      } catch (error) {
        logger.error('Logout error:', error)
      }
    }

    /**
     * Checks if user session is valid and restores from localStorage if needed
     * @returns {boolean}
     */
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user')
        const storedToken = localStorage.getItem('auth_token')
        const storedTimeout = localStorage.getItem('auth_session_timeout')

        if (!storedUser || !storedToken || !storedTimeout) {
          return false
        }

        // Check if session is still valid
        if (new Date() >= new Date(storedTimeout)) {
          logger.info('Session expired, logging out')
          await logout()
          return false
        }

        // BACKEND INTEGRATION - Verify session with backend
        if (!shouldUseMockData()) {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend session check', { userCode: storedUser.userCode })
          const sessionResult = await authApiModule.checkSession()
          
          if (!sessionResult.success) {
            logger.warn('Backend session invalid, logging out', {
              error: sessionResult.error,
              userCode: storedUser.userCode
            })
            await logout()
            return false
          }
          
          logger.info('Backend session valid', { userCode: storedUser.userCode })
        } catch (error) {
          logger.warn('Backend session check failed, continuing with local session:', {
            error: error.message,
            userCode: storedUser.userCode
          })
          // Continue with local session if backend is unavailable
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - skipping session check')
        } else {
          logger.info('Mock data mode: Skipping backend session check', {
            environment: getEnvironmentInfo().environment,
          })
        }

        // Restore user session
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        sessionTimeout.value = storedTimeout

        // AccountStore'u da senkronize et
        const accountStore = useAccountStore()
        accountStore.syncFromAuthStore(user.value)

        logger.info('Session restored', { userCode: user.value.userCode })
        return true
      } catch (error) {
        logger.error('Session check error:', error)
        await logout()
        return false
      }
    }

    /**
     * Handles forgot password request
     * @param {string} email - User email
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const forgotPassword = async (email) => {
      try {
        logger.info('Forgot password request', { email })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock validation
        if (!email || !email.includes('@')) {
          throw new Error('Invalid email address')
        }

        logger.info('Password reset link sent', { email })

        return {
          success: true,
          message: 'Password reset link has been sent to your email address',
        }
      } catch (error) {
        logger.error('Forgot password error:', error)
        return {
          success: false,
          message: error.message || 'Failed to send password reset link',
        }
      }
    }

    /**
     * Extends current session
     * @returns {void}
     */
    const extendSession = () => {
      if (isAuthenticated.value) {
        const newTimeout = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
        sessionTimeout.value = newTimeout
        localStorage.setItem('auth_session_timeout', newTimeout)
        logger.info('Session extended')
      }
    }

    /**
     * Checks if user has specific permission
     * @param {string} permission - Permission to check
     * @returns {boolean}
     */
    const hasPermission = (permission) => {
      if (!user.value || !user.value.permissions) return false
      return user.value.permissions.includes(permission)
    }

    /**
     * Toggles password visibility
     * @returns {void}
     */
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    return {
      // State
      isAuthenticated,
      user,
      loginAttempts,
      lastLoginAttempt,
      sessionTimeout,
      loginForm,
      isLoading,
      showPassword,

      // Computed
      isLoggedIn,
      userDisplayName,
      isSessionValid,

      // Actions
      login,
      logout,
      checkSession,
      forgotPassword,
      extendSession,
      hasPermission,
      togglePasswordVisibility,
    }
  },
  {
    persist: {
      key: 'sompo-auth',
      storage: localStorage,
      paths: ['isAuthenticated', 'user', 'sessionTimeout'],
    },
  },
)
