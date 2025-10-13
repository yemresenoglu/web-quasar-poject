<template>
  <q-menu
    ref="menuRef"
    class="account-menu"
    transition-show="fade"
    transition-hide="fade"
    :anchor="menuAnchor"
    :self="menuSelf"
    :offset="MENU_CONFIG.offset"
    :transition-duration="MENU_CONFIG.transitionDuration"
    role="dialog"
    aria-labelledby="account-menu-title"
    aria-describedby="account-menu-description"
  >
    <div class="account-menu__container">
      <!-- Sabit header -->
      <div class="account-menu__header">
        <div id="account-menu-title" class="account-menu__title">{{ $t('account.title') }}</div>
        <q-btn
          flat
          round
          dense
          class="account-menu__close-btn"
          @click="closeMenu"
          :aria-label="$t('common.close')"
        >
          <i class="bi bi-x-lg"></i>
        </q-btn>
      </div>
      <div class="account-menu__divider"></div>
      <q-scroll-area class="account-menu__scroll-area" visible>
        <div id="account-menu-description" class="sr-only">{{ $t('account.menuDescription') }}</div>
        <div class="account-menu__content">
          <!-- User Profile Component - Store'dan besleniyor -->
          <AccountProfile />

          <div class="account-menu__divider"></div>

          <!-- Department Selector Component -->
          <AccountDepartmentSelector
            :department-items="departmentItems"
            @select-department="selectDepartment"
          />

          <div class="account-menu__divider"></div>

          <!-- Task Selector Component -->
          <AccountTaskSelector :task-items="taskItems" @toggle-task="toggleTaskStatus" />

          <div class="account-menu__divider"></div>

          <!-- Quick Access Manager Component -->
          <AccountQuickAccessManager
            :quick-access-items="quickAccessItems"
            @navigate="navigateToRoute"
            @toggle-pin="togglePinItem"
          />

          <div class="account-menu__divider"></div>

          <!-- Taskbar Settings Component -->
          <AccountTaskbarSettings
            :taskbar-settings="taskbarSettings"
            @toggle-auto-hide="toggleTaskbarAutoHide"
            @change-position="handleTaskbarPositionChange"
          />

          <div class="account-menu__divider"></div>

          <!-- Account Actions Component -->
          <AccountActions
            :is-logging-out="loadingStates[LOADING_STATE_KEYS.LOGOUT]"
            @logout="handleLogout"
            @navigate="navigateToRoute"
          />
        </div>
      </q-scroll-area>
    </div>
  </q-menu>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from 'src/stores/account-store'
import { useMenuPageStore } from 'src/stores/menu-page-store'
import { createLogger } from 'src/utils/logger.js'
import { LOADING_STATE_KEYS, MENU_CONFIG } from 'src/constants/account.js'

// Import sub-components
import AccountProfile from './AccountProfile.vue'
import AccountDepartmentSelector from './AccountDepartmentSelector.vue'
import AccountTaskSelector from './AccountTaskSelector.vue'
import AccountQuickAccessManager from './AccountQuickAccessManager.vue'
import AccountTaskbarSettings from './AccountTaskbarSettings.vue'
import AccountActions from './AccountActions.vue'

const menuRef = ref(null)
const logger = createLogger('AccountMenu')
const router = useRouter()
const $q = useQuasar()
const { t: $t } = useI18n()

const accountStore = useAccountStore()
const menuPageStore = useMenuPageStore()

// Taskbar position from store
const taskbarPosition = computed(() => accountStore.accountSettings.taskbar.position)

// Dynamic anchor and self based on taskbar position
const menuAnchor = computed(() => {
  switch (taskbarPosition.value) {
    case 'bottom':
      return 'top left'
    case 'left':
    default:
      return 'top right'
  }
})

const menuSelf = computed(() => {
  switch (taskbarPosition.value) {
    case 'bottom':
      return 'bottom right'
    case 'left':
    default:
      return 'center left'
  }
})

// Loading states
const loadingStates = ref({
  [LOADING_STATE_KEYS.DEPARTMENT]: false,
  [LOADING_STATE_KEYS.LOGOUT]: false,
  [LOADING_STATE_KEYS.NAVIGATION]: false,
})

// Computed
const quickAccessItems = computed(() => menuPageStore.quickAccessItems)
const departmentItems = computed(() => accountStore.departmentItems)
const taskItems = computed(() => accountStore.taskItems)
const taskbarSettings = computed(() => accountStore.accountSettings.taskbar)

// ===== NAVIGATION METHODS =====

/**
 * Closes the account menu by hiding the menu reference
 * @returns {void}
 */
const closeMenu = () => {
  logger.info('Account menu closing')
  menuRef.value.hide()
}

/**
 * Handles user logout process with loading state management
 * Closes the menu after successful logout or on error
 * @returns {Promise<void>}
 */
const handleLogout = async () => {
  loadingStates.value[LOADING_STATE_KEYS.LOGOUT] = true
  try {
    logger.info('User logout initiated')
    accountStore.logout()
    closeMenu()
    logger.info('User logout completed successfully')
  } catch (error) {
    logger.error('Logout failed:', error)
    $q.notify({
      type: 'negative',
      message: 'Çıkış yapılırken hata oluştu',
      icon: '✕',
      position: 'top-right',
    })
    // Even if logout fails, still close the menu
    closeMenu()
  } finally {
    loadingStates.value[LOADING_STATE_KEYS.LOGOUT] = false
  }
}

/**
 * Navigates to the specified route with loading state management
 * Closes the menu after successful navigation or on error
 * @param {string} route - The route path to navigate to
 * @returns {Promise<void>}
 */
const navigateToRoute = async (route) => {
  loadingStates.value[LOADING_STATE_KEYS.NAVIGATION] = true
  try {
    logger.info('Navigating to:', route)
    await router.push(route)
    closeMenu()
    logger.info('Navigation completed successfully')
  } catch (error) {
    logger.error('Navigation failed:', error)
    $q.notify({
      type: 'negative',
      message: 'Sayfa yönlendirme hatası',
      icon: '✕',
      position: 'top-right',
    })
    // Even if navigation fails, still close the menu
    closeMenu()
  } finally {
    loadingStates.value[LOADING_STATE_KEYS.NAVIGATION] = false
  }
}

/**
 * Toggles the pin status of a quick access item
 * @param {string} itemId - The ID of the item to toggle
 * @returns {void}
 */
const togglePinItem = (itemId) => {
  logger.info('Toggling pin for item:', itemId)
  menuPageStore.togglePinQuickAccess(itemId)
}

// ===== DEPARTMENT METHODS =====

/**
 * Selects a department from the menu list with visual feedback
 * Updates the store and resets other department selections
 * @param {string} departmentId - The ID of the department to select
 * @returns {Promise<void>}
 */
const selectDepartment = async (departmentId) => {
  try {
    logger.info('Department selection initiated:', departmentId)
    accountStore.selectDepartment(departmentId)
    logger.info('Department selected successfully:', departmentId)
  } catch (error) {
    logger.error('Department selection failed:', error)
    $q.notify({
      type: 'negative',
      message: 'Birim seçimi sırasında hata oluştu',
      icon: '✕',
      position: 'top-right',
    })
  }
}

// ===== TASK METHODS =====

/**
 * Toggles the completion status of a task with radio button behavior
 * Only one task can be selected at a time (unselects others)
 * @param {string} taskId - The ID of the task to toggle
 * @returns {Promise<void>}
 */
const toggleTaskStatus = async (taskId) => {
  try {
    logger.info('Task status toggle initiated:', taskId)
    accountStore.toggleTaskStatus(taskId)
    logger.info('Task status toggled successfully:', taskId)
  } catch (error) {
    logger.error('Task status toggle failed:', error)
    $q.notify({
      type: 'negative',
      message: 'Görev durumu değiştirilirken hata oluştu',
      icon: '✕',
      position: 'top-right',
    })
  }
}

// ===== TASKBAR SETTINGS METHODS =====

/**
 * Toggles the taskbar auto-hide setting
 * @returns {void}
 */
const toggleTaskbarAutoHide = () => {
  logger.info('Toggling taskbar auto-hide')
  accountStore.toggleTaskbarAutoHide()
}

/**
 * Handles taskbar position change
 * @param {string} position - The new position for the taskbar
 * @returns {void}
 */
const handleTaskbarPositionChange = (position) => {
  logger.info('Changing taskbar position to:', position)
  accountStore.setTaskbarPosition(position)
}

// ===== KEYBOARD NAVIGATION =====

/**
 * Handles keyboard navigation for accessibility
 * ESC key closes the menu, Enter key activates focused menu items
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {void}
 */
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
  if (event.key === 'Enter' && event.target.closest('.account-menu__item')) {
    event.target.closest('.account-menu__item').click()
  }
}

// Lifecycle
onMounted(() => {
  logger.info('AccountMenu mounted')
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeydown)
})

// Cleanup
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.account-menu {
  height: calc(100% - 52px);
  border-radius: 18px;
  max-height: none !important;

  &__container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: $background-card;
    border-radius: 18px;
    overflow: hidden;
  }

  &__header {
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $border-lighter;
  }

  &__close-btn {
    margin-right: -8px;
    min-height: 28px;
    min-width: 28px;
    padding: 4px;
    border-radius: 2px;
    font-size: 11px;
    color: $text-secondary;
    opacity: 0.87;

    &:hover {
      background: $background-light;
      color: $text-primary;
    }
  }

  &__scroll-area {
    flex: 1;
    width: 444px;
    padding-right: 8px;

    // Vertical scrollbar
    .q-scrollarea__thumb--v {
      width: 4px !important;
      right: 4px;
      background: $text-muted !important;
      opacity: 0.6 !important;

      &:hover {
        opacity: 0.8 !important;
        background: $text-secondary !important;
      }
    }

    .q-scrollarea__bar--v {
      width: 4px !important;
      right: 4px !important;
      background: transparent !important;
      opacity: 0.4 !important;
    }

    :deep(.q-scrollarea__content) {
      padding-right: 8px;
    }
  }

  &__content {
    padding-right: 8px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: $text-secondary;
    text-transform: none;
  }

  &__divider {
    height: 1px;
    background: $border-lighter;
  }
}

// Accessibility
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Override global uppercase rules for AccountMenu
.account-menu {
  text-transform: none !important;

  * {
    text-transform: none !important;
  }

  .q-item,
  .q-item__label,
  .q-item__section {
    text-transform: none !important;
  }
}
</style>
