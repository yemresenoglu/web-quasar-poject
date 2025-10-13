<template>
  <div class="page-header">
    <div class="page-header__content">
      <div class="page-header__left">
        <h1 class="page-header__title">
          <i :class="`bi bi-${icon}`" style="font-size: 18px;" class="q-mr-sm"></i>
          <span>{{ title }}</span>
        </h1>
      </div>
      <div class="page-header__actions" v-if="showActions">
        <q-btn-group flat>
          <q-btn 
            flat 
            size="sm" 
            dense 
            @click="handlePrint"
            :aria-label="t('pageHeader.actions.print')"
          >
            <i class="bi bi-printer"></i>
            <q-tooltip>{{ t('pageHeader.actions.print') }}</q-tooltip>
          </q-btn>
          <q-btn 
            flat 
            size="sm" 
            dense 
            @click="handleDownload"
            :aria-label="t('pageHeader.actions.download')"
          >
            <i class="bi bi-download"></i>
            <q-tooltip>{{ t('pageHeader.actions.download') }}</q-tooltip>
          </q-btn>
          <q-btn 
            flat 
            size="sm" 
            dense 
            @click="handleShare"
            :aria-label="t('pageHeader.actions.share')"
          >
            <i class="bi bi-share"></i>
            <q-tooltip>{{ t('pageHeader.actions.share') }}</q-tooltip>
          </q-btn>
        </q-btn-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useUIStore } from 'src/stores/ui-store'

const { t } = useI18n()
const uiStore = useUIStore()

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'description'
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

// Header action methods
const handlePrint = () => {
  uiStore.handlePrint()
  uiStore.showInfo(t('pageHeader.messages.printing'))
}

const handleDownload = () => {
  uiStore.handleDownload()
  uiStore.showInfo(t('pageHeader.messages.downloading'))
}

const handleShare = () => {
  uiStore.handleShare()
  uiStore.showInfo(t('pageHeader.messages.shareFeature'))
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

// BEM: Block - page-header
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $border-lighter;
  margin: 0 0 14px 0;
  width: 100%;
  box-sizing: border-box;
  
  // BEM: Element - content
  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    margin: 0 auto;
    height: 50px;
    max-height: 50px;
    max-width: 1600px;
    width: 100%;
    box-sizing: border-box;
  }

  // BEM: Element - left section
  &__left {
    display: flex;
    align-items: center;
  }

  // BEM: Element - title
  &__title {
    font-size: 12px;
    font-weight: 500;
    color: $text-tertiary;
    margin: 0;
    display: flex;
    align-items: center;

    .q-icon {
      color: $text-muted;
      font-size: 14px !important;
    }
  }
  
  // BEM: Element - actions
  &__actions {
    display: flex;
    gap: 4px;
    
    .q-btn {
      min-height: 28px !important;
      min-width: 28px !important;
      padding: 4px !important;
      border-radius: 2px !important;
      color: $text-secondary !important;
      opacity: 0.87;
      transition: all 0.2s ease;
      
      .q-icon {
        font-size: 14px !important;
        color: $text-secondary !important;
      }
      
      &:hover {
        background: $background-light !important;
        opacity: 1;
        
        .q-icon {
          color: $text-primary !important;
        }
      }
    }
  }
}
</style>

