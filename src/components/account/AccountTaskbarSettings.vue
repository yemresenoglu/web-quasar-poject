<template>
  <div class="account-menu__section">
    <div class="account-menu__section-header">
      <div class="account-menu__section-title">{{ $t('taskbarSettings.title') }}</div>
    </div>
    
    <div class="account-menu__list">
      <!-- Auto Hide -->
      <q-item 
        clickable 
        v-ripple 
        @click="handleToggleAutoHide"
        class="account-menu__item"
        role="switch"
        :aria-checked="taskbarSettings.autoHide"
        :aria-label="$t('taskbarSettings.autoHide')"
        tabindex="0"
      >
        <q-item-section avatar class="q-pr-none">
          <i class="bi bi-eye-slash" style="font-size: 16px;">
            <q-tooltip>{{ $t('taskbarSettings.autoHide') }}</q-tooltip>
          </i>
        </q-item-section>
        <q-item-section>
          <div class="account-menu__item-title">{{ $t('taskbarSettings.autoHide') }}</div>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :model-value="taskbarSettings.autoHide"
            @update:model-value="handleToggleAutoHide"
            color="primary"
            size="xs"
            dense
            @click.stop
          />
        </q-item-section>
      </q-item>

      <!-- Konum (Ana başlık - sadece solda göster subtitle) -->
      <q-item 
        class="account-menu__item account-menu__item--header account-menu__item--multi-subtitle"
      >
        <q-item-section avatar class="q-pr-none">
          <i class="bi bi-layout-sidebar" style="font-size: 16px;">
            <q-tooltip>{{ $t('taskbarSettings.position') }}</q-tooltip>
          </i>
        </q-item-section>
        <q-item-section>
          <div class="account-menu__item-title">{{ $t('taskbarSettings.position') }}</div>
          
          <!-- Solda Göster -->
          <div class="account-menu__subtitle-with-toggle">
            <div 
              class="account-menu__item-subtitle clickable"
              @click="handlePositionChange('left')"
            >
              {{ $t('taskbarSettings.showLeft') }}
            </div>
            <q-toggle
              :model-value="taskbarSettings.position === 'left'"
              @update:model-value="val => val && handlePositionChange('left')"
              color="primary"
              size="xs"
              dense
              @click.stop
              class="subtitle-toggle"
            />
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
  taskbarSettings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-auto-hide', 'change-position'])

const handleToggleAutoHide = () => {
  emit('toggle-auto-hide')
}

const handlePositionChange = (position) => {
  emit('change-position', position)
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

.account-menu__item-subtitle {
  font-size: 11px;
  color: $text-secondary;
  font-weight: 400;
  margin-top: 2px;
}

// Taskbar Settings Styles
// Header item styling (Konum başlığı - subtitle ile toggle)
.account-menu__item--header {
  cursor: default !important;
  margin-top: 4px !important;
  margin-bottom: 2px !important;
  min-height: 32px !important;
  border-left: 2px solid $border-lighter !important;
  
  &:hover {
    background: transparent !important;
    border-left: 2px solid $border-accent !important;
  }
  
  .account-menu__item-title {
    font-weight: 600;
    opacity: 1;
    font-size: 13px;
  }
  
  .account-menu__item-subtitle {
    font-size: 11px;
    color: $text-secondary;
    font-weight: 400;
    margin-top: 2px;
    opacity: 0.9;
    flex: 1;
    
    &.clickable {
      cursor: pointer;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  // Multi-subtitle için ekstra height
  &.account-menu__item--multi-subtitle {
    min-height: auto !important;
    padding-top: 4px;
    padding-bottom: 4px;
  }
}

// Subtitle with toggle container
.account-menu__subtitle-with-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  margin-bottom: 2px;
  
  &:first-of-type {
    margin-top: 8px;
  }
  
  &:last-of-type {
    margin-bottom: 4px;
  }
  
  .subtitle-toggle {
    transform: scale(0.85);
    transform-origin: right center;
    
    :deep(.q-toggle__inner) {
      font-size: 24px;
    }
    
    :deep(.q-toggle__thumb) {
      width: 16px;
      height: 16px;
    }
    
    :deep(.q-toggle__track) {
      height: 12px;
      opacity: 0.6;
    }
  }
}

// Toggle styling (Tüm renkler #64748b - $text-secondary)
.account-menu__item {
  :deep(.q-toggle) {
    .q-toggle__inner {
      font-size: 24px !important;
    }
    
    // Thumb - Tüm durumlar için
    .q-toggle__thumb {
      width: 16px !important;
      height: 16px !important;
      background-color: $text-secondary !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15) !important;
    }
    
    // Track - Tüm durumlar için
    .q-toggle__track {
      height: 12px !important;
      opacity: 0.3 !important;
      background-color: $text-secondary !important;
      transition: all 0.3s ease !important;
    }
    
    // Active state (Açık durum)
    &.q-toggle--truthy {
      .q-toggle__track {
        opacity: 1 !important;
        background-color: $text-secondary !important;
      }
      
      .q-toggle__thumb {
        background-color: $text-secondary !important;
      }
    }
    
    // Disabled state
    &.q-toggle--disabled {
      opacity: 0.4 !important;
      
      .q-toggle__track {
        background-color: $text-secondary !important;
        opacity: 0.2 !important;
      }
      
      .q-toggle__thumb {
        background-color: $text-secondary !important;
      }
    }
  }
}

// Ekstra override - Quasar'ın color prop'unu bypass et
.account-menu__item :deep(.q-toggle.q-toggle--truthy .q-toggle__thumb) {
  background-color: $text-secondary !important;
}

.account-menu__item :deep(.q-toggle.q-toggle--truthy .q-toggle__track) {
  background-color: $text-secondary !important;
  opacity: 1 !important;
}

.account-menu__item :deep(.q-toggle .q-toggle__thumb) {
  background-color: $text-secondary !important;
}

.account-menu__item :deep(.q-toggle .q-toggle__track) {
  background-color: $text-secondary !important;
  opacity: 0.3 !important;
}
</style>

