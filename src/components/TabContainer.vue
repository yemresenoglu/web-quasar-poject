<template>
  <div class="header-tabs">
    <q-tabs
      v-model="tabStore.activeTab"
      class="header-tabs__container"
      active-color="black"
      indicator-color="transparent"
      align="left"
      @update:model-value="handleTabChange"
    >
      <template v-for="tab in tabStore.tabs" :key="tab.id">
        <Tab :tab="tab" />
        <div v-if="!isLastTab(tab)" class="header-tabs__separator"></div>
      </template>
    </q-tabs>
  </div>
</template>

<script setup>
import { useTabStore } from 'src/stores/tab-store'
import Tab from './Tab.vue'
import { useRouter } from 'vue-router'

const tabStore = useTabStore()
const router = useRouter()

const isLastTab = (tab) => {
  const tabs = tabStore.tabs
  return tabs.indexOf(tab) === tabs.length - 1
}

// Tab değişikliğini izleyelim
const handleTabChange = (tabId) => {
  const tab = tabStore.tabs.find(t => t.id === tabId)
  if (tab) {
    tabStore.setActiveTab(tabId)
    router.push(tab.route)
  }
}
</script>

<style lang="sass">
.header-tabs
  flex: 1
  height: 36px
  display: flex
  align-items: stretch
  padding: 0
  -webkit-app-region: no-drag // Prevent dragging on tabs

  &__container
    width: 100%
    height: 36px
    background: transparent
    padding-left: 4px
    padding-right: 8px
    display: flex
    align-items: stretch
    min-width: 0

    :deep(.q-tabs__content)
      padding: 0

  &__separator
    width: 1px
    height: 16px
    background: rgba(0,0,0,0.1)
    margin: auto 1px
    align-self: center
</style> 