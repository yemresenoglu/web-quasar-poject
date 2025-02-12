<template>
  <q-page class="mega-menu">
    <div class="search-container">
      <div class="search-wrapper">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          :placeholder="$t('menuPage.search')"
          class="search-input"
          @input="filterMenuItems"
        >
          <template v-slot:prepend>
            <q-icon name="bi-search" color="grey-6" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="searchQuery"
              name="bi-x-lg"
              color="grey-6"
              class="cursor-pointer"
              @click="clearSearch"
            />
          </template>
        </q-input>
      </div>
    </div>
    <div class="menu-container">
      <div v-for="menuItem in menuPageStore.translatedMenuData" 
           :key="menuItem.id" 
           class="menu-category">
        <div class="menu-header">
          <q-icon :name="menuItem.icon" size="24px" class="q-mr-sm" />
          <h3 class="menu-title">{{ menuItem.text }}</h3>
        </div>
        <q-list class="menu-list">
          <q-item v-for="item in menuItem.items" 
                  :key="item.id"
                  clickable
                  v-ripple
                  class="menu-item"
                  @click="openInTab(item)">
            <q-item-section avatar v-if="item.icon">
              <q-icon :name="item.icon" size="18px" />
            </q-item-section>
            <q-item-section>{{item.text}}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div v-for="n in 100" :key="n" class="q-pa-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTabStore } from 'src/stores/tab-store'
import { useMenuPageStore } from 'src/stores/menu-page-store'

const menuPageStore = useMenuPageStore()

const router = useRouter()
const tabStore = useTabStore()
const searchQuery = ref('')

const clearSearch = () => {
  searchQuery.value = ''
}

const openInTab = (item) => {
  tabStore.addTab({
    title: item.text,
    name: item.text,
    icon: item.icon,
    route: item.route
  })
  
  router.push(item.route)
}
</script>

<style lang="sass">
.mega-menu
  width: 100%
  height: 100%
  background: #f9f9f9
  padding: 24px
  overflow: auto

  .search-container
    width: 100%
    max-width: 1400px
    margin: 0 auto 24px

  .search-wrapper
    max-width: 600px
    margin: 0 auto

  .search-input
    .q-field__control
      height: 44px
      background: white
      border-radius: 8px
    .q-field__marginal
      height: 44px
    ::v-deep(.q-field__native)
      font-size: 14px
      padding-left: 4px
    ::v-deep(.q-field__control:before)
      border: none
    &.q-field--focused
      .q-field__control
        box-shadow: 0 1px 3px rgba(0,0,0,0.12)

  .menu-container
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))
    gap: 24px
    width: 100%
    max-width: 1400px
    margin: 0 auto

  .menu-category
    background: #fff
    border-radius: 12px
    padding: 20px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.06)
    &:hover
      box-shadow: 0 4px 8px rgba(0,0,0,0.1)
      transform: translateY(-2px)

  .menu-header
    display: flex
    align-items: center
    margin-bottom: 20px
    padding-bottom: 12px
    border-bottom: 1px solid rgba(0,0,0,0.06)
    .q-icon
      font-size: 24px
      color: #1976d2
      opacity: 0.9

  .menu-title
    font-size: 16px
    font-weight: 500
    color: #202124
    margin: 0
    letter-spacing: 0.25px

  .menu-list
    padding: 0

  .menu-item
    min-height: 44px
    padding: 10px 16px
    color: #424242
    font-size: 14px
    border-radius: 8px
    margin-bottom: 4px
    transition: all 0.2s ease

    .q-icon
      font-size: 18px
      color: #1976d2
      opacity: 0.8

    &:hover
      background: rgba(25, 118, 210, 0.04)
      color: #1976d2

      .q-icon
        opacity: 1

    &:active
      background: rgba(25, 118, 210, 0.08)

  // Scroll bar styling
  ::-webkit-scrollbar
    width: 8px
    height: 8px

  ::-webkit-scrollbar-track
    background: transparent

  ::-webkit-scrollbar-thumb
    background: rgba(0,0,0,0.2)
    border-radius: 4px

    &:hover
      background: rgba(0,0,0,0.3)
</style> 