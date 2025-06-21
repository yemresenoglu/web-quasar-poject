<template>
  <q-page class="performance-page">
    <div class="page-header">
      <h1 class="page-title">
        <q-icon name="speed" size="md" />
        Performance Monitor
      </h1>
      <p class="page-subtitle">
        Real-time application performance monitoring and optimization
      </p>
    </div>

    <div class="performance-content">
      <PerformanceDashboard />
    </div>
  </q-page>
</template>

<script setup>
import PerformanceDashboard from '../components/PerformanceDashboard.vue'
</script>

<style lang="sass" scoped>
.performance-page
  padding: 24px
  min-height: 100vh
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)

.page-header
  text-align: center
  margin-bottom: 32px
  
  .page-title
    display: flex
    align-items: center
    justify-content: center
    gap: 12px
    font-size: 32px
    font-weight: 700
    color: #2c3e50
    margin: 0 0 8px 0
    
  .page-subtitle
    font-size: 16px
    color: #7f8c8d
    margin: 0

.performance-content
  max-width: 1200px
  margin: 0 auto
</style> 