<template>
  <q-layout :view="layoutView">
    <Taskbar v-model="drawerOpen" />
    <q-page-container id="main-content">
      <MainContent />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAccountStore } from 'src/stores/account-store'
import Taskbar from 'src/components/Taskbar.vue'
import MainContent from 'src/components/MainContent.vue'

const accountStore = useAccountStore()
const drawerOpen = ref(false)

// Taskbar settings
const taskbarSettings = computed(() => accountStore.accountSettings.taskbar)

/**
 * Dynamic layout view based on taskbar position
 * h = header, f = footer, l = left drawer, r = right drawer
 * Uppercase = always visible, lowercase = hidden by default
 * 
 * Format: [header] [left/right] [footer]
 * Examples:
 * - 'hHh lpR fFf' = left drawer, mini mode
 * - 'hHh Lpr fFf' = left drawer, always visible
 * - 'hHh lpr fff' = no footer, left drawer mini
 */
const layoutView = computed(() => {
  const position = taskbarSettings.value.position
  const showTaskbar = taskbarSettings.value.showTaskbar
  const autoHide = taskbarSettings.value.autoHide
  
  if (!showTaskbar) {
    // No taskbar
    return 'hHh lpr fFf'
  }
  
  // Determine drawer visibility
  const drawerMode = autoHide ? 'l' : 'L' // lowercase = mini/overlay, uppercase = always visible
  
  switch (position) {
    case 'left':
      return `hHh ${drawerMode}pr fFf`
    case 'bottom':
      // Bottom için footer kullan (q-footer component)
      return 'hHh lpr fFf'
    case 'top':
      // Top için header kullan (q-header component - gelecekte eklenebilir)
      return 'hHh lpr fFf'
    default:
      return 'hHh lpR fFf'
  }
})
</script>

<style lang="sass">
// Light mode background
#q-app
  background: #f8fafc
  transition: background 0.3s ease

// Dark mode background - #030514
body.body--dark #q-app
  background: #030514

// q-drawer ve q-footer için istisna (kendi background'larını kullansınlar)
#q-app > .q-layout
  background: transparent !important

.q-drawer,
.q-footer
  background: transparent !important

*
  -ms-overflow-style: none
  scrollbar-width: none

::-webkit-scrollbar
  display: none
</style>