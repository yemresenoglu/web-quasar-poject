// Auth Mock Data
// Authentication ve kullanıcı oturumu için mock veriler

export const mockAuthData = {
  // Mock kullanıcı bilgileri
  user: {
    id: 'USER001',
    userCode: 'YEMRE001',
    firstName: 'Yunus Emre',
    lastName: 'Şenoğlu',
    email: 'yunus.senoglu@sompo.com',
    phone: '+90 532 123 45 67',
    department: {
      id: 'DEPT001',
      name: 'Hasar Uzmanı',
      code: 'HASAR_UZMAN'
    },
    role: {
      id: 'ROLE001',
      name: 'Hasar Uzmanı',
      permissions: [
        'hasar_dosya_okuma',
        'hasar_dosya_yazma',
        'evrak_yukleme',
        'rapor_goruntuleme'
      ]
    },
    lastLogin: '2024-01-15T10:30:00Z',
    loginCount: 156,
    status: 'active',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
  },

  // Mock oturum bilgileri
  session: {
    id: 'SESSION_001',
    token: 'mock_jwt_token_123456789',
    refreshToken: 'mock_refresh_token_987654321',
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 saat sonra
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },

  // Mock captcha verileri
  captcha: {
    imageUrl: 'http://10.81.98.63/sigorta/simpleCaptcha.png',
    token: 'captcha_token_mock_123',
    expiresIn: 300 // 5 dakika
  },

  // Mock login deneme limitleri
  loginLimits: {
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 dakika
    currentAttempts: 0,
    lastFailedAttempt: null,
    isLocked: false
  }
}

// Mock API response'ları
export const mockAuthResponses = {
  // Başarılı login response
  loginSuccess: {
    success: true,
    data: {
      user: mockAuthData.user,
      session: mockAuthData.session,
      message: 'Giriş başarılı'
    },
    status: 200
  },

  // Başarısız login response
  loginFailed: {
    success: false,
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Kullanıcı kodu veya şifre hatalı'
    },
    status: 401
  },

  // Captcha gerekli response
  captchaRequired: {
    success: false,
    error: {
      code: 'CAPTCHA_REQUIRED',
      message: 'Güvenlik doğrulaması gerekli'
    },
    captchaUrl: mockAuthData.captcha.imageUrl,
    status: 429
  },

  // Hesap kilitli response
  accountLocked: {
    success: false,
    error: {
      code: 'ACCOUNT_LOCKED',
      message: 'Hesap geçici olarak kilitlendi. 15 dakika sonra tekrar deneyin.'
    },
    lockoutUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    status: 423
  },

  // Token yenileme response
  refreshTokenSuccess: {
    success: true,
    data: {
      token: 'new_mock_jwt_token_987654321',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    },
    status: 200
  },

  // Logout response
  logoutSuccess: {
    success: true,
    data: {
      message: 'Çıkış başarılı'
    },
    status: 200
  },

  // Kullanıcı bilgileri response
  userInfoSuccess: {
    success: true,
    data: mockAuthData.user,
    status: 200
  }
}

// Mock captcha response (header ile)
export const mockCaptchaResponse = {
  success: true,
  data: {
    imageUrl: mockAuthData.captcha.imageUrl,
    token: 'captcha_token_mock_' + Math.random().toString(36).substr(2, 9)
  },
  headers: {
    'x-captcha-token': 'captcha_token_mock_' + Math.random().toString(36).substr(2, 9)
  },
  status: 200
}

// Mock validation fonksiyonları
export const mockValidations = {
  // Kullanıcı kodu validation
  validateUserCode: (userCode) => {
    if (!userCode || userCode.trim().length < 3) {
      return { valid: false, message: 'Kullanıcı kodu en az 3 karakter olmalıdır' }
    }
    if (!/^[A-Z0-9_]+$/.test(userCode)) {
      return { valid: false, message: 'Kullanıcı kodu sadece büyük harf, rakam ve alt çizgi içerebilir' }
    }
    return { valid: true }
  },

  // Şifre validation
  validatePassword: (password) => {
    if (!password || password.length < 6) {
      return { valid: false, message: 'Şifre en az 6 karakter olmalıdır' }
    }
    return { valid: true }
  },

  // Captcha validation
  validateCaptcha: (captcha) => {
    if (!captcha || captcha.trim().length < 4) {
      return { valid: false, message: 'Güvenlik kodu en az 4 karakter olmalıdır' }
    }
    return { valid: true }
  },

  // Session validation
  validateSession: (session) => {
    if (!session || !session.expiresAt) {
      return { valid: false, message: 'Geçersiz oturum' }
    }
    
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    
    if (now >= expiresAt) {
      return { valid: false, message: 'Oturum süresi dolmuş' }
    }
    
    return { valid: true }
  }
}

// Mock login simulation
export const simulateLogin = async (userCode, password, captcha) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  const userCodeValidation = mockValidations.validateUserCode(userCode)
  const passwordValidation = mockValidations.validatePassword(password)
  const captchaValidation = mockValidations.validateCaptcha(captcha)
  
  if (!userCodeValidation.valid) {
    return mockAuthResponses.loginFailed
  }
  
  if (!passwordValidation.valid) {
    return mockAuthResponses.loginFailed
  }
  
  if (!captchaValidation.valid) {
    return mockAuthResponses.captchaRequired
  }
  
  // Mock successful login for specific credentials
  if (userCode === 'YEMRE001' && password === '123456' && captcha) {
    return mockAuthResponses.loginSuccess
  }
  
  return mockAuthResponses.loginFailed
}

// Mock logout simulation
export const simulateLogout = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockAuthResponses.logoutSuccess
}

// Mock captcha fetch simulation
export const simulateCaptchaFetch = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCaptchaResponse
}

// Mock token refresh simulation
export const simulateTokenRefresh = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockAuthResponses.refreshTokenSuccess
}

// Mock user info fetch simulation
export const simulateUserInfoFetch = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockAuthResponses.userInfoSuccess
}

// Helper functions
export const getMockUser = () => mockAuthData.user
export const getMockSession = () => mockAuthData.session
export const getMockCaptcha = () => mockAuthData.captcha
export const getMockLoginLimits = () => mockAuthData.loginLimits

// API response formatında mock data
export const getMockAuthApiResponse = (endpoint) => {
  switch (endpoint) {
    case 'login':
      return mockAuthResponses.loginSuccess
    case 'logout':
      return mockAuthResponses.logoutSuccess
    case 'refreshToken':
      return mockAuthResponses.refreshTokenSuccess
    case 'userInfo':
      return mockAuthResponses.userInfoSuccess
    case 'captcha':
      return mockCaptchaResponse
    default:
      return mockAuthResponses.loginSuccess
  }
}

export default mockAuthData
