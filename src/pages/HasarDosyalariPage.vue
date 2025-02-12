<template>
  <q-page class="hasar-dosyalari">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">
          <q-icon name="bi-folder-fill" size="24px" class="q-mr-sm" />
          Hasar Dosyaları
        </h1>
      </div>

      <div class="row q-col-gutter-md">
        <!-- İstatistik Kartları -->
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section>
              <div class="stat-title">Toplam Dosya</div>
              <div class="stat-value">1,234</div>
              <div class="stat-trend positive">
                <q-icon name="bi-arrow-up-right" />
                <span>8.2%</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section>
              <div class="stat-title">Aktif Dosyalar</div>
              <div class="stat-value">856</div>
              <div class="stat-trend positive">
                <q-icon name="bi-arrow-up-right" />
                <span>12.5%</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section>
              <div class="stat-title">Tamamlanan</div>
              <div class="stat-value">378</div>
              <div class="stat-trend negative">
                <q-icon name="bi-arrow-down-right" />
                <span>3.1%</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section>
              <div class="stat-title">Ortalama Süre</div>
              <div class="stat-value">15.2<span class="stat-unit">gün</span></div>
              <div class="stat-trend positive">
                <q-icon name="bi-arrow-up-right" />
                <span>5.4%</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Dosya Listesi -->
        <div class="col-12">
          <q-card class="file-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Dosya Listesi</div>
                <q-btn
                  unelevated
                  color="primary"
                  icon="bi-plus-lg"
                  label="Yeni Dosya"
                  no-caps
                />
              </div>

              <q-table
                :rows="files"
                :columns="columns"
                row-key="id"
                :filter="filter"
                :loading="loading"
                :pagination="pagination"
                flat
                bordered
                binary-state-sort
                :sort-icon="sortIcon"
              >
                <template v-slot:top-right>
                  <q-input
                    v-model="filter"
                    placeholder="Ara..."
                    dense
                    outlined
                    class="q-ml-md"
                  >
                    <template v-slot:append>
                      <q-icon name="bi-search" />
                    </template>
                  </q-input>
                </template>

                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip
                      :color="getStatusColor(props.value)"
                      text-color="white"
                      dense
                      class="status-chip"
                    >
                      {{ props.value }}
                    </q-chip>
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="text-center">
                    <q-btn flat round dense color="primary" icon="bi-eye">
                      <q-tooltip>Görüntüle</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense color="secondary" icon="bi-pencil">
                      <q-tooltip>Düzenle</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense color="negative" icon="bi-trash">
                      <q-tooltip>Sil</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const loading = ref(false)
const filter = ref('')
const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const columns = [
  { name: 'id', label: 'Dosya No', field: 'id', sortable: true, align: 'left' },
  { name: 'date', label: 'Tarih', field: 'date', sortable: true, align: 'left' },
  { name: 'customer', label: 'Müşteri', field: 'customer', sortable: true, align: 'left' },
  { name: 'type', label: 'Hasar Tipi', field: 'type', sortable: true, align: 'left' },
  { name: 'amount', label: 'Tutar', field: 'amount', sortable: true, align: 'right' },
  { name: 'status', label: 'Durum', field: 'status', sortable: true, align: 'center' },
  { name: 'actions', label: 'İşlemler', field: 'actions', align: 'center' }
]

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
  }
])

const getStatusColor = (status) => {
  const colors = {
    'Beklemede': 'warning',
    'İşlemde': 'info',
    'Tamamlandı': 'positive',
    'İptal': 'negative'
  }
  return colors[status] || 'grey'
}

const sortIcon = computed(() => ({
  up: 'bi-chevron-up',
  down: 'bi-chevron-down'
}))
</script>

<style lang="sass">
.hasar-dosyalari
  padding: 24px
  background: #f9f9f9
  min-height: 100vh

  .page-container
    max-width: 1400px
    margin: 0 auto

  .page-header
    margin-bottom: 24px

  .page-title
    font-size: 24px
    font-weight: 500
    color: #202124
    margin: 0
    display: flex
    align-items: center
    letter-spacing: 0.25px

    .q-icon
      color: #1976d2
      opacity: 0.9

  .stat-card
    background: #fff
    border-radius: 12px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.06)

    &:hover
      box-shadow: 0 4px 8px rgba(0,0,0,0.1)
      transform: translateY(-2px)

    .stat-title
      font-size: 14px
      color: #5f6368
      margin-bottom: 8px

    .stat-value
      font-size: 28px
      font-weight: 500
      color: #202124
      margin-bottom: 8px

      .stat-unit
        font-size: 16px
        margin-left: 4px
        color: #5f6368

    .stat-trend
      display: flex
      align-items: center
      font-size: 14px
      gap: 4px

      &.positive
        color: #34a853
      &.negative
        color: #ea4335

  .file-card
    background: #fff
    border-radius: 12px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.06)

    &:hover
      box-shadow: 0 4px 8px rgba(0,0,0,0.1)

  .status-chip
    min-width: 90px
    justify-content: center

  .q-table
    &__container
      border-radius: 8px
      overflow: hidden

    thead
      tr
        th
          font-weight: 500
          font-size: 14px
          color: #202124
          background: #f5f5f5

    tbody
      td
        font-size: 14px
        color: #424242

  // Scroll bar styling
  ::-webkit-scrollbar
    width: 8px
    height: 8px

  ::-webkit-scrollbar-track
    background: transparent

  ::-webkit-scrollbar-thumb
    background: rgba(0,0,0,0.2)
    border-radius: 4px

    &:hover
      background: rgba(0,0,0,0.3)
</style> 