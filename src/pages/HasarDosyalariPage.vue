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
                <div class="stat-value">{{ damageFilesStore.statistics.totalFiles.toLocaleString() }}</div>
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
                <div class="stat-value">{{ damageFilesStore.statistics.activeFiles.toLocaleString() }}</div>
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
                <div class="stat-value">{{ damageFilesStore.statistics.completedFiles.toLocaleString() }}</div>
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
                <div class="stat-value">{{ damageFilesStore.statistics.averageDuration }}<span class="stat-unit">gün</span></div>
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
                  :rows="damageFilesStore.files"
                  :columns="damageFilesStore.columns"
                row-key="id"
                  :filter="damageFilesStore.filter"
                  :loading="damageFilesStore.loading"
                  :pagination="damageFilesStore.pagination"
                flat
                bordered
                binary-state-sort
                  :sort-icon="damageFilesStore.sortIcon"
                  @update:pagination="handlePaginationChange"
              >
                <template v-slot:top-right>
                  <q-input
                      v-model="damageFilesStore.filter"
                    placeholder="Ara..."
                    dense
                    outlined
                    class="q-ml-md"
                      @update:model-value="handleFilterChange"
                  >
                    <template v-slot:append>
                      <q-icon name="bi-search" />
                    </template>
                  </q-input>
                </template>

                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip
                        :color="damageFilesStore.getStatusColor(props.value)"
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
import { useDamageFilesStore } from 'src/stores/damage-files-store'

const damageFilesStore = useDamageFilesStore()

// Filtre değiştiğinde store'u güncelle
const handleFilterChange = (value) => {
  damageFilesStore.updateFilter(value)
}

// Pagination değiştiğinde store'u güncelle
const handlePaginationChange = (newPagination) => {
  damageFilesStore.updatePagination(newPagination)
}
</script>

<style lang="sass">
.hasar-dosyalari
  width: 100%
  height: 100%
  background: #f9f9f9

  padding: 24px

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


</style> 