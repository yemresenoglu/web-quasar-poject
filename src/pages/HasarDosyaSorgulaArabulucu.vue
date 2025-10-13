<template>
  <q-page class="hasar-sorgula-arabulucu">
    <div class="page-container">
      <!-- Page Header -->
      <PageHeader
        :title="pageTitle"
        icon="scales"
        :show-actions="false"
      />

      <!-- Search Form -->
      <SearchFormSection
        v-model:search-form="searchForm"
        :loading="isSearching"
        @search="handleSearch"
        @clear="handleClear"
      />

      <!-- Results Table -->
      <ResultsTableSection
        :rows="searchResults"
        :columns="resultColumns"
        :loading="isSearching"
        :pagination="{ rowsPerPage: 50 }"
        @view="viewDetails"
        @edit="editDetails"
        @openInNewTab="openInNewTab"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

// Components
import PageHeader from 'src/components/PageHeader.vue'
import SearchFormSection from 'src/components/hasar/SearchFormSection.vue'
import ResultsTableSection from 'src/components/hasar/ResultsTableSection.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

// Page title
const pageTitle = computed(() => t('damageQueryMediator.title'))

// Search form
const searchForm = ref({
  fileNumber: '',
  victimNumber: ''
})

// Search state
const isSearching = ref(false)

// Search results
const searchResults = ref([])

// Table columns
const resultColumns = [
  {
    name: 'fileNumber',
    label: t('damageQueryMediator.results.columns.fileNumber'),
    field: 'fileNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'victimNumber',
    label: t('damageQueryMediator.results.columns.victimNumber'),
    field: 'victimNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'policyNumber',
    label: t('damageQueryMediator.results.columns.policyNumber'),
    field: 'policyNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'insuredName',
    label: t('damageQueryMediator.results.columns.insuredName'),
    field: 'insuredName',
    align: 'left',
    sortable: true
  },
  {
    name: 'victimName',
    label: t('damageQueryMediator.results.columns.victimName'),
    field: 'victimName',
    align: 'left',
    sortable: true
  },
  {
    name: 'damageDate',
    label: t('damageQueryMediator.results.columns.damageDate'),
    field: 'damageDate',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    label: t('damageQueryMediator.results.columns.status'),
    field: 'status',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: t('damageQueryMediator.results.columns.actions'),
    field: 'actions',
    align: 'center'
  }
]

/**
 * Handle search
 */
const handleSearch = async (searchResult) => {
  isSearching.value = true

  try {
    if (searchResult.success) {
      // Transform API response to table format
      searchResults.value = searchResult.data.files.map(file => ({
        fileNumber: file.dosyaNo,
        victimNumber: file.victimNumber || '-',
        policyNumber: file.policeNo,
        insuredName: file.insuredName || '-',
        victimName: file.victimName || '-',
        damageDate: file.hasarTarihi,
        damageLocation: file.hasarYeri,
        damageReason: file.hasarSebebi || '-',
        damageAmount: file.hasarTutari || 0,
        status: file.durum
      }))
    } else {
      console.error('Search failed:', searchResult.error)
      // Show error message to user
      searchResults.value = []
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

/**
 * Handle clear
 */
const handleClear = () => {
  searchForm.value = {
    fileNumber: '',
    victimNumber: ''
  }
  searchResults.value = []

  $q.notify({
    type: 'info',
    message: t('damageQueryMediator.messages.searchCleared'),
    icon: 'ℹ',
    position: 'top'
  })
}

/**
 * View details
 * @param {Object} row - Row data
 */
const viewDetails = (row) => {
  router.push(`/hasar-dosya-arabulucu/${row.fileNumber}`)
}

/**
 * Open in new tab
 * @param {Object} row - Row data
 */
const openInNewTab = (row) => {
  const url = `${window.location.origin}/hasar-dosya-arabulucu/${row.fileNumber}`
  window.open(url, '_blank')
  
  $q.notify({
    type: 'positive',
    message: t('damageQueryMediator.messages.openedInNewTab'),
    icon: 'bi-box-arrow-up-right',
    position: 'top'
  })
}

/**
 * Edit details
 * @param {Object} row - Row data
 */
const editDetails = (row) => {
  $q.notify({
    type: 'info',
    message: t('damageQueryMediator.messages.editingFile', { fileNumber: row.fileNumber }),
    position: 'top'
  })
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.hasar-sorgula-arabulucu {
  background: $background-page;
  min-height: 100vh;
  text-transform: uppercase;

  // Icon'ları ve butonları hariç tut
  .q-icon,
  .q-select__dropdown-icon,
  .q-table__sort-icon,
  .q-btn .q-icon,
  .q-btn,
  i,
  [class*="bi-"] {
    text-transform: none !important;
  }

  .page-container {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px;
  }
}
</style>
