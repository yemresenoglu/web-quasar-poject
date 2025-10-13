<template>
  <q-page class="account-edit-profile">
    <!-- Page Header -->
    <div class="account-edit-profile__header">
      <div class="account-edit-profile__header-content">
        <q-btn
          flat
          round
          dense
          icon="bi-arrow-left"
          class="account-edit-profile__back-btn"
          @click="goBack"
          :aria-label="$t('common.back')"
        />
        <div class="account-edit-profile__title">{{ $t('account.editProfile') }}</div>
        <div class="account-edit-profile__spacer"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="account-edit-profile__container">
      <!-- Profile Section -->
      <div class="account-edit-profile__section">
         <div class="account-edit-profile__section-header">
           <i class="bi bi-person account-edit-profile__section-icon" style="font-size: 16px;"></i>
           <div class="account-edit-profile__section-title">{{ $t('account.profileInfo') }}</div>
         </div>
        
        <q-form @submit.prevent="saveProfile" class="account-edit-profile__form">
          <div class="account-edit-profile__form-grid">
            <q-input
              v-model="profileForm.firstName"
              :label="$t('account.firstName')"
              outlined
              dense
              :rules="validationRules.firstName"
              class="account-edit-profile__input"
            />
            
            <q-input
              v-model="profileForm.lastName"
              :label="$t('account.lastName')"
              outlined
              dense
              :rules="validationRules.lastName"
              class="account-edit-profile__input"
            />
            
            <q-input
              v-model="profileForm.userCode"
              :label="$t('account.userCode')"
              outlined
              dense
              :rules="validationRules.userCode"
              class="account-edit-profile__input"
            />
            
            <q-input
              v-model="profileForm.email"
              :label="$t('account.email')"
              outlined
              dense
              type="email"
              :rules="validationRules.email"
              class="account-edit-profile__input"
            />
          </div>
          
          <div class="search-form-actions">
            <q-btn
              color="primary"
              :label="$t('common.save')"
              icon="bi-floppy"
              @click="saveProfile"
              :loading="loadingStates.profile"
              class="search-btn"
            />
            <q-btn
              color="primary"
              :label="$t('common.cancel')"
              icon="bi-x-lg"
              @click="goBack"
              class="clear-btn"
            />
          </div>
        </q-form>
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

const logger = createLogger('AccountEditProfile')
const router = useRouter()
const $q = useQuasar()
const { t: $t } = useI18n()

const accountStore = useAccountStore()

// Loading states
const loadingStates = ref({
  profile: false
})

// Profile form
const profileForm = ref({
  firstName: '',
  lastName: '',
  userCode: '',
  email: ''
})

/**
 * Computed property containing all form validation rules
 * @returns {Object} Object containing validation rules for each form field
 */
const validationRules = computed(() => ({
  userCode: [
    val => !!val || $t('validation.required'),
    val => val.length >= 3 || $t('validation.minLength', { min: 3 }),
    val => /^[A-Z0-9]+$/.test(val) || $t('validation.userCodeFormat')
  ],
  email: [
    val => !!val || $t('validation.required'),
    val => /.+@.+\..+/.test(val) || $t('validation.email')
  ],
  firstName: [
    val => !!val || $t('validation.required'),
    val => val.length >= 2 || $t('validation.minLength', { min: 2 })
  ],
  lastName: [
    val => !!val || $t('validation.required'),
    val => val.length >= 2 || $t('validation.minLength', { min: 2 })
  ]
}))

/**
 * Sets the profile form values from the current user profile in the store
 * @returns {void}
 */
const setProfileFormValues = () => {
  profileForm.value.firstName = accountStore.userProfile.firstName
  profileForm.value.lastName = accountStore.userProfile.lastName
  profileForm.value.userCode = accountStore.userProfile.userCode
  profileForm.value.email = accountStore.userProfile.email
}

/**
 * Saves the profile form data to the store with loading state management
 * @returns {Promise<void>}
 */
const saveProfile = async () => {
  loadingStates.value.profile = true
  try {
    logger.info('Profile update initiated')
    accountStore.updateProfile(profileForm.value)
    $q.notify({
      type: 'positive',
      message: $t('account.profileUpdatedSuccessfully'),
      icon: '✓',
      position: 'top-right'
    })
    logger.info('Profile updated successfully')
  } catch (error) {
    logger.error('Profile update failed:', error)
    $q.notify({
      type: 'negative',
      message: $t('account.profileUpdateFailed'),
      icon: '✕',
      position: 'top-right'
    })
  } finally {
    loadingStates.value.profile = false
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
  setProfileFormValues()
})
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.account-edit-profile {
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
    max-width: 1200px;
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
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
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
      cursor: pointer;
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

}
</style>
