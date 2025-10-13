<template>
  <div class="evrak-section section-card">
    <div class="section-header">
      <h2 class="section-title">
        <i class="bi bi-paperclip" style="font-size: 16px;"></i>
        {{ t('hasarDosyaArabulucu.sections.evrak') }}
      </h2>
    </div>
    
    <div class="section-content">
      <!-- Evrak Ekleme Formu -->
      <div class="evrak-section__form">
        <div class="evrak-section__form-row">
          <label class="evrak-section__label">{{ t('hasarDosyaArabulucu.evrak.selectType') }}</label>
          <q-select
            v-model="newEvrak.type"
            :options="evrakOptions"
            outlined
            dense
            class="evrak-section__input"
          >
            <template v-slot:append>
              <i class="bi bi-chevron-down select-arrow"></i>
            </template>
          </q-select>
          <q-btn
            flat
            :label="t('hasarDosyaArabulucu.evrak.requestDocument')"
            @click="handleAdd"
            :disable="!newEvrak.type"
            icon="bi-floppy"
            class="evrak-section__btn"
          />
        </div>
      </div>

      <!-- Evrak Tablosu -->
      <div class="evrak-section__table">
        <q-table
          :rows="evrakList"
          :columns="evrakColumns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          flat
          bordered
        >
          <!-- Custom Sort Icons -->
          <template v-slot:header-cell="props">
            <q-th :props="props">
              {{ props.col.label }}
              <i 
                v-if="props.col.sortable" 
                :class="getSortIconClass(props.col.name)"
                class="table-sort-icon"
              ></i>
            </q-th>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat 
                round 
                dense 
                size="sm"
                @click="handleView(props.row)"
                v-if="props.row.evrakBelgeDurum === 'Alındı'"
                class="evrak-section__action-btn evrak-section__action-btn--view"
              >
                <i class="bi bi-eye"></i>
                <q-tooltip>{{ t('hasarDosyaArabulucu.messages.viewingDocument') }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { hasarApi } from 'src/api/hasarApi.js'

const { t } = useI18n()

// Sorting state
const sortBy = ref(null)
const sortOrder = ref('asc')

// Get sort icon class
const getSortIconClass = (colName) => {
  if (sortBy.value !== colName) {
    return 'bi bi-chevron-expand'
  }
  return sortOrder.value === 'asc' ? 'bi bi-chevron-up' : 'bi bi-chevron-down'
}

// Props
const props = defineProps({
  evrakList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  dosyaNo: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['add', 'view'])

// New evrak form
const newEvrak = ref({
  type: ''
})

// Evrak options
const evrakOptions = [
  'Kaza Tespit Tutanağı',
  'Ruhsat Fotokopisi',
  'Ehliyet Fotokopisi',
  'Ekspertiz Raporu',
  'Tamir Faturası',
  'Fotoğraf',
  'Diğer'
]


// Table columns
const evrakColumns = [
  {
    name: 'evrakAdi',
    label: t('hasarDosyaArabulucu.evrak.documentName'),
    field: 'evrakAdi',
    align: 'left',
    sortable: true
  },
  {
    name: 'evrakBelgeDurum',
    label: t('hasarDosyaArabulucu.evrak.status'),
    field: 'evrakBelgeDurum',
    align: 'left',
    sortable: true
  },
  {
    name: 'tarih',
    label: t('hasarDosyaArabulucu.evrak.date'),
    field: 'tarih',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: t('hasarDosyaArabulucu.evrak.actions'),
    field: 'actions',
    align: 'center'
  }
]

/**
 * Handle add evrak
 */
const handleAdd = async () => {
  if (!newEvrak.value.type) return
  
  try {
    const evrakData = {
      evrakAdi: newEvrak.value.type,
      evrakBelgeDurum: 'Bekleniyor'
    }
    
    // Get dosyaNo from props or route
    const dosyaNo = props.dosyaNo || 'default-file'
    
    const result = await hasarApi.addEvrak(dosyaNo, evrakData)
    
    if (result.success) {
      emit('add', evrakData)
      // Reset form
      newEvrak.value = { type: '' }
    } else {
      console.error('Add evrak failed:', result.error)
    }
  } catch (error) {
    console.error('Add evrak error:', error)
  }
}

/**
 * Handle view document
 * @param {Object} doc - Document to view
 */
const handleView = (doc) => {
  emit('view', doc)
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@import 'src/css/quasar.variables.scss';

.evrak-section {
  background: white;
  border: 1px solid $border-light;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: $box-shadow-card;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: $box-shadow-card-hover;
  }

  .section-header {
    padding: 12px 16px;
    border-bottom: 1px solid $border-lighter;
    display: flex;
    align-items: center;
    gap: 8px;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .q-icon {
        color: $text-muted;
      }
    }
  }

  .section-content {
    padding: 16px;
  }
}

.evrak-section__form {
  margin-bottom: 20px;
  max-width: 800px;
}

.evrak-section__form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.evrak-section__label {
  font-size: 10px;
  font-weight: 600;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
  min-width: 80px;
}

.evrak-section__input {
  flex: 1;
  max-width: 400px;
  
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
    
    &::placeholder {
      color: $text-muted !important;
      opacity: 0.8 !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      line-height: 14px !important;
    }
  }
  
  :deep(.q-select__dropdown-icon) {
    display: none !important;
  }
  
  :deep(.q-field__append) {
    display: flex !important;
    padding-right: 8px !important;
    height: 26px !important;
    align-items: center !important;
  }
  
  .select-arrow {
    font-size: 10px !important;
    color: $text-muted !important;
    opacity: 0.8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }
  
  :deep(.q-field--focused) {
    .select-arrow {
      transform: rotate(180deg);
      color: $border-accent !important;
      opacity: 1;
    }
  }
  
  &:hover {
    .select-arrow {
      color: $text-primary !important;
      opacity: 1;
    }
  }
  
  :deep(.q-menu) {
    box-shadow: $box-shadow-dropdown;
    border-radius: 4px;
    border: 1px solid $border-light;
    margin-top: 4px;
  }
  
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
  
  // ─────────────────────────────────────────────
  // Q-FIELD SUFFIX (TL yazısı için - select'te yok)
  // ─────────────────────────────────────────────
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

.evrak-section__btn {
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
  white-space: nowrap;
  
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

.evrak-section__table {
  :deep(.q-table) {
    font-size: 11px;
    
    thead tr {
      background: $background-page;
      
      th {
        font-size: 10px;
        font-weight: 600;
        color: $text-secondary;
        padding: 6px 8px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
    }
    
    tbody tr {
      td {
        padding: 6px 8px;
        color: $text-primary;
      }
    }
  }
  
  :deep(.q-table__sort-icon) {
    display: none !important;
  }
  
  .table-sort-icon {
    margin-left: 6px;
    font-size: 9px;
    color: $text-muted;
    opacity: 0.6;
    transition: all 0.2s ease;
    vertical-align: middle;
    
    &.bi-chevron-up,
    &.bi-chevron-down {
      color: $border-accent;
      opacity: 1;
    }
  }
  
  // Sortable column hover
  :deep(th[aria-sort]) {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      .table-sort-icon {
        opacity: 1;
        color: $text-primary;
      }
    }
  }
}

// ════════════════════════════════════════════════
// BEM: ACTION BUTTONS (Table içindeki)
// ════════════════════════════════════════════════
.evrak-section__action-btn {
  &--view {
    color: $primary;
    
    &:hover {
      background: rgba($primary, 0.1);
    }
  }
}

// ════════════════════════════════════════════════
// BEM: RESPONSIVE (Mobile)
// ════════════════════════════════════════════════
@media (max-width: 768px) {
  .evrak-section__form {
    max-width: 100%;
  }
  
  .evrak-section__form-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .evrak-section__label {
    min-width: auto;
  }
  
  .evrak-section__input {
    max-width: 100%;
  }
}
</style>

