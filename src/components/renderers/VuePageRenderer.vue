<template>
  <div class="vue-page-renderer">
    <component 
      :is="pageComponent" 
      v-if="pageComponent"
      @update:title="updateTitle"
    />
    <div v-else class="error-state">
      <q-icon name="error_outline" size="3rem" color="negative" />
      <h3>Sayfa Bulunamadı</h3>
      <p>{{ tab.component || tab.route }} komponenti yüklenemedi.</p>
      <q-btn
        color="primary"
        @click="reloadPage"
        icon="refresh"
        label="Tekrar Dene"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { defineAsyncComponent } from 'vue'

interface Props {
  tab: {
    id: string
    component?: string
    route?: string
    title: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:title': [title: string]
  'update:loading': [loading: boolean]
}>()

const isLoading = ref(true)
const loadError = ref(false)

const pageComponent = computed(() => {
  if (!props.tab.component) return null
  
  try {
    // Dynamic component loading based on component name
    return defineAsyncComponent({
      loader: () => {
        emit('update:loading', true)
        
        // Map component names to actual imports
        const componentMap: Record<string, () => Promise<any>> = {
          'EmptyPage': () => import('../../pages/EmptyPage.vue'),
          'IndexPage': () => import('../../pages/IndexPage.vue'),
          'MenuPage': () => import('../../pages/MenuPage.vue'),
          'TabsPage': () => import('../../pages/TabsPage.vue'),
          'PerformancePage': () => import('../../pages/PerformancePage.vue'),
          'HasarBildirimiPage': () => import('../../pages/HasarBildirimiPage.vue'),
          'HasarDosyalariPage': () => import('../../pages/HasarDosyalariPage.vue'),
          'HasarTakibiPage': () => import('../../pages/HasarTakibiPage.vue'),
          'WebAppPage': () => import('../../pages/WebAppPage.vue'),
          'SplitIndexPage': () => import('../../pages/SplitIndexPage.vue')
        }
        
        const loader = componentMap[props.tab.component]
        if (!loader) {
          throw new Error(`Component ${props.tab.component} not found`)
        }
        
        return loader()
      },
      loadingComponent: {
        template: `
          <div class="loading-container">
            <q-spinner size="2rem" color="primary" />
            <p>Sayfa yükleniyor...</p>
          </div>
        `
      },
      errorComponent: {
        template: `
          <div class="error-container">
            <q-icon name="error_outline" size="3rem" color="negative" />
            <h3>Yükleme Hatası</h3>
            <p>Sayfa yüklenirken hata oluştu.</p>
          </div>
        `
      },
      delay: 200,
      timeout: 10000,
      onError: (error) => {
        console.error('Component loading error:', error)
        loadError.value = true
        emit('update:loading', false)
      }
    })
  } catch (error) {
    console.error('Component creation error:', error)
    loadError.value = true
    emit('update:loading', false)
    return null
  }
})

const updateTitle = (newTitle: string) => {
  emit('update:title', newTitle)
}

const reloadPage = () => {
  loadError.value = false
  isLoading.value = true
  // Force component reload
  window.location.reload()
}

watch(() => props.tab.component, () => {
  isLoading.value = true
  loadError.value = false
}, { immediate: true })

onMounted(() => {
  emit('update:loading', false)
})
</script>

<style lang="scss" scoped>
.vue-page-renderer {
  height: 100%;
  overflow: auto;
}

.error-state,
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
  
  h3 {
    margin: 16px 0;
    color: var(--q-negative);
  }
  
  p {
    margin-bottom: 24px;
    opacity: 0.7;
  }
}

.loading-container {
  gap: 16px;
  
  p {
    margin: 0;
    opacity: 0.8;
  }
}
</style> 