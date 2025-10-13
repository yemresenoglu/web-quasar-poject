<template>
  <q-drawer
    v-if="taskbarSettings.showTaskbar && isVertical"
    :model-value="computedModelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-if-above="!taskbarSettings.autoHide"
    :side="drawerSide"
    class="taskbar taskbar--left"
    :width="drawerWidth"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="taskbar__section">
      <q-list>
        <q-item class="taskbar__item taskbar__item--logo">
          <q-item-section avatar>
            <div 
              class="taskbar__logo cursor-pointer"
              @click="navigateToIndex"
              role="button"
              :aria-label="$t('taskbar.start')"
              tabindex="0"
              @keydown.enter="navigateToIndex"
              @keydown.space.prevent="navigateToIndex"
            >
              <img 
                src="/src/assets/logo.png" 
                alt="SOMPO Logo"
                width="24"
                height="24"
                loading="lazy"
              />
              <q-tooltip :anchor="tooltipAnchor" :self="tooltipSelf" :offset="tooltipOffset">
                {{ $t('taskbar.start') }}
              </q-tooltip>
            </div>
          </q-item-section>
        </q-item>
        <q-item class="taskbar__item taskbar__item--static">
          <q-item-section avatar class="taskbar__icon-wrapper">
            <i 
              class="bi bi-grid-3x3-gap cursor-pointer"
              style="font-size: 16px;"
              @click="navigateToMenu"
            >
              <q-tooltip :anchor="tooltipAnchor" :self="tooltipSelf" :offset="tooltipOffset">
                {{ $t('taskbar.menu') }}
              </q-tooltip>
            </i>
            <q-badge 
              v-if="newMenuItemsCount > 0" 
              color="red" 
              floating
              rounded
              class="taskbar__badge"
            >
              {{ newMenuItemsCount }}
            </q-badge>
          </q-item-section>
        </q-item>
        <q-item 
          v-for="pinnedItem in menuPageStore.pinnedQuickAccessItems" 
          :key="pinnedItem.id"
          class="taskbar__item taskbar__item--static"
        >
          <q-item-section avatar>
            <i 
              :class="pinnedItem.icon"
              style="font-size: 16px;"
              class="cursor-pointer"
              @click="navigateToRoute(pinnedItem)"
            >
              <q-tooltip :anchor="tooltipAnchor" :self="tooltipSelf" :offset="tooltipOffset">
                {{ pinnedItem.text }}
              </q-tooltip>
            </i>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator spaced="sm" inset class="taskbar__separator" />

    <div class="taskbar__section taskbar__section--grow">
    </div>

    <div class="taskbar__section">
      <q-list>
        <!-- Dark Mode Toggle -->
        <q-item 
          class="taskbar__item taskbar__item--static"
          clickable
          @click="toggleDarkMode"
        >
          <q-item-section avatar>
            <i 
              :class="uiStore.darkMode ? 'bi bi-sun' : 'bi bi-moon'"
              style="font-size: 16px;"
              class="cursor-pointer"
            >
              <q-tooltip :anchor="tooltipAnchor" :self="tooltipSelf" :offset="tooltipOffset">
                {{ uiStore.darkMode ? $t('darkMode.switchToLight') : $t('darkMode.switchToDark') }}
              </q-tooltip>
            </i>
          </q-item-section>
        </q-item>

        <q-item class="taskbar__item taskbar__item--avatar">
          <q-item-section avatar>
            <div 
              class="taskbar__avatar-wrapper cursor-pointer"
              role="button"
              :aria-label="$t('taskbar.account')"
              tabindex="0"
            >
              <q-avatar 
                v-if="userProfile.avatar" 
                size="24px" 
                class="taskbar__avatar"
              >
                <img 
                  :src="userProfile.avatar" 
                  :alt="userProfile.firstName"
                  width="24"
                  height="24"
                  loading="lazy"
                />
              </q-avatar>
              <i 
                v-else
                class="bi bi-person-circle taskbar__avatar-icon"
                style="font-size: 24px;"
              ></i>
              <q-tooltip :anchor="tooltipAnchor" :self="tooltipSelf" :offset="tooltipOffset">
                {{ $t('taskbar.account') }}
              </q-tooltip>
              <AccountMenu />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>

</template>

<script setup>
import { defineAsyncComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuPageStore } from 'src/stores/menu-page-store'
import { useAccountStore } from 'src/stores/account-store'
import { useUIStore } from 'src/stores/ui-store'

const AccountMenu = defineAsyncComponent(() => import('./account/AccountMenu.vue'))

const router = useRouter()
const menuPageStore = useMenuPageStore()
const accountStore = useAccountStore()
const uiStore = useUIStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])

const isHovered = ref(false)
const taskbarSettings = computed(() => accountStore.accountSettings.taskbar)
const userProfile = computed(() => accountStore.userProfile)
const isVertical = computed(() => true)

// New menu items count for notification badge
const newMenuItemsCount = computed(() => {
  // This would typically come from a store or API
  // For now, return 0 (can be connected to actual new items count)
  return 0
})

const computedModelValue = computed(() => {
  if (taskbarSettings.value.autoHide) {
    return isHovered.value || props.modelValue
  }
  return props.modelValue
})

const drawerSide = computed(() => 'left')
const drawerWidth = computed(() => 48)
const tooltipAnchor = computed(() => 'center right')
const tooltipSelf = computed(() => 'center left')
const tooltipOffset = computed(() => [16, 0])

const handleMouseEnter = () => {
  if (taskbarSettings.value.autoHide) {
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  if (taskbarSettings.value.autoHide) {
    isHovered.value = false
  }
}

const navigateToIndex = () => {
  router.push('/')
}

const navigateToMenu = () => {
  router.push('/menu')
}

const navigateToRoute = (item) => {
  if (!item.route) return
  router.push(item.route)
}

const toggleDarkMode = () => {
  uiStore.toggleDarkMode()
}
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

// Global tooltip styling
.q-tooltip {
  background: $background-light !important;
  color: $text-secondary !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 6px 12px !important;
  border-radius: 8px !important;
  border: 1px solid $border-light !important;
  box-shadow: 0 2px 4px rgba(100, 116, 139, 0.15) !important;
  letter-spacing: 0.3px !important;
  max-width: 300px !important;
}

// BEM: Block - taskbar
.taskbar {
  background-color: $background-card !important;
  display: flex;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 18px !important; 
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  box-shadow: none !important;
  
  // BEM: Modifier - left position
  &--left {
    flex-direction: column;
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 8px !important;
    height: calc(100vh - 16px) !important;
  }
  
  // BEM: Element - section
  &__section {
    padding: 8px 0;

    // BEM: Modifier - growable section
    &--grow {
      flex-grow: 1;
      overflow-y: auto;
    }

    .q-list {
      padding: 0;
    }
  }
  
  // BEM: Element - separator
  &__separator {
    margin: 8px;
    opacity: 0.3;
    background: $border-lighter;
  }
  
  // BEM: Element - item
  &__item {
    min-height: 32px;
    padding: 4px;
    display: flex;
    justify-content: center;
    width: 100%;
    color: $text-secondary;
    transition: all 0.2s ease;
    background: transparent !important;

    .q-item__section--avatar {
      min-width: unset;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    // BEM: Modifier - logo item
    &--logo {
      cursor: pointer;
      
      .q-item__section--avatar {
        width: 32px;
        height: 32px;
      }
    }
    
    // BEM: Modifier - static item (menu/pinned)
    &--static {
      .q-item__section--avatar {
        width: 32px;
        height: 32px;
        border-radius: 2px;
        transition: all 0.2s ease;
        cursor: pointer;

        .q-icon {
          width: 24px;
          height: 24px;
          border-radius: 2px;
          font-size: 14px;
          color: $text-secondary;
          opacity: 0.87;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
      }
      
      &:hover {
        background: $background-light;
        border-left: 2px solid $border-accent;
        
        .q-item__section--avatar .q-icon {
          opacity: 1;
        }
      }
    }
    
    // BEM: Modifier - avatar item (logo ile aynı)
    &--avatar {
      cursor: pointer;
      
      .q-item__section--avatar {
        width: 32px;
        height: 32px;
      }
    }
  }
  
  // BEM: Element - logo
  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    img {
      object-fit: contain;
      filter: grayscale(20%) opacity(0.87);
      transition: all 0.2s ease;
    }
    
    &:hover img {
      filter: grayscale(0%) opacity(1);
      transform: scale(1.15) !important;
    }
    
    &:focus-visible {
      outline: 2px solid $border-accent;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
  
  // BEM: Element - avatar wrapper (logo ile birebir aynı)
  &__avatar-wrapper {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
    width: 24px !important;
    height: 24px !important;
    
    // Quasar q-avatar override - daha spesifik
    .q-avatar.taskbar__avatar {
      border: 2px solid rgba(0, 0, 0, 0.1) !important;
      transition: all 0.2s ease !important;
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      min-height: 24px !important;
      
      img {
        object-fit: contain !important;
        filter: grayscale(20%) opacity(0.87) !important;
        transition: all 0.2s ease !important;
        width: 24px !important;
        height: 24px !important;
        transform: none !important;
      }
    }
    
    // Icon fallback
    .q-icon.taskbar__avatar-icon {
      color: $text-secondary !important;
      opacity: 0.87 !important;
      transition: all 0.2s ease !important;
      width: 24px !important;
      height: 24px !important;
      font-size: 24px !important;
    }
    
    // Hover state - wrapper'a uygulanıyor (logo ile aynı)
    &:hover {
      .q-avatar.taskbar__avatar {
        transform: scale(1.15) !important;
        
        img {
          filter: grayscale(0%) opacity(1) !important;
          transform: scale(1.15) !important;
        }
      }
      
      .q-icon.taskbar__avatar-icon {
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }
    }
    
    &:focus-visible {
      outline: 2px solid $border-accent !important;
      outline-offset: 2px !important;
      border-radius: 4px !important;
    }
  }
  
  // BEM: Element - avatar (Quasar component için - yedek)
  &__avatar {
    border: 2px solid rgba(0, 0, 0, 0.1) !important;
    transition: all 0.2s ease !important;
    width: 24px !important;
    height: 24px !important;
    
    img {
      object-fit: contain !important;
      filter: grayscale(20%) opacity(0.87) !important;
      transition: all 0.2s ease !important;
      width: 24px !important;
      height: 24px !important;
    }
  }
  
  // BEM: Element - avatar icon (fallback - yedek)
  &__avatar-icon {
    color: $text-secondary !important;
    opacity: 0.87 !important;
    transition: all 0.2s ease !important;
    width: 24px !important;
    height: 24px !important;
    font-size: 24px !important;
  }
  
  // BEM: Element - icon wrapper (for badge)
  &__icon-wrapper {
    position: relative;
  }
  
  // BEM: Element - notification badge
  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 16px;
    min-height: 16px;
    font-size: 10px;
    padding: 2px 4px;
    z-index: 1;
  }
}
</style> 
