import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDamageTrackingStore = defineStore('damageTracking', () => {
  // Arama parametrelerini tutacak state'ler
  const searchParams = ref({
    dosyaNo: '',
    plaka: '',
    durum: null
  })

  // Arama sonuçlarını tutacak state
  const searchResults = ref([
    {
      id: 1,
      dosyaNo: 'HSR-2024-001',
      plaka: '34ABC123',
      tarih: '01.03.2024',
      durum: 'İşlemde'
    },
    {
      id: 2,
      dosyaNo: 'HSR-2024-002',
      plaka: '06XYZ789',
      tarih: '02.03.2024',
      durum: 'Tamamlandı'
    }
  ])

  // Loading durumu
  const loading = ref(false)

  // Pagination ayarları
  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
  })

  // Arama parametrelerini güncelleme fonksiyonu
  const updateSearchParams = (newParams) => {
    searchParams.value = { ...searchParams.value, ...newParams }
  }

  // Arama parametrelerini sıfırlama fonksiyonu
  const resetSearchParams = () => {
    searchParams.value = {
      dosyaNo: '',
      plaka: '',
      durum: null
    }
  }

  // Arama fonksiyonu
  const search = () => {
    loading.value = true
    // Burada API çağrısı yapılabilir
    console.log('Arama yapılıyor:', searchParams.value)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }

  // Arama sonuçlarını güncelleme fonksiyonu
  const updateSearchResults = (results) => {
    searchResults.value = results
  }

  return {
    searchParams,
    searchResults,
    loading,
    pagination,
    updateSearchParams,
    resetSearchParams,
    search,
    updateSearchResults
  }
}) 