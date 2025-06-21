<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    show-if-above
    class="drawer"
    :width="48"
  >
    <div class="drawer__section">
      <q-list>
        <q-item class="drawer-item drawer-item--logo">
          <q-item-section avatar>
            <q-icon 
              name="img:src/assets/logo.png" 
              size="24px"
              class="cursor-pointer"
              @click="navigateToIndex"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ $t('sidebar.start') }}
              </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>
        <q-item class="drawer-item drawer-item-static">
          <q-item-section avatar>
            <q-icon 
              name="bi-grid" 
              size="16px"
              class="cursor-pointer"
              @click="navigateToMenu"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ $t('sidebar.menu') }}
              </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>

        <!-- Tab Management -->
        <q-item class="drawer-item drawer-item-static">
          <q-item-section avatar>
            <q-icon 
              name="bi-window-stack" 
              size="16px"
              class="cursor-pointer"
              @click="navigateToTabs"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                Sekme Yönetimi
              </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>

        <!-- Workspaces -->
        <q-item 
          v-for="workspace in workspaces" 
          :key="workspace.text"
          class="drawer-item drawer-item-static"
        >
          <q-item-section avatar>
            <q-icon 
              :name="workspace.icon" 
              size="16px"
              class="cursor-pointer"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ workspace.text }}
              </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator spaced="sm" inset class="drawer__separator" />

    <div class="drawer__section drawer__section--grow">
      <q-list>
        <!-- Integrated Services -->
        <q-item 
          v-for="service in integratedServices" 
          :key="service.text"
          class="drawer-item drawer-item-static"
        >
          <q-item-section avatar>
            <q-icon 
              :name="service.icon" 
              size="16px"
              class="cursor-pointer"
              @click="handleServiceClick(service)"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ service.text }}
              </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator spaced="sm" inset class="drawer__separator" />

    <div class="drawer__section">
      <q-list>
        <!-- Drawer Tools Links -->
        <q-item 
          v-for="link in bottomLinks" 
          :key="link.text"
          class="drawer-item drawer-item-static"
        >
          <q-item-section avatar>
            <q-icon 
              :name="link.icon" 
              size="16px"
              class="cursor-pointer"
              @click="handleBottomLinkClick(link)"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ link.text }}
              </q-tooltip>
              <FavoritesMenu v-if="link.key === 'favorites'" />
              <NotificationsMenu v-if="link.key === 'notifications'" />
              <PinboardsMenu v-if="link.key === 'pinboards'" />
              <HistoryMenu v-if="link.key === 'history'" />
              <SettingsMenu v-if="link.key === 'settings'" />
            </q-icon>
          </q-item-section>
        </q-item>

        <q-item class="drawer-item drawer-item-static">
          <q-item-section avatar>
            <q-icon 
              name="bi-three-dots" 
              size="16px"
              class="cursor-pointer"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ $t('sidebar.more') }}
              </q-tooltip>
              <SidebarSetting />
            </q-icon>
          </q-item-section>
        </q-item>
        <q-item class="drawer-item drawer-item--avatar">
          <q-item-section avatar>
            <q-avatar size="24px">
              <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              <q-tooltip anchor="center right" self="center left" :offset="[16, 0]">
                {{ $t('sidebar.account') }}
              </q-tooltip>
              <AccountMenu />
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useDrawerToolsStore } from 'src/stores/drawer-tools-store'
import { useIntegratedServicesStore } from 'src/stores/integrated-services-store'
import { useWorkspacesStore } from 'src/stores/workspaces-store'
import { useIntegratedServiceViewStore } from 'src/stores/integrated-service-view-store'
import { useTabStore } from 'src/stores/tab-store'
import SidebarSetting from './SidebarSetting.vue'
import FavoritesMenu from './FavoritesMenu.vue'
import NotificationsMenu from './NotificationsMenu.vue'
import PinboardsMenu from './PinboardsMenu.vue'
import HistoryMenu from './HistoryMenu.vue'
import SettingsMenu from './SettingsMenu.vue'
import AccountMenu from './AccountMenu.vue'
import TabsDialog from './TabsDialog.vue'

const router = useRouter()
const $q = useQuasar()
const drawerToolsStore = useDrawerToolsStore()
const integratedServicesStore = useIntegratedServicesStore()
const workspacesStore = useWorkspacesStore()
const integratedServiceViewStore = useIntegratedServiceViewStore()
const tabStore = useTabStore()

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])

const navigateToIndex = () => {
  tabStore.deactivateTab()
  router.push('/')
}

const navigateToMenu = () => {
  tabStore.addTab({
    title: 'Menu',
    icon: 'bi-grid',
    route: '/menu'
  })
}

const navigateToTabs = () => {
  $q.dialog({
    component: TabsDialog,
    componentProps: {}
  })
}

const handleServiceClick = (service) => {
  // All integrated services are now external web applications
  integratedServiceViewStore.show()
  integratedServiceViewStore.setCurrentService(service)
}

const handleBottomLinkClick = (link) => {
  if (link.route) {
    // Navigate to internal route (like Performance Dashboard)
    tabStore.addTab({
      title: link.text,
      icon: link.icon,
      route: link.route,
      type: 'internal'
    })
  }
}

const workspaces = computed(() => [...workspacesStore.activeWorkspaces])
const integratedServices = computed(() => [...integratedServicesStore.activeServices])
const bottomLinks = computed(() => [...drawerToolsStore.bottomLinks])
</script>

<style lang="sass">
.drawer
  display: flex
  flex-direction: column
  height: 100%
  background: #fefefe
  border-right: 1px solid rgba(0,0,0,0.1)

  &__section
    padding: 8px 0

    &--grow
      flex-grow: 1
      overflow-y: auto

  &__separator
    margin: 8px
    opacity: 0.2
    background: #5f6368

  .q-list
    padding: 0

.drawer-item
  &--logo, &--avatar
    min-height: 32px
    padding: 4px
    display: flex
    justify-content: center
    align-items: center
    background: transparent !important
    cursor: pointer

    .q-item__section--avatar
      min-width: unset
      padding: 0
      display: flex
      justify-content: center
      align-items: center

  &--logo .q-icon
    color: #3c4043 !important

  &--avatar .q-avatar
    opacity: 1 !important

  &-static
    min-height: 32px
    padding: 4px
    display: flex
    justify-content: center
    width: 100%

    .q-item__section--avatar
      min-width: unset
      padding: 0
      display: flex
      justify-content: center
      align-items: center
      width: 32px
      height: 32px
      border-radius: 4px
      transition: background-color 0.2s ease
      cursor: pointer

      &:hover
        background: rgba(0, 0, 0, 0.1)

      .q-icon
        width: 24px
        height: 24px
        border-radius: 4px
        font-size: 16px
        color: #3c4043
        display: flex
        justify-content: center
        align-items: center
</style> 
