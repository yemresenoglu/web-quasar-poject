<template>
  <div 
    v-if="integratedServiceStore.isPinned || splitViewStore.isVisible" 
    class="separator-label"
    v-touch-pan.horizontal.mouse.prevent="onPan"
    :style="{ left: leftPanelWidth + '%' }"
  >
    <q-btn
      flat
      round
      dense
      icon="bi-distribute-horizontal"
      class="separator-button"
      @click="$emit('reset')"
    />
  </div>
</template>

<script setup>
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useSplitViewStore } from 'src/stores/split-view-store'

const props = defineProps({
  leftPanelWidth: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:leftPanelWidth', 'reset'])

const integratedServiceStore = useIntegratedServiceViewStore()
const splitViewStore = useSplitViewStore()

let startX = 0
let startWidth = 0

const onPan = (evt) => {
  if (evt.isFirst) {
    startX = evt.position.left
    startWidth = props.leftPanelWidth
  }

  const delta = evt.position.left - startX
  const percentDelta = (delta / window.innerWidth) * 100
  const newWidth = Math.max(30, Math.min(70, startWidth + percentDelta))
  emit('update:leftPanelWidth', newWidth)
}
</script>

<style lang="sass">
.separator-label
  position: absolute
  top: 52px
  bottom: 0
  width: 10px
  z-index: 1000
  display: flex
  align-items: center
  justify-content: center
  cursor: col-resize
  touch-action: none
  user-select: none
  
  &:hover, &:active
    &::after
      content: ""
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      background: rgba(0, 0, 0, 0.05)
      pointer-events: none

.separator-button
  background: rgba(255, 255, 255, 0.9)
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
  position: absolute
  z-index: 1001

  .q-icon
    font-size: 18px
    color: #5f6368
    
    &:hover
      color: #202124
</style> 