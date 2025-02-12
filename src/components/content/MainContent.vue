<template>
  <q-scroll-area 
    class="content-scroll"
    :style="mainContentStyle"
  >
    <div class="content-layout">
      <router-view />
    </div>
  </q-scroll-area>
</template>

<script setup>
import { computed } from 'vue'
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useSplitViewStore } from 'src/stores/split-view-store'

const props = defineProps({
  leftPanelWidth: {
    type: Number,
    required: true
  }
})

const integratedServiceStore = useIntegratedServiceViewStore()
const splitViewStore = useSplitViewStore()

const mainContentStyle = computed(() => 
  integratedServiceStore.isPinned || splitViewStore.isVisible
    ? {
        width: `${100 - props.leftPanelWidth}%`,
        left: `${props.leftPanelWidth + 0.5}%`
      }
    : {}
)
</script>

<style lang="sass">
.content-scroll
  position: absolute
  top: 52px
  left: 52px
  right: 0
  bottom: 0
  background: #fefefe
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 18px
  overflow: hidden
  z-index: 800
  transition: width 0.1s ease-out, left 0.1s ease-out

  :deep(.q-scrollarea__container)
    height: 100%
</style> 