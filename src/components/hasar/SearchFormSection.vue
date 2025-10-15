<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        {{ t('damageQueryMediator.sections.damageInfo') }}
      </h2>
    </div>
    <div class="section-content">
      <div class="info-grid-2">
        <div class="form-group">
          <label>{{ t('damageQueryMediator.searchForm.fileNumber') }}</label>
          <q-input 
            v-model="localForm.fileNumber" 
            outlined 
            dense 
            class="search-input"
            @update:model-value="$emit('update:searchForm', localForm)"
          />
        </div>
        <div class="form-group form-group--narrow">
          <label>{{ t('damageQueryMediator.searchForm.victimNumber') }}</label>
          <q-input 
            v-model="localForm.victimNumber" 
            outlined 
            dense 
            class="search-input"
            @update:model-value="$emit('update:searchForm', localForm)"
          />
        </div>
      </div>
      
      <div class="search-form-actions">
        <q-btn
          flat
          :label="t('damageQueryMediator.searchForm.searchButton')"
          icon="bi-search"
          @click="performSearch"
          :loading="isLoading"
          class="search-btn"
        />
        <q-btn
          flat
          :label="t('damageQueryMediator.searchForm.clearButton')"
          icon="bi-x-lg"
          @click="clearForm"
          class="clear-btn"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { hasarApi } from 'src/api/hasarApi.js'
import { useApiLoading } from 'src/composables/useApiLoading.js'

const { t } = useI18n()

// Loading state
const { isLoading, executeWithLoading } = useApiLoading('search')

// Props
const props = defineProps({
  searchForm: {
    type: Object,
    required: true,
    default: () => ({
      fileNumber: '',
      victimNumber: ''
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:searchForm', 'search', 'clear'])

// Local state
const localForm = ref({ ...props.searchForm })

// Watch for external changes
watch(() => props.searchForm, (newVal) => {
  localForm.value = { ...newVal }
}, { deep: true })

// API search function
const performSearch = async () => {
  try {
    const result = await executeWithLoading(async () => {
      emit('update:searchForm', { ...localForm.value })
      
      const searchParams = {
        dosyaNo: localForm.value.fileNumber || undefined,
        victimNumber: localForm.value.victimNumber || undefined
      }
      
      // Remove undefined values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined) {
          delete searchParams[key]
        }
      })
      
      const result = await hasarApi.searchHasarFiles(searchParams)
      return result
    })
    
    // Emit result to parent
    emit('search', result)
    
  } catch (error) {
    // Handle error case
    emit('search', { 
      success: false, 
      error: error.message || 'Search failed' 
    })
  }
}

// Clear form function
const clearForm = () => {
  localForm.value = {
    fileNumber: '',
    victimNumber: ''
  }
  emit('update:searchForm', { ...localForm.value })
  emit('clear')
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
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
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

  &--narrow {
    grid-column: span 1;
  }
}

.search-input {
  :deep(.q-field__control) {
    height: 26px;
    min-height: 26px;
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
    
    &::placeholder {
      color: $text-muted !important;
      opacity: 0.8 !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      line-height: 14px !important;
    }
  }
  
  :deep(.q-field__append) {
    padding-right: 4px;
    height: 26px !important;
    display: flex !important;
    align-items: center !important;
  }
}

.search-form-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid $border-lighter;
}

.search-btn,
.clear-btn {
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
  line-height: 1.1 !important;
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
    opacity: 1 !important;
  }
  
  &:hover {
    background: color.adjust($background-button, $lightness: -2%) !important;
  }
  
  &:before {
    box-shadow: none !important;
  }
}

.clear-btn {
  border: none !important;
  border-left: 2px solid $border-accent !important;
}
</style>

