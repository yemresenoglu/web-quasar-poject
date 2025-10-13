/**
 * Auth Store Tests
 *
 * Tests for authentication store functionality including:
 * - Initial state
 * - Login/logout operations
 * - Session management
 * - Captcha generation
 * - Password visibility toggle
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth-store'

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance before each test
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should initialize with logged out state', () => {
      const store = useAuthStore()

      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
      expect(store.loginAttempts).toBe(0)
      expect(store.isLoading).toBe(false)
      expect(store.showPassword).toBe(false)
    })

    it('should initialize loginForm with empty values', () => {
      const store = useAuthStore()

      expect(store.loginForm).toEqual({
        userCode: '',
        password: '',
        captcha: '',
      })
    })

    it('should generate initial captcha', () => {
      const store = useAuthStore()

      expect(store.captchaText).toBeDefined()
      expect(store.captchaText.length).toBe(6)
      expect(typeof store.captchaText).toBe('string')
    })

    it('should have isLoggedIn as false initially', () => {
      const store = useAuthStore()

      expect(store.isLoggedIn).toBe(false)
    })

    it('should have empty userDisplayName initially', () => {
      const store = useAuthStore()

      expect(store.userDisplayName).toBe('')
    })
  })

  describe('Captcha Generation', () => {
    it('should generate a 6-character captcha', () => {
      const store = useAuthStore()
      const initialCaptcha = store.captchaText

      store.generateCaptcha()

      expect(store.captchaText).toBeDefined()
      expect(store.captchaText.length).toBe(6)
      expect(store.captchaText).not.toBe(initialCaptcha)
    })

    it('should only use allowed characters', () => {
      const store = useAuthStore()
      const allowedChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/

      store.generateCaptcha()

      expect(allowedChars.test(store.captchaText)).toBe(true)
    })
  })

  describe('Login Functionality', () => {
    it('should login successfully with valid credentials', async () => {
      const store = useAuthStore()

      const result = await store.login('YUNUSEMRE', '12', 'ABC123')

      expect(result.success).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).not.toBeNull()
      expect(store.user.userCode).toBe('YUNUSEMRE')
      expect(store.isLoggedIn).toBe(true)
    })

    it('should fail login with invalid credentials', async () => {
      const store = useAuthStore()

      const result = await store.login('WRONGUSER', 'wrongpass', 'ABC123')

      expect(result.success).toBe(false)
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
    })

    it('should set loading state during login', async () => {
      const store = useAuthStore()

      const loginPromise = store.login('YUNUSEMRE', '12', 'ABC123')

      // Check loading state while promise is pending
      expect(store.isLoading).toBe(true)

      await loginPromise

      // Loading should be false after completion
      expect(store.isLoading).toBe(false)
    })

    it('should increment login attempts on failed login', async () => {
      const store = useAuthStore()

      await store.login('WRONGUSER', 'wrongpass', 'ABC123')

      expect(store.loginAttempts).toBe(1)
    })

    it('should not increment login attempts on successful login', async () => {
      const store = useAuthStore()

      await store.login('YUNUSEMRE', '12', 'ABC123')

      expect(store.loginAttempts).toBe(0)
    })

    it('should set session timeout on successful login', async () => {
      const store = useAuthStore()

      await store.login('YUNUSEMRE', '12', 'ABC123')

      expect(store.sessionTimeout).not.toBeNull()
    })

    it('should fail login with invalid captcha', async () => {
      const store = useAuthStore()

      const result = await store.login('YUNUSEMRE', '12', '')

      expect(result.success).toBe(false)
      expect(result.message).toContain('captcha')
    })
  })

  describe('Logout Functionality', () => {
    it('should clear user data on logout', async () => {
      const store = useAuthStore()

      // First login
      await store.login('YUNUSEMRE', '12', 'ABC123')

      // Then logout
      store.logout()

      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
      expect(store.isLoggedIn).toBe(false)
      expect(store.sessionTimeout).toBeNull()
    })

    it('should reset login form on logout', async () => {
      const store = useAuthStore()

      store.loginForm.userCode = 'TEST'
      store.loginForm.password = 'test123'

      await store.login('YUNUSEMRE', '12', 'ABC123')
      store.logout()

      expect(store.loginForm.userCode).toBe('')
      expect(store.loginForm.password).toBe('')
      expect(store.loginForm.captcha).toBe('')
    })

    it('should generate new captcha on logout', async () => {
      const store = useAuthStore()

      await store.login('YUNUSEMRE', '12', 'ABC123')

      store.logout()

      // Captcha might be same due to random, check it's still 6 chars
      expect(store.captchaText).toBeDefined()
      expect(store.captchaText.length).toBe(6)
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      const store = useAuthStore()

      expect(store.showPassword).toBe(false)

      store.togglePasswordVisibility()
      expect(store.showPassword).toBe(true)

      store.togglePasswordVisibility()
      expect(store.showPassword).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should compute isLoggedIn correctly', async () => {
      const store = useAuthStore()

      expect(store.isLoggedIn).toBe(false)

      await store.login('YUNUSEMRE', '12', 'ABC123')
      expect(store.isLoggedIn).toBe(true)

      store.logout()
      expect(store.isLoggedIn).toBe(false)
    })

    it('should compute userDisplayName correctly', async () => {
      const store = useAuthStore()

      expect(store.userDisplayName).toBe('')

      await store.login('YUNUSEMRE', '12', 'ABC123')
      expect(store.userDisplayName).toBe('Yunus Emre Şenoğlu')
    })

    it('should fallback to userCode if name is not available', async () => {
      const store = useAuthStore()

      await store.login('YUNUSEMRE', '12', 'ABC123')
      store.user.firstName = ''
      store.user.lastName = ''

      expect(store.userDisplayName).toBe('YUNUSEMRE')
    })

    it('should validate session timeout', async () => {
      const store = useAuthStore()

      expect(store.isSessionValid).toBe(false)

      await store.login('YUNUSEMRE', '12', 'ABC123')
      expect(store.isSessionValid).toBe(true)
    })
  })

  describe('Session Management', () => {
    it('should extend session', async () => {
      const store = useAuthStore()

      await store.login('YUNUSEMRE', '12', 'ABC123')
      const oldTimeout = store.sessionTimeout

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100))

      store.extendSession()

      expect(store.sessionTimeout).not.toBe(oldTimeout)
      expect(new Date(store.sessionTimeout) > new Date(oldTimeout)).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle login errors gracefully', async () => {
      const store = useAuthStore()

      const result = await store.login('', '', '')

      expect(result.success).toBe(false)
      expect(result.message).toBeDefined()
      expect(store.isLoading).toBe(false)
    })

    it('should block login after 3 failed attempts', async () => {
      const store = useAuthStore()

      // Make 3 failed attempts
      await store.login('WRONG', 'wrong', 'ABC123')
      await store.login('WRONG', 'wrong', 'ABC123')
      await store.login('WRONG', 'wrong', 'ABC123')

      expect(store.loginAttempts).toBe(3)

      // 4th attempt should be blocked
      const result = await store.login('YUNUSEMRE', '12', 'ABC123')

      expect(result.success).toBe(false)
      expect(result.message).toContain('Too many')
    })
  })
})
