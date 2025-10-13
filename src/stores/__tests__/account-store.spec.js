/**
 * Account Store Tests
 * 
 * Tests for account store functionality including:
 * - User profile management
 * - Account settings
 * - Department and task selection
 * - Password change
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from '../account-store'

describe('Account Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should initialize with default user profile', () => {
      const store = useAccountStore()
      
      expect(store.userProfile).toBeDefined()
      expect(store.userProfile.id).toBe('user_001')
      expect(store.userProfile.firstName).toBe('Yunus Emre')
      expect(store.userProfile.lastName).toBe('Şenoğlu')
      expect(store.userProfile.userCode).toBe('YUNUSEMRE')
    })

    it('should initialize with default settings', () => {
      const store = useAccountStore()
      
      expect(store.accountSettings).toBeDefined()
      expect(store.accountSettings.language).toBe('tr-TR')
      expect(store.accountSettings.timezone).toBe('Europe/Istanbul')
      expect(store.accountSettings.currency).toBe('TRY')
    })

    it('should initialize taskbar settings', () => {
      const store = useAccountStore()
      
      expect(store.accountSettings.taskbar).toBeDefined()
      expect(store.accountSettings.taskbar.showTaskbar).toBe(true)
      expect(store.accountSettings.taskbar.autoHide).toBe(false)
      expect(store.accountSettings.taskbar.position).toBe('left')
    })

    it('should have department and task items', () => {
      const store = useAccountStore()
      
      expect(Array.isArray(store.departmentItems)).toBe(true)
      expect(Array.isArray(store.taskItems)).toBe(true)
      expect(store.departmentItems.length).toBeGreaterThan(0)
      expect(store.taskItems.length).toBeGreaterThan(0)
    })
  })

  describe('Computed Properties', () => {
    it('should compute fullName correctly', () => {
      const store = useAccountStore()
      
      expect(store.fullName).toBe('Yunus Emre Şenoğlu')
    })

    it('should compute initials correctly', () => {
      const store = useAccountStore()
      
      // YŞ bekleniyor (Yunus Emre Şenoğlu -> Y + Ş)
      expect(store.initials).toBe('YŞ')
    })

    it('should compute isOnline based on lastLogin', () => {
      const store = useAccountStore()
      
      // Set recent login (within 5 minutes)
      store.userProfile.lastLogin = new Date().toISOString()
      expect(store.isOnline).toBe(true)
      
      // Set old login (more than 5 minutes ago)
      const oldDate = new Date()
      oldDate.setMinutes(oldDate.getMinutes() - 10)
      store.userProfile.lastLogin = oldDate.toISOString()
      expect(store.isOnline).toBe(false)
    })

    it('should compute selectedTaskName correctly', () => {
      const store = useAccountStore()
      
      expect(store.selectedTaskName).toBeDefined()
      expect(typeof store.selectedTaskName).toBe('string')
    })

    it('should compute selectedDepartmentName correctly', () => {
      const store = useAccountStore()
      
      expect(store.selectedDepartmentName).toBeDefined()
      expect(typeof store.selectedDepartmentName).toBe('string')
    })
  })

  describe('Profile Management', () => {
    it('should update profile information', () => {
      const store = useAccountStore()
      
      const newData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      }
      
      store.updateProfile(newData)
      
      expect(store.userProfile.firstName).toBe('Test')
      expect(store.userProfile.lastName).toBe('User')
      expect(store.userProfile.email).toBe('test@example.com')
      // Original data should remain
      expect(store.userProfile.userCode).toBe('YUNUSEMRE')
    })

    it('should not lose existing data when updating profile', () => {
      const store = useAccountStore()
      const originalId = store.userProfile.id
      
      store.updateProfile({ firstName: 'NewName' })
      
      expect(store.userProfile.id).toBe(originalId)
      expect(store.userProfile.userCode).toBe('YUNUSEMRE')
    })
  })

  describe('Settings Management', () => {
    it('should update account settings', () => {
      const store = useAccountStore()
      
      store.updateSettings({
        language: 'en-US',
        currency: 'USD'
      })
      
      expect(store.accountSettings.language).toBe('en-US')
      expect(store.accountSettings.currency).toBe('USD')
      // Original settings should remain
      expect(store.accountSettings.timezone).toBe('Europe/Istanbul')
    })

    it('should update privacy settings', () => {
      const store = useAccountStore()
      
      store.updatePrivacySettings({
        profileVisibility: 'public',
        activityTracking: false
      })
      
      expect(store.accountSettings.privacy.profileVisibility).toBe('public')
      expect(store.accountSettings.privacy.activityTracking).toBe(false)
    })

    it('should update taskbar settings', () => {
      const store = useAccountStore()
      
      store.updateTaskbarSettings({
        autoHide: true,
        showTaskbar: false
      })
      
      expect(store.accountSettings.taskbar.autoHide).toBe(true)
      expect(store.accountSettings.taskbar.showTaskbar).toBe(false)
    })
  })

  describe('Department and Task Selection', () => {
    it('should select a department', () => {
      const store = useAccountStore()
      const departmentId = store.departmentItems[0]?.id
      
      if (departmentId) {
        store.selectDepartment(departmentId)
        expect(store.selectedDepartmentId).toBe(departmentId)
      }
    })

    it('should select a task', () => {
      const store = useAccountStore()
      const taskId = store.taskItems[0]?.id
      
      if (taskId) {
        store.selectTask(taskId)
        expect(store.selectedTaskId).toBe(taskId)
      }
    })

    it('should update selectedTaskName when task changes', () => {
      const store = useAccountStore()
      const firstTask = store.taskItems[0]
      
      if (firstTask) {
        store.selectTask(firstTask.id)
        expect(store.selectedTaskName).toBe(firstTask.name)
      }
    })
  })

  describe('Password Change', () => {
    it('should validate password change inputs', async () => {
      const store = useAccountStore()
      
      const result = await store.changePassword('', '')
      
      expect(result.success).toBe(false)
      expect(result.message).toContain('gerekli')
    })

    it('should reject short passwords', async () => {
      const store = useAccountStore()
      
      const result = await store.changePassword('old123', '123')
      
      expect(result.success).toBe(false)
      expect(result.message).toContain('6')
    })

    it('should accept valid password change', async () => {
      const store = useAccountStore()
      
      const result = await store.changePassword('old123', 'newPassword123')
      
      expect(result.success).toBe(true)
    })

    it('should reject same password', async () => {
      const store = useAccountStore()
      
      const result = await store.changePassword('password123', 'password123')
      
      expect(result.success).toBe(false)
      expect(result.message).toContain('aynı')
    })
  })

  describe('Avatar Management', () => {
    it('should update avatar URL', () => {
      const store = useAccountStore()
      const newAvatar = 'https://example.com/avatar.jpg'
      
      store.updateProfile({ avatar: newAvatar })
      
      expect(store.userProfile.avatar).toBe(newAvatar)
    })

    it('should handle null avatar', () => {
      const store = useAccountStore()
      
      store.updateProfile({ avatar: null })
      
      expect(store.userProfile.avatar).toBeNull()
    })
  })

  describe('Permissions', () => {
    it('should have default permissions', () => {
      const store = useAccountStore()
      
      expect(Array.isArray(store.userProfile.permissions)).toBe(true)
      expect(store.userProfile.permissions.length).toBeGreaterThan(0)
    })

    it('should check if user has specific permission', () => {
      const store = useAccountStore()
      
      const hasPermission = store.hasPermission('damage_view')
      
      expect(typeof hasPermission).toBe('boolean')
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined profile updates', () => {
      const store = useAccountStore()
      const originalProfile = { ...store.userProfile }
      
      store.updateProfile(undefined)
      
      expect(store.userProfile.firstName).toBe(originalProfile.firstName)
    })

    it('should handle empty settings update', () => {
      const store = useAccountStore()
      const originalSettings = { ...store.accountSettings }
      
      store.updateSettings({})
      
      expect(store.accountSettings.language).toBe(originalSettings.language)
    })

    it('should compute initials for single-word names', () => {
      const store = useAccountStore()
      
      store.updateProfile({
        firstName: 'Test',
        lastName: ''
      })
      
      expect(store.initials).toBe('T')
    })
  })
})

