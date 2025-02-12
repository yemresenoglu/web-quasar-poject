<template>
  <q-header class="header">
    <q-toolbar class="header__toolbar">
      <TabContainer />
      <div class="header__actions">
        <q-btn flat round dense icon="bi-alexa" class="alexa_button" @click="openAIChat">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
            Moss
          </q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="bi-three-dots-vertical" class="header__action-button">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
            {{ $t('header.tools') }}
          </q-tooltip>
          <PageTools />
        </q-btn>
        <q-btn flat round dense icon="bi-dash-lg" class="header__action-button">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
            {{ $t('header.minimize') }}
          </q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="bi-square" class="header__action-button">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
            {{ $t('header.maximize') }}
          </q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="bi-x-lg" class="header__action-button">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
            {{ $t('header.close') }}
          </q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
    <AIChatView ref="aiChat" />
  </q-header>
</template>

<script setup>
import TabContainer from './TabContainer.vue'
import PageTools from './PageTools.vue'
import AIChatView from './AIChatView.vue'
import { ref } from 'vue'

const aiChat = ref(null)

const openAIChat = () => {
  aiChat.value.isOpen = true
}
</script>

<style lang="sass">
.header
  height: 48px
  background: linear-gradient(135deg, #d7e1ea, #f5f1ff)
  padding-top: 2px

  &__toolbar
    height: 100%
    padding: 2px 2px !important

  .open-tab-menu__button
    width: 24px
    height: 24px
    border-radius: 4px
    .q-icon
      font-size: 18px !important
      color: #3c4043
      transition: color 0.2s ease
    &:hover
      background: rgba(0,0,0,0.1)
      .q-icon
        color: #202124

  &__actions
    height: 24px
    display: flex
    align-items: center
    gap: 2px

  &__action-button
    width: 24px
    height: 24px
    border-radius: 4px
    .q-icon
      font-size: 12px
      color: #3c4043
      transition: color 0.2s ease
    &:hover
      background: rgba(0,0,0,0.1)
      .q-icon
        color: #202124

  .alexa_button
    width: 32px
    height: 32px
    border-radius: 4px
    .q-icon
      &.bi-alexa
        font-size: 20px
        color: #7c4dff
        transition: all 0.3s ease
    &:hover
      .q-icon
        font-size: 28px
        transform: rotate(180deg)

</style> 