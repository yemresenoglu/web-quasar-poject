import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useIntegratedServicesStore = defineStore('integrated-services', () => {
  // Tüm entegre servislerin listesi - sadece external web uygulamaları
  const services = ref([
    // External Web Applications (webview-based)
    { id: 'hasar-sorgulama', icon: 'bi-search', text: 'Hasar Sorgulama', url: 'https://www.somposigorta.com.tr/hasariniz-ne-durumda', type: 'external', enabled: true },
    { id: 'uyap', icon: 'bi-bank', text: 'UYAP', url: 'https://vatandas.uyap.gov.tr', type: 'external', enabled: false },
    { id: 'icap', icon: 'bi-shield-check', text: 'ICAP', url: 'https://icap.org.tr', type: 'external', enabled: false },
    { id: 'wikipedia', icon: 'bi-globe', text: 'Wikipedia', url: 'https://tr.wikipedia.org', type: 'external', enabled: false },
    { id: 'e-devlet', icon: 'bi-building', text: 'e-Devlet', url: 'https://www.turkiye.gov.tr', type: 'external', enabled: false },
    { id: 'sgk', icon: 'bi-shield-plus', text: 'SGK', url: 'https://www.sgk.gov.tr', type: 'external', enabled: false },
    { id: 'e-beyanname', icon: 'bi-file-earmark-text', text: 'e-Beyanname', url: 'https://ebeyanname.gib.gov.tr', type: 'external', enabled: false },
    { id: 'turkiye-finans', icon: 'bi-bank2', text: 'Türkiye Finans', url: 'https://www.turkiyefinans.com.tr', type: 'external', enabled: false }
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