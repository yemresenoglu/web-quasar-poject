<template>
  <div class="main-content" :class="`main-content--${taskbarPosition}`">
    <q-scroll-area class="content-scroll" :class="`content-scroll--${taskbarPosition}`">
      <div class="content-layout">
        <router-view />
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAccountStore } from 'src/stores/account-store'

const accountStore = useAccountStore()

// Taskbar position from store
const taskbarPosition = computed(() => accountStore.accountSettings.taskbar.position)
</script>

<style lang="sass">
.main-content
  position: relative
  height: 100%

.content-scroll
  position: fixed
  background: #fefefe
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 18px
  overflow: hidden
  z-index: 800
  transition: all 0.3s ease
  
  // Left position (default)
  &--left
    top: 8px
    left: 64px !important // 48px (taskbar) + 8px (taskbar margin) + 8px (gap)
    right: 8px // Sağdan boşluk
    bottom: 8px // Alttan boşluk
  
  // Bottom position
  
  // Top position (gelecekte)
  &--top
    top: 52px
    left: 0
    right: 0
    bottom: 0

  .q-scrollarea__thumb--v
    width: 4px !important
    right: 4px
    background: #9e9e9e !important
    opacity: 0.6 !important
    &:hover
      opacity: 0.8 !important
      background: #757575 !important
      
  .q-scrollarea__bar--v
    width: 4px !important
    right: 4px !important
    background: transparent !important
    opacity: 0.4 !important

  .q-scrollarea__thumb--h
    height: 4px !important
    bottom: 4px
    background: #9e9e9e !important
    opacity: 0.6 !important
    &:hover
      opacity: 0.8 !important
      background: #757575 !important
      
  .q-scrollarea__bar--h
    height: 4px !important
    bottom: 4px !important
    background: transparent !important
    opacity: 0.4 !important

  :deep(.q-scrollarea__container)
    height: 100%
    
  :deep(.q-scrollarea__content)
    padding-right: 8px

.content-layout
  padding: 16px
  min-height: 100%
</style>
