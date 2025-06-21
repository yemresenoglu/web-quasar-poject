<template>
  <q-page class="hasar-bildirimi">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">
          <q-icon name="bi-exclamation-triangle-fill" size="24px" class="q-mr-sm" />
          Hasar Bildirimi
        </h1>
      </div>

      <q-card class="form-card">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="damageReportStore.formData.vehicleInfo.plate"
                label="Plaka"
                class="form-field"
                dense
                @update:model-value="handleInputChange('vehicleInfo.plate', $event)"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="damageReportStore.formData.vehicleInfo.brand"
                label="Marka"
                class="form-field"
                dense
                @update:model-value="handleInputChange('vehicleInfo.brand', $event)"
              />
            </div>
            <div class="col-12">
              <q-input
                outlined
                v-model="damageReportStore.formData.description"
                label="Hasar Açıklaması"
                type="textarea"
                rows="4"
                class="form-field"
                dense
                @update:model-value="handleInputChange('description', $event)"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="damageReportStore.formData.reportDate"
                label="Hasar Tarihi"
                mask="##.##.####"
                class="form-field"
                dense
                @update:model-value="handleInputChange('reportDate', $event)"
              >
                <template v-slot:append>
                  <q-icon name="bi-calendar3" class="cursor-pointer">
                    <q-popup-proxy 
                      cover 
                      transition-show="scale" 
                      transition-hide="scale"
                      :offset="[0, 10]"
                    >
                      <q-date v-model="damageReportStore.formData.reportDate" mask="DD.MM.YYYY" />
                    </q-popup-proxy>
                  </q-icon>
                  <span class="text-grey-6 text-caption">gg.aa.yyyy</span>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="damageReportStore.formData.damageDetails.type"
                :options="hasarTipleri"
                label="Hasar Tipi"
                class="form-field"
                dense
                emit-value
                map-options
                options-dense
                dropdown-icon="bi-chevron-down"
                @update:model-value="handleInputChange('damageDetails.type', $event)"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Vazgeç"
            color="grey-7"
            class="form-button q-mr-sm"
            no-caps
            @click="damageReportStore.resetForm"
          />
          <q-btn
            unelevated
            label="Bildirimi Gönder"
            color="grey-8"
            class="form-button"
            no-caps
            @click="damageReportStore.submitForm"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useDamageReportStore } from 'src/stores/damage-report-store'

const damageReportStore = useDamageReportStore()

const hasarTipleri = [
  { label: 'Trafik Kazası', value: 'trafik_kazasi' },
  { label: 'Doğal Afet', value: 'dogal_afet' },
  { label: 'Hırsızlık', value: 'hirsizlik' },
  { label: 'Yangın', value: 'yangin' },
  { label: 'Diğer', value: 'diger' }
]

// Form alanları değiştiğinde store'u güncelle
const handleInputChange = (field, value) => {
  const updateData = {}
  const fieldParts = field.split('.')
  
  if (fieldParts.length === 1) {
    updateData[field] = value
  } else {
    updateData[fieldParts[0]] = {
      ...damageReportStore.formData[fieldParts[0]],
      [fieldParts[1]]: value
    }
  }
  
  damageReportStore.updateFormData(updateData)
}
</script>

<style lang="sass">
.hasar-bildirimi
  width: 100%
  height: 100%
  background: #f9f9f9
  padding: 24px

  .page-container
    max-width: 1200px
    margin: 0 auto

  .page-header
    margin-bottom: 24px

  .page-title
    font-size: 24px
    font-weight: 600
    color: #202124
    margin: 0
    display: flex
    align-items: center

    .q-icon
      color: #1976d2
      opacity: 0.9

  .form-card
    background: #fff
    border-radius: 12px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    border: 1px solid rgba(0,0,0,0.06)

  .form-field
    .q-field__control
      background: #fff
      border-radius: 8px
    .q-field__native
      font-size: 14px
    &.q-field--focused
      .q-field__control
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2)

  .form-button
    border-radius: 8px
    font-weight: 500
    padding: 8px 16px
    font-size: 14px

  .q-card-actions
    border-top: 1px solid rgba(0,0,0,0.08)
</style> 
