<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="section-card minimal-design forgot-password-dialog">
      <div class="section-header">
        <h2 class="section-title">{{ $t('login.forgotPasswordTitle') }}</h2>
        <q-btn 
          flat 
          round 
          dense 
          v-close-popup
          class="dialog-close-btn"
        >
          <i class="bi bi-x-lg"></i>
        </q-btn>
      </div>

      <div class="section-content">
        <p class="dialog-description">{{ $t('login.forgotPasswordDescription') }}</p>
        
        <div class="form-group">
          <label>{{ $t('login.email') }}</label>
          <q-input
            v-model="email"
            outlined
            dense
            type="email"
            class="login-input"
          >
            <template v-slot:prepend>
              <i class="bi bi-envelope"></i>
            </template>
          </q-input>
        </div>
        
        <div class="dialog-actions">
          <q-btn 
            flat 
            :label="$t('common.cancel')" 
            v-close-popup
            class="dialog-btn"
          />
          <q-btn 
            flat
            :label="$t('login.sendResetLink')" 
            @click="handleSendReset"
            :loading="loading"
            :disable="!email"
            class="dialog-btn"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth-store.js'
import { createLogger } from 'src/utils/logger.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()
const { t } = useI18n()
const authStore = useAuthStore()
const logger = createLogger('ForgotPasswordDialog')

const email = ref('')
const loading = ref(false)

const handleSendReset = async () => {
  if (!email.value) return

  loading.value = true
  try {
    logger.info('Forgot password request started')
    
    const result = await authStore.forgotPassword(email.value)
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: result.message,
        icon: '✓',
        position: 'top-right'
      })
      
      emit('update:modelValue', false)
      email.value = ''
      
      logger.info('Reset link sent successfully')
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    logger.error('Forgot password failed:', error)
    $q.notify({
      type: 'negative',
      message: error.message || t('login.resetLinkError'),
      icon: '✕',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    email.value = ''
  }
})
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.forgot-password-dialog {
  width: 100%;
  max-width: 420px;
  
  .dialog-close-btn {
    min-height: 24px;
    min-width: 24px;
    padding: 2px;
    color: $text-secondary;
    opacity: 0.7;
    transition: all 0.2s ease;
    
    .q-icon {
      font-size: 12px;
    }
    
    &:hover {
      opacity: 1;
      background: $background-light;
    }
  }
  
  .dialog-description {
    color: $text-secondary;
    opacity: 0.87;
    font-size: 11px;
    margin: 0 0 14px 0;
    line-height: 1.4;
    text-transform: none;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid $border-lighter;
  }
  
  .dialog-btn {
    min-height: 26px !important;
    height: 26px !important;
    padding: 2px 12px !important;
    border-radius: 2px !important;
    font-weight: 600 !important;
    font-size: 9px !important;
    letter-spacing: 0.3px !important;
    line-height: 1.1;
    text-transform: uppercase !important;
    color: $text-secondary !important;
    background: $background-button !important;
    border-left: 2px solid $border-accent !important;
    transition: all 0.2s ease;
    
    &:hover:not(.q-btn--loading) {
      transform: translateY(-1px);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    
    .q-icon {
      font-size: 9px !important;
      margin-right: 4px !important;
    }
  }
}

.form-group {
  margin-bottom: 16px;
  
  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: $text-secondary;
    margin-bottom: 6px;
    text-transform: none;
    opacity: 0.87;
  }
}

.login-input {
  :deep(.q-field__control) {
    border-radius: 4px;
    min-height: 40px;
    
    &:hover {
      border-color: $border-hover;
    }
  }
  
  :deep(.q-field__native) {
    font-size: 13px;
    color: $text-primary;
    padding: 8px 12px;
  }
  
  :deep(.q-field__control):before {
    border-color: $border-lighter;
  }
  
  :deep(.q-field__prepend) {
    .q-icon,
    i {
      font-size: 16px;
      color: $text-secondary;
      opacity: 0.7;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 1;
      }
    }
  }
}

.section-card {
  background: $background-card;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
}

.section-header {
  padding: 16px 20px;
  border-bottom: 1px solid $border-lighter;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-secondary;
  text-transform: none;
  margin: 0;
}

.section-content {
  padding: 20px;
}

@media (max-width: 480px) {
  .section-card.minimal-design {
    .section-header {
      padding: 12px 14px;
    }
    
    .section-content {
      padding: 14px;
    }
  }
}

.section-card {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
