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
    field: 'fileNumberWithMagdur',
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
    name: 'sigortaliAd',
    label: 'Sigortalı Ad',
    field: 'sigortaliAd',
    align: 'left',
    sortable: true
  },
  {
    name: 'sigortaliSoyad',
    label: 'Sigortalı Soyad',
    field: 'sigortaliSoyad',
    align: 'left',
    sortable: true
  },
  {
    name: 'sigortaliPlaka',
    label: 'Sigortalı Plaka',
    field: 'sigortaliPlaka',
    align: 'left',
    sortable: true
  },
  {
    name: 'sigortaliKusurOrani',
    label: 'Sigortalı Kusur Oranı',
    field: 'sigortaliKusurOrani',
    align: 'left',
    sortable: true
  },
  {
    name: 'magdurAd',
    label: 'Mağdur Ad',
    field: 'magdurAd',
    align: 'left',
    sortable: true
  },
  {
    name: 'magdurSoyad',
    label: 'Mağdur Soyad',
    field: 'magdurSoyad',
    align: 'left',
    sortable: true
  },
  {
    name: 'magdurAracPlaka',
    label: 'Mağdur Araç Plaka',
    field: 'magdurAracPlaka',
    align: 'left',
    sortable: true
  },
  {
    name: 'ihbarTarihi',
    label: 'İhbar Tarihi',
    field: 'ihbarTarihi',
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
      searchResults.value = searchResult.data.files.map(file => {
        // Sigortalı ad soyadını ayır
        const sigortaliAdSoyad = file.sigortaliAdSoyad || ''
        const sigortaliParts = sigortaliAdSoyad.split(' ')
        const sigortaliAd = sigortaliParts[0] || ''
        const sigortaliSoyad = sigortaliParts.slice(1).join(' ') || ''
        
        // Mağdur ad soyadını ayır
        const magdurAdSoyad = file.magdurAdSoyad || ''
        const magdurParts = magdurAdSoyad.split(' ')
        const magdurAd = magdurParts[0] || ''
        const magdurSoyad = magdurParts.slice(1).join(' ') || ''
        
        return {
          fileNumber: file.dosyaNo,
          victimNumber: file.magdurNo,
          fileNumberWithMagdur: `${file.dosyaNo}/${file.magdurNo}`,
          policyNumber: file.policeNo,
          sigortaliAd: sigortaliAd,
          sigortaliSoyad: sigortaliSoyad,
          sigortaliPlaka: file.sigortaliPlaka,
          sigortaliKusurOrani: file.sigortaliKusurOrani || '-',
          magdurAd: magdurAd,
          magdurSoyad: magdurSoyad,
          magdurAracPlaka: file.magdurAracPlaka,
          ihbarTarihi: file.ihbarTarihi,
          damageDate: file.hasarTarihi,
          damageLocation: file.hasarYeri,
          damageReason: file.hasarSebebi,
          damageAmount: file.hasarTutari || 0,
          status: file.durum
        }
      })
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

</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.hasar-sorgula-arabulucu {
  background: $background-page;
  min-height: 100vh;

  // Text transform kuralları artık global CSS'de tanımlı

  .page-container {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px;
  }
}
</style>
