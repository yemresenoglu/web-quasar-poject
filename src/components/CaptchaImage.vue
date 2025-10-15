<template>
  <div class="captcha-container">
    <div class="captcha-input-wrapper">
      <q-img
        :src="captchaUrl"
        alt="Captcha"
        class="captcha-image"
        @load="onImageLoad"
        @error="onImageError"
        spinner-color="primary"
        spinner-size="20px"
      >
        <template v-slot:loading>
          <div class="captcha-loading">
            <q-spinner color="primary" size="20px" />
          </div>
        </template>
      </q-img>
      <button
        @click="refreshCaptcha"
        :disabled="loading"
        class="captcha-refresh-icon"
      >
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { createLogger } from 'src/utils/logger'
import { getCaptchaUrl } from 'src/constants/api'

const { t } = useI18n()
const logger = createLogger('CaptchaImage')

const CAPTCHA_TOKEN_KEY = 'captchaToken'

const captchaUrl = ref('')
const loading = ref(false)
const captchaToken = ref('')



const loadCaptcha = async () => {
  try {
    loading.value = true
    
    // Gerçek HTTP request atarak captcha'yı yenile
    const response = await fetch(`${getCaptchaUrl()}?_=${Date.now()}`, {
      method: 'GET',
      credentials: 'include', // Cookies dahil et
      cache: 'no-cache'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // Response header'ından token bilgisini al
    const captchaTokenFromHeader = response.headers.get('captcha-token') || 
                                  response.headers.get('x-captcha-token') ||
                                  response.headers.get('set-cookie')
    
    if (captchaTokenFromHeader) {
      captchaToken.value = captchaTokenFromHeader
      localStorage.setItem(CAPTCHA_TOKEN_KEY, captchaTokenFromHeader)
      logger.info('Captcha token from header:', captchaTokenFromHeader)
    } else {
      logger.warn('No captcha token found in response headers')
      captchaToken.value = ''
    }
    
    // Captcha URL'ini güncelle
    captchaUrl.value = `${getCaptchaUrl()}?t=${captchaToken.value}&_=${Date.now()}`
    
    logger.info('Captcha loaded successfully')
  } catch (error) {
    logger.error('Error loading captcha:', error)
    captchaToken.value = ''
    captchaUrl.value = getCaptchaUrl()
  } finally {
    loading.value = false
  }
}

const refreshCaptcha = () => {
  loadCaptcha()
}

const onImageLoad = () => {
  logger.debug('Captcha image loaded successfully')
}

const onImageError = (error) => {
  logger.error('Captcha image failed to load:', error)
}

// Component mount edildiğinde captcha'yı yükle
onMounted(() => {
  loadCaptcha()
})

// Parent component'ten çağrılabilmesi için expose ediyoruz
defineExpose({
  refreshCaptcha,
  getCaptchaToken: () => captchaToken.value
})
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.captcha-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.captcha-image {
  flex: 1;
  height: 40px;
  border: 1px solid $border-light;
  border-radius: 4px;
  background-color: $background-card;
  
  &:hover {
    border-color: $border-hover;
  }
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: $background-card;
}

.captcha-refresh-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: $text-secondary;
  border-radius: 2px;
  transition: all 0.2s ease;
  
  &:hover {
    color: $text-primary;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  i {
    font-size: 14px;
  }
}
</style>
