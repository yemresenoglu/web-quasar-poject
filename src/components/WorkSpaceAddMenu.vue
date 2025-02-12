<template>
    <q-menu
      ref="menuRef"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="workspace-add-menu"
      anchor="bottom left"
      self="top left"
      :offset="[-60, 0]"
      :transition-duration="200"
    >
      <q-list style="min-width: 300px">
        <q-item>
          <q-item-section>
            <div>{{ $t('workspace.create') }}</div>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <div>{{ $t('workspace.icon') }}</div>
            <div class="icon-grid">
              <q-btn 
                v-for="icon in icons" 
                :key="icon" 
                flat 
                round 
                :icon="icon"
                :color="selectedIcon === icon ? 'primary' : 'grey-7'"
                @click="selectedIcon = icon" 
              />
            </div>

            <div>{{ $t('workspace.name') }}</div>
            <q-input
              v-model="workspaceName"
              dense
              outlined
              class="q-mb-md"
            />

            <div class="row justify-end q-gutter-x-sm">
              <q-btn
                flat
                :label="$t('workspace.cancel')"
                color="grey-7"
                @click="menuRef.hide()"
                class="action-btn"
              />
              <q-btn
                flat
                :label="$t('workspace.createButton')"
                color="grey-7"
                @click="createWorkspace"
                :loading="loading"
                class="action-btn"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useWorkspacesStore } from 'src/stores/workspaces-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const workspacesStore = useWorkspacesStore()
const workspaceName = ref('')
const selectedIcon = ref(null)
const loading = ref(false)
const menuRef = ref(null)

const icons = [
  'bi-grid-fill', 'bi-folder-fill', 'bi-briefcase-fill', 'bi-bag-fill', 'bi-play-circle-fill', 'bi-airplane-fill',
  'bi-cup-hot-fill', 'bi-file-text-fill', 'bi-emoji-smile-fill', 'bi-controller', 'bi-book-fill', 'bi-gift-fill',
  'bi-bicycle', 'bi-cloud-fill', 'bi-star-fill', 'bi-sun-fill', 'bi-clock-fill', 'bi-person-walking',
  'bi-heart-fill', 'bi-hourglass', 'bi-search', 'bi-list-ul', 'bi-rocket-takeoff', 'bi-brain'
]

const resetForm = () => {
  workspaceName.value = ''
  selectedIcon.value = null
}

const createWorkspace = () => {
  if (!selectedIcon.value || !workspaceName.value) {
    Notify.create({
      message: t('workspace.errors.required'),
      color: 'warning',
      position: 'top'
    })
    return
  }

  loading.value = true
  
  try {
    const newWorkspace = {
      id: `workspace_${Date.now()}`,
      icon: selectedIcon.value,
      text: workspaceName.value,
      enabled: true
    }
    
    workspacesStore.addWorkspace(newWorkspace)
    
    Notify.create({
      message: t('workspace.success'),
      color: 'positive',
      position: 'top'
    })
    
    resetForm()
    menuRef.value.hide()
  } catch (err) {
    console.error('Workspace creation error:', err)
    Notify.create({
      message: t('workspace.errors.creation'),
      color: 'negative',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="sass">
.workspace-add-menu
  .q-list
    background: #fff
    border-radius: 8px
    padding: 8px

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

  .action-btn
    text-transform: capitalize !important
</style> 