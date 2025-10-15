<template>
  <q-page class="hasar-dosya-arabulucu">
    <div class="page-container">
      <PageHeader :title="pageTitle" icon="file-text" :show-actions="!!dosyaNo" />

      <div v-if="dosyaNo" class="content-flow">
        <!-- Dosya Özet Bilgileri -->
        <DosyaOzetSection :file-data="fileData" />

        <!-- İhbar Veren Kişi Bilgileri -->
        <IhbarVerenSection :ihbar-data="fileData.ihbarVeren" />

        <!-- Değer Kaybı Arabuluculuk Bilgileri -->
        <DegerKaybiArabuluculukSection
          v-model:arabuluculuk="fileData.degerKaybi"
          :loading="loadingStates.degerKaybi"
          @save="saveDegerKaybi"
        />

        <!-- Evrak Bilgileri -->
        <EvrakSection
          v-model:evrak-list="evrakList"
          :loading="loadingStates.evrak"
          @add="addEvrak"
          @view="viewDocument"
          @openInNewTab="openEvrakInNewTab"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { createLogger } from 'src/utils/logger'
import { getMockFileData } from 'src/data/mock-hasar-dosya-arabulucu-data.js'

const logger = createLogger('HasarDosyaArabulucu')

// Components
import PageHeader from 'src/components/PageHeader.vue'
import DosyaOzetSection from 'src/components/hasar/DosyaOzetSection.vue'
import IhbarVerenSection from 'src/components/hasar/IhbarVerenSection.vue'
import DegerKaybiArabuluculukSection from 'src/components/hasar/DegerKaybiArabuluculukSection.vue'
import EvrakSection from 'src/components/hasar/EvrakSection.vue'

// Composables
const route = useRoute()
const $q = useQuasar()
const { t } = useI18n()

// Computed properties
const dosyaNo = computed(() => route.params.dosyaNo)
const magdurNo = computed(() => fileData.value.magdurNo || '1')
const pageTitle = computed(() => {
  if (dosyaNo.value) {
    return `${dosyaNo.value}/${magdurNo.value} - SOMPO Sigorta`
  }
  return t('hasarDosyaArabulucu.title')
})

// Loading states
const loadingStates = reactive({
  degerKaybi: false,
  evrak: false,
})

// File data - Initialize with mock data
const fileData = ref({})
const evrakList = ref([])

// Load mock data on component mount
onMounted(() => {
  loadFileData()
})

/**
 * Load file data from mock data
 */
const loadFileData = () => {
  try {
    const mockData = getMockFileData(dosyaNo.value)
    fileData.value = mockData
    evrakList.value = mockData.evrakList || []
    
    logger.info('File data loaded:', mockData)
  } catch (error) {
    logger.error('Error loading file data:', error)
    // Fallback to default data
    fileData.value = {
      dosyaNo: dosyaNo.value || '2025311003010',
      magdurNo: '1',
      policeNo: '311000144377772',
      sigortaliAdSoyad: 'YAVUZ BÜLENT TÜRELİ',
      sigortaliKusurOrani: '75%',
      sigortaliPlaka: '06HO8413',
      magdurAdSoyad: 'MEHTAP ÇİFTCİ',
      magdurAracPlaka: '50AAA22',
      hasarNedeni: 'DEĞER KAYBI',
      altHasarNedeni: 'DEĞER KAYBI',
      hasarTarihi: '04/05/2023 11:21',
      ihbarTarihi: '04/07/2025 11:22',
      altBrans: 'TRAFİK',
      ihbarVeren: {
        ihbarYapanAdSoyad: 'YAVUZ BÜLENT TÜRELİ',
        gsm: '(545) 734 51 74',
        eposta: '',
        yakinlikDerecesi: 'Sigortalı',
      },
      degerKaybi: {
        teklifEdilenTutar: 45000,
        vekaletTutari: 5000,
        anlasmaYapilacakIslem: '',
        anlasmaDurum: 'Anlaşma sağlandı',
        talepEdilenRevizeTutar: 48000,
        onaylananRevizeTutar: 46000,
        anlasmaSaglananTutar: 43000,
        anlasmaSaglananVekaletTutari: 4500,
      },
    }
    evrakList.value = [
      {
        id: 1,
        evrakAdi: 'Kaza Tespit Tutanağı',
        evrakBelgeDurum: 'Alındı',
        tarih: '15.01.2024',
      },
      {
        id: 2,
        evrakAdi: 'Ruhsat Fotokopisi',
        evrakBelgeDurum: 'Bekleniyor',
        tarih: '-',
      },
    ]
  }
}

// Update document title and fileData when dosyaNo changes
watch(
  [dosyaNo, magdurNo],
  ([newDosyaNo, newMagdurNo]) => {
    if (newDosyaNo) {
      // Update fileData with new dosyaNo
      fileData.value.dosyaNo = newDosyaNo

      // Update document title
      document.title = `${newDosyaNo}/${newMagdurNo} - SOMPO Sigorta`
    } else {
      document.title = 'SOMPO Sigorta'
    }
  },
  { immediate: true },
)

/**
 * Save Değer Kaybı
 */
const saveDegerKaybi = async () => {
  loadingStates.degerKaybi = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: t('hasarDosyaArabulucu.messages.saveSuccess'),
      position: 'top',
    })
  } catch (error) {
    logger.error('Error saving file:', error)
    $q.notify({
      type: 'negative',
      message: t('hasarDosyaArabulucu.messages.saveError'),
      position: 'top',
    })
  } finally {
    loadingStates.degerKaybi = false
  }
}

/**
 * Add evrak
 * @param {Object} evrakData - Evrak data
 */
const addEvrak = (evrakData) => {
  const newEvrak = {
    id: Date.now(),
    ...evrakData,
    tarih: new Date().toLocaleDateString('tr-TR'),
  }

  evrakList.value.push(newEvrak)

  $q.notify({
    type: 'positive',
    message: t('hasarDosyaArabulucu.messages.evrakAdded'),
    position: 'top',
  })
}

/**
 * View document
 */
const viewDocument = () => {
  $q.notify({
    type: 'info',
    message: t('hasarDosyaArabulucu.messages.viewingDocument'),
    position: 'top',
  })
}

/**
 * Open evrak in new tab
 * @param {Object} doc - Document to open in new tab
 */
const openEvrakInNewTab = (doc) => {
  // Bu örnekte evrak için ayrı bir sayfa yok, bu yüzden mevcut sayfayı yeni sekmede açıyoruz
  const url = `${window.location.origin}/hasar-dosya-arabulucu/${dosyaNo.value}`
  window.open(url, '_blank')
  
  $q.notify({
    type: 'positive',
    message: 'Evrak yeni sekmede açıldı',
    icon: 'bi-box-arrow-up-right',
    position: 'top'
  })
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.hasar-dosya-arabulucu {
  background: $background-page;
  min-height: 100vh;

  // Text transform kuralları artık global CSS'de tanımlı

  .page-container {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px;
  }

  .content-flow {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
