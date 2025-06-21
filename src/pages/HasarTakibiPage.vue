<template>
  <q-page class="hasar-takibi">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">
          <q-icon name="bi-search" size="24px" class="q-mr-sm" />
          Hasar Takibi
        </h1>
      </div>

      <q-card class="search-card">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                outlined
                v-model="damageTrackingStore.searchParams.dosyaNo"
                label="Dosya No"
                class="form-field"
                dense
                @update:model-value="handleInputChange('dosyaNo', $event)"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                v-model="damageTrackingStore.searchParams.plaka"
                label="Plaka"
                class="form-field"
                dense
                @update:model-value="handleInputChange('plaka', $event)"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                outlined
                v-model="damageTrackingStore.searchParams.durum"
                :options="durumOptions"
                label="Durum"
                class="form-field"
                dense
                emit-value
                map-options
                options-dense
                dropdown-icon="bi-chevron-down"
                @update:model-value="handleInputChange('durum', $event)"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Temizle"
            color="grey-7"
            class="form-button q-mr-sm"
            no-caps
            @click="damageTrackingStore.resetSearchParams"
          />
          <q-btn
            unelevated
            icon="bi-search"
            label="Ara"
            color="primary"
            class="search-button"
            no-caps
            @click="damageTrackingStore.search"
          />
        </q-card-actions>
      </q-card>

      <q-card class="results-card q-mt-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Arama Sonuçları</div>
          
          <q-table
            :rows="damageTrackingStore.searchResults"
            :columns="columns"
            row-key="id"
            :loading="damageTrackingStore.loading"
            :pagination="damageTrackingStore.pagination"
            flat
            bordered
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round dense color="primary" icon="bi-eye">
                  <q-tooltip>Detay Görüntüle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="secondary" icon="bi-pencil">
                  <q-tooltip>Düzenle</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useDamageTrackingStore } from 'src/stores/damage-tracking-store'

const damageTrackingStore = useDamageTrackingStore()

const durumOptions = [
  { label: 'Tümü', value: null },
  { label: 'Açık', value: 'open' },
  { label: 'İşlemde', value: 'processing' },
  { label: 'Tamamlandı', value: 'completed' },
  { label: 'İptal', value: 'cancelled' }
]

const columns = [
  { name: 'dosyaNo', label: 'Dosya No', field: 'dosyaNo', sortable: true, align: 'left' },
  { name: 'plaka', label: 'Plaka', field: 'plaka', sortable: true, align: 'left' },
  { name: 'tarih', label: 'Tarih', field: 'tarih', sortable: true, align: 'left' },
  { name: 'durum', label: 'Durum', field: 'durum', sortable: true, align: 'left' },
  { name: 'actions', label: 'İşlemler', field: 'actions', align: 'center' }
]

// Form alanları değiştiğinde store'u güncelle
const handleInputChange = (field, value) => {
  const updateData = { [field]: value }
  damageTrackingStore.updateSearchParams(updateData)
}
</script>

<style lang="sass">
.hasar-takibi
  padding: 24px
  background: #f9f9f9
  min-height: 100vh

  .page-container
    max-width: 1200px
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

  .search-card, .results-card
    background: #fff
    border-radius: 12px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.06)

    &:hover
      box-shadow: 0 4px 8px rgba(0,0,0,0.1)

  .form-field
    .q-field__control
      height: 44px
      background: white
      border-radius: 8px
      &:hover
        border-color: rgba(25, 118, 210, 0.4)

    .q-field__native, .q-field__prefix, .q-field__suffix
      padding: 0 4px
      font-size: 14px

    .q-field__label
      font-size: 14px
      color: #424242

  .search-button
    min-height: 44px
    font-size: 14px
    font-weight: 500
    padding: 0 24px
    border-radius: 8px
    transition: all 0.2s ease

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