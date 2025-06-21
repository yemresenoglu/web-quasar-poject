import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useDrawerToolsStore = defineStore('drawer-tools', () => {
  const { t } = useI18n()

  // Tool definitions with translation keys
  const tools = ref([
    { 
      id: 'favorites', 
      key: 'favorites',
      icon: 'bi-heart', 
      translationKey: 'drawer.tools.favorites', 
      enabled: true 
    },
    { 
      id: 'pinboards', 
      key: 'pinboards',
      icon: 'bi-pin-angle', 
      translationKey: 'drawer.tools.pinboards', 
      enabled: true 
    },
    { 
      id: 'history', 
      key: 'history',
      icon: 'bi-clock', 
      translationKey: 'drawer.tools.history', 
      enabled: true 
    },
    { 
      id: 'notifications', 
      key: 'notifications',
      icon: 'bi-bell', 
      translationKey: 'drawer.tools.notifications', 
      enabled: true 
    },
    { 
      id: 'performance', 
      key: 'performance',
      icon: 'bi-speedometer2', 
      text: 'Performance', 
      route: '/performance',
      enabled: true 
    },
    { 
      id: 'settings', 
      key: 'settings',
      icon: 'bi-gear', 
      translationKey: 'drawer.tools.settings', 
      enabled: true 
    }
  ])

  // Computed property for enabled tools with translations
  const bottomLinks = computed(() => {
    return tools.value
      .filter(tool => tool.enabled)
      .map(tool => {
        let text = tool.text
        if (!text && tool.translationKey) {
          try {
            text = t(tool.translationKey)
          } catch {
            console.warn(`Translation key not found: ${tool.translationKey}`)
            text = tool.key || tool.id || 'Unknown'
          }
        }
        return {
          ...tool,
          text: text || tool.key || tool.id || 'Unknown'
        }
      })
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
    tools: computed(() => tools.value.map(tool => {
      let text = tool.text
      if (!text && tool.translationKey) {
        try {
          text = t(tool.translationKey)
        } catch {
          console.warn(`Translation key not found: ${tool.translationKey}`)
          text = tool.key || tool.id || 'Unknown'
        }
      }
      return {
        ...tool,
        text: text || tool.key || tool.id || 'Unknown'
      }
    })),
    bottomLinks,
    toggleTool
  }
}) 