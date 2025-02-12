import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDamageReportStore = defineStore('damageReport', () => {
  // Form verilerini tutacak state'ler
  const formData = ref({
    // Temel bilgiler
    reportType: '',
    reportDate: '',
    description: '',
    location: '',
    
    // Araç bilgileri
    vehicleInfo: {
      plate: '',
      brand: '',
      model: '',
      year: ''
    },
    
    // Hasar bilgileri
    damageDetails: {
      type: '',
      severity: '',
      description: ''
    },
    
    // Dosya ekleri
    attachments: [],
    
    // Diğer alanlar
    notes: '',
    status: 'draft' // draft, submitted, processing, completed
  })

  // Form verilerini güncelleme fonksiyonu
  const updateFormData = (newData) => {
    formData.value = { ...formData.value, ...newData }
  }

  // Formu sıfırlama fonksiyonu
  const resetForm = () => {
    formData.value = {
      reportType: '',
      reportDate: '',
      description: '',
      location: '',
      vehicleInfo: {
        plate: '',
        brand: '',
        model: '',
        year: ''
      },
      damageDetails: {
        type: '',
        severity: '',
        description: ''
      },
      attachments: [],
      notes: '',
      status: 'draft'
    }
  }

  // Form verilerini kaydetme fonksiyonu
  const saveForm = () => {
    // Burada API çağrısı yapılabilir
    console.log('Form kaydediliyor:', formData.value)
  }

  // Form verilerini gönderme fonksiyonu
  const submitForm = () => {
    formData.value.status = 'submitted'
    // Burada API çağrısı yapılabilir
    console.log('Form gönderiliyor:', formData.value)
  }

  return {
    formData,
    updateFormData,
    resetForm,
    saveForm,
    submitForm
  }
}) 