import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useTabStore = defineStore('tab', () => {
  const router = useRouter()
  const route = useRoute()
  const activeTab = ref(null)
  const tabs = ref([])

  // Watch route changes
  watch(
    () => route.path,
    (newPath) => {
      // For other routes, find and activate corresponding tab
      const tab = tabs.value.find(tab => tab.route === newPath)
      if (tab) {
        activeTab.value = tab.id
      }
    }
  )

  const closeTab = (id) => {
    const index = tabs.value.findIndex(tab => tab.id === id)
    if (index !== -1) {
      tabs.value.splice(index, 1)
      if (activeTab.value === id) {
        const newActiveTab = tabs.value[Math.max(0, index - 1)]
        if (newActiveTab) {
          activeTab.value = newActiveTab.id
          router.push(newActiveTab.route)
        } else {
          activeTab.value = null
          router.push('/')
        }
      }
    }
  }

  const addTab = ({ title, icon, route }) => {
    const existingTab = tabs.value.find(tab => tab.route === route)
    if (existingTab) {
      activeTab.value = existingTab.id
      router.push(route)
      return
    }

    const newTab = {
      id: `tab_${Date.now()}`,
      title,
      icon: icon || 'bi-globe',
      route,
      closeable: true
    }
    
    tabs.value.push(newTab)
    activeTab.value = newTab.id
    router.push(route)
  }

  const setActiveTab = (id) => {
    const tab = tabs.value.find(tab => tab.id === id)
    if (tab) {
      activeTab.value = id
      router.push(tab.route)
    }
  }

  const deactivateTab = () => {
    activeTab.value = null
  }

  return {
    tabs,
    activeTab,
    closeTab,
    addTab,
    setActiveTab,
    deactivateTab
  }
}) 