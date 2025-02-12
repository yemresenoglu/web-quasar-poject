import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useIntegratedServicesStore = defineStore('integrated-services', () => {
  // Tüm entegre servislerin listesi
  const services = ref([
    { id: 'wikipedia', icon: 'bi-globe', text: 'Wikipedia', url: 'https://wikipedia.org', enabled: false },
    { id: 'uyap', icon: 'bi-bank', text: 'UYAP', url: 'https://vatandas.uyap.gov.tr', enabled: false },
    { id: 'agir-hasar', icon: 'bi-car-front', text: 'Ağır Hasar', url: 'https://hasarsorgulama.sbm.org.tr', enabled: false },
    { id: 'icap', icon: 'bi-shield-check', text: 'ICAP', url: 'https://icap.org.tr', enabled: false }
  ])

  // TheDrawer'da görünecek servisler (enabled: true olanlar)
  const activeServices = computed(() => {
    return services.value.filter(service => service.enabled)
  })

  // Servis durumunu değiştirme fonksiyonu
  function toggleService(serviceId) {
    const service = services.value.find(s => s.id === serviceId)
    if (service) {
      service.enabled = !service.enabled
    }
  }

  // Yeni servis ekleme fonksiyonu
  function addService(newService) {
    services.value.push(newService)
  }

  return {
    services,
    activeServices,
    toggleService,
    addService
  }
}) 