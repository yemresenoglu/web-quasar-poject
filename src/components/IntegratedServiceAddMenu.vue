<template>
    <q-menu
      ref="menuRef"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="entegre-servis-menu"
      anchor="bottom left"
      self="top left"
      :offset="[-60, 0]"
      :transition-duration="200"
    >
      <q-list style="min-width: 300px">
        <q-item>
          <q-item-section>
            <div>{{ $t('integratedService.add') }}</div>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <div>{{ $t('integratedService.icon') }}</div>
            <div class="icon-grid">
              <q-btn 
                v-for="icon in icons" 
                :key="icon" 
                flat 
                round 
                :icon="icon"
                :color="selectedIcon === icon ? 'primary' : 'grey-7'"
                @click="selectedIcon = icon" 
              />
            </div>

            <div>{{ $t('integratedService.name') }}</div>
            <q-input
              v-model="serviceName"
              dense
              outlined
              class="q-mb-md"
            />

            <div>{{ $t('integratedService.url') }}</div>
            <q-input
              v-model="serviceUrl"
              dense
              outlined
              class="q-mb-md"
            />

            <div class="row justify-end q-gutter-x-sm">
              <q-btn
                flat
                :label="$t('integratedService.cancel')"
                color="grey-7"
                @click="menuRef.hide()"
                class="action-btn"
              />
              <q-btn
                flat
                :label="$t('integratedService.addButton')"
                color="grey-7"
                @click="createService"
                :loading="loading"
                class="action-btn"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useIntegratedServicesStore } from 'src/stores/integrated-services-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const integratedServicesStore = useIntegratedServicesStore()
const serviceName = ref('')
const serviceUrl = ref('')
const selectedIcon = ref(null)
const loading = ref(false)
const menuRef = ref(null)

const icons = [
  'bi-cloud-fill', 'bi-globe', 'bi-hdd-network-fill', 'bi-server', 'bi-database-fill', 'bi-diagram-3-fill',
  'bi-cloud-arrow-up-fill', 'bi-cloud-check-fill', 'bi-cloud-download-fill', 'bi-gear-fill', 'bi-plug-fill', 'bi-shield-fill',
  'bi-graph-up', 'bi-bar-chart-fill', 'bi-pie-chart-fill', 'bi-clipboard-data-fill', 'bi-box-seam-fill', 'bi-cpu-fill'
]

const resetForm = () => {
  serviceName.value = ''
  serviceUrl.value = ''
  selectedIcon.value = null
}

const createService = () => {
  if (!selectedIcon.value || !serviceName.value || !serviceUrl.value) {
    Notify.create({
      message: t('integratedService.errors.required'),
      color: 'warning',
      position: 'top'
    })
    return
  }

  loading.value = true
  
  try {
    const newService = {
      id: `service_${Date.now()}`,
      icon: selectedIcon.value,
      text: serviceName.value,
      url: serviceUrl.value,
      enabled: true
    }
    
    integratedServicesStore.addService(newService)
    
    Notify.create({
      message: t('integratedService.success'),
      color: 'positive',
      position: 'top'
    })
    
    resetForm()
    menuRef.value.hide()
  } catch (err) {
    console.error('Service creation error:', err)
    Notify.create({
      message: t('integratedService.errors.creation'),
      color: 'negative',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="sass">
.entegre-servis-menu
  .q-list
    background: #fff
    border-radius: 8px
    padding: 8px

  .icon-grid
    display: grid
    grid-template-columns: repeat(6, 1fr)
    gap: 8px
    padding: 8px 0

    .q-btn
      width: 40px
      height: 40px
      .q-icon
        font-size: 20px

  .action-btn
    text-transform: capitalize !important
</style> 