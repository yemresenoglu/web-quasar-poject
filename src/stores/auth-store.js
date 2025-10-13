import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger.js'
import { hasarApi } from 'src/api/hasarApi.js'
import cookieManager from 'src/api/cookieManager.js'

const logger = createLogger('AuthStore')

/**
 * Authentication Store
 * Manages user authentication state and login/logout operations
 */
export const useAuthStore = defineStore('auth', () => {
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
    captcha: ''
  })
  
  // UI state
  const isLoading = ref(false)
  const showPassword = ref(false)
  const captchaText = ref('')
  
  // Initialize captcha on store creation
  const initializeCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    captchaText.value = result
  }
  
  // Generate initial captcha
  initializeCaptcha()

  // Computed
  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)
  
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`.trim() || user.value.userCode
  })

  const isSessionValid = computed(() => {
    if (!sessionTimeout.value) return false
    return new Date() < new Date(sessionTimeout.value)
  })

  // Actions
  /**
   * Attempts to authenticate user with credentials
   * @param {string} userCode - User code
   * @param {string} password - Password
   * @param {string} captcha - Captcha code
   * @returns {Promise<{success: boolean, message: string, user?: object}>}
   */
  const login = async (userCode, password, captcha) => {
    try {
      isLoading.value = true
      logger.info('Login attempt started', { userCode })
      
      // Validate captcha (basic check)
      if (!captcha || captcha.length < 4) {
        throw new Error('Invalid captcha')
      }

      // Check login attempts
      const now = new Date()
      if (loginAttempts.value >= 3) {
        const timeDiff = now - lastLoginAttempt.value
        if (timeDiff < 300000) { // 5 minutes
          throw new Error('Too many login attempts. Please try again in 5 minutes.')
        } else {
          loginAttempts.value = 0 // Reset attempts after 5 minutes
        }
      }

      // Call backend API
      const loginResult = await hasarApi.login({
        userCode,
        password,
        captcha
      })

      if (loginResult.success) {
        // Extract user data from backend response
        const userData = {
          id: loginResult.data.id || 'user_001',
          userCode: userCode,
          firstName: loginResult.data.firstName || 'Yunus Emre',
          lastName: loginResult.data.lastName || 'Şenoğlu',
          email: loginResult.data.email || 'yunus.emre@example.com',
          department: loginResult.data.department || 'arabuluculuk',
          role: loginResult.data.role || 'admin',
          permissions: loginResult.data.permissions || ['damage_view', 'damage_edit', 'customer_view', 'reports_view'],
          lastLogin: now.toISOString()
        }

        // Update state
        isAuthenticated.value = true
        user.value = userData
        loginAttempts.value = 0
        lastLoginAttempt.value = null
        sessionTimeout.value = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString() // 8 hours

        // Store in localStorage for persistence
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_token', loginResult.data.token || 'backend_token_' + Date.now())
        localStorage.setItem('auth_session_timeout', sessionTimeout.value)
        
        // Set language cookie
        cookieManager.setUserSessionLang('tr')

        // Reset form
        loginForm.value = {
          userCode: '',
          password: '',
          captcha: ''
        }
        
        logger.info('Login successful', { userCode })
        
        return {
          success: true,
          message: 'Login successful',
          user: userData
        }
      } else {
        // Failed login
        loginAttempts.value++
        lastLoginAttempt.value = now
        
        logger.warn('Login failed', { userCode, attempts: loginAttempts.value, error: loginResult.error })
        
        throw new Error(loginResult.error || 'Invalid user code or password')
      }
    } catch (error) {
      logger.error('Login error:', error)
      return {
        success: false,
        message: error.message || 'Login failed'
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
      
      // Call backend logout
      try {
        await hasarApi.logout()
      } catch (error) {
        logger.warn('Backend logout failed:', error)
        // Continue with local logout even if backend fails
      }
      
      // Clear state
      isAuthenticated.value = false
      user.value = null
      sessionTimeout.value = null
      
      // Clear localStorage
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_session_timeout')
      
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

      // Verify session with backend
      try {
        const sessionResult = await hasarApi.checkSession()
        if (!sessionResult.success) {
          logger.warn('Backend session invalid, logging out')
          await logout()
          return false
        }
      } catch (error) {
        logger.warn('Backend session check failed:', error)
        // Continue with local session if backend is unavailable
      }

      // Restore user session
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      sessionTimeout.value = storedTimeout

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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email address')
      }

      logger.info('Password reset link sent', { email })
      
      return {
        success: true,
        message: 'Password reset link has been sent to your email address'
      }
    } catch (error) {
      logger.error('Forgot password error:', error)
      return {
        success: false,
        message: error.message || 'Failed to send password reset link'
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
   * Generates a random captcha code
   * @returns {void}
   */
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    captchaText.value = result
    logger.info('Captcha generated')
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
    captchaText,
    
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
    generateCaptcha,
    togglePasswordVisibility
  }
}, {
  persist: {
    key: 'sompo-auth',
    storage: localStorage,
    paths: ['isAuthenticated', 'user', 'sessionTimeout']
  }
})
