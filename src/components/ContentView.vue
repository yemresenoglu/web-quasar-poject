<template>
  <q-page-container class="content-view">
    <div 
      class="content-container" 
      :class="{ 'content-container--split': integratedServiceStore.isPinned || splitViewStore.isVisible }"
    >
      <!-- Integrated Service Panel -->
      <div 
        v-if="integratedServiceStore.isVisible" 
        class="integrated-service-layout"
        :style="servicePanelStyle"
      >
        <IntegratedServiceView />
      </div>

      <!-- Split View Panel -->
      <SplitViewPanel 
        v-model:leftPanelWidth="leftPanelWidth"
        :leftPanelWidth="leftPanelWidth"
      />

      <!-- Separator -->
      <PanelSeparator
        v-model:leftPanelWidth="leftPanelWidth"
        :leftPanelWidth="leftPanelWidth"
        @reset="resetPanelWidths"
      />

      <!-- Main Content -->
      <MainContent :leftPanelWidth="leftPanelWidth" />
    </div>
  </q-page-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import IntegratedServiceView from './IntegratedServiceView.vue'
import SplitViewPanel from './content/SplitViewPanel.vue'
import PanelSeparator from './content/PanelSeparator.vue'
import MainContent from './content/MainContent.vue'
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useSplitViewStore } from 'src/stores/split-view-store'

// Stores
const integratedServiceStore = useIntegratedServiceViewStore()
const splitViewStore = useSplitViewStore()

// Panel width state
const leftPanelWidth = ref(50)

// Computed styles
const servicePanelStyle = computed(() => ({
  width: integratedServiceStore.isPinned 
    ? `calc(${leftPanelWidth.value}% - 50px)` 
    : 'calc(50% - 50px)'
}))

// Reset panel widths
const resetPanelWidths = () => {
  leftPanelWidth.value = 50
}

// Toggle layout split
const toggleLayoutSplit = () => {
  splitViewStore.toggle()
}

// Expose methods for external use
defineExpose({
  toggleLayoutSplit
})
</script>

<style lang="sass">
.content-view
  padding-left: 0 !important
  padding-top: 0 !important

  .q-page-container
    height: 100vh
    margin: 0
    padding: 0 !important
    position: relative

    :deep(.q-page)
      padding: 0 !important
      min-height: unset !important

  .content-container
    height: 100%
    display: flex
    position: relative

  .integrated-service-layout
    position: absolute
    top: 52px
    left: 52px
    bottom: 0
    z-index: 900
    transition: width 0.1s ease-out
</style>


