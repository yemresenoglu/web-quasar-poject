import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useDrawerToolsStore = defineStore('drawer-tools', () => {
  const { t } = useI18n()

  // Tool definitions with translation keys
  const tools = ref([
    { 
      id: 'favorites', 
      icon: 'bi-heart', 
      translationKey: 'drawer.tools.favorites', 
      enabled: false 
    },
    { 
      id: 'pinboards', 
      icon: 'bi-pin-angle', 
      translationKey: 'drawer.tools.pinboards', 
      enabled: false 
    },
    { 
      id: 'history', 
      icon: 'bi-clock', 
      translationKey: 'drawer.tools.history', 
      enabled: false 
    },
    { 
      id: 'notifications', 
      icon: 'bi-bell', 
      translationKey: 'drawer.tools.notifications', 
      enabled: false 
    },
    { 
      id: 'settings', 
      icon: 'bi-gear', 
      translationKey: 'drawer.tools.settings', 
      enabled: false 
    },
    { 
      id: 'education', 
      icon: 'bi-mortarboard', 
      translationKey: 'drawer.tools.education', 
      enabled: false 
    }
  ])

  // Computed property for enabled tools with translations
  const bottomLinks = computed(() => {
    return tools.value
      .filter(tool => tool.enabled)
      .map(tool => ({
        ...tool,
        text: t(tool.translationKey)
      }))
  })

  // Toggle tool enabled state
  function toggleTool(toolId) {
    const tool = tools.value.find(t => t.id === toolId)
    if (tool) {
      tool.enabled = !tool.enabled
    }
  }

  // Return store interface with computed translations
  return {
    tools: computed(() => tools.value.map(tool => ({
      ...tool,
      text: t(tool.translationKey)
    }))),
    bottomLinks,
    toggleTool
  }
}) 