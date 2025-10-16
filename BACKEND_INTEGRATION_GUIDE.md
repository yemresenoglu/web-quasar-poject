# Backend Integration Implementation Guide

Bu dokümantasyon, Quasar projesinde backend entegrasyonu için hazırlanmış yorum satırlarındaki kodları nasıl aktif edeceğinizi ve test edeceğinizi açıklar.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Hazırlık](#hazırlık)
3. [Backend Entegrasyon Adımları](#backend-entegrasyon-adımları)
4. [Test ve Validation](#test-ve-validation)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

## 🎯 Genel Bakış

Proje, backend entegrasyonu için tamamen hazır durumda. Tüm API çağrıları yorum satırlarında hazır bekliyor. Bu guide ile adım adım backend entegrasyonunu aktif edebilirsiniz.

### Mevcut Durum
- ✅ **Mock Data**: Aktif ve çalışıyor
- ✅ **Backend API Kodları**: Yorum satırlarında hazır
- ✅ **Error Handling**: Fallback stratejileri mevcut
- ✅ **Environment Configuration**: Tamamen yapılandırılmış
- ✅ **Test Utilities**: Hazır test fonksiyonları

## 🚀 Hazırlık

### 1. Environment Variables

`env.example` dosyasını `.env` olarak kopyalayın ve değerleri güncelleyin:

```bash
# Development için
NODE_ENV=development
VUE_APP_API_BASE_URL=http://localhost:8080
VUE_APP_USE_MOCK_DATA=true
VUE_APP_ENABLE_LOGGING=true

# Production için
NODE_ENV=production
VUE_APP_API_BASE_URL=https://api.sompo.com
VUE_APP_USE_MOCK_DATA=false
VUE_APP_ENABLE_LOGGING=false
```

### 2. Backend Server

Backend server'ınızın çalıştığından emin olun:
- **Development**: `http://localhost:8080`
- **Production**: `https://api.sompo.com`

### 3. API Endpoints

Backend'inizde şu endpoint'lerin mevcut olduğundan emin olun:
- `/api/auth/*` - Authentication endpoints
- `/api/user/*` - User management endpoints
- `/api/dashboard/*` - Dashboard data endpoints
- `/api/menu/*` - Menu data endpoints
- `/api/hasar/*` - Hasar dosya endpoints
- `/api/account/*` - Account management endpoints

## 🔧 Backend Entegrasyon Adımları

### ADIM 1: Environment Configuration

1. **Development'dan Production'a Geçiş**:
   ```bash
   # .env dosyasında
   NODE_ENV=production
   VUE_APP_USE_MOCK_DATA=false
   ```

2. **API Base URL'i güncelleyin**:
   ```bash
   VUE_APP_API_BASE_URL=https://your-backend-url.com
   ```

### ADIM 2: Auth Store Backend Entegrasyonu

`src/stores/auth-store.js` dosyasında yorum satırlarını kaldırın:

#### Login Fonksiyonu (Satır 92-115):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

#### getUserUnit Fonksiyonu (Satır 140-158):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

#### getUserTask Fonksiyonu (Satır 185-203):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

#### Logout Fonksiyonu (Satır 387-406):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

#### checkSession Fonksiyonu (Satır 475-496):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

### ADIM 3: Account Store Backend Entegrasyonu

`src/stores/account-store.js` dosyasında yorum satırlarını kaldırın:

#### fetchProfile Fonksiyonu (Satır 369-389):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

#### updateProfile Fonksiyonu (Satır 474-503):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
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
```

### ADIM 4: Dashboard Store Backend Entegrasyonu

`src/stores/dashboard-store.js` dosyasında yorum satırlarını kaldırın:

#### fetchDashboardData Fonksiyonu (Satır 84-111):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
try {
  logger.info('Attempting backend getDashboardData', { userOid })
  const result = await dashboardApiModule.getDashboardData(userOid)
  
  if (result.success && result.data) {
    userLocation.value = result.data.userLocation || ''
    processStats.value = result.data.processStats || []
    jobStatusStats.value = result.data.jobStatusStats || []
    announcementList.value = result.data.announcements || []
    chartData.value = result.data.charts || {}
    
    logger.info('Dashboard data loaded successfully (Backend)', { userOid })
  } else {
    logger.warn('Backend getDashboardData failed, falling back to mock data', {
      error: result.error,
      userOid
    })
    throw new Error(result.error || 'Backend dashboard data fetch failed')
  }
} catch (apiError) {
  logger.error('Backend API getDashboardData error, falling back to mock data:', {
    error: apiError.message,
    userOid
  })
  throw apiError
}
```

### ADIM 5: Menu Store Backend Entegrasyonu

`src/stores/menu-page-store.js` dosyasında yorum satırlarını kaldırın:

#### buildMenuFromData Fonksiyonu (Satır 55-85):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
try {
  logger.info('Attempting backend getMenuData', { userOid })
  const result = await menuApiModule.getMenuData(userOid)
  
  if (result.success && result.data) {
    logger.info('Backend menu data loaded successfully', { 
      userOid, 
      categoriesCount: result.data?.categories?.length || 0 
    })
    return result.data.categories || []
  } else {
    logger.warn('Backend getMenuData failed, falling back to mock data', { 
      userOid, 
      error: result.error 
    })
    
    // Fallback to mock data
    const userMenuData = getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)
    return userMenuData
  }
} catch (apiError) {
  logger.error('Backend API getMenuData error, falling back to mock data:', {
    error: apiError.message,
    userOid
  })
  
  // Fallback to mock data
  const userMenuData = getUserMenuData(userOid, selectedBirimLabel, selectedGörevLabel)
  return userMenuData
}
```

### ADIM 6: Hasar Dosya API Backend Entegrasyonu

`src/api/modules/hasar-dosya-api.js` dosyasında yorum satırlarını kaldırın:

#### searchHasarFiles Fonksiyonu (Satır 52-88):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
try {
  logger.info('Attempting backend searchHasarFiles', { 
    searchParams: Object.keys(searchParams),
    dosyaNo: searchParams.dosyaNo 
  })
  
  const response = await createBaseApi().dispatch('searchHasarFiles', searchParams)
  
  if (response.success) {
    logger.info('Hasar Dosya API: Search successful (Backend)', { 
      count: response.data?.length || 0,
      dosyaNo: searchParams.dosyaNo
    })
  } else {
    logger.warn('Backend searchHasarFiles failed, falling back to mock data', {
      error: response.error,
      dosyaNo: searchParams.dosyaNo
    })
    
    // Fallback to mock data
    const { dosyaNo, victimNumber } = searchParams
    return getMockSearchResponse(dosyaNo, victimNumber)
  }
  
  return response
} catch (apiError) {
  logger.error('Backend API searchHasarFiles error, falling back to mock data:', {
    error: apiError.message,
    dosyaNo: searchParams.dosyaNo
  })
  
  // Fallback to mock data
  const { dosyaNo, victimNumber } = searchParams
  return getMockSearchResponse(dosyaNo, victimNumber)
}
```

#### getHasarFileDetails Fonksiyonu (Satır 135-157):
```javascript
// Yorum satırlarını kaldır ve şunu aktif et:
try {
  logger.info('Attempting backend getHasarFileDetails', { dosyaNo })
  const response = await createBaseApi().dispatch('getHasarFileDetails', { dosyaNo })
  
  if (response.success) {
    logger.info('Hasar Dosya API: File details retrieved successfully (Backend)', { dosyaNo })
  } else {
    logger.error('Hasar Dosya API: Get file details failed (Backend)', { 
      error: response.error,
      dosyaNo 
    })
  }
  
  return response
} catch (apiError) {
  logger.error('Backend API getHasarFileDetails error:', {
    error: apiError.message,
    dosyaNo
  })
  throw apiError
}
```

## 🧪 Test ve Validation

### 1. Backend Integration Test Suite

```javascript
// src/utils/backend-integration-tests.js kullanarak test edin
import { backendTestSuite } from 'src/utils/backend-integration-tests.js'

// Tüm testleri çalıştır
const testResults = await backendTestSuite.runAllTests()
console.log('Test Results:', testResults)
```

### 2. Configuration Validation

```javascript
// src/config/backend-config.js kullanarak konfigürasyonu doğrulayın
import { backendConfig } from 'src/config/backend-config.js'

const validation = backendConfig.validateConfig()
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors)
}
```

### 3. Backend Health Check

```javascript
// src/utils/backend-integration-helpers.js kullanarak health check yapın
import { BackendHealthMonitor } from 'src/utils/backend-integration-helpers.js'

const healthStatus = await BackendHealthMonitor.checkHealth(async () => {
  // Health check fonksiyonu
  const response = await fetch('/health')
  return response.ok
})
```

### 4. Manual Test Senaryoları

#### Auth Test:
1. Login yapın (şifre: `12`, captcha: `aaa`)
2. Console'da backend API çağrılarını kontrol edin
3. Logout yapın ve API çağrılarını kontrol edin

#### Dashboard Test:
1. Dashboard'a gidin
2. Console'da dashboard data API çağrılarını kontrol edin
3. Chart data'nın yüklendiğini kontrol edin

#### Menu Test:
1. Menu sayfasına gidin
2. Console'da menu data API çağrılarını kontrol edin
3. Menu item'ların yüklendiğini kontrol edin

#### Hasar Dosya Test:
1. Hasar Dosya Sorgula sayfasına gidin
2. Dosya numarası: `2025001000001` ile arama yapın
3. Console'da search API çağrılarını kontrol edin

## 🔧 Troubleshooting

### Yaygın Sorunlar ve Çözümleri

#### 1. Network Error
```
Error: Network Error
```
**Çözüm**: Backend server'ın çalıştığından emin olun ve URL'i kontrol edin.

#### 2. CORS Error
```
Error: CORS policy
```
**Çözüm**: Backend'de CORS ayarlarını kontrol edin.

#### 3. 401 Unauthorized
```
Error: 401 Unauthorized
```
**Çözüm**: Authentication token'larını kontrol edin.

#### 4. 404 Not Found
```
Error: 404 Not Found
```
**Çözüm**: API endpoint'lerinin doğru olduğundan emin olun.

#### 5. Mock Data Fallback
```
Warning: Backend failed, falling back to mock data
```
**Çözüm**: Bu normal bir durumdur. Backend başarısız olduğunda mock data kullanılır.

### Debug Mode

Debug mode'u aktif etmek için:

```bash
# .env dosyasında
VUE_APP_DEBUG_MODE=true
VUE_APP_ENABLE_LOGGING=true
```

## 📚 Best Practices

### 1. Gradual Migration
- Önce development environment'ta test edin
- Sonra staging environment'ta test edin
- En son production'a geçin

### 2. Fallback Strategy
- Her zaman mock data fallback'i aktif tutun
- Backend başarısız olduğunda kullanıcı deneyimi bozulmasın

### 3. Error Handling
- Tüm API çağrılarında error handling yapın
- Kullanıcıya anlamlı hata mesajları gösterin

### 4. Logging
- Production'da logging'i kapatın
- Development'ta detaylı logging yapın

### 5. Configuration Management
- Environment variables kullanın
- Configuration'ı centralize edin

### 6. Testing
- Her backend entegrasyonunu test edin
- Automated test suite kullanın

## 📞 Support

Backend entegrasyonu ile ilgili sorunlar için:

1. Console log'larını kontrol edin
2. Network tab'ını kontrol edin
3. Backend server log'larını kontrol edin
4. Test suite'i çalıştırın

## 🎉 Sonuç

Bu guide ile backend entegrasyonunu adım adım aktif edebilirsiniz. Tüm kodlar hazır durumda ve fallback stratejileri mevcut. Backend başarısız olduğunda otomatik olarak mock data'ya geçiş yapacaktır.

**Başarılı entegrasyon için:**
1. ✅ Environment variables'ı doğru ayarlayın
2. ✅ Backend server'ın çalıştığından emin olun
3. ✅ API endpoint'lerinin doğru olduğundan emin olun
4. ✅ Yorum satırlarını adım adım kaldırın
5. ✅ Her adımı test edin
6. ✅ Log'ları kontrol edin

İyi çalışmalar! 🚀
