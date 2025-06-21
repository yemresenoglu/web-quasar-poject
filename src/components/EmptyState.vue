<template>
  <div class="empty-state" :class="emptyStateClass">
    <div class="empty-state__content">
      <!-- Icon -->
      <div v-if="icon" class="empty-state__icon">
        <q-icon :name="icon" :size="iconSize" :color="iconColor" />
      </div>
      
      <!-- Illustration -->
      <div v-else-if="illustration" class="empty-state__illustration">
        <img :src="illustration" :alt="title" />
      </div>
      
      <!-- Default Empty Icon -->
      <div v-else class="empty-state__icon">
        <q-icon name="bi-inbox" size="64px" color="grey-5" />
      </div>
      
      <!-- Title -->
      <h3 v-if="title" class="empty-state__title">{{ title }}</h3>
      
      <!-- Description -->
      <p v-if="description" class="empty-state__description">{{ description }}</p>
      
      <!-- Action Button -->
      <div v-if="actionText || $slots.action" class="empty-state__action">
        <slot name="action">
          <q-btn
            v-if="actionText"
            :label="actionText"
            :color="actionColor"
            :icon="actionIcon"
            :outline="actionOutline"
            :flat="actionFlat"
            @click="handleAction"
          />
        </slot>
      </div>
      
      <!-- Custom Content -->
      <div v-if="$slots.default" class="empty-state__custom">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconSize: {
    type: String,
    default: '64px'
  },
  iconColor: {
    type: String,
    default: 'grey-5'
  },
  illustration: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  actionColor: {
    type: String,
    default: 'primary'
  },
  actionOutline: {
    type: Boolean,
    default: false
  },
  actionFlat: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  centered: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['action'])

const emptyStateClass = computed(() => ({
  'empty-state--small': props.size === 'small',
  'empty-state--medium': props.size === 'medium',
  'empty-state--large': props.size === 'large',
  'empty-state--centered': props.centered
}))

const handleAction = () => {
  emit('action')
}
</script>

<style lang="sass" scoped>
.empty-state
  display: flex
  align-items: center
  justify-content: center
  min-height: 200px
  padding: 32px 16px
  
  &--centered
    text-align: center
    
  &--small
    min-height: 150px
    padding: 24px 16px
    
  &--large
    min-height: 300px
    padding: 48px 16px

.empty-state__content
  max-width: 400px
  width: 100%
  
.empty-state__icon
  margin-bottom: 24px
  opacity: 0.7
  
  .q-icon
    display: block
    margin: 0 auto
    
.empty-state__illustration
  margin-bottom: 24px
  
  img
    max-width: 200px
    width: 100%
    height: auto
    opacity: 0.8
    
.empty-state__title
  font-size: 20px
  font-weight: 600
  color: var(--theme-text-primary)
  margin: 0 0 12px 0
  line-height: 1.3
  
.empty-state__description
  font-size: 14px
  color: var(--theme-text-secondary)
  margin: 0 0 24px 0
  line-height: 1.5
  
.empty-state__action
  margin-bottom: 16px
  
.empty-state__custom
  margin-top: 16px

// Size variations
.empty-state--small
  .empty-state__icon
    margin-bottom: 16px
    
    .q-icon
      font-size: 48px !important
      
  .empty-state__title
    font-size: 18px
    margin-bottom: 8px
    
  .empty-state__description
    font-size: 13px
    margin-bottom: 16px
    
  .empty-state__illustration img
    max-width: 150px

.empty-state--large
  .empty-state__icon
    margin-bottom: 32px
    
    .q-icon
      font-size: 80px !important
      
  .empty-state__title
    font-size: 24px
    margin-bottom: 16px
    
  .empty-state__description
    font-size: 16px
    margin-bottom: 32px
    
  .empty-state__illustration img
    max-width: 250px

// Responsive design
@media (max-width: 768px)
  .empty-state
    padding: 24px 16px
    min-height: 180px
    
  .empty-state__content
    max-width: 300px
    
  .empty-state__title
    font-size: 18px
    
  .empty-state__description
    font-size: 13px
    
  .empty-state__icon .q-icon
    font-size: 56px !important
    
  .empty-state__illustration img
    max-width: 160px

// Animation
.empty-state__content
  animation: fadeInUp 0.6s ease-out
  
@keyframes fadeInUp
  from
    opacity: 0
    transform: translateY(20px)
  to
    opacity: 1
    transform: translateY(0)

// Dark theme support
.theme-dark
  .empty-state__title
    color: var(--theme-text-primary)
    
  .empty-state__description
    color: var(--theme-text-secondary)
</style> 