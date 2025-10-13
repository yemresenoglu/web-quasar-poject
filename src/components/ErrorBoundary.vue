<!-- src/components/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__content">
      <div class="error-boundary__icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h3 class="error-boundary__title">{{ t('errors.somethingWentWrong') }}</h3>
      <p class="error-boundary__message">{{ errorMessage }}</p>
      <div class="error-boundary__actions">
        <q-btn 
          @click="resetError" 
          :label="t('common.retry')"
          color="primary"
          icon="bi-arrow-clockwise"
          class="error-boundary__btn"
        />
        <q-btn 
          @click="goHome" 
          :label="t('common.goHome')"
          color="secondary"
          icon="bi-house"
          class="error-boundary__btn"
          flat
        />
      </div>
      <div v-if="showDetails" class="error-boundary__details">
        <details>
          <summary>{{ t('errors.showDetails') }}</summary>
          <pre class="error-boundary__stack">{{ errorStack }}</pre>
        </details>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { createLogger } from 'src/utils/logger'
import { ERROR_CODES } from 'src/api/types'

const { t } = useI18n()
const router = useRouter()
const logger = createLogger('ErrorBoundary')

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const showDetails = ref(false)

onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message
  
  // Enhanced error logging with API context
  const errorContext = {
    error: error.message,
    stack: error.stack,
    component: instance?.$options?.name,
    info,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  logger.error('Component error caught:', errorContext)
  
  // Check if it's an API error
  if (error.name === 'AxiosError' || error.config) {
    handleApiError(error)
  } else {
    handleGenericError(error)
  }
  
  errorStack.value = error.stack || 'No stack trace available'
  showDetails.value = process.env.NODE_ENV === 'development'
  
  return false // Prevent error propagation
})

/**
 * Handle API-specific errors
 */
const handleApiError = (error) => {
  const status = error.response?.status
  const statusText = error.response?.statusText
  
  switch (status) {
    case 401:
      errorMessage.value = t('errors.unauthorized')
      logger.warn('Authentication error - redirecting to login')
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      break
      
    case 403:
      errorMessage.value = t('errors.forbidden')
      break
      
    case 404:
      errorMessage.value = t('errors.notFound')
      break
      
    case 500:
      errorMessage.value = t('errors.serverError')
      break
      
    case 503:
      errorMessage.value = t('errors.serviceUnavailable')
      break
      
    default:
      if (error.code === 'ECONNABORTED') {
        errorMessage.value = t('errors.timeout')
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage.value = t('errors.networkError')
      } else {
        errorMessage.value = t('errors.apiError', { status, statusText })
      }
  }
}

/**
 * Handle generic JavaScript errors
 */
const handleGenericError = (error) => {
  if (error.name === 'TypeError') {
    errorMessage.value = t('errors.typeError')
  } else if (error.name === 'ReferenceError') {
    errorMessage.value = t('errors.referenceError')
  } else if (error.name === 'SyntaxError') {
    errorMessage.value = t('errors.syntaxError')
  } else {
    errorMessage.value = t('errors.genericError')
  }
}

/**
 * Reset error state
 */
const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  showDetails.value = false
  
  logger.info('Error boundary reset by user')
}

/**
 * Navigate to home page
 */
const goHome = () => {
  resetError()
  router.push('/')
}

/**
 * Get error severity level
 */
const getErrorSeverity = (error) => {
  if (error.response?.status >= 500) return 'critical'
  if (error.response?.status >= 400) return 'high'
  return 'medium'
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: $background-light;
  border: 1px solid $border-light;
  border-radius: 8px;
  margin: 1rem;

  &__content {
    text-align: center;
    max-width: 500px;
  }

  &__icon {
    font-size: 4rem;
    color: $negative;
    margin-bottom: 1rem;
  }

  &__title {
    color: $text-primary;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  &__message {
    color: $text-secondary;
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }

  &__btn {
    min-width: 120px;
  }

  &__details {
    text-align: left;
    background: white;
    border: 1px solid $border-light;
    border-radius: 4px;
    padding: 1rem;
    
    summary {
      cursor: pointer;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 1rem;
    }
  }

  &__stack {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: $text-secondary;
    background: $background-light;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

// Dark mode support
.body--dark {
  .error-boundary {
    background: $dark-page;
    border-color: $dark-border;

    &__details {
      background: $dark-card;
      border-color: $dark-border;
    }

    &__stack {
      background: $dark-page;
    }
  }
}
</style>
