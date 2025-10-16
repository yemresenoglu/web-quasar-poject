import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger.js'
import { useMenuPageStore } from './menu-page-store.js'
import {
  simulateAccountApi,
  // getMockUserProfile,
  // getMockDepartments,
  // getMockTasks,
  // getMockAccountSettings
} from 'src/data/account-mock-data.js'
// import { accountApiModule } from 'src/api/modules/account-api.js'
import { shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

const logger = createLogger('AccountStore')

export const useAccountStore = defineStore(
  'account',
  () => {
    // Kullanıcı profil bilgileri
    const userProfile = ref({})
    const isLoading = ref(false)
    const error = ref(null)

    // Seçili department ve task state'leri
    const selectedDepartmentId = ref('')
    const selectedTaskId = ref('')

    // Department ve task items (API'den gelecek)
    const departmentItems = ref([])
    const taskItems = ref([])

    // Menüyü kullanıcı bilgilerine göre yenile
    const refreshMenuForUser = async () => {
      try {
        const menuPageStore = useMenuPageStore()
        const userOid = userProfile.value?.oid || 'YEMRE001'

        logger.info(
          'Refreshing menu for user',
          {
            userOid,
            selectedBirimLabel: userProfile.value?.selectedBirimLabel,
            selectedGörevLabel: userProfile.value?.selectedGörevLabel,
          },
          'store',
        )

        await menuPageStore.loadMenuData(userOid)

        logger.info('Menu refreshed successfully for user', { userOid }, 'store')
      } catch (error) {
        logger.error('Failed to refresh menu for user:', error, 'store')
      }
    }

    // Mock data ile başlangıç değerleri
    const initializeMockData = () => {
      // AuthStore'dan user verilerini al (localStorage'dan)
      const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')

      if (authUser.oid) {
        // AuthStore'dan gelen verileri kullan
        logger.info('Initializing with AuthStore data', { oid: authUser.oid }, 'store')

        // Department items'ları AuthStore verilerine göre oluştur
        departmentItems.value = [
          {
            id: authUser.defaultBirimOid || 'UNIT001',
            name: authUser.defaultBirimLabel || 'Arabuluculuk',
            description:
              authUser.defaultBirimAciklama || 'Hasar dosya yönetimi ve arabuluculuk işlemleri',
            icon: 'bi bi-people',
            selected: authUser.selectedBirimOid === authUser.defaultBirimOid,
          },
          {
            id: 'UNIT002',
            name: 'Hasar Uzmanı',
            description: 'Hasar dosyalarının incelenmesi',
            icon: 'bi bi-file-earmark-text',
            selected: authUser.selectedBirimOid === 'UNIT002',
          },
        ]

        // Task items'ları AuthStore verilerine göre oluştur
        taskItems.value = [
          {
            id: authUser.defaultGörevOid || 'TASK001',
            name: authUser.defaultGörevLabel || 'Arabulucu',
            description:
              authUser.defaultGörevAciklama ||
              'Hasar dosyalarının incelenmesi ve arabuluculuk süreçlerinin yönetimi',
            icon: 'bi bi-handshake',
            completed: authUser.selectedGörevOid === authUser.defaultGörevOid,
          },
          {
            id: 'TASK002',
            name: 'Hasar Uzmanı',
            description: 'Hasar dosyalarının teknik incelemesi',
            icon: 'bi bi-search',
            completed: authUser.selectedGörevOid === 'TASK002',
          },
        ]

        // Seçili ID'leri güncelle
        selectedDepartmentId.value = authUser.selectedBirimOid || authUser.defaultBirimOid || ''
        selectedTaskId.value = authUser.selectedGörevOid || authUser.defaultGörevOid || ''

        logger.info(
          'Mock data initialized from AuthStore',
          {
            selectedBirimLabel: authUser.selectedBirimLabel,
            selectedGörevLabel: authUser.selectedGörevLabel,
          },
          'store',
        )

        // Menüyü initialize et
        refreshMenuForUser()
        return
      }

      // AuthStore verisi yoksa varsayılan mock data kullan
      logger.info('No AuthStore data found, using default mock data', {}, 'store')

      // Mock department items
      departmentItems.value = [
        {
          id: 'UNIT001',
          name: 'Arabuluculuk',
          description: 'Hasar dosya yönetimi ve arabuluculuk işlemleri',
          icon: 'bi bi-people',
          selected: true,
        },
        {
          id: 'UNIT002',
          name: 'Hasar Uzmanı',
          description: 'Hasar dosyalarının incelenmesi',
          icon: 'bi bi-file-earmark-text',
          selected: false,
        },
      ]

      // Mock task items
      taskItems.value = [
        {
          id: 'TASK001',
          name: 'Arabulucu',
          description: 'Hasar dosyalarının incelenmesi ve arabuluculuk süreçlerinin yönetimi',
          icon: 'bi bi-handshake',
          completed: true,
        },
        {
          id: 'TASK002',
          name: 'Hasar Uzmanı',
          description: 'Hasar dosyalarının teknik incelemesi',
          icon: 'bi bi-search',
          completed: false,
        },
      ]

      // localStorage'a kaydetme - AuthStore zaten yapıyor

      // Başlangıç seçili değerlerini userProfile'a kaydet
      const selectedDept = departmentItems.value.find((dept) => dept.selected)
      const selectedTask = taskItems.value.find((task) => task.completed)

      if (selectedDept) {
        userProfile.value.selectedBirimOid = selectedDept.id
        userProfile.value.selectedBirimLabel = selectedDept.name
        userProfile.value.selectedBirimAciklama = selectedDept.description
      }

      if (selectedTask) {
        userProfile.value.selectedGörevOid = selectedTask.id
        userProfile.value.selectedGörevLabel = selectedTask.name
        userProfile.value.selectedGörevAciklama = selectedTask.description
      }

      logger.info(
        'Mock data initialized with selected values',
        {
          selectedBirimLabel: userProfile.value.selectedBirimLabel,
          selectedGörevLabel: userProfile.value.selectedGörevLabel,
        },
        'store',
      )

      // Menüyü initialize et
      refreshMenuForUser()
    }

    // Hesap ayarları
    const accountSettings = ref({
      language: 'tr-TR',
      timezone: 'Europe/Istanbul',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h',
      currency: 'TRY',
      privacy: {
        profileVisibility: 'team',
        activityTracking: true,
        dataSharing: false,
      },
      taskbar: {
        showTaskbar: true,
        autoHide: false,
        position: 'left', // Sadece 'left' pozisyonu desteklenir
      },
    })

    // Computed properties - Yeni user object yapısına göre güncellendi
    const fullName = computed(() =>
      `${userProfile.value.kullaniciAd || ''} ${userProfile.value.soyad || ''}`.trim(),
    )

    const initials = computed(() => {
      const first = (userProfile.value.kullaniciAd || '').charAt(0).toUpperCase()
      const last = (userProfile.value.soyad || '').charAt(0).toUpperCase()
      return `${first}${last}`
    })

    const isOnline = computed(() => {
      if (!userProfile.value.lastLogin) return false
      const lastLogin = new Date(userProfile.value.lastLogin)
      const now = new Date()
      const diffMinutes = (now - lastLogin) / (1000 * 60)
      return diffMinutes < 5 // Son 5 dakika içinde aktifse online
    })

    // Yeni computed properties - AuthStore'dan gelen veriler için
    const userOid = computed(() => userProfile.value.oid || '')
    const userEmail = computed(() => userProfile.value.eposta || '')
    const isActive = computed(() => userProfile.value.aktifMi || false)

    // Default birim ve görev bilgileri (computed for future use)
    // const defaultBirimInfo = computed(() => ({
    //   oid: userProfile.value.defaultBirimOid || '',
    //   label: userProfile.value.defaultBirimLabel || '',
    //   aciklama: userProfile.value.defaultBirimAciklama || ''
    // }))

    // const defaultGörevInfo = computed(() => ({
    //   oid: userProfile.value.defaultGörevOid || '',
    //   label: userProfile.value.defaultGörevLabel || '',
    //   aciklama: userProfile.value.defaultGörevAciklama || ''
    // }))

    // Seçili birim ve görev bilgileri (computed for future use)
    // const selectedBirimInfo = computed(() => ({
    //   oid: userProfile.value.selectedBirimOid || '',
    //   label: userProfile.value.selectedBirimLabel || '',
    //   aciklama: userProfile.value.selectedBirimAciklama || ''
    // }))

    // const selectedGörevInfo = computed(() => ({
    //   oid: userProfile.value.selectedGörevOid || '',
    //   label: userProfile.value.selectedGörevLabel || '',
    //   aciklama: userProfile.value.selectedGörevAciklama || ''
    // }))

    // Legacy support - eski field isimleri için
    const birimInfo = computed(() => ({
      oid: userProfile.value.birimOid || userProfile.value.defaultBirimOid || '',
      label: userProfile.value.birimLabel || userProfile.value.defaultBirimLabel || '',
      aciklama: userProfile.value.birimAciklama || userProfile.value.defaultBirimAciklama || '',
    }))

    const görevInfo = computed(() => ({
      oid: userProfile.value.görevOid || userProfile.value.defaultGörevOid || '',
      label: userProfile.value.görevLabel || userProfile.value.defaultGörevLabel || '',
      aciklama: userProfile.value.görevAciklama || userProfile.value.defaultGörevAciklama || '',
    }))

    // Seçili task'ın adını döndür
    const selectedTaskName = computed(() => {
      const selectedTask = taskItems.value.find((task) => task.id === selectedTaskId.value)
      return selectedTask ? selectedTask.name : null
    })

    // Seçili department'ın adını döndür
    const selectedDepartmentName = computed(() => {
      const selectedDept = departmentItems.value.find(
        (dept) => dept.id === selectedDepartmentId.value,
      )
      return selectedDept ? selectedDept.name : null
    })

    // Actions
    /**
     * AuthStore'dan user verilerini senkronize et
     * @param {Object} authUser - AuthStore'dan gelen user object
     */
    const syncFromAuthStore = (authUser) => {
      if (!authUser) return

      logger.info('Syncing user data from AuthStore', { oid: authUser.oid })

      // AuthStore'dan gelen verileri userProfile'a map et
      userProfile.value = {
        // Login'den gelen veriler
        oid: authUser.oid,
        kullaniciAd: authUser.kullaniciAd,
        soyad: authUser.soyad,
        eposta: authUser.eposta,
        email: authUser.eposta, // AccountProfile için email field'ı da ekle
        aktifMi: authUser.aktifMi,
        avatar: authUser.avatar,
        userCode: authUser.userCode,
        lastLogin: authUser.lastLogin,
        permissions: authUser.permissions,

        // Birim bilgileri (legacy)
        birimOid: authUser.birimOid,
        birimLabel: authUser.birimLabel,
        birimAciklama: authUser.birimAciklama,

        // Görev bilgileri (legacy)
        görevOid: authUser.görevOid,
        görevLabel: authUser.görevLabel,
        görevAciklama: authUser.görevAciklama,

        // Default birim ve görev (backend'den gelen varsayılan değerler)
        defaultBirimOid: authUser.defaultBirimOid,
        defaultBirimLabel: authUser.defaultBirimLabel,
        defaultBirimAciklama: authUser.defaultBirimAciklama,

        defaultGörevOid: authUser.defaultGörevOid,
        defaultGörevLabel: authUser.defaultGörevLabel,
        defaultGörevAciklama: authUser.defaultGörevAciklama,

        // Seçili birim ve görev (kullanıcının aktif olarak seçtiği değerler)
        selectedBirimOid: authUser.selectedBirimOid,
        selectedBirimLabel: authUser.selectedBirimLabel,
        selectedBirimAciklama: authUser.selectedBirimAciklama,

        selectedGörevOid: authUser.selectedGörevOid,
        selectedGörevLabel: authUser.selectedGörevLabel,
        selectedGörevAciklama: authUser.selectedGörevAciklama,

        // AccountStore'a özel alanlar (varsayılan değerler)
        department: authUser.selectedBirimOid || authUser.birimOid || selectedDepartmentId.value,
        taskId: authUser.selectedGörevOid || authUser.görevOid || selectedTaskId.value,
        phone: userProfile.value.phone || '', // Mevcut değer korunur
        // avatar: userProfile.value.avatar || '', // Mevcut değer korunur - duplicate key
        bio: userProfile.value.bio || '', // Mevcut değer korunur
        location: userProfile.value.location || '', // Mevcut değer korunur
        website: userProfile.value.website || '', // Mevcut değer korunur
        socialLinks: userProfile.value.socialLinks || {}, // Mevcut değer korunur
      }

      // Department ve task ID'lerini güncelle
      selectedDepartmentId.value = authUser.selectedBirimOid || authUser.birimOid || ''
      selectedTaskId.value = authUser.selectedGörevOid || authUser.görevOid || ''

      logger.info('User data synced from AuthStore successfully')
    }

    /**
     * AuthStore'dan user verilerini otomatik senkronize et (watch ile)
     */
    const initializeFromAuthStore = () => {
      // localStorage'dan auth user verilerini al
      const storedAuthUser = localStorage.getItem('auth_user')
      if (storedAuthUser) {
        try {
          const authUser = JSON.parse(storedAuthUser)
          syncFromAuthStore(authUser)
        } catch (error) {
          logger.error('Failed to parse stored auth user:', error)
        }
      }
    }

    const fetchUserProfile = async () => {
      isLoading.value = true
      error.value = null

      try {
        logger.info('Fetching user profile from backend')

        // Environment-based API call strategy
        let result

        if (shouldUseMockData()) {
          logger.info('Using mock data for user profile', {
            environment: getEnvironmentInfo().environment,
          })
          result = await simulateAccountApi.fetchProfile()
        } else {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend getUserProfile', { 
            userOid: userProfile.value.oid || userProfile.value.userOid 
          })
          result = await accountApiModule.getUserProfile(userProfile.value.oid || userProfile.value.userOid)
          
          if (!result.success) {
            logger.warn('Backend getUserProfile failed, falling back to mock data', {
              error: result.error,
              userOid: userProfile.value.oid || userProfile.value.userOid
            })
            result = await simulateAccountApi.fetchProfile()
          }
        } catch (apiError) {
          logger.error('Backend API getUserProfile error, falling back to mock data:', {
            error: apiError.message,
            userOid: userProfile.value.oid || userProfile.value.userOid
          })
          result = await simulateAccountApi.fetchProfile()
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - using mock data for getUserProfile')
          result = await simulateAccountApi.fetchProfile()
        }

        if (result.success && result.data) {
          // AuthStore verileri ile birleştir
          const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
          userProfile.value = { ...authUser, ...result.data }
          selectedDepartmentId.value = result.data.department || authUser.birimOid || ''
          selectedTaskId.value = result.data.taskId || authUser.görevOid || ''

          logger.info('User profile loaded successfully')
        } else {
          throw new Error(result.error || 'Failed to fetch user profile')
        }
      } catch (err) {
        logger.error('User profile fetch failed:', err)
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    const fetchDepartments = async () => {
      try {
        logger.info('Fetching departments from backend')

        // Mock data for departments - backend integration ready
        const mockDepartments = [
          { id: 'DEPT001', name: 'Arabuluculuk', selected: true },
          { id: 'DEPT002', name: 'Hasar Uzmanı', selected: false },
        ]

        departmentItems.value = mockDepartments.map((dept) => ({
          ...dept,
          selected: dept.id === selectedDepartmentId.value,
        }))

        logger.info('Departments loaded successfully (mock)')
      } catch (err) {
        logger.error('Departments fetch failed:', err)
      }
    }

    const fetchTasks = async () => {
      try {
        logger.info('Fetching tasks from backend')

        // Mock data for tasks - backend integration ready
        const mockTasks = [
          { id: 'TASK001', name: 'Arabulucu', completed: true },
          { id: 'TASK002', name: 'Hasar Dosya Uzmanı', completed: false },
        ]

        taskItems.value = mockTasks.map((task) => ({
          ...task,
          completed: task.id === selectedTaskId.value,
        }))

        logger.info('Tasks loaded successfully (mock)')
      } catch (err) {
        logger.error('Tasks fetch failed:', err)
      }
    }

    const updateProfile = async (profileData) => {
      isLoading.value = true
      error.value = null

      try {
        logger.info('Updating user profile')

        // Environment-based API call strategy
        if (shouldUseMockData()) {
          logger.info('Using mock data for updateProfile', {
            environment: getEnvironmentInfo().environment,
          })
          // Mock data için basit bir response simüle et
          const mockResult = {
            success: true,
            data: { ...profileData, updatedAt: new Date().toISOString() },
          }

          userProfile.value = { ...userProfile.value, ...mockResult.data }
          logger.info('User profile updated successfully (Mock)')
        } else {
          // BACKEND INTEGRATION - Gerçek API çağrısı
          /*
        try {
          logger.info('Attempting backend updateUserProfile', { 
            userOid: userProfile.value.oid || userProfile.value.userOid,
            updateFields: Object.keys(profileData)
          })
          const result = await accountApiModule.updateUserProfile(
            userProfile.value.oid || userProfile.value.userOid,
            profileData
          )
          
          if (!result.success) {
            logger.warn('Backend updateUserProfile failed, falling back to mock data', {
              error: result.error,
              userOid: userProfile.value.oid || userProfile.value.userOid
            })
            // Fallback to mock behavior
            userProfile.value = { ...userProfile.value, ...profileData, updatedAt: new Date().toISOString() }
          } else {
            userProfile.value = { ...userProfile.value, ...result.data }
            logger.info('User profile updated successfully (Backend)')
          }
        } catch (apiError) {
          logger.error('Backend API updateUserProfile error, falling back to mock data:', {
            error: apiError.message,
            userOid: userProfile.value.oid || userProfile.value.userOid
          })
          // Fallback to mock behavior
          userProfile.value = { ...userProfile.value, ...profileData, updatedAt: new Date().toISOString() }
        }
        */

          // ŞU AN MOCK DATA KULLAN - Backend entegrasyonu için yorum satırlarını kaldır
          logger.info('Backend integration disabled - using mock data for updateUserProfile')
          userProfile.value = {
            ...userProfile.value,
            ...profileData,
            updatedAt: new Date().toISOString(),
          }
        }
      } catch (err) {
        logger.error('User profile update failed:', err)
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    const updateSettings = (settingsData) => {
      accountSettings.value = { ...accountSettings.value, ...settingsData }
    }

    const updatePrivacySettings = (privacyData) => {
      accountSettings.value.privacy = {
        ...accountSettings.value.privacy,
        ...privacyData,
      }
    }

    const changePassword = async (currentPassword, newPassword) => {
      // Parametrelerin geçerliliğini kontrol et
      if (!currentPassword || !newPassword) {
        return { success: false, message: 'Mevcut şifre ve yeni şifre gereklidir' }
      }

      if (newPassword.length < 6) {
        return { success: false, message: 'Yeni şifre en az 6 karakter olmalıdır' }
      }

      // Aynı şifre kontrolü
      if (currentPassword === newPassword) {
        return { success: false, message: 'Yeni şifre mevcut şifre ile aynı olamaz' }
      }

      // Simüle edilmiş şifre değiştirme
      console.log('Şifre değiştiriliyor...', {
        currentPasswordLength: currentPassword.length,
        newPasswordLength: newPassword.length,
      })

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Şifre başarıyla değiştirildi' })
        }, 1000)
      })
    }

    /**
     * Check if user has specific permission
     * @param {string} permission - Permission key
     * @returns {boolean} Has permission
     */
    const hasPermission = (permission) => {
      return userProfile.value.permissions?.includes(permission) ?? false
    }

    // Department seçimi
    const selectDepartment = (departmentId) => {
      selectedDepartmentId.value = departmentId
      userProfile.value.department = departmentId

      // Seçili department'ı userProfile'a da kaydet
      const selectedDept = departmentItems.value.find((dept) => dept.id === departmentId)
      if (selectedDept) {
        userProfile.value.selectedBirimOid = selectedDept.id
        userProfile.value.selectedBirimLabel = selectedDept.name
        userProfile.value.selectedBirimAciklama = selectedDept.description
      }

      // Department items'ları güncelle
      departmentItems.value.forEach((dept) => {
        dept.selected = dept.id === departmentId
      })

      // AuthStore'daki user object'i güncelle
      const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
      if (authUser.oid === userProfile.value.oid) {
        authUser.selectedBirimOid = userProfile.value.selectedBirimOid
        authUser.selectedBirimLabel = userProfile.value.selectedBirimLabel
        authUser.selectedBirimAciklama = userProfile.value.selectedBirimAciklama
        localStorage.setItem('auth_user', JSON.stringify(authUser))
        logger.info('AuthStore updated with new department selection', { departmentId }, 'store')
      }

      logger.info(
        'Department selected',
        {
          departmentId,
          selectedBirimLabel: userProfile.value.selectedBirimLabel,
        },
        'store',
      )

      // Menüyü yenile - yeni birim/görev bilgilerine göre
      refreshMenuForUser()
    }

    // Task seçimi (radio button mantığı - sadece bir tane seçilebilir)
    const selectTask = (taskId) => {
      selectedTaskId.value = taskId

      // Task items'ları güncelle
      taskItems.value.forEach((task) => {
        task.completed = task.id === taskId
      })
    }

    // Task durumunu toggle et
    const toggleTaskStatus = (taskId) => {
      const task = taskItems.value.find((t) => t.id === taskId)
      if (task) {
        if (task.completed) {
          // Eğer görev zaten seçiliyse, seçimi kaldır
          task.completed = false
          selectedTaskId.value = null

          // userProfile'dan seçili görev bilgilerini temizle
          userProfile.value.selectedGörevOid = null
          userProfile.value.selectedGörevLabel = null
          userProfile.value.selectedGörevAciklama = null
        } else {
          // Diğer tüm görevleri kapat ve sadece bu görevi seç
          taskItems.value.forEach((t) => (t.completed = false))
          task.completed = true
          selectedTaskId.value = taskId

          // Seçili görev bilgilerini userProfile'a kaydet
          userProfile.value.selectedGörevOid = task.id
          userProfile.value.selectedGörevLabel = task.name
          userProfile.value.selectedGörevAciklama = task.description
        }
      }

      // AuthStore'daki user object'i güncelle
      const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
      if (authUser.oid === userProfile.value.oid) {
        authUser.selectedGörevOid = userProfile.value.selectedGörevOid
        authUser.selectedGörevLabel = userProfile.value.selectedGörevLabel
        authUser.selectedGörevAciklama = userProfile.value.selectedGörevAciklama
        localStorage.setItem('auth_user', JSON.stringify(authUser))
        logger.info('AuthStore updated with new task selection', { taskId }, 'store')
      }

      logger.info(
        'Task toggled',
        {
          taskId,
          selectedGörevLabel: userProfile.value.selectedGörevLabel,
          completed: task?.completed,
        },
        'store',
      )

      // Menüyü yenile - yeni birim/görev bilgilerine göre
      refreshMenuForUser()
    }

    // Taskbar ayarlarını güncelle
    const updateTaskbarSettings = (taskbarData) => {
      accountSettings.value.taskbar = {
        ...accountSettings.value.taskbar,
        ...taskbarData,
      }
    }

    // Logout fonksiyonu - AccountStore state'ini temizle
    const logout = () => {
      // AccountStore state'ini temizle
      userProfile.value = {}
      departmentItems.value = []
      taskItems.value = []

      // AccountStore localStorage verilerini temizle
      localStorage.removeItem('account_departmentItems')
      localStorage.removeItem('account_taskItems')
      localStorage.removeItem('account_userProfile')

      logger.info('AccountStore logout completed', {}, 'store')
    }

    // Taskbar görünürlüğünü toggle et
    const toggleTaskbarVisibility = () => {
      accountSettings.value.taskbar.showTaskbar = !accountSettings.value.taskbar.showTaskbar
    }

    // Taskbar otomatik gizleme toggle
    const toggleTaskbarAutoHide = () => {
      accountSettings.value.taskbar.autoHide = !accountSettings.value.taskbar.autoHide
    }

    // Taskbar konumunu değiştir - sadece left pozisyonu desteklenir
    const setTaskbarPosition = (position) => {
      if (position === 'left') {
        accountSettings.value.taskbar.position = position
      }
    }

    return {
      // State
      userProfile,
      isLoading,
      error,
      accountSettings,
      selectedDepartmentId,
      selectedTaskId,
      departmentItems,
      taskItems,

      // Computed - Yeni user object yapısına göre güncellendi
      fullName,
      initials,
      isOnline,
      selectedTaskName,
      selectedDepartmentName,
      userOid,
      userEmail,
      isActive,
      birimInfo,
      görevInfo,

      // Actions
      fetchUserProfile,
      fetchDepartments,
      fetchTasks,
      updateProfile,
      updateSettings,
      updatePrivacySettings,
      changePassword,
      hasPermission,
      logout,
      selectDepartment,
      selectTask,
      toggleTaskStatus,
      updateTaskbarSettings,
      toggleTaskbarVisibility,
      toggleTaskbarAutoHide,
      setTaskbarPosition,

      // Yeni senkronizasyon fonksiyonları
      syncFromAuthStore,
      initializeFromAuthStore,
      initializeMockData,
      refreshMenuForUser,
      // logout - duplicate key removed
    }
  },
  {
    persist: {
      key: 'sompo-account',
      storage: localStorage,
      paths: ['userProfile', 'accountSettings', 'selectedDepartmentId', 'selectedTaskId'],
    },
  },
)
