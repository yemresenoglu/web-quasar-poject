import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIntegratedServiceViewStore = defineStore('integrated-service-view', () => {
  const isVisible = ref(false)
  const currentService = ref(null)
  const isPinned = ref(false)

  const show = () => {
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
    currentService.value = null
    isPinned.value = false
  }

  const toggle = () => {
    isVisible.value = !isVisible.value
  }

  const togglePin = () => {
    isPinned.value = !isPinned.value
  }

  const setCurrentService = (service) => {
    currentService.value = service
  }

  return {
    isVisible,
    currentService,
    isPinned,
    show,
    hide,
    toggle,
    togglePin,
    setCurrentService
  }
}) 