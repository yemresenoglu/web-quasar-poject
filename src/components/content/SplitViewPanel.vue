<template>
  <div 
    v-if="splitViewStore.isVisible" 
    class="split-view-layout"
    :style="splitViewStyle"
  >
    <div class="split-view-header">
      <div class="split-view-title">
        <q-icon name="bi-layout-split" size="16px" class="q-mr-sm" />
        <span>Bölünmüş Görünüm</span>
      </div>
      <div class="split-view-actions">
        <q-btn flat round dense icon="bi-x" @click="handleClose" />
      </div>
    </div>
    <div class="split-view-content">
      <router-view name="split" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSplitViewStore } from 'src/stores/split-view-store'

const props = defineProps({
  leftPanelWidth: {
    type: Number,
    required: true
  }
})

const router = useRouter()
const splitViewStore = useSplitViewStore()

const splitViewStyle = computed(() => ({
  width: `calc(${props.leftPanelWidth}% - 50px)`
}))

const handleClose = () => {
  splitViewStore.hide()
  const currentRoute = router.currentRoute.value
  if (currentRoute.name) {
    router.push({ name: currentRoute.name })
  }
}
</script>

<style lang="sass">
.split-view-layout
  position: absolute
  top: 52px
  left: 52px
  bottom: 0
  z-index: 900
  transition: width 0.1s ease-out
  background: #fefefe
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 18px
  overflow: hidden
  display: flex
  flex-direction: column

.split-view-header
  height: 48px
  padding: 0 16px
  display: flex
  align-items: center
  justify-content: space-between
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)
  background: #fff

  .split-view-title
    display: flex
    align-items: center
    font-size: 14px
    font-weight: 500
    color: #202124

  .split-view-actions
    display: flex
    gap: 4px

.split-view-content
  flex: 1
  overflow: hidden
</style> 