import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDamageFilesStore = defineStore('damageFiles', () => {
  // Filtre parametrelerini tutacak state
  const filter = ref('')

  // Loading durumu
  const loading = ref(false)

  // Pagination ayarları
  const pagination = ref({
    sortBy: 'date',
    descending: true,
    page: 1,
    rowsPerPage: 10
  })

  // Dosya listesi
  const files = ref([
    {
      id: 'HSR-2024-001',
      date: '01.03.2024',
      customer: 'Ahmet Yılmaz',
      type: 'Kaza',
      amount: '₺15,000',
      status: 'İşlemde'
    },
    {
      id: 'HSR-2024-002',
      date: '02.03.2024',
      customer: 'Mehmet Demir',
      type: 'Sel',
      amount: '₺25,000',
      status: 'Tamamlandı'
    },
    {
      id: 'HSR-2024-003',
      date: '03.03.2024',
      customer: 'Ayşe Kaya',
      type: 'Yangın',
      amount: '₺50,000',
      status: 'Beklemede'
    },
    {
      id: 'HSR-2024-004',
      date: '04.03.2024',
      customer: 'Fatma Özkan',
      type: 'Hırsızlık',
      amount: '₺8,500',
      status: 'İşlemde'
    },
    {
      id: 'HSR-2024-005',
      date: '05.03.2024',
      customer: 'Ali Şahin',
      type: 'Kaza',
      amount: '₺32,000',
      status: 'Tamamlandı'
    }
  ])

  // İstatistik verileri
  const statistics = ref({
    totalFiles: 1234,
    activeFiles: 856,
    completedFiles: 378,
    averageDuration: 15.2
  })

  // Tablo sütunları
  const columns = [
    { name: 'id', label: 'Dosya No', field: 'id', sortable: true, align: 'left' },
    { name: 'date', label: 'Tarih', field: 'date', sortable: true, align: 'left' },
    { name: 'customer', label: 'Müşteri', field: 'customer', sortable: true, align: 'left' },
    { name: 'type', label: 'Hasar Tipi', field: 'type', sortable: true, align: 'left' },
    { name: 'amount', label: 'Tutar', field: 'amount', sortable: true, align: 'right' },
    { name: 'status', label: 'Durum', field: 'status', sortable: true, align: 'center' },
    { name: 'actions', label: 'İşlemler', field: 'actions', align: 'center' }
  ]

  // Sort iconları
  const sortIcon = computed(() => ({
    up: 'bi-chevron-up',
    down: 'bi-chevron-down'
  }))

  // Filtre güncelleme fonksiyonu
  const updateFilter = (newFilter) => {
    filter.value = newFilter
  }

  // Pagination güncelleme fonksiyonu
  const updatePagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  // Dosya listesini güncelleme fonksiyonu
  const updateFiles = (newFiles) => {
    files.value = newFiles
  }

  // İstatistikleri güncelleme fonksiyonu
  const updateStatistics = (newStats) => {
    statistics.value = { ...statistics.value, ...newStats }
  }

  // Durum rengini alma fonksiyonu
  const getStatusColor = (status) => {
    const colors = {
      'Beklemede': 'warning',
      'İşlemde': 'info',
      'Tamamlandı': 'positive',
      'İptal': 'negative'
    }
    return colors[status] || 'grey'
  }

  // Filtre sıfırlama fonksiyonu
  const resetFilter = () => {
    filter.value = ''
  }

  // Tüm verileri sıfırlama fonksiyonu
  const resetAll = () => {
    filter.value = ''
    pagination.value = {
      sortBy: 'date',
      descending: true,
      page: 1,
      rowsPerPage: 10
    }
  }

  return {
    filter,
    loading,
    pagination,
    files,
    statistics,
    columns,
    sortIcon,
    updateFilter,
    updatePagination,
    updateFiles,
    updateStatistics,
    getStatusColor,
    resetFilter,
    resetAll
  }
}) 