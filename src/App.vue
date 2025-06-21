<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from 'src/stores/theme-store'
import { useAppDataStore } from 'src/stores/app-data-store'

const themeStore = useThemeStore()
const appDataStore = useAppDataStore()

onMounted(() => {
  // Initialize app data store
  appDataStore.initialize()
  
  // Initialize theme system
  themeStore.initializeTheme()
})
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

#app {
  height: 100vh;
  overflow: hidden;
}

.q-page-container {
  height: 100vh;
  overflow-y: auto;
}
</style>
