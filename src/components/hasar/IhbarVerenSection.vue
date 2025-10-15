<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        <i class="bi bi-person" style="font-size: 16px;"></i>
        {{ t('hasarDosyaArabulucu.sections.ihbarVeren') }}
      </h2>
    </div>
    <div class="section-content">
      <div class="info-grid-2">
        <!-- Sol Sütun -->
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.yakinlikDerecesi') }}</label>
          <q-input 
            :model-value="ihbarData.yakinlikDerecesi || 'Sigortalı'"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.gsm') }}</label>
          <q-input 
            :model-value="ihbarData.gsm || '(545) 734 51 74'"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        
        <!-- Sağ Sütun -->
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.ihbarYapanAdSoyad') }}</label>
          <q-input 
            :model-value="ihbarData.ihbarYapanAdSoyad || 'YAVUZ BÜLENT TÜRELİ'"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.eposta') }}</label>
          <q-input 
            :model-value="ihbarData.eposta || ''"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
defineProps({
  ihbarData: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@import 'src/css/quasar.variables.scss';

.section-card {
  background: white;
  border: 1px solid $border-light;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: $box-shadow-card;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: $box-shadow-card-hover;
  }
}

.section-header {
  padding: 12px 16px;
  border-bottom: 1px solid $border-lighter;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  padding: 16px;
}

// .info-grid-2 utility class'i artık global utilities.scss'de tanımlı

.form-group {
  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: $text-secondary;
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
}

.search-input {
  :deep(.q-field__control) {
    min-height: 26px !important;
    height: 26px !important;
    font-size: 12px;
    background: $background-light !important;
    border: none !important;
    border-radius: 3px;
    transition: all 0.2s ease;

    &:before,
    &:after {
      border: none !important;
    }

    &:hover {
      background: color.adjust($background-light, $lightness: -2%) !important;
      box-shadow: $box-shadow-input-hover;
    }
    
    &:focus-within {
      background: white !important;
      box-shadow: 0 0 0 2px rgba($border-accent, 0.15);
    }
  }
  
  :deep(.q-field__native) {
    padding: 6px 10px !important;
    min-height: 26px !important;
    height: 26px !important;
    line-height: 14px !important;
    color: $text-primary !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    display: flex !important;
    align-items: center !important;
  }
  
  :deep(.q-field__append) {
    padding-right: 4px;
    height: 26px !important;
    display: flex !important;
    align-items: center !important;
  }
}

// Readonly input override
.readonly-input {
  :deep(.q-field--readonly) {
    opacity: 1 !important;
    
    .q-field__control {
      background: $background-light !important;
      opacity: 1 !important;
    }
    
    .q-field__native {
      color: $text-primary !important;
      opacity: 1 !important;
      cursor: default !important;
    }
  }
}
</style>
