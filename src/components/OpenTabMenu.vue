<template>
  <q-menu
    class="header-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="bottom start"
    self="top start"
    :offset="[-5, 0]"
    :transition-duration="100"
  >
      <div class="header-menu__container">
        <div class="row items-center q-px-sm q-py-xs header-menu__search-row">
          <q-icon name="bi-search" size="16px" class="q-mr-sm" style="color: #5f6368; opacity: 0.87" />
          <input 
            v-model="search"
            class="header-menu__search-input"
            :placeholder="searchPlaceholder"
          />
          <q-icon 
            name="bi-x-lg" 
            size="14px" 
            class="q-mr-sm cursor-pointer" 
            style="color: #5f6368; opacity: 0.87"
            @click="search = ''"
          />
        </div>
        <div class="header-menu__divider"></div>

        <q-scroll-area class="header-menu__scroll" visible>
          <div class="header-menu__section">
            <div class="header-menu__section-title q-px-sm q-py-xs">{{ openTabsText }}</div>
            <div class="header-menu__tabs">
              <q-item 
                v-for="tab in tabStore.tabs" 
                :key="tab.id" 
                clickable 
                class="header-menu__tab"
                @click="tabStore.setActiveTab(tab.id)"
              >
                <q-item-section>
                  <div class="header-menu__tab-title">{{ tab.title }}</div>
                </q-item-section>
                <q-item-section side class="q-pl-xs">
                  <q-icon 
                    name="bi-x-lg" 
                    size="12px" 
                    class="cursor-pointer close-icon" 
                    @click.stop="tabStore.closeTab(tab.id)" 
                    v-if="tab.closeable"
                  >
                    <q-tooltip>{{ closeText }}</q-tooltip>
                  </q-icon>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-scroll-area>
      </div>
  </q-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const search = ref('')
const tabStore = useTabStore()

// Computed translations
const searchPlaceholder = computed(() => t('tabs.search'))
const openTabsText = computed(() => t('tabs.openTabs'))
const closeText = computed(() => t('tabs.close'))
</script>

<style lang="sass">
.header-menu

  &__scroll
    height: 480px
    width: 320px

    // Vertical scrollbar
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
    
    // Horizontal scrollbar
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

  &__container
    background: #fff
    border-radius: 8px

  &__search-row
    height: 32px
    margin: 8px

  &__search-input
    flex: 1
    border: none
    background: transparent
    font-size: 13px
    line-height: 18px
    color: #3c4043
    outline: none
    text-transform: capitalize
    &::placeholder
      color: #5f6368
      font-size: 12px

  &__divider
    height: 1px
    background: rgba(0,0,0,0.08)

  &__section
    margin-top: 8px

  &__section-title
    color: #5f6368
    font-size: 12px
    font-weight: 500
    padding: 8px

  &__tabs
    overflow-y: auto
    max-height: calc(480px - 120px)

  &__tab
    min-height: 32px
    padding: 8px 16px
    color: #666
    transition: background 0.3s ease
    &:hover
      background: rgba(0,0,0,0.04)
      color: #333

    .q-item__section--avatar
      min-width: 30px
      .q-icon
        color: #5f6368

    .q-item__section--side
      min-width: 30px

    .close-icon
      opacity: 0
      transition: opacity 0.3s ease
      &:hover
        opacity: 0.85

    &:hover .close-icon
      opacity: 0.7

  &__tab-title
    font-size: 13px
    line-height: 18px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    max-width: 240px
    text-transform: capitalize
</style> 