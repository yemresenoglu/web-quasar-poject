<template>
  <div class="error-state" :class="errorStateClass">
    <div class="error-state__content">
      <!-- Error Icon -->
      <div class="error-state__icon">
        <q-icon 
          :name="getErrorIcon" 
          :size="iconSize" 
          :color="getErrorColor"
        />
      </div>
      
      <!-- Error Title -->
      <h3 class="error-state__title">{{ getErrorTitle }}</h3>
      
      <!-- Error Message -->
      <p v-if="message || getErrorMessage" class="error-state__message">
        {{ message || getErrorMessage }}
      </p>
      
      <!-- Error Details (Collapsible) -->
      <div v-if="details && showDetails" class="error-state__details">
        <q-expansion-item
          icon="bi-info-circle"
          label="Error Details"
          header-class="text-grey-7"
        >
          <div class="error-details">
            <pre>{{ details }}</pre>
          </div>
        </q-expansion-item>
      </div>
      
      <!-- Actions -->
      <div class="error-state__actions">
        <!-- Retry Button -->
        <q-btn
          v-if="showRetry"
          :label="retryText"
          :color="retryColor"
          :icon="retryIcon"
          :loading="retrying"
          :outline="retryOutline"
          @click="handleRetry"
        />
        
        <!-- Custom Actions -->
        <slot name="actions" />
        
        <!-- Report Button -->
        <q-btn
          v-if="showReport"
          :label="reportText"
          color="grey-7"
          icon="bi-bug"
          flat
          @click="handleReport"
        />
      </div>
      
      <!-- Custom Content -->
      <div v-if="$slots.default" class="error-state__custom">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['generic', 'network', 'server', 'permission', 'notfound', 'timeout'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  retryText: {
    type: String,
    default: 'Tekrar Dene'
  },
  retryIcon: {
    type: String,
    default: 'bi-arrow-clockwise'
  },
  retryColor: {
    type: String,
    default: 'primary'
  },
  retryOutline: {
    type: Boolean,
    default: false
  },
  retrying: {
    type: Boolean,
    default: false
  },
  showReport: {
    type: Boolean,
    default: false
  },
  reportText: {
    type: String,
    default: 'Hata Bildir'
  },
  iconSize: {
    type: String,
    default: '64px'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['retry', 'report'])

const errorStateClass = computed(() => ({
  'error-state--small': props.size === 'small',
  'error-state--medium': props.size === 'medium',
  'error-state--large': props.size === 'large'
}))

const getErrorIcon = computed(() => {
  const icons = {
    generic: 'bi-exclamation-triangle',
    network: 'bi-wifi-off',
    server: 'bi-server',
    permission: 'bi-shield-exclamation',
    notfound: 'bi-search',
    timeout: 'bi-clock'
  }
  return icons[props.type] || icons.generic
})

const getErrorColor = computed(() => {
  const colors = {
    generic: 'orange',
    network: 'red',
    server: 'red',
    permission: 'amber',
    notfound: 'grey-6',
    timeout: 'orange'
  }
  return colors[props.type] || colors.generic
})

const getErrorTitle = computed(() => {
  if (props.title) return props.title
  
  const titles = {
    generic: 'Bir Hata Oluştu',
    network: 'Bağlantı Hatası',
    server: 'Sunucu Hatası',
    permission: 'Erişim Reddedildi',
    notfound: 'Sayfa Bulunamadı',
    timeout: 'İstek Zaman Aşımı'
  }
  return titles[props.type] || titles.generic
})

const getErrorMessage = computed(() => {
  if (props.message) return props.message
  
  const messages = {
    generic: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    network: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
    server: 'Sunucuya bağlanırken bir sorun oluştu.',
    permission: 'Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.',
    notfound: 'Aradığınız sayfa veya kaynak bulunamadı.',
    timeout: 'İstek çok uzun sürdü ve zaman aşımına uğradı.'
  }
  return messages[props.type] || messages.generic
})

const handleRetry = () => {
  emit('retry')
}

const handleReport = () => {
  emit('report', {
    type: props.type,
    title: getErrorTitle.value,
    message: props.message || getErrorMessage.value,
    details: props.details,
    timestamp: new Date().toISOString()
  })
}
</script>

<style lang="sass" scoped>
.error-state
  display: flex
  align-items: center
  justify-content: center
  min-height: 300px
  padding: 32px 16px
  text-align: center
  
  &--small
    min-height: 200px
    padding: 24px 16px
    
  &--large
    min-height: 400px
    padding: 48px 16px

.error-state__content
  max-width: 500px
  width: 100%
  
.error-state__icon
  margin-bottom: 24px
  opacity: 0.8
  
  .q-icon
    display: block
    margin: 0 auto
    
.error-state__title
  font-size: 22px
  font-weight: 600
  color: var(--theme-text-primary)
  margin: 0 0 16px 0
  line-height: 1.3
  
.error-state__message
  font-size: 15px
  color: var(--theme-text-secondary)
  margin: 0 0 24px 0
  line-height: 1.5
  
.error-state__details
  margin: 16px 0 24px 0
  text-align: left
  
.error-details
  background: var(--theme-surface)
  border-radius: 8px
  padding: 16px
  margin-top: 8px
  
  pre
    font-family: 'Courier New', monospace
    font-size: 12px
    color: var(--theme-text-secondary)
    white-space: pre-wrap
    word-break: break-word
    margin: 0
    
.error-state__actions
  display: flex
  gap: 12px
  justify-content: center
  align-items: center
  flex-wrap: wrap
  margin-bottom: 16px
  
.error-state__custom
  margin-top: 24px

// Size variations
.error-state--small
  .error-state__icon
    margin-bottom: 16px
    
    .q-icon
      font-size: 48px !important
      
  .error-state__title
    font-size: 18px
    margin-bottom: 12px
    
  .error-state__message
    font-size: 14px
    margin-bottom: 20px

.error-state--large
  .error-state__icon
    margin-bottom: 32px
    
    .q-icon
      font-size: 80px !important
      
  .error-state__title
    font-size: 26px
    margin-bottom: 20px
    
  .error-state__message
    font-size: 16px
    margin-bottom: 28px

// Responsive design
@media (max-width: 768px)
  .error-state
    padding: 24px 16px
    min-height: 250px
    
  .error-state__content
    max-width: 350px
    
  .error-state__actions
    flex-direction: column
    gap: 8px
    
    .q-btn
      width: 100%
      max-width: 200px

// Animation
.error-state__content
  animation: fadeInUp 0.6s ease-out
  
@keyframes fadeInUp
  from
    opacity: 0
    transform: translateY(20px)
  to
    opacity: 1
    transform: translateY(0)

// Dark theme support
.theme-dark
  .error-state__title
    color: var(--theme-text-primary)
    
  .error-state__message
    color: var(--theme-text-secondary)
    
  .error-details
    background: var(--theme-surface)
    
    pre
      color: var(--theme-text-secondary)
</style> 