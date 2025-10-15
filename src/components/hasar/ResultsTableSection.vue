<template>
  <div class="section-card">
    <div class="section-header">
      <h2 class="section-title">
        <i class="bi bi-table" style="font-size: 16px;"></i>
        {{ t('damageQueryMediator.results.title') }}
      </h2>
    </div>
    <div class="section-content">
      <div class="results-table">
        <q-table
          :rows="rows"
          :columns="columns"
          :row-key="rowKey"
          :loading="loading"
          :pagination="pagination"
          :rows-per-page-options="[10, 25, 50, 100, 0]"
          virtual-scroll
          :virtual-scroll-item-size="48"
          :virtual-scroll-sticky-size-start="48"
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

          <template v-slot:no-data>
            <!-- Boş - hiçbir mesaj gösterme -->
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-group flat dense>
                <q-btn 
                  flat 
                  round 
                  dense 
                  @click="$emit('view', props.row)"
                  class="action-btn action-btn--view"
                >
                  <i class="bi bi-eye"></i>
                  <q-tooltip>{{ t('common.view') }}</q-tooltip>
                </q-btn>
                <q-btn 
                  flat 
                  round 
                  dense 
                  @click="$emit('openInNewTab', props.row)"
                  class="action-btn action-btn--new-tab"
                >
                  <i class="bi bi-box-arrow-up-right"></i>
                  <q-tooltip>{{ t('common.openInNewTab') }}</q-tooltip>
                </q-btn>
              </q-btn-group>
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

const { t } = useI18n()

// Sorting state
const sortBy = ref(null)
const sortOrder = ref('asc')

// Get sort icon class
const getSortIconClass = (colName) => {
  if (sortBy.value !== colName) {
    return 'bi bi-chevron-expand'  // Neutral state
  }
  return sortOrder.value === 'asc' ? 'bi bi-chevron-up' : 'bi bi-chevron-down'
}

// Props
defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({ rowsPerPage: 50 })
  }
})

// Emits
defineEmits(['view', 'openInNewTab'])
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  padding: 16px;
}

.results-table {
  :deep(.q-table) {
    border: 1px solid $border-light;
    border-radius: 3px;

    thead tr {
      background: $background-table-header;

      th {
        font-size: 11px;
        font-weight: 600;
        color: $text-secondary;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        padding: 8px 12px;
        border-bottom: 1px solid $border-light;
      }
    }

    tbody tr {
      transition: background-color 0.15s ease;

      &:hover {
        background: $background-hover;
      }

      td {
        font-size: 12px;
        color: $text-primary;
        padding: 8px 12px;
        border-bottom: 1px solid $border-lighter;
      }
    }
  }
  
  // Quasar default sort icon'unu gizle
  :deep(.q-table__sort-icon) {
    display: none !important;
  }
  
  // Custom sort icon
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
  
  // Pagination dropdown icon override
  :deep(.q-table__bottom) {
    .q-select {
      .q-field__append {
        .q-select__dropdown-icon {
          display: none !important;
        }
        
        &::after {
          content: '\f282'; // Bootstrap Icons arrow-down unicode
          font-family: 'bootstrap-icons' !important;
          font-size: 12px !important;
          color: $text-muted !important;
          opacity: 0.8;
          transition: all 0.3s ease;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      
      &:hover .q-field__append::after {
        color: $text-primary !important;
        opacity: 1;
      }
      
      &.q-field--focused .q-field__append::after {
        color: $border-accent !important;
        opacity: 1;
        transform: translateY(-50%) rotate(180deg);
      }
    }
  }
}

.action-btn {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;

  &--view {
    color: $border-accent !important;
    
    &:hover {
      background: rgba($border-accent, 0.1) !important;
      color: color.adjust($border-accent, $lightness: -10%) !important;
    }
  }

  &--new-tab {
    color: $text-success !important;
    
    &:hover {
      color: color.adjust($text-success, $lightness: -10%) !important;
      background: rgba($text-success, 0.1) !important;
    }
  }

  :deep(.q-icon) {
    font-size: 14px;
  }
}
</style>

