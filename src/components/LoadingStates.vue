<template>
  <!-- Skeleton Screen Loading -->
  <div v-if="type === 'skeleton'" class="skeleton-container">
    <div v-if="variant === 'card'" class="skeleton-card">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--subtitle"></div>
        <div class="skeleton-line skeleton-line--text"></div>
      </div>
    </div>
    
    <div v-else-if="variant === 'list'" class="skeleton-list">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-avatar skeleton-avatar--small"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--subtitle"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="variant === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="i in 4" :key="i" class="skeleton-line skeleton-line--header"></div>
      </div>
      <div v-for="i in count" :key="i" class="skeleton-table-row">
        <div v-for="j in 4" :key="j" class="skeleton-line skeleton-line--cell"></div>
      </div>
    </div>
    
    <div v-else class="skeleton-default">
      <div v-for="i in count" :key="i" class="skeleton-line"></div>
    </div>
  </div>
  
  <!-- Spinner Loading -->
  <div v-else-if="type === 'spinner'" class="spinner-container" :class="spinnerClass">
    <q-spinner-dots 
      v-if="spinnerType === 'dots'"
      :size="size" 
      :color="color"
    />
    <q-spinner-grid 
      v-else-if="spinnerType === 'grid'"
      :size="size" 
      :color="color"
    />
    <q-spinner-cube 
      v-else-if="spinnerType === 'cube'"
      :size="size" 
      :color="color"
    />
    <q-spinner 
      v-else
      :size="size" 
      :color="color"
    />
    <div v-if="message" class="loading-message">{{ message }}</div>
  </div>
  
  <!-- Progress Loading -->
  <div v-else-if="type === 'progress'" class="progress-container">
    <q-linear-progress 
      :value="progress / 100" 
      :color="color"
      :size="size"
      :indeterminate="indeterminate"
      class="loading-progress"
    />
    <div v-if="message" class="loading-message">{{ message }}</div>
    <div v-if="showPercentage && !indeterminate" class="loading-percentage">{{ progress }}%</div>
  </div>
  
  <!-- Overlay Loading -->
  <div v-else-if="type === 'overlay'" class="loading-overlay" :class="overlayClass">
    <div class="loading-content">
      <q-spinner-dots :size="size" :color="color" />
      <div v-if="message" class="loading-message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['skeleton', 'spinner', 'progress', 'overlay'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'card', 'list', 'table'].includes(value)
  },
  spinnerType: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dots', 'grid', 'cube'].includes(value)
  },
  size: {
    type: String,
    default: '40px'
  },
  color: {
    type: String,
    default: 'primary'
  },
  count: {
    type: Number,
    default: 3
  },
  message: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  showPercentage: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  blur: {
    type: Boolean,
    default: false
  }
})

const spinnerClass = computed(() => ({
  'spinner-container--fullscreen': props.fullscreen,
  'spinner-container--blur': props.blur
}))

const overlayClass = computed(() => ({
  'loading-overlay--fullscreen': props.fullscreen,
  'loading-overlay--blur': props.blur
}))
</script>

<style lang="sass" scoped>
// Skeleton Styles
.skeleton-container
  padding: 16px
  
.skeleton-card
  display: flex
  gap: 16px
  padding: 16px
  border-radius: 8px
  background: var(--theme-surface)
  
.skeleton-list
  display: flex
  flex-direction: column
  gap: 12px
  
.skeleton-list-item
  display: flex
  gap: 12px
  align-items: center
  padding: 8px
  
.skeleton-table
  display: flex
  flex-direction: column
  gap: 8px
  
.skeleton-table-header
  display: flex
  gap: 16px
  padding: 12px
  background: var(--theme-surface)
  border-radius: 4px
  
.skeleton-table-row
  display: flex
  gap: 16px
  padding: 8px
  
.skeleton-avatar
  width: 48px
  height: 48px
  border-radius: 50%
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)
  background-size: 200% 100%
  animation: skeleton-loading 1.5s infinite
  
  &--small
    width: 32px
    height: 32px
    
.skeleton-content
  flex: 1
  display: flex
  flex-direction: column
  gap: 8px
  
.skeleton-line
  height: 16px
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)
  background-size: 200% 100%
  animation: skeleton-loading 1.5s infinite
  border-radius: 4px
  
  &--title
    height: 20px
    width: 80%
    
  &--subtitle
    height: 16px
    width: 60%
    
  &--text
    height: 14px
    width: 90%
    
  &--header
    height: 18px
    flex: 1
    
  &--cell
    height: 16px
    flex: 1

@keyframes skeleton-loading
  0%
    background-position: -200% 0
  100%
    background-position: 200% 0

// Spinner Styles
.spinner-container
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 16px
  padding: 32px
  
  &--fullscreen
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    background: rgba(255, 255, 255, 0.9)
    z-index: 9999
    
  &--blur
    backdrop-filter: blur(4px)

// Progress Styles
.progress-container
  display: flex
  flex-direction: column
  gap: 8px
  padding: 16px
  
.loading-progress
  border-radius: 4px
  
.loading-percentage
  text-align: center
  font-size: 14px
  font-weight: 500
  color: var(--theme-text-secondary)

// Overlay Styles
.loading-overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(255, 255, 255, 0.9)
  display: flex
  align-items: center
  justify-content: center
  z-index: 1000
  
  &--fullscreen
    position: fixed
    width: 100vw
    height: 100vh
    z-index: 9999
    
  &--blur
    backdrop-filter: blur(4px)
    
.loading-content
  display: flex
  flex-direction: column
  align-items: center
  gap: 16px
  
.loading-message
  text-align: center
  font-size: 14px
  color: var(--theme-text-secondary)
  max-width: 200px
  line-height: 1.4

// Dark theme support
.theme-dark
  .skeleton-avatar, .skeleton-line
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)
    background-size: 200% 100%
    
  .loading-overlay
    background: rgba(0, 0, 0, 0.8)
    
  .spinner-container--fullscreen
    background: rgba(0, 0, 0, 0.8)
</style> 