<template>
  <q-menu
    ref="menuRef"
    class="account-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"
  >
    <div class="account-menu__container">
      <!-- Header -->
      <div class="account-menu__header">
        <div class="account-menu__title">{{ $t('account.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="account-menu__close" 
          @click="closeMenu"
        />
      </div>
      <div class="account-menu__divider"></div>
      
      <q-scroll-area class="account-menu__scroll" visible>
        <div class="account-menu__content">
          <!-- Kullanıcı Profili -->
          <div class="account-menu__section">
            <div class="account-menu__profile">
              <div class="account-menu__avatar-container">
                <q-avatar size="48px" class="account-menu__avatar">
                  <img :src="accountStore.userProfile.avatar" />
                  <div 
                    class="account-menu__status" 
                    :class="{ 'account-menu__status--online': accountStore.isOnline }"
                  ></div>
                </q-avatar>
              </div>
              <div class="account-menu__profile-info">
                <div class="account-menu__name">{{ accountStore.fullName }}</div>
                <div class="account-menu__email">{{ accountStore.userProfile.email }}</div>
                <div class="account-menu__department">{{ accountStore.userProfile.department }}</div>
              </div>
            </div>
          </div>

          <div class="account-menu__divider"></div>

          <!-- İstatistikler -->
          <div class="account-menu__section">
            <div class="account-menu__section-header">
              <div class="account-menu__section-title">{{ $t('account.statistics') }}</div>
            </div>
            <div class="account-menu__stats">
              <div class="account-menu__stat-item">
                <div class="account-menu__stat-value">{{ accountStore.userStats.totalDamageFiles }}</div>
                <div class="account-menu__stat-label">{{ $t('account.stats.damageFiles') }}</div>
              </div>
              <div class="account-menu__stat-item">
                <div class="account-menu__stat-value">{{ accountStore.userStats.completedTasks }}</div>
                <div class="account-menu__stat-label">{{ $t('account.stats.completedTasks') }}</div>
              </div>
              <div class="account-menu__stat-item">
                <div class="account-menu__stat-value">{{ accountStore.userStats.pendingApprovals }}</div>
                <div class="account-menu__stat-label">{{ $t('account.stats.pendingApprovals') }}</div>
              </div>
            </div>
          </div>

          <div class="account-menu__divider"></div>

          <!-- Son Aktiviteler -->
          <div class="account-menu__section">
            <div class="account-menu__section-header">
              <div class="account-menu__section-title">{{ $t('account.recentActivities') }}</div>
              <q-btn 
                flat 
                round 
                dense 
                icon="bi-arrow-clockwise" 
                size="sm"
                class="account-menu__refresh-btn"
                @click="refreshActivities"
              >
                <q-tooltip>{{ $t('account.refreshActivities') }}</q-tooltip>
              </q-btn>
            </div>
            <div class="account-menu__activities">
              <q-item 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="account-menu__activity-item"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="activity.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="account-menu__activity-title">{{ activity.title }}</div>
                  <div class="account-menu__activity-description">{{ activity.description }}</div>
                  <div class="account-menu__activity-time">{{ formatTimeAgo(activity.timestamp) }}</div>
                </q-item-section>
              </q-item>
              
              <!-- Empty State -->
              <div v-if="recentActivities.length === 0" class="account-menu__empty">
                <q-icon name="bi-activity" size="32px" class="q-mb-sm" />
                <div class="account-menu__empty-title">{{ $t('account.empty.title') }}</div>
                <div class="account-menu__empty-subtitle">{{ $t('account.empty.subtitle') }}</div>
              </div>
            </div>
          </div>

          <div class="account-menu__divider"></div>

          <!-- Hesap İşlemleri -->
          <div class="account-menu__section">
            <div class="account-menu__section-header">
              <div class="account-menu__section-title">{{ $t('account.accountActions') }}</div>
            </div>
            <div class="account-menu__list">
              <q-item clickable v-ripple class="account-menu__item" @click="showProfileDialog = true">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-person" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="account-menu__item-title">{{ $t('account.editProfile') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="account-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="account-menu__item" @click="showPasswordDialog = true">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-key" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="account-menu__item-title">{{ $t('account.changePassword') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="account-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="account-menu__item" @click="showSecurityDialog = true">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-shield-check" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="account-menu__item-title">{{ $t('account.security') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="account-menu__arrow" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="account-menu__item" @click="accountStore.exportAccountData">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-download" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="account-menu__item-title">{{ $t('account.exportData') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-arrow-right" size="14px" class="account-menu__arrow" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="account-menu__divider"></div>

          <!-- Çıkış -->
          <div class="account-menu__section">
            <div class="account-menu__list">
              <q-item clickable v-ripple class="account-menu__item account-menu__item--logout" @click="handleLogout">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-box-arrow-right" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="account-menu__item-title">{{ $t('account.logout') }}</div>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>

    <!-- Profile Edit Dialog -->
    <q-dialog v-model="showProfileDialog">
      <q-card class="account-profile-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('account.editProfile') }}</div>
          <q-space />
          <q-btn icon="bi-x-lg" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="profileForm.firstName"
                :label="$t('account.firstName')"
                outlined
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="profileForm.lastName"
                :label="$t('account.lastName')"
                outlined
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="profileForm.email"
                :label="$t('account.email')"
                outlined
                type="email"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="profileForm.phone"
                :label="$t('account.phone')"
                outlined
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup />
          <q-btn 
            color="primary" 
            :label="$t('actions.save')" 
            @click="saveProfile"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Password Change Dialog -->
    <q-dialog v-model="showPasswordDialog">
      <q-card class="account-password-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('account.changePassword') }}</div>
          <q-space />
          <q-btn icon="bi-x-lg" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="passwordForm.currentPassword"
            :label="$t('account.currentPassword')"
            outlined
            type="password"
            class="q-mb-md"
          />
          <q-input
            v-model="passwordForm.newPassword"
            :label="$t('account.newPassword')"
            outlined
            type="password"
            class="q-mb-md"
          />
          <q-input
            v-model="passwordForm.confirmPassword"
            :label="$t('account.confirmPassword')"
            outlined
            type="password"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup />
          <q-btn 
            color="primary" 
            :label="$t('actions.save')" 
            @click="changePassword"
            :disable="!isPasswordFormValid"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Security Settings Dialog -->
    <q-dialog v-model="showSecurityDialog">
      <q-card class="account-security-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('account.security') }}</div>
          <q-space />
          <q-btn icon="bi-x-lg" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section>
              <div class="account-menu__item-title">{{ $t('account.twoFactorAuth') }}</div>
              <div class="text-caption text-grey">{{ $t('account.twoFactorAuthDesc') }}</div>
            </q-item-section>
            <q-item-section side>
              <q-toggle 
                v-model="accountStore.accountSettings.security.twoFactorAuth" 
                @update:model-value="toggle2FA"
                class="account-menu__toggle" 
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="account-menu__item-title">{{ $t('account.sessionTimeout') }}</div>
              <div class="text-caption text-grey">{{ $t('account.sessionTimeoutDesc') }}</div>
            </q-item-section>
            <q-item-section side>
              <q-select
                v-model="accountStore.accountSettings.security.sessionTimeout"
                :options="sessionTimeoutOptions"
                outlined
                dense
                style="min-width: 100px"
              />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('actions.close')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from 'src/stores/account-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const accountStore = useAccountStore()

const menuRef = ref(null)
const showProfileDialog = ref(false)
const showPasswordDialog = ref(false)
const showSecurityDialog = ref(false)

// Form data
const profileForm = ref({
  firstName: accountStore.userProfile.firstName,
  lastName: accountStore.userProfile.lastName,
  email: accountStore.userProfile.email,
  phone: accountStore.userProfile.phone
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Session timeout options
const sessionTimeoutOptions = [
  { label: '15 dakika', value: 15 },
  { label: '30 dakika', value: 30 },
  { label: '1 saat', value: 60 },
  { label: '2 saat', value: 120 }
]

// Computed
const recentActivities = computed(() => accountStore.recentActivities.slice(0, 5))

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword && 
         passwordForm.value.newPassword && 
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword.length >= 6
})

// Methods
const closeMenu = () => {
  menuRef.value.hide()
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMinutes = Math.floor((now - time) / (1000 * 60))
  
  if (diffMinutes < 1) return t('account.timeAgo.now')
  if (diffMinutes < 60) return `${diffMinutes} ${t('account.timeAgo.minutes')}`
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} ${t('account.timeAgo.hours')}`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ${t('account.timeAgo.days')}`
}

const refreshActivities = () => {
  // Simüle edilmiş aktivite yenileme
  console.log('Aktiviteler yenileniyor...')
}

const saveProfile = () => {
  accountStore.updateProfile(profileForm.value)
  showProfileDialog.value = false
  console.log('Profil güncellendi')
}

const changePassword = async () => {
  try {
    const result = await accountStore.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    if (result.success) {
      showPasswordDialog.value = false
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      console.log('Şifre başarıyla değiştirildi')
    }
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error)
  }
}

const toggle2FA = async (enabled) => {
  try {
    if (enabled) {
      await accountStore.enableTwoFactorAuth()
    } else {
      await accountStore.disableTwoFactorAuth()
    }
  } catch (error) {
    console.error('2FA ayar hatası:', error)
  }
}

const handleLogout = () => {
  accountStore.logout()
  closeMenu()
}
</script>

<style lang="sass">
.account-menu
  height: calc(100% - 52px)
  border-radius: 18px
  max-height: none !important

  &__container
    height: 100%
    display: flex
    flex-direction: column
    background: #fefefe

  &__header
    height: 48px
    padding: 0 16px
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid rgba(0,0,0,0.08)

  &__close
    margin-right: -8px
    min-height: 28px
    min-width: 28px
    padding: 4px
    border-radius: 0
    font-size: 11px
    color: #5f6368
    opacity: 0.87

    &:hover
      background: rgba(0,0,0,0.04)
      color: #202124

  &__scroll
    flex: 1
    width: 444px
    padding-right: 8px
    
    // Vertical scrollbar
    .q-scrollarea__thumb--v
      width: 4px !important
      right: 4px
      background: #9e9e9e !important
      opacity: 0.6 !important
      &:hover
        opacity: 0.8 !important
        background: #757575 !important
    
    .q-scrollarea__bar--v
      width: 4px !important
      right: 4px !important
      background: transparent !important
      opacity: 0.4 !important
    
    // Horizontal scrollbar
    .q-scrollarea__thumb--h
      height: 4px !important
      bottom: 4px
      background: #9e9e9e !important
      opacity: 0.6 !important
      &:hover
        opacity: 0.8 !important
        background: #757575 !important
    
    .q-scrollarea__bar--h
      height: 4px !important
      bottom: 4px !important
      background: transparent !important
      opacity: 0.4 !important
    
    :deep(.q-scrollarea__content)
      padding-right: 8px

  &__title
    font-size: 16px
    font-weight: 500
    color: #5f6368
    text-transform: capitalize

  &__divider
    height: 1px
    background: rgba(0,0,0,0.08)

  &__section
    padding: 8px 0

  &__section-header
    padding: 0 16px
    height: 40px
    display: flex
    align-items: center
    justify-content: space-between
    margin: 0

  &__section-title
    color: #5f6368
    font-size: 16px
    font-weight: 500
    text-transform: capitalize
    padding: 0

  &__refresh-btn
    color: #5f6368
    opacity: 0.87
    &:hover
      opacity: 1
      background: rgba(0,0,0,0.04)

  &__profile
    padding: 16px
    display: flex
    align-items: center
    gap: 12px

  &__avatar-container
    position: relative

  &__avatar
    border: 2px solid #e0e0e0

  &__status
    position: absolute
    bottom: 2px
    right: 2px
    width: 12px
    height: 12px
    border-radius: 50%
    background: #9e9e9e
    border: 2px solid #fff

    &--online
      background: #4caf50

  &__profile-info
    flex: 1
    min-width: 0

  &__name
    font-size: 16px
    font-weight: 500
    color: #202124
    margin-bottom: 2px

  &__email
    font-size: 13px
    color: #5f6368
    margin-bottom: 2px

  &__department
    font-size: 12px
    color: #9e9e9e

  &__stats
    display: flex
    padding: 0 16px
    gap: 16px

  &__stat-item
    flex: 1
    text-align: center

  &__stat-value
    font-size: 18px
    font-weight: 600
    color: #1976d2
    margin-bottom: 2px

  &__stat-label
    font-size: 11px
    color: #5f6368
    text-transform: uppercase
    letter-spacing: 0.5px

  &__activities
    max-height: 200px
    overflow-y: auto

  &__activity-item
    min-height: 56px
    padding: 8px 16px
    color: #666
    font-size: 14px

    .q-item__section--avatar
      min-width: 32px
      .q-icon
        color: #5f6368
        opacity: 0.87
        font-size: 16px

  &__activity-title
    font-weight: 500
    margin-bottom: 2px
    font-size: 13px

  &__activity-description
    font-size: 12px
    color: #5f6368
    margin-bottom: 2px

  &__activity-time
    font-size: 11px
    color: #9e9e9e

  &__list
    .account-menu__item
      min-height: 40px
      padding: 8px 16px
      color: #666
      font-size: 14px

      .q-item__section--avatar
        min-width: 40px
        .q-icon
          color: #5f6368
          opacity: 0.87
          font-size: 16px

      .q-item__section--side
        min-width: 40px
        padding-left: 16px
        &:last-child
          padding-left: 8px
        .q-icon
          color: #5f6368
          opacity: 0.87
          font-size: 16px

      &:hover
        background: rgba(0,0,0,0.04)
        color: #202124
        .q-item__section--side .q-icon
          opacity: 1

      &--logout
        color: #d32f2f
        .q-item__section--avatar .q-icon
          color: #d32f2f

  &__item-title
    font-weight: 500

  &__arrow
    opacity: 0.6

  &__empty
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 32px 16px
    text-align: center
    color: #5f6368
    opacity: 0.7

  &__empty-title
    font-size: 14px
    font-weight: 500
    margin-bottom: 4px

  &__empty-subtitle
    font-size: 12px

  &__toggle
    .q-toggle__inner
      font-size: 32px
    :deep(.q-toggle__thumb)
      top: 0.5rem
      width: 24px
      height: 24px
    :deep(.q-toggle__track)
      height: 16px

.account-profile-dialog,
.account-password-dialog,
.account-security-dialog
  min-width: 400px

.account-menu__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 