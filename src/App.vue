<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { createLogger } from './utils/logger.js'
import { initPerformanceMonitoring } from './utils/performance.js'

// Bootstrap Icons CSS'i yükle - CDN alternatifi
// import 'bootstrap-icons/font/bootstrap-icons.css'

const logger = createLogger('App')

onMounted(() => {
  logger.info('🚀 Application started successfully')
  
  // Initialize performance monitoring
  initPerformanceMonitoring()
})

</script>

<style lang="css">
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
