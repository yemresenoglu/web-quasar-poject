<template>
  <q-tab :name="tab.id" class="header-tab">
    <div class="header-tab__content">
      <div class="header-tab__icon">
        <q-icon :name="tab.icon" size="12px" />
      </div>
      <div class="header-tab__title">
        <span class="header-tab__label">{{ tab.title }}</span>
      </div>
      <div v-if="tab.closeable" class="header-tab__actions">
        <q-icon 
          name="bi-x" 
          size="14px"
          class="header-tab__close" 
          @click.stop="closeTab" 
        />
      </div>
    </div>
  </q-tab>
</template>

<script setup>
import { useTabStore } from 'src/stores/tab-store'

const props = defineProps({
  tab: {
    type: Object,
    required: true
  }
})

const tabStore = useTabStore()
const closeTab = () => tabStore.closeTab(props.tab.id)
</script>

<style lang="sass">
// Variables
$tab-height: 36px
$icon-size: 14px
$border-radius: 8px
$hover-color: rgba(255,255,255,0.25)
$active-color: rgba(255,255,255,0.45)
$text-color: #5f6368
$base-color: rgba(255,255,255,0.15)

// Mixins
@mixin flex-center
  display: flex
  align-items: center
  justify-content: center

@mixin flex-item
  display: flex
  align-items: center

// Base tab styles
.header-tab
  min-width: 140px
  max-width: 200px
  height: $tab-height
  margin: 0 1px
  border-radius: $border-radius
  background: $base-color

  &:hover
    background: $hover-color

  &:hover .header-tab__close
    opacity: 0.7

// Quasar overrides
.q-tab
  min-height: unset !important
  width: 100% !important
  height: 100% !important
  padding: 0 !important

  &__content
    min-width: unset !important
    width: 100% !important
    padding: 0 !important

  &--active
    background: $active-color
    border-radius: $border-radius
    box-shadow: inset 0 -3px 0 rgba(0,0,0,0.3)
    
// Content layout
.header-tab__content
  @include flex-item
  width: 100%
  height: 100%
  gap: 8px
  font-size: 13px
  color: $text-color
  text-transform: none

.header-tab__icon
  @include flex-center
  width: 16px
  height: 16px
  margin-left: 4px
  flex-shrink: 0

.header-tab__title
  @include flex-item
  flex: 1
  min-width: 0

.header-tab__label
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  line-height: $tab-height

.header-tab__actions
  @include flex-center
  margin-left: auto
  margin-right: 6px
  flex-shrink: 0

.header-tab__close
  @include flex-center
  width: $icon-size
  height: $icon-size
  margin-left: -2px
  opacity: 0
  color: rgba(0,0,0,0.7)

  &:hover
    opacity: 0.9
</style> 