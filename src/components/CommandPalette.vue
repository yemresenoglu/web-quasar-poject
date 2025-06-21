<template>
  <q-dialog
    v-model="isVisible"
    position="top"
    class="command-palette-dialog"
    @hide="onHide"
  >
    <q-card class="command-palette-card">
      <q-card-section class="command-input-section">
        <q-input
          ref="commandInput"
          v-model="searchQuery"
          placeholder="Komut ara... (Ctrl+Shift+P)"
          dense
          borderless
          class="command-input"
          @keydown="handleKeydown"
        >
          <template #prepend>
            <q-icon name="search" class="text-primary" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section class="command-results-section">
        <q-list class="command-list">
          <q-item
            v-for="(command, index) in filteredCommands"
            :key="command.id"
            clickable
            :class="{ 'selected': selectedIndex === index }"
            class="command-item"
            @click="executeCommand(command)"
          >
            <q-item-section avatar>
              <q-icon :name="command.icon" :color="command.color || 'primary'" />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="command-title">{{ command.title }}</q-item-label>
              <q-item-label caption class="command-description">
                {{ command.description }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side v-if="command.shortcut">
              <q-chip dense outline size="sm" class="shortcut-chip">
                {{ command.shortcut }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
        
        <div v-if="filteredCommands.length === 0" class="no-results">
          <q-icon name="search_off" size="3rem" class="text-grey-5" />
          <p class="text-grey-6">Sonuç bulunamadı</p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

interface Command {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  shortcut?: string
  action: () => void
}

const $q = useQuasar()
const isVisible = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const commandInput = ref()

const commands = ref<Command[]>([
  {
    id: 'new-tab',
    title: 'Yeni Sekme Aç',
    description: 'Yeni bir web sekmesi oluştur',
    icon: 'tab',
    color: 'primary',
    shortcut: 'Ctrl+T',
    action: () => openNewTab()
  },
  {
    id: 'open-edevlet',
    title: 'e-Devlet Aç',
    description: 'e-Devlet kapısını aç',
    icon: 'account_balance',
    color: 'red-6',
    shortcut: 'Ctrl+E',
    action: () => openEDevlet()
  },
  {
    id: 'open-sgk',
    title: 'SGK Aç',
    description: 'SGK web sitesini aç',
    icon: 'local_hospital',
    color: 'green-6',
    action: () => openSGK()
  },
  {
    id: 'settings',
    title: 'Ayarlar',
    description: 'Uygulama ayarlarını aç',
    icon: 'settings',
    color: 'grey-6',
    shortcut: 'Ctrl+,',
    action: () => openSettings()
  },
  {
    id: 'dev-tools',
    title: 'Geliştirici Araçları',
    description: 'Tarayıcı geliştirici araçlarını aç',
    icon: 'code',
    color: 'orange-6',
    shortcut: 'F12',
    action: () => openDevTools()
  },
  {
    id: 'reload',
    title: 'Sayfayı Yenile',
    description: 'Aktif sekmeyi yenile',
    icon: 'refresh',
    color: 'blue-6',
    shortcut: 'F5',
    action: () => reloadPage()
  },
  {
    id: 'fullscreen',
    title: 'Tam Ekran',
    description: 'Tam ekran moduna geç',
    icon: 'fullscreen',
    color: 'purple-6',
    shortcut: 'F11',
    action: () => toggleFullscreen()
  }
])

const filteredCommands = computed(() => {
  if (!searchQuery.value) return commands.value
  
  const query = searchQuery.value.toLowerCase()
  return commands.value.filter(cmd => 
    cmd.title.toLowerCase().includes(query) ||
    cmd.description.toLowerCase().includes(query)
  )
})

const show = async () => {
  isVisible.value = true
  selectedIndex.value = 0
  searchQuery.value = ''
  
  await nextTick()
  commandInput.value?.focus()
}

const hide = () => {
  isVisible.value = false
}

const onHide = () => {
  searchQuery.value = ''
  selectedIndex.value = 0
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredCommands.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (filteredCommands.value[selectedIndex.value]) {
        executeCommand(filteredCommands.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      hide()
      break
  }
}

const executeCommand = (command: Command) => {
  hide()
  command.action()
  $q.notify({
    message: `${command.title} komutu çalıştırıldı`,
    type: 'positive',
    position: 'top-right',
    timeout: 2000
  })
}

// Command Actions
const openNewTab = () => {
  // Tab store'dan yeni tab aç
  console.log('Yeni tab açılıyor...')
}

const openEDevlet = () => {
  // e-Devlet sayfasını aç
  console.log('e-Devlet açılıyor...')
}

const openSGK = () => {
  // SGK sayfasını aç
  console.log('SGK açılıyor...')
}

const openSettings = () => {
  // Ayarlar sayfasını aç
  console.log('Ayarlar açılıyor...')
}

const openDevTools = () => {
  // Electron dev tools aç
  if (window.electronAPI) {
    window.electronAPI.openDevTools()
  }
}

const reloadPage = () => {
  // Aktif sekmeyi yenile
  console.log('Sayfa yenileniyor...')
}

const toggleFullscreen = () => {
  // Tam ekran toggle
  if (window.electronAPI) {
    window.electronAPI.toggleFullscreen()
  }
}

// Global keyboard shortcuts
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'P') {
    event.preventDefault()
    show()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>
.command-palette-dialog {
  .q-dialog__inner {
    padding-top: 10vh;
  }
}

.command-palette-card {
  width: 600px;
  max-width: 90vw;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.command-input-section {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.command-input {
  font-size: 16px;
  
  :deep(.q-field__control) {
    height: 48px;
  }
  
  :deep(.q-field__native) {
    font-weight: 500;
  }
}

.command-results-section {
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}

.command-list {
  padding: 8px;
}

.command-item {
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  
  &:hover, &.selected {
    background: rgba(25, 118, 210, 0.1);
    border-left: 3px solid var(--q-primary);
  }
  
  .command-title {
    font-weight: 600;
    font-size: 14px;
  }
  
  .command-description {
    font-size: 12px;
    opacity: 0.7;
  }
}

.shortcut-chip {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.6;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  
  p {
    margin-top: 16px;
    font-size: 14px;
  }
}

// Dark mode adjustments
.body--dark {
  .command-palette-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .command-input-section {
    background: rgba(255, 255, 255, 0.03);
  }
}
</style> 