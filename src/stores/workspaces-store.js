import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkspacesStore = defineStore('workspaces', () => {
  // Tüm çalışma alanlarının listesi
  const workspaces = ref([
    { id: 'workspace1', icon: 'bi-house', text: 'Çalışma Alanı 1', enabled: false },
    { id: 'workspace2', icon: 'bi-star-fill', text: 'Çalışma Alanı 2', enabled: false },

  ])

  const activeWorkspaces = computed(() => {
    return workspaces.value.filter(workspace => workspace.enabled)
  })

  function toggleWorkspace(workspaceId) {
    const workspace = workspaces.value.find(w => w.id === workspaceId)
    if (workspace) {
      workspace.enabled = !workspace.enabled
    }
  }

  const addWorkspace = (workspace) => {
    workspaces.value.push(workspace)
  }

  return {
    workspaces,
    activeWorkspaces,
    toggleWorkspace,
    addWorkspace
  }
}) 