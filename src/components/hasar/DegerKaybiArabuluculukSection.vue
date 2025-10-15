<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        <i class="bi bi-handshake" style="font-size: 16px;"></i>
        {{ t('hasarDosyaArabulucu.sections.degerKaybi') }}
      </h2>
    </div>
    <div class="section-content">
      <div class="info-grid-3">
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.teklifEdilenTutar') }}</label>
          <q-input 
            v-model.number="localData.teklifEdilenTutar" 
            type="number"
            outlined 
            dense 
            suffix="TL"
            placeholder="0"
            class="search-input"
            @update:model-value="$emit('update:arabuluculuk', localData)"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.vekaletTutari') }}</label>
          <q-input 
            v-model.number="localData.vekaletTutari" 
            type="number"
            outlined 
            dense 
            suffix="TL"
            placeholder="0"
            class="search-input"
            @update:model-value="$emit('update:arabuluculuk', localData)"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.toplamTutar') }}</label>
          <q-input 
            :model-value="toplamTutar + ' TL'"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input readonly-input--total"
          />
        </div>
      </div>

      <div class="info-grid-2">
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.anlasmaYapilacakIslem') }}</label>
          <q-select
            v-model="localData.anlasmaYapilacakIslem"
            outlined
            dense
            class="search-input select-input"
            :options="anlasmaIslemOptions"
            :loading="anlasmaIslemOptionsLoading"
            placeholder="Seçiniz..."
            clearable
            @update:model-value="$emit('update:arabuluculuk', localData)"
          >
            <template v-slot:append>
              <i class="bi bi-chevron-down select-arrow"></i>
            </template>
          </q-select>
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.anlasmaDurum') }}</label>
          <q-input 
            :model-value="localData.anlasmaDurum || '-'"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input"
          />
        </div>
      </div>

      <!-- Revize Tutarları -->
      <div class="info-grid-2">
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.talepEdilenRevizeTutar') }}</label>
          <q-input 
            v-model.number="localData.talepEdilenRevizeTutar" 
            type="number"
            outlined 
            dense 
            suffix="TL"
            placeholder="0"
            class="search-input"
            @update:model-value="$emit('update:arabuluculuk', localData)"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.onaylananRevizeTutar') }}</label>
          <q-input 
            v-model.number="localData.onaylananRevizeTutar" 
            type="number"
            outlined 
            dense 
            suffix="TL"
            placeholder="0"
            class="search-input"
            @update:model-value="$emit('update:arabuluculuk', localData)"
          />
        </div>
      </div>

      <!-- Anlaşma Sağlanan Tutarlar -->
      <div class="info-grid-3">
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.anlasmaSaglananTutar') }}</label>
          <q-input 
            v-model.number="localData.anlasmaSaglananTutar" 
            type="number"
            outlined 
            dense 
            suffix="TL"
            placeholder="0"
            class="search-input"
            @update:model-value="$emit('update:arabuluculuk', localData)"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.anlasmaSaglananVekaletTutari') }}</label>
          <q-input 
            v-model.number="localData.anlasmaSaglananVekaletTutari" 
            type="number"
            outlined 
            dense 
            suffix="TL"
            placeholder="0"
            class="search-input"
            @update:model-value="$emit('update:arabuluculuk', localData)"
          />
        </div>
        <div class="form-group">
          <label>{{ t('hasarDosyaArabulucu.labels.anlasmaSaglananToplamTutar') }}</label>
          <q-input 
            :model-value="anlasmaToplamTutar + ' TL'"
            readonly
            outlined
            dense
            borderless
            class="search-input readonly-input readonly-input--total"
          />
        </div>
      </div>
      
      <div class="search-form-actions">
        <q-btn
          flat
          :label="t('common.save')"
          :loading="loading"
          icon="bi-floppy"
          @click="saveData"
          class="save-btn"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { hasarApi } from 'src/api/hasarApi.js'
import { getAnlasmaYapilacakIslemListesiApi } from 'src/data/mock-hasar-dosya-arabulucu-data.js'

const { t } = useI18n()

// Props
const props = defineProps({
  arabuluculuk: {
    type: Object,
    required: true,
    default: () => ({
      teklifEdilenTutar: 0,
      vekaletTutari: 0,
      anlasmaYapilacakIslem: '',
      anlasmaDurum: '',
      talepEdilenRevizeTutar: 0,
      onaylananRevizeTutar: 0,
      anlasmaSaglananTutar: 0,
      anlasmaSaglananVekaletTutari: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:arabuluculuk', 'save'])

// Local state
const localData = ref({ ...props.arabuluculuk })

// Watch for external changes
watch(() => props.arabuluculuk, (newVal) => {
  localData.value = { ...newVal }
}, { deep: true })

// Computed
const toplamTutar = computed(() => {
  const { teklifEdilenTutar, vekaletTutari } = localData.value
  return (teklifEdilenTutar || 0) + (vekaletTutari || 0)
})

const anlasmaToplamTutar = computed(() => {
  const { anlasmaSaglananTutar, anlasmaSaglananVekaletTutari } = localData.value
  return (anlasmaSaglananTutar || 0) + (anlasmaSaglananVekaletTutari || 0)
})

// API save function
const saveData = async () => {
  try {
    emit('update:arabuluculuk', { ...localData.value })
    
    // Get dosyaNo from props or route
    const dosyaNo = props.dosyaNo || 'default-file'
    
    const result = await hasarApi.updateDegerKaybi(dosyaNo, localData.value)
    emit('save', result)
  } catch (error) {
    console.error('Save error:', error)
    emit('save', { success: false, error: error.message })
  }
}

// Seçenekler - Load from API
const anlasmaIslemOptions = ref([])
const anlasmaIslemOptionsLoading = ref(false)

// Load anlasma islem options on component mount
onMounted(async () => {
  await loadAnlasmaIslemOptions()
})

/**
 * Load anlaşma işlem options from API
 */
const loadAnlasmaIslemOptions = async () => {
  anlasmaIslemOptionsLoading.value = true
  
  try {
    // In development, use mock data
    if (process.env.NODE_ENV === 'development') {
      const response = getAnlasmaYapilacakIslemListesiApi()
      if (response.success) {
        anlasmaIslemOptions.value = response.data.map(item => item.name)
      }
    } else {
      // In production, use real API
      const response = await hasarApi.getAnlasmaYapilacakIslemListesi()
      if (response.success) {
        anlasmaIslemOptions.value = response.data.map(item => item.name)
      }
    }
  } catch (error) {
    console.error('Error loading anlasma islem options:', error)
    // Fallback to default options
    anlasmaIslemOptions.value = [
      'Anlaştım',
      'Anlaşmadım',
      'Ulaşamadım'
    ]
  } finally {
    anlasmaIslemOptionsLoading.value = false
  }
}
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

// .info-grid-2 ve .info-grid-3 utility class'ları artık global utilities.scss'de tanımlı

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
    min-height: 26px;
    height: 26px;
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
    display: flex !important;
    align-items: center !important;
    
    // Number input spinner'larını gizle
    &[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
      
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
        -webkit-appearance: none;
        margin: 0;
      }
    }
    
    // Placeholder styling
    &::placeholder {
      color: $text-muted !important;
      opacity: 0.8 !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      line-height: 14px !important;
    }
  }
  
  :deep(.q-field__append) {
    display: none !important; // Quasar'ın append ikonlarını gizle
  }
  
  // Suffix için (TL yazısı)
  :deep(.q-field__suffix) {
    font-size: 11px !important;
    color: $text-muted !important;
    padding: 0 8px 0 6px !important;
    font-weight: 500;
    opacity: 0.8;
    line-height: 14px !important;
    height: 26px !important;
    display: flex !important;
    align-items: center !important;
  }
}

// Q-Select özel stilleri
.select-input {
  // Quasar'ın default dropdown icon'unu gizle
  :deep(.q-select__dropdown-icon) {
    display: none !important;
  }
  
  :deep(.q-field__append) {
    display: flex !important;
    padding-right: 8px !important;
    height: 26px !important;
    align-items: center !important;
  }
  
  // Custom arrow icon
  .select-arrow {
    font-size: 10px !important;
    color: $text-muted !important;
    opacity: 0.8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }
  
  // Arrow animasyonu - dropdown açıkken
  :deep(.q-field--focused) {
    .select-arrow {
      transform: rotate(180deg);
      color: $border-accent !important;
      opacity: 1;
    }
  }
  
  // Hover durumu
  &:hover {
    .select-arrow {
      color: $text-primary !important;
      opacity: 1;
    }
  }
  
  // Native select okunu gizle
  :deep(.q-field__native) {
    cursor: pointer !important;
  }
  
  // Dropdown menü stilleri
  :deep(.q-menu) {
    box-shadow: $box-shadow-dropdown;
    border-radius: 4px;
    border: 1px solid $border-light;
    margin-top: 4px;
  }
  
  // Dropdown item stilleri
  :deep(.q-item) {
    min-height: 32px !important;
    padding: 6px 12px !important;
    font-size: 12px !important;
    color: $text-primary !important;
    transition: all 0.15s ease;
    
    &:hover {
      background: $background-hover !important;
    }
    
    &.q-manual-focusable--focused {
      background: $background-hover !important;
    }
    
    // Seçili item
    &[aria-selected="true"] {
      background: rgba($border-accent, 0.1) !important;
      color: $border-accent !important;
      font-weight: 600;
      
      &:before {
        content: '✓';
        margin-right: 8px;
        font-size: 11px;
      }
    }
  }
}

.search-form-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-lighter;
}

.save-btn {
  min-width: 150px !important;
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background: $background-button !important;
  padding: 2px 16px !important;
  border-radius: 2px !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  color: $text-secondary !important;
  border-left: 2px solid $border-accent !important;
  letter-spacing: 0.3px !important;
  text-transform: uppercase !important;
  
  :deep(.q-btn__wrapper) {
    padding: 0 !important;
    min-height: 26px !important;
    height: 26px !important;
  }
  
  :deep(.q-btn__content) {
    color: $text-secondary !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    line-height: 14px !important;
  }
  
  :deep(.q-icon) {
    font-size: 11px !important;
    margin-right: 6px !important;
    color: $text-secondary !important;
  }
  
  &:hover {
    background: color.adjust($background-button, $lightness: -2%) !important;
  }
  
  &:before {
    box-shadow: none !important;
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
  
  // Toplam tutar alanları için özel stil
  &--total {
    :deep(.q-field__native) {
      font-weight: 600 !important;
    }
  }
}
</style>
