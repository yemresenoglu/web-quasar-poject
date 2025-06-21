<template>
  <div class="performance-dashboard">
    <!-- Performance Score Widget -->
    <div class="performance-widget score-widget">
      <div class="widget-header">
        <h3>Performance Score</h3>
        <q-icon 
          :name="performanceIcon" 
          :color="performanceColor"
          size="md"
        />
      </div>
      <div class="score-display">
        <div class="score-circle" :class="performanceClass">
          {{ performanceMonitor.performanceScore }}
        </div>
        <div class="score-label">
          {{ performanceLabel }}
        </div>
      </div>
    </div>

    <!-- Real-time Metrics -->
    <div class="performance-widget metrics-widget">
      <div class="widget-header">
        <h3>Real-time Metrics</h3>
        <q-btn 
          flat 
          round 
          icon="refresh" 
          size="sm"
          @click="refreshMetrics"
        />
      </div>
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-value">{{ performanceMonitor.metrics.fps }}</div>
          <div class="metric-label">FPS</div>
          <div class="metric-bar">
            <div 
              class="metric-fill fps"
              :style="{ width: `${Math.min(performanceMonitor.metrics.fps / 60 * 100, 100)}%` }"
            ></div>
          </div>
        </div>
        
        <div class="metric-item">
          <div class="metric-value">{{ memoryUsageDisplay }}</div>
          <div class="metric-label">Memory</div>
          <div class="metric-bar">
            <div 
              class="metric-fill memory"
              :style="{ width: `${performanceMonitor.metrics.memoryUsage?.percentage ?? 0}%` }"
            ></div>
          </div>
        </div>
        
        <div class="metric-item">
          <div class="metric-value">{{ performanceMonitor.metrics.domNodes }}</div>
          <div class="metric-label">DOM Nodes</div>
          <div class="metric-bar">
            <div 
              class="metric-fill dom"
              :style="{ width: `${Math.min(performanceMonitor.metrics.domNodes / 5000 * 100, 100)}%` }"
            ></div>
          </div>
        </div>
        
        <div class="metric-item">
          <div class="metric-value">{{ webviewCacheSize }}</div>
          <div class="metric-label">WebViews</div>
          <div class="metric-bar">
            <div 
              class="metric-fill webview"
              :style="{ width: `${webviewCacheSize / 10 * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Performance -->
    <div class="performance-widget components-widget">
      <div class="widget-header">
        <h3>Component Performance</h3>
        <q-chip 
          :color="componentPerformanceColor"
          text-color="white"
          size="sm"
        >
          {{ Object.keys(performanceMonitor.metrics.componentRenderTime || {}).length }} Components
        </q-chip>
      </div>
      <div class="component-list">
        <div 
          v-for="(renderTime, componentName) in (performanceMonitor.metrics.componentRenderTime || {})"
          :key="componentName"
          class="component-item"
        >
          <div class="component-name">{{ componentName }}</div>
          <div class="component-stats">
            <span class="render-time" :class="getRenderTimeClass(renderTime.average)">
              {{ renderTime.average }}ms avg
            </span>
            <span class="render-max">{{ renderTime.max }}ms max</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Suggestions -->
    <div class="performance-widget suggestions-widget" v-if="suggestions.length > 0">
      <div class="widget-header">
        <h3>Optimization Suggestions</h3>
        <q-badge :color="suggestionsBadgeColor" :label="suggestions.length" />
      </div>
      <div class="suggestions-list">
        <div 
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-item"
          :class="suggestion.priority"
        >
          <q-icon 
            :name="getSuggestionIcon(suggestion.type)"
            :color="getSuggestionColor(suggestion.priority)"
            size="sm"
          />
          <div class="suggestion-content">
            <div class="suggestion-message">{{ suggestion.message }}</div>
            <div class="suggestion-meta">
              {{ suggestion.metric }}: {{ suggestion.value }}
              <q-chip 
                :color="getSuggestionColor(suggestion.priority)"
                text-color="white"
                size="xs"
              >
                {{ suggestion.priority }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lazy Loading Stats -->
    <div class="performance-widget lazy-loading-widget">
      <div class="widget-header">
        <h3>Lazy Loading Performance</h3>
        <q-circular-progress
          :value="lazyLoading.loadingProgress"
          size="30px"
          color="primary"
          track-color="grey-3"
        />
      </div>
      <div class="lazy-stats">
        <div class="stat-row">
          <span>Loading Progress:</span>
          <span class="stat-value">{{ lazyLoading.loadingProgress }}%</span>
        </div>
        <div class="stat-row">
          <span>Avg Load Time:</span>
          <span class="stat-value">{{ lazyLoading.performanceStats.averageLoadTime }}ms</span>
        </div>
        <div class="stat-row">
          <span>Saved Bandwidth:</span>
          <span class="stat-value">{{ lazyLoading.performanceStats.savedBandwidth }}MB</span>
        </div>
        <div class="stat-row">
          <span>Success Rate:</span>
          <span class="stat-value">{{ lazyLoading.performanceStats.successRate }}%</span>
        </div>
      </div>
    </div>

    <!-- Performance Actions -->
    <div class="performance-widget actions-widget">
      <div class="widget-header">
        <h3>Performance Actions</h3>
      </div>
      <div class="actions-grid">
        <q-btn
          color="primary"
          icon="cleaning_services"
          label="Clear Cache"
          @click="clearCaches"
          size="sm"
        />
        <q-btn
          color="orange"
          icon="memory"
          label="Force GC"
          @click="forceGarbageCollection"
          size="sm"
        />
        <q-btn
          color="green"
          icon="download"
          label="Export Report"
          @click="exportPerformanceReport"
          size="sm"
        />
        <q-btn
          color="purple"
          icon="tune"
          label="Optimize"
          @click="runOptimizations"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { usePerformanceMonitor } from '../composables/usePerformanceMonitor'
import { useLazyLoading } from '../composables/useLazyLoading'
import { useTabStore } from '../stores/tab-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const performanceMonitor = usePerformanceMonitor()
const lazyLoading = useLazyLoading()
const tabStore = useTabStore()

// Computed properties
const performanceIcon = computed(() => {
  if (performanceMonitor.isPerformanceGood.value) return 'check_circle'
  if (performanceMonitor.isPerformanceFair.value) return 'warning'
  return 'error'
})

const performanceColor = computed(() => {
  if (performanceMonitor.isPerformanceGood.value) return 'green'
  if (performanceMonitor.isPerformanceFair.value) return 'orange'
  return 'red'
})

const performanceClass = computed(() => {
  if (performanceMonitor.isPerformanceGood.value) return 'good'
  if (performanceMonitor.isPerformanceFair.value) return 'fair'
  return 'poor'
})

const performanceLabel = computed(() => {
  if (performanceMonitor.isPerformanceGood.value) return 'Excellent'
  if (performanceMonitor.isPerformanceFair.value) return 'Fair'
  return 'Needs Optimization'
})

const memoryUsageDisplay = computed(() => {
  const memoryUsage = performanceMonitor.metrics.memoryUsage || { used: 0, percentage: 0 }
  const { used, percentage } = memoryUsage
  return `${used}MB (${percentage}%)`
})

const webviewCacheSize = computed(() => {
  return performanceMonitor.metrics.webviewMemory?.size ?? 0
})

const suggestions = computed(() => {
  return performanceMonitor.getOptimizationSuggestions()
})

const componentPerformanceColor = computed(() => {
  const componentRenderTime = performanceMonitor.metrics.componentRenderTime || {}
  const componentCount = Object.keys(componentRenderTime).length
  if (componentCount < 10) return 'green'
  if (componentCount < 20) return 'orange'
  return 'red'
})

const suggestionsBadgeColor = computed(() => {
  const highPriority = suggestions.value.filter(s => s.priority === 'high').length
  if (highPriority > 0) return 'red'
  if (suggestions.value.length > 0) return 'orange'
  return 'green'
})

// Methods
const refreshMetrics = () => {
  performanceMonitor.startMonitoring()
}

const getRenderTimeClass = (avgTime) => {
  if (avgTime < 5) return 'good'
  if (avgTime < 15) return 'fair'
  return 'poor'
}

const getSuggestionIcon = (type) => {
  switch (type) {
    case 'performance': return 'speed'
    case 'memory': return 'memory'
    case 'webview': return 'tab'
    default: return 'info'
  }
}

const getSuggestionColor = (priority) => {
  switch (priority) {
    case 'high': return 'red'
    case 'medium': return 'orange'
    case 'low': return 'blue'
    default: return 'grey'
  }
}

const clearCaches = () => {
  tabStore.clearWebviewCache()
  lazyLoading.clearMetrics()
  performanceMonitor.clearMetrics()
  
  $q.notify({
    type: 'positive',
    message: 'All caches cleared successfully',
    icon: 'cleaning_services'
  })
}

const forceGarbageCollection = () => {
  if (window.gc) {
    window.gc()
    $q.notify({
      type: 'positive',
      message: 'Garbage collection forced',
      icon: 'memory'
    })
  } else {
    $q.notify({
      type: 'warning',
      message: 'Garbage collection not available',
      icon: 'warning'
    })
  }
}

const exportPerformanceReport = () => {
  const report = performanceMonitor.generateReport()
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-report-${new Date().toISOString().slice(0, 19)}.json`
  a.click()
  
  URL.revokeObjectURL(url)
  
  $q.notify({
    type: 'positive',
    message: 'Performance report exported',
    icon: 'download'
  })
}

const runOptimizations = () => {
  // Implement automatic optimizations
  clearCaches()
  
  // Force hibernation of inactive tabs
  tabStore.hibernateInactiveTabs()
  
  $q.notify({
    type: 'positive',
    message: 'Optimizations applied',
    icon: 'tune'
  })
}

// Lifecycle
onMounted(() => {
  performanceMonitor.startMonitoring()
})

onUnmounted(() => {
  performanceMonitor.stopMonitoring()
})
</script>

<style lang="sass" scoped>
.performance-dashboard
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: 16px
  padding: 16px

.performance-widget
  background: white
  border-radius: 12px
  padding: 16px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  border: 1px solid #e0e0e0

.widget-header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 16px
  
  h3
    margin: 0
    font-size: 16px
    font-weight: 600
    color: #333

.score-widget
  .score-display
    text-align: center
    
  .score-circle
    width: 80px
    height: 80px
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    font-size: 24px
    font-weight: bold
    margin: 0 auto 8px
    
    &.good
      background: linear-gradient(135deg, #4CAF50, #66BB6A)
      color: white
      
    &.fair
      background: linear-gradient(135deg, #FF9800, #FFB74D)
      color: white
      
    &.poor
      background: linear-gradient(135deg, #F44336, #EF5350)
      color: white
      
  .score-label
    font-size: 14px
    color: #666

.metrics-grid
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 16px

.metric-item
  .metric-value
    font-size: 20px
    font-weight: bold
    color: #333
    
  .metric-label
    font-size: 12px
    color: #666
    margin-bottom: 4px
    
  .metric-bar
    height: 4px
    background: #e0e0e0
    border-radius: 2px
    overflow: hidden
    
    .metric-fill
      height: 100%
      transition: width 0.3s ease
      
      &.fps
        background: linear-gradient(90deg, #4CAF50, #66BB6A)
        
      &.memory
        background: linear-gradient(90deg, #2196F3, #42A5F5)
        
      &.dom
        background: linear-gradient(90deg, #FF9800, #FFB74D)
        
      &.webview
        background: linear-gradient(90deg, #9C27B0, #BA68C8)

.component-list
  max-height: 200px
  overflow-y: auto

.component-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 8px 0
  border-bottom: 1px solid #f0f0f0
  
  &:last-child
    border-bottom: none
    
  .component-name
    font-size: 14px
    font-weight: 500
    
  .component-stats
    display: flex
    gap: 8px
    
    .render-time
      font-size: 12px
      padding: 2px 6px
      border-radius: 4px
      
      &.good
        background: #E8F5E8
        color: #4CAF50
        
      &.fair
        background: #FFF3E0
        color: #FF9800
        
      &.poor
        background: #FFEBEE
        color: #F44336
        
    .render-max
      font-size: 12px
      color: #666

.suggestions-list
  .suggestion-item
    display: flex
    gap: 12px
    padding: 12px
    margin-bottom: 8px
    border-radius: 8px
    border-left: 4px solid
    
    &.high
      background: #FFEBEE
      border-color: #F44336
      
    &.medium
      background: #FFF3E0
      border-color: #FF9800
      
    &.low
      background: #E3F2FD
      border-color: #2196F3
      
    .suggestion-content
      flex: 1
      
      .suggestion-message
        font-size: 14px
        margin-bottom: 4px
        
      .suggestion-meta
        font-size: 12px
        color: #666
        display: flex
        align-items: center
        gap: 8px

.lazy-stats
  .stat-row
    display: flex
    justify-content: space-between
    padding: 4px 0
    
    .stat-value
      font-weight: 600
      color: #2196F3

.actions-grid
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 8px
</style>
