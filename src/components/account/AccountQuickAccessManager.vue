<template>
  <div class="account-menu__section">
    <div class="account-menu__section-header">
      <div class="account-menu__section-title">{{ $t('quickAccess.title') }}</div>
    </div>
    <div class="account-menu__list">
      <q-item
        v-for="item in quickAccessItems"
        :key="item.id"
        clickable
        v-ripple
        class="account-menu__item"
        @click="handleNavigate(item.route)"
        role="button"
        :aria-label="`${item.text} sayfasına git`"
        tabindex="0"
      >
        <q-item-section avatar class="q-pr-none">
          <i :class="item.icon" style="font-size: 16px">
            <q-tooltip>{{ item.text }}</q-tooltip>
          </i>
        </q-item-section>
        <q-item-section>
          <div class="account-menu__item-title">{{ item.text }}</div>
        </q-item-section>
        <q-item-section side>
          <i
            :class="[
              item.pinned ? 'bi bi-check-circle' : 'bi bi-circle',
              'account-menu__pin-icon',
              { 'account-menu__pin-icon--pinned': item.pinned },
            ]"
            style="font-size: 16px"
            @click.stop="handleTogglePin(item.id)"
          >
            <q-tooltip>{{
              item.pinned ? $t('quickAccess.unpinFromTaskbar') : $t('quickAccess.pinToTaskbar')
            }}</q-tooltip>
          </i>
        </q-item-section>
      </q-item>

      <div v-if="quickAccessItems.length === 0" class="account-menu__empty-state">
        {{ $t('quickAccess.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

defineProps({
  quickAccessItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['navigate', 'toggle-pin'])

const handleNavigate = (route) => {
  emit('navigate', route)
}

const handleTogglePin = (itemId) => {
  emit('toggle-pin', itemId)
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

.account-menu__empty-state {
  padding: 16px;
  text-align: center;
  color: $text-muted;
  font-size: 12px;
  font-style: italic;
}

// Pin Icon Styles - Soldaki iconlarla aynı tasarım (#64748b)
.account-menu__pin-icon {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  font-size: 14px;
  color: $text-secondary;
  opacity: 0.87;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    opacity 0.2s ease,
    color 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &--pinned {
    color: $text-secondary;
    opacity: 1;
  }
}
</style>
