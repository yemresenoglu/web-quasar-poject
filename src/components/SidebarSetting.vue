<template>
  <q-menu
    ref="menuRef"
    class="drawer-settings"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"

  >
    <div class="drawer-settings__container">
      <!-- Sabit header -->
      <div class="drawer-settings__header">
        <div class="drawer-settings__title">{{ $t('settings.sidebar.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="drawer-settings__close" 
          @click="closeMenu"
        />
      </div>
      <div class="drawer-settings__divider"></div>
     <q-scroll-area class="drawer-settings__scroll" visible>
        <div class="drawer-settings__content">
          <div class="drawer-settings__section">
            <div class="drawer-settings__section-header">
              <div class="drawer-settings__section-title">{{ $t('settings.sidebar.workspaces') }}</div>
            </div>
            <div class="drawer-settings__list">
              <q-item 
                id="workspace-add"
                clickable 
                v-ripple 
                class="drawer-settings__item"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-plus-lg" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ $t('actions.addMore') }}</div>
                </q-item-section>
                <WorkSpaceAddMenu @create="handleWorkspaceCreate" />
              </q-item>
              <q-item v-for="workspace in workspacesStore.workspaces"
                     :key="workspace.id"
                     clickable
                     v-ripple
                     class="drawer-settings__item"
                     @click="workspacesStore.toggleWorkspace(workspace.id)">
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="workspace.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ workspace.text }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-three-dots" size="16px" class="cursor-pointer" />
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-check-circle"
                         :color="workspace.enabled ? 'grey-8' : 'grey-4'"
                         size="16px" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="drawer-settings__divider"></div>

          <div class="drawer-settings__section">
            <div class="drawer-settings__section-header">
              <div class="drawer-settings__section-title">{{ $t('settings.sidebar.services') }}</div>
            </div>
            <div class="drawer-settings__list">
              <q-item 
                id="service-add"
                clickable 
                v-ripple 
                class="drawer-settings__item"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-plus-lg" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ $t('actions.addMore') }}</div>
                </q-item-section>
                <IntegratedServiceAddMenu />
              </q-item>
              <q-item v-for="service in integratedServicesStore.services"
                     :key="service.id"
                     clickable
                     v-ripple
                     class="drawer-settings__item"
                     @click="integratedServicesStore.toggleService(service.id)">
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="service.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ service.text }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-three-dots" size="16px" class="cursor-pointer" />
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-check-circle"
                         :color="service.enabled ? 'grey-8' : 'grey-4'"
                         size="16px" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="drawer-settings__divider"></div>

          <div class="drawer-settings__section">
            <div class="drawer-settings__section-header">
              <div class="drawer-settings__section-title">{{ $t('settings.sidebar.tools') }}</div>
            </div>
            <div class="drawer-settings__list">
              <q-item v-for="tool in drawerToolsStore.tools" 
                      :key="tool.id"
                      clickable 
                      v-ripple 
                      class="drawer-settings__item"
                      @click="drawerToolsStore.toggleTool(tool.id)">
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="tool.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ tool.text }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-three-dots" size="16px" class="cursor-pointer" />
                </q-item-section>
                <q-item-section side>
                  <q-icon name="bi-check-circle"
                         :color="tool.enabled ? 'grey-8' : 'grey-4'"
                         size="16px" />
                </q-item-section>
              </q-item>
            </div>
          </div>
          <div class="drawer-settings__divider"></div>
          <div class="drawer-settings__section">
            <div class="drawer-settings__section-header">
              <div class="drawer-settings__section-title">{{ $t('settings.sidebar.settings') }}</div>
            </div>
            <div class="drawer-settings__list">
              <q-item clickable v-ripple class="drawer-settings__item" id="sidebar-show">
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ $t('settings.sidebar.show') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="showSidebar" dense class="drawer-settings__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="drawer-settings__item" id="sidebar-hide">
                <q-item-section>
                  <div class="drawer-settings__item-title">{{ $t('settings.sidebar.hide') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="autoHideSidebar" dense class="drawer-settings__toggle" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </q-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useDrawerToolsStore } from 'src/stores/drawer-tools-store'
import { useIntegratedServicesStore } from 'src/stores/integrated-services-store'
import { useWorkspacesStore } from 'src/stores/workspaces-store'
import WorkSpaceAddMenu from './WorkSpaceAddMenu.vue'
import IntegratedServiceAddMenu from './IntegratedServiceAddMenu.vue'

const menuRef = ref(null)

const showSidebar = ref(true)
const autoHideSidebar = ref(false)
const drawerToolsStore = useDrawerToolsStore()
const integratedServicesStore = useIntegratedServicesStore()
const workspacesStore = useWorkspacesStore()

const handleWorkspaceCreate = (workspace) => {
  // Burada workspace store'a yeni workspace'i ekleyebilirsiniz
  console.log('Yeni workspace:', workspace)
}

const closeMenu = () => {
  console.log('Menü kapatılıyor')
  menuRef.value.hide()
}
</script>

<style lang="sass">
.drawer-settings
  height: calc(100% - 52px)
  border-radius: 18px
  max-height: none !important

  &__container
    height: 100%
    display: flex
    flex-direction: column
    background: #fefefe

  &__header
    height: 48px
    padding: 0 16px
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid rgba(0,0,0,0.08)

  &__close
    margin-right: -8px
    min-height: 28px
    min-width: 28px
    padding: 4px
    border-radius: 0
    font-size: 11px
    color: #5f6368
    opacity: 0.87

    &:hover
      background: rgba(0,0,0,0.04)
      color: #202124

  &__scroll
    flex: 1
    width: 444px
    padding-right: 8px
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
    :deep(.q-scrollarea__content)
      padding-right: 8px

  &__title
    font-size: 16px
    font-weight: 500
    color: #5f6368
    text-transform: capitalize

  &__divider
    height: 1px
    background: rgba(0,0,0,0.08)

  &__section
    padding: 8px 0

  &__section-header
    padding: 0 16px
    height: 40px
    display: flex
    align-items: center
    justify-content: space-between
    margin: 0

  &__section-title
    color: #5f6368
    font-size: 16px
    font-weight: 500
    text-transform: capitalize
    padding: 0

  &__toggle
    .q-toggle__inner
      font-size: 32px
    :deep(.q-toggle__thumb)
      top: 0.5rem
      width: 24px
      height: 24px
    :deep(.q-toggle__track)
      height: 16px

  &__list
    .drawer-settings__item
      min-height: 40px
      padding: 8px 16px
      color: #666
      font-size: 14px

      .q-item__section--avatar
        min-width: 40px
        .q-icon
          color: #5f6368
          opacity: 0.87
          font-size: 16px

      .q-item__section--side
        min-width: 40px
        padding-left: 16px
        &:last-child
          padding-left: 8px
        .q-icon
          color: #5f6368
          opacity: 0.87
          font-size: 16px

      &:hover
        background: rgba(0,0,0,0.04)
        color: #202124
        .q-item__section--side .q-icon
          opacity: 1

  &__footer
    padding: 8px 16px
    display: flex
    justify-content: flex-start

  &__show-all
    color: rgb(26, 115, 232)
    font-size: 14px
    font-weight: 500
    padding: 0
    min-height: 32px
    text-transform: capitalize
    .q-icon
      font-size: 14px

.icon-selector
  width: 300px
  max-width: 90vw

  .icon-grid
    display: grid
    grid-template-columns: repeat(6, 1fr)
    gap: 8px
    padding: 8px 0

  .q-btn
    width: 40px
    height: 40px

    .q-icon
      font-size: 20px

.drawer-settings__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 