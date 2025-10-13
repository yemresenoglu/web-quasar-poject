<template>
  <q-page class="account-change-password">
    <!-- Page Header -->
    <div class="account-change-password__header">
      <div class="account-change-password__header-content">
        <q-btn
          flat
          round
          dense
          icon="bi-arrow-left"
          class="account-change-password__back-btn"
          @click="goBack"
          :aria-label="$t('common.back')"
        />
        <div class="account-change-password__title">{{ $t('account.changePassword') }}</div>
        <div class="account-change-password__spacer"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="account-change-password__container">
      <!-- Password Section -->
      <div class="account-change-password__section">
        <div class="account-change-password__section-header">
          <i class="bi bi-key account-change-password__section-icon" style="font-size: 16px;"></i>
          <div class="account-change-password__section-title">{{ $t('account.changePassword') }}</div>
        </div>
        
        <q-form @submit.prevent="submitChangePassword" class="account-change-password__form">
          <div class="account-change-password__form-grid">
            <div class="account-change-password__field account-change-password__field--full">
              <label class="account-change-password__field-label">{{ $t('account.currentPassword') }}</label>
              <q-input
                v-model="passwordForm.currentPassword"
                outlined
                dense
                type="password"
                :rules="validationRules.currentPassword"
                class="account-change-password__input"
              />
            </div>
            
            <div class="account-change-password__field account-change-password__field--full">
              <label class="account-change-password__field-label">{{ $t('account.newPassword') }}</label>
              <q-input
                v-model="passwordForm.newPassword"
                outlined
                dense
                type="password"
                :rules="validationRules.newPassword"
                class="account-change-password__input"
              />
            </div>
            
            <div class="account-change-password__field account-change-password__field--full">
              <label class="account-change-password__field-label">{{ $t('account.confirmPassword') }}</label>
              <q-input
                v-model="passwordForm.confirmPassword"
                outlined
                dense
                type="password"
                :rules="validationRules.confirmPassword"
                class="account-change-password__input"
              />
            </div>
          </div>
          
          <div class="search-form-actions">
            <q-btn
              color="primary"
              :label="$t('common.save')"
              icon="bi-floppy"
              type="submit"
              :disable="!isPasswordFormValid || loadingStates.password"
              :loading="loadingStates.password"
              class="search-btn"
            />
            <q-btn
              color="primary"
              :label="$t('common.cancel')"
              icon="bi-x-lg"
              @click="resetPasswordForm"
              :disable="loadingStates.password"
              class="clear-btn"
            />
          </div>
        </q-form>
      </div>

      <!-- Security Tips -->
      <div class="account-change-password__section">
        <div class="account-change-password__section-header">
          <i class="bi bi-shield-check account-change-password__section-icon" style="font-size: 16px;"></i>
          <div class="account-change-password__section-title">{{ $t('account.passwordSecurityTips') }}</div>
        </div>
        
        <div class="account-change-password__tips">
          <div class="account-change-password__tip">
            <i class="bi bi-check-circle account-change-password__tip-icon" style="font-size: 14px;"></i>
            <span class="account-change-password__tip-text">{{ $t('account.passwordTip1') }}</span>
          </div>
          <div class="account-change-password__tip">
            <i class="bi bi-check-circle account-change-password__tip-icon" style="font-size: 14px;"></i>
            <span class="account-change-password__tip-text">{{ $t('account.passwordTip2') }}</span>
          </div>
          <div class="account-change-password__tip">
            <i class="bi bi-check-circle account-change-password__tip-icon" style="font-size: 14px;"></i>
            <span class="account-change-password__tip-text">{{ $t('account.passwordTip3') }}</span>
          </div>
          <div class="account-change-password__tip">
            <i class="bi bi-check-circle account-change-password__tip-icon" style="font-size: 14px;"></i>
            <span class="account-change-password__tip-text">{{ $t('account.passwordTip4') }}</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from 'src/stores/account-store'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('AccountChangePassword')
const router = useRouter()
const $q = useQuasar()
const { t: $t } = useI18n()

const accountStore = useAccountStore()

// Loading states
const loadingStates = ref({
  password: false
})

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed
const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword && 
         passwordForm.value.newPassword && 
         passwordForm.value.newPassword.length >= 6 &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

/**
 * Computed property containing all form validation rules
 * @returns {Object} Object containing validation rules for each form field
 */
const validationRules = computed(() => ({
  currentPassword: [
    val => !!val || $t('validation.required')
  ],
  newPassword: [
    val => !!val || $t('validation.required'),
    val => val.length >= 6 || $t('validation.minLength', { min: 6 })
  ],
  confirmPassword: [
    val => !!val || $t('validation.required'),
    val => val === passwordForm.value.newPassword || $t('validation.passwordMismatch')
  ]
}))

/**
 * Resets the password form to its initial empty state
 * @returns {void}
 */
const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

/**
 * Submits the password change form with validation and loading state management
 * @returns {Promise<void>}
 */
const submitChangePassword = async () => {
  if (!isPasswordFormValid.value) return

  loadingStates.value.password = true
  try {
    logger.info('Password change initiated')
    const result = await accountStore.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    if (result.success) {
      resetPasswordForm()
      $q.notify({
        type: 'positive',
        message: $t('account.passwordChangedSuccessfully'),
        icon: '✓',
        position: 'top-right'
      })
      logger.info('Password changed successfully')
      
      // Redirect to profile page after successful password change
      setTimeout(() => {
        router.push('/account/edit-profile')
      }, 1500)
    } else {
      logger.error('Password change failed:', result.message)
      $q.notify({
        type: 'negative',
        message: $t('account.passwordChangeFailed'),
        icon: '✕',
        position: 'top-right'
      })
    }
  } catch (error) {
    logger.error('Password change error:', error)
    $q.notify({
      type: 'negative',
      message: $t('account.passwordChangeError'),
      icon: '✕',
      position: 'top-right'
    })
  } finally {
    loadingStates.value.password = false
  }
}

/**
 * Navigates back to the previous page
 * @returns {void}
 */
const goBack = () => {
  router.go(-1)
}

// Lifecycle
onMounted(() => {
  logger.info('AccountChangePassword page mounted')
})
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.account-change-password {
  min-height: 100vh;
  background: $background-page;
  padding: 16px;

  &__header {
    margin-bottom: 16px;
  }

  &__header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 8px 0;
  }

  &__back-btn {
    min-height: 32px;
    min-width: 32px;
    border-radius: 4px;
    color: $text-secondary;
    opacity: 0.87;
    transition: all 0.2s ease;

    &:hover {
      background: $background-light;
      opacity: 1;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $text-secondary;
    text-transform: none;
  }

  &__spacer {
    flex: 1;
  }

  &__container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__section {
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

  &__section-header {
    padding: 16px 20px;
    border-bottom: 1px solid $border-lighter;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
  }

  &__section-icon {
    color: $text-secondary;
    font-size: 16px;
  }

  &__section-title {
    font-size: 15px;
    font-weight: 600;
    color: $text-secondary;
    text-transform: none;
  }

  &__form {
    padding: 20px;
  }

  &__form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &--full {
      grid-column: 1 / -1;
    }
  }

  &__field-label {
    font-size: 13px;
    font-weight: 500;
    color: $text-secondary;
    text-transform: none;
    opacity: 0.87;
  }

  &__input {
    :deep(.q-field__control) {
      border-radius: 4px;
      min-height: 40px;
      
      &:hover {
        border-color: $border-hover;
      }
    }
    
    :deep(.q-field__label) {
      font-size: 13px;
      color: $text-secondary;
      font-weight: 400;
    }
    
    :deep(.q-field__native) {
      font-size: 13px;
      color: $text-primary;
      padding: 8px 12px;
    }
    
    :deep(.q-field__control):before {
      border-color: $border-lighter;
    }
  }

  // Search form actions (buttons)
  .search-form-actions {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid $border-lighter;
  }

  // 🔧 Save Button (KAYDET)
  .search-btn {
    width: 130px !important;
    min-width: 130px !important;
    max-width: 130px !important;
    height: 26px !important;
    min-height: 26px !important;
    background: $background-button !important;
    padding: 2px 6px !important;
    border-radius: 2px !important;
    font-weight: 600 !important;
    font-size: 9px !important;
    color: $text-secondary !important;
    border-left: 2px solid $border-accent !important;
    letter-spacing: 0.3px !important;
    line-height: 1.1 !important;
    text-transform: uppercase !important;
    
    // Icon styling
    :deep(.q-icon) {
      font-size: 9px !important;
      margin-right: 4px !important;
      color: $text-secondary !important;
      opacity: 1 !important;
    }
    
    // Loading state
    &.q-btn--loading {
      :deep(.q-icon) {
        font-size: 9px !important;
        color: $text-secondary !important;
      }
    }
  }

  // 🔧 Cancel Button (İPTAL)
  .clear-btn {
    width: 130px !important;
    min-width: 130px !important;
    max-width: 130px !important;
    height: 26px !important;
    min-height: 26px !important;
    background: $background-button !important;
    padding: 2px 6px !important;
    border-radius: 2px !important;
    font-weight: 600 !important;
    font-size: 9px !important;
    color: $text-secondary !important;
    border: none !important;
    border-top: none !important;
    border-right: none !important;
    border-bottom: none !important;
    border-left: 2px solid $border-accent !important;
    letter-spacing: 0.3px !important;
    line-height: 1.1 !important;
    text-transform: uppercase !important;
    
    // Icon styling
    :deep(.q-icon) {
      font-size: 9px !important;
      margin-right: 4px !important;
      color: $text-secondary !important;
      opacity: 1 !important;
    }
    
    // Hover/Focus states
    &:hover, &:focus, &:active {
      border: none !important;
      border-top: none !important;
      border-right: none !important;
      border-bottom: none !important;
      border-left: 2px solid $border-accent !important;
    }
  }

  &__tips {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__tip {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  &__tip-icon {
    color: $text-success;
    margin-top: 2px;
    flex-shrink: 0;
  }

  &__tip-text {
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.5;
    opacity: 0.87;
  }
}

// Override global uppercase rules for this page
.account-change-password {
  text-transform: none !important;
  
  * {
    text-transform: none !important;
  }
  
  .q-field__label,
  .q-item__label,
  .account-change-password__title,
  .account-change-password__section-title,
  .account-change-password__field-label,
  .account-change-password__tip-text {
    text-transform: none !important;
  }
  
  // ✅ Butonlar uppercase olmalı (HasarDosya stili)
  .search-btn,
  .clear-btn {
    text-transform: uppercase !important;
    
    * {
      text-transform: uppercase !important;
    }
  }
}
</style>

