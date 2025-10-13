<template>
  <div class="account-menu__section">
    <div class="account-menu__section-header">
      <div class="account-menu__section-title">{{ $t('account.actions') }}</div>
    </div>
    
    <div class="account-menu__list">
      <q-item 
        clickable 
        v-ripple 
        @click="handleNavigate('/account/edit-profile')"
        class="account-menu__item"
        role="button"
        :aria-label="$t('account.editProfile')"
        tabindex="0"
      >
        <q-item-section avatar class="q-pr-none">
          <i class="bi bi-gear" style="font-size: 16px;">
            <q-tooltip>{{ $t('account.editProfile') }}</q-tooltip>
          </i>
        </q-item-section>
        <q-item-section>
          <div class="account-menu__item-title">{{ $t('account.editProfile') }}</div>
        </q-item-section>
      </q-item>

      <q-item 
        clickable 
        v-ripple 
        @click="handleNavigate('/account/change-password')"
        class="account-menu__item"
        role="button"
        :aria-label="$t('account.changePassword')"
        tabindex="0"
      >
        <q-item-section avatar class="q-pr-none">
          <i class="bi bi-lock" style="font-size: 16px;">
            <q-tooltip>{{ $t('account.changePassword') }}</q-tooltip>
          </i>
        </q-item-section>
        <q-item-section>
          <div class="account-menu__item-title">{{ $t('account.changePassword') }}</div>
        </q-item-section>
      </q-item>

      <div class="account-menu__divider"></div>

      <q-item 
        clickable 
        v-ripple 
        @click="handleLogout"
        class="account-menu__item account-menu__item--logout"
        :class="{ 'account-menu__item--loading': isLoggingOut }"
        role="button"
        :aria-label="isLoggingOut ? 'Çıkış yapılıyor' : $t('account.logout')"
        tabindex="0"
      >
        <q-item-section avatar class="q-pr-none">
          <i 
            :class="[isLoggingOut ? 'bi bi-hourglass-split' : 'bi bi-box-arrow-right', { 'account-menu__loading-icon': isLoggingOut }]"
            style="font-size: 16px;"
          >
            <q-tooltip>{{ isLoggingOut ? 'Çıkış yapılıyor...' : $t('account.logout') }}</q-tooltip>
          </i>
        </q-item-section>
        <q-item-section>
          <div class="account-menu__item-title">
            {{ isLoggingOut ? 'Çıkış yapılıyor...' : $t('account.logout') }}
          </div>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

defineProps({
  isLoggingOut: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logout', 'navigate'])

const handleLogout = () => {
  emit('logout')
}

const handleNavigate = (route) => {
  emit('navigate', route)
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.account-menu__section {
  padding: 8px 0;
}

.account-menu__section-header {
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}

.account-menu__section-title {
  color: $text-secondary;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  padding: 0;
}

.account-menu__divider {
  height: 1px;
  background: $border-lighter;
  margin: 8px 0;
}

.account-menu__list {
  .account-menu__item {
    min-height: 32px;
    padding: 4px 8px;
    display: flex;
    justify-content: center;
    width: 100%;
    color: $text-secondary;
    font-size: 13px;
    border-radius: 2px;
    transition: all 0.2s ease;

    :deep(.q-item__section--avatar) {
      min-width: unset;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 2px;
      transition: all 0.2s ease;

      .q-icon {
        width: 24px;
        height: 24px;
        border-radius: 2px;
        font-size: 14px;
        color: $text-secondary;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    :deep(.q-item__section--side) {
      min-width: 40px;
      padding-left: 16px;
      
      &:last-child {
        padding-left: 8px;
      }
      
      .q-icon {
        color: $text-secondary;
        opacity: 0.87;
        font-size: 14px;
      }
    }

    &:hover {
      background: $background-light;
      border-left: 2px solid $border-accent;
      
      :deep(.q-item__section--side .q-icon) {
        opacity: 1;
      }
    }
  }
}

.account-menu__item-title {
  font-weight: 500;
  color: $text-secondary !important;
  font-size: 13px;
}

// Logout Item
.account-menu__item--logout {
  color: $text-secondary !important;
  
  .account-menu__item-title {
    color: $text-secondary !important;
  }
  
  :deep(.q-icon) {
    color: $text-secondary !important;
  }
  
  :deep(.q-item__section--avatar .q-icon) {
    color: $text-secondary !important;
  }
}

// Loading states
.account-menu__loading-icon {
  animation: spin 1s linear infinite;
}

.account-menu__item--loading {
  opacity: 0.7;
  pointer-events: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

