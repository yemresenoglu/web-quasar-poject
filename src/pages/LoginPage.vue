<template>
  <q-page class="login-page">
    <div class="login-container">
      <!-- Logo -->
      <div class="login-header">
        <div class="login-logo">
          <img src="src/assets/logo.png" alt="Logo" class="login-logo-img" />
        </div>
      </div>

      <!-- Login Form -->
      <div class="login-page__section">
        <div class="login-page__section-header">
          <i class="bi bi-person-circle login-page__section-icon" style="font-size: 16px"></i>
          <div class="login-page__section-title">{{ t('login.title') }}</div>
        </div>

        <q-form @submit.prevent="handleLogin" class="login-page__form">
          <div class="login-page__form-grid">
            <!-- Kullanıcı Kodu -->
            <div class="login-page__field login-page__field--full">
              <label class="login-page__field-label">{{ t('login.userCode') }}</label>
              <q-input
                v-model="loginForm.userCode"
                outlined
                dense
                class="login-page__input"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <i class="bi bi-person"></i>
                </template>
              </q-input>
            </div>

            <!-- Şifre -->
            <div class="login-page__field login-page__field--full">
              <label class="login-page__field-label">{{ t('login.password') }}</label>
              <q-input
                v-model="loginForm.password"
                outlined
                dense
                :type="showPassword ? 'text' : 'password'"
                class="login-page__input"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <i class="bi bi-lock"></i>
                </template>
                <template v-slot:append>
                  <i
                    :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
                    class="cursor-pointer"
                    @click="authStore.togglePasswordVisibility()"
                  ></i>
                </template>
              </q-input>
            </div>

            <!-- Captcha - Sadece captchaKontrolDurum true ise göster -->
            <div v-if="captchaKontrolDurum" class="login-page__field login-page__field--full">
              <label class="login-page__field-label">{{ $t('login.captcha') }}</label>
              <div class="captcha-field-wrapper">
                <CaptchaImage ref="captchaRef" class="captcha-image-section" />
                <q-input
                  v-model="loginForm.captcha"
                  outlined
                  dense
                  class="login-page__input captcha-input"
                  :disable="loading"
                />
              </div>
            </div>

            <!-- Şifremi Unuttum -->
            <div class="login-page__field login-page__field--full">
              <q-btn
                flat
                dense
                no-caps
                :label="$t('login.forgotPassword')"
                @click="showForgotPasswordDialog = true"
                class="login-page__forgot-password-btn"
                :disable="loading"
              />
            </div>
          </div>

          <!-- Login Button -->
          <div class="search-form-actions">
            <q-btn
              color="primary"
              :label="$t('login.loginButton')"
              type="submit"
              :disable="!isFormValid"
              :loading="loading"
              class="search-btn login-page__login-btn"
            >
              <i class="bi bi-box-arrow-in-right"></i>
            </q-btn>
          </div>
        </q-form>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p class="footer-text">{{ $t('login.footer') }}</p>
        <div class="footer-links">
          <q-btn flat dense no-caps color="grey-7" :label="$t('login.help')" size="sm" />
          <q-separator vertical class="q-mx-sm" />
          <q-btn flat dense no-caps color="grey-7" :label="$t('login.contact')" size="sm" />
        </div>
      </div>
    </div>

    <!-- Şifremi Unuttum Dialog -->
    <ForgotPasswordDialog v-model="showForgotPasswordDialog" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth-store.js'
import { createLogger } from 'src/utils/logger.js'
import CaptchaImage from 'src/components/CaptchaImage.vue'
import ForgotPasswordDialog from 'src/components/ForgotPasswordDialog.vue'
import { getCaptchaKontrolDurum } from 'src/data/auth-mock-data.js'

// Composables
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const authStore = useAuthStore()
const logger = createLogger('LoginPage')

// Reactive data
const showForgotPasswordDialog = ref(false)
const captchaRef = ref(null)

// Store state
const loading = computed(() => authStore.isLoading)
const showPassword = computed(() => authStore.showPassword)
const loginForm = computed(() => authStore.loginForm)
const captchaKontrolDurum = computed(() => getCaptchaKontrolDurum())
const isFormValid = computed(() => {
  const baseValid = loginForm.value.userCode && loginForm.value.password
  return captchaKontrolDurum.value ? baseValid && loginForm.value.captcha : baseValid
})

// Methods
const generateCaptcha = () => {
  if (captchaRef.value) {
    captchaRef.value.refreshCaptcha()
  }
}

const handleLogin = async () => {
  if (!isFormValid.value) return

  logger.info('Login attempt started')

  const result = await authStore.login(
    loginForm.value.userCode,
    loginForm.value.password,
    captchaKontrolDurum.value ? loginForm.value.captcha : null,
  )

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: t('login.successMessage'),
      icon: '✓',
      position: 'top-right',
    })

    logger.info('Login successful')
    router.push('/home')
  } else {
    $q.notify({
      type: 'negative',
      message: result.message,
      icon: '✕',
      position: 'top-right',
    })

    // Regenerate captcha on failed login (sadece captcha kontrolü aktifse)
    if (captchaKontrolDurum.value) {
      generateCaptcha()
    }
  }
}

// Lifecycle
onMounted(() => {
  // Captcha will be loaded automatically by CaptchaImage component
})
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: $background-page;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-logo {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-logo-img {
  height: 56px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
}

// BEM: Element - section
.login-page__section {
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

// BEM: Element - section header
.login-page__section-header {
  padding: 16px 20px;
  border-bottom: 1px solid $border-lighter;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
}

// BEM: Element - section icon
.login-page__section-icon {
  color: $text-secondary;
  font-size: 16px;
}

// BEM: Element - section title
.login-page__section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-secondary;
  text-transform: none;
}

// BEM: Element - form
.login-page__form {
  padding: 20px;
}

// BEM: Element - form grid
.login-page__form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

// BEM: Element - field
.login-page__field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &--full {
    grid-column: 1 / -1;
  }
}

// BEM: Element - field label
.login-page__field-label {
  font-size: 13px;
  font-weight: 500;
  color: $text-secondary;
  text-transform: none;
  opacity: 0.87;
}

// BEM: Element - input (AccountEditProfile stili)
.login-page__input {
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

  :deep(.q-field__prepend),
  :deep(.q-field__append) {
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

  // Error state için Bootstrap icon - LoginPage özel
  :deep(.q-field--error) {
    // Border'ı düzelt - tam oturması için
    .q-field__control:before {
      border: 2px solid #f56565 !important;
      border-radius: 4px !important;
    }

    // Input içindeki tüm icon'ları gizle (prepend dahil)
    .q-field__control {
      .q-field__prepend,
      .q-field__append,
      .q-field__native {
        .q-icon,
        i,
        [class*='bi-'] {
          display: none !important;
        }
      }

      // Sadece sağda tek icon göster
      &::after {
        content: '⚠' !important;
        position: absolute !important;
        right: 12px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        font-size: 16px !important;
        color: #f56565 !important;
        z-index: 10 !important;
        pointer-events: none !important;
        display: block !important;
      }
    }

    // Quasar'ın default error icon'unu özellikle hedefle
    .q-field__append {
      .q-icon.material-icons,
      i.material-icons,
      .q-icon[class*='material-icons'] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        font-size: 0 !important;
      }
    }

    // Tüm error icon'larını gizle
    .q-field__append {
      .q-icon,
      i,
      [class*='material-icons'] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        font-size: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }

    // Kırmızı alt çizgiyi kaldır
    .q-field__native {
      text-decoration: none !important;
      border-bottom: none !important;
      box-shadow: none !important;
    }

    .q-field__messages {
      color: #f56565 !important;

      .q-icon {
        display: none !important;
      }

      // Icon'u tamamen kaldır
      &::before {
        display: none !important;
      }
    }
  }
}

.captcha-field-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.captcha-image-section {
  flex: 2;
  min-width: 180px;
}

.captcha-input {
  flex: 1;
  max-width: 200px;
}

// BEM: Element - forgot password button
.login-page__forgot-password-btn {
  font-size: 12px;
  padding: 0;
  color: $text-secondary;
  font-weight: 500;
  text-transform: none;
  min-height: 24px;
  opacity: 0.87;

  &:hover {
    color: $border-accent;
    opacity: 1;
  }
}

// Search form actions (buttons) - AccountEditProfile stili
.search-form-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid $border-lighter;
}

// Login button (search-btn stili)
.search-btn.login-page__login-btn {
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

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.footer-text {
  font-size: 11px;
  color: $text-secondary;
  margin: 0 0 12px 0;
  opacity: 0.87;
  text-transform: none;
  letter-spacing: 0.2px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;

  .q-btn {
    font-size: 13px;
    padding: 0 8px;
    color: $text-secondary;
    text-transform: none;

    &:hover {
      color: $border-accent;
    }
  }

  .q-separator {
    background: $border-lighter;
  }
}

// Responsive design
@media (max-width: 480px) {
  .login-page {
    padding: 12px;
  }

  .login-container {
    max-width: 100%;
  }

  .section-card.minimal-design {
    .section-header {
      padding: 12px 14px;
    }

    .section-content {
      padding: 14px;
    }
  }

  .login-logo-img {
    height: 48px;
  }

  .captcha-display {
    padding: 4px 6px;
  }

  .captcha-text {
    font-size: 10px;
    letter-spacing: 1px;
  }

  .login-form {
    .form-group {
      margin-bottom: 14px;
    }
  }
}

// Animation for better UX
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

// Loading state improvements
.q-btn--loading {
  .q-btn__content {
    opacity: 0.7;
  }
}

// Override global uppercase rules for this page (AccountEditProfile stili)
.login-page {
  text-transform: none !important;

  * {
    text-transform: none !important;
  }

  .q-field__label,
  .q-item__label,
  .login-page__section-title,
  .login-page__field-label,
  .footer-text,
  .dialog-description {
    text-transform: none !important;
  }

  // ✅ Login butonu uppercase olmalı (AccountEditProfile stili)
  .search-btn,
  .login-page__login-btn {
    text-transform: uppercase !important;

    * {
      text-transform: uppercase !important;
    }
  }
}
</style>
