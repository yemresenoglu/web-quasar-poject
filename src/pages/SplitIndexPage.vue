<template>
  <q-page class="split-page">
    <div class="page-container">
      <div class="tabs-container">
        <div class="tabs-header">
          <div class="tabs-title">
            <q-icon name="bi-window-stack" size="20px" class="q-mr-sm" />
            Açık Sekmelerim
          </div>
        </div>

        <div class="tabs-scroll-area">
          <div class="tab-previews">
            <q-card 
              v-for="tab in tabs" 
              :key="tab.id" 
              class="preview-card"
              @click="handleTabClick(tab)"
            >
              <q-card-section class="preview-header">
                <div class="preview-title">
                  <q-icon :name="tab.icon" size="16px" class="q-mr-sm" />
                  {{ tab.title }}
                </div>
              </q-card-section>
              
              <q-card-section class="preview-content">
                <div class="preview-frame" :ref="'preview_' + tab.id">
                  <img :src="tab.preview" v-if="tab.preview" class="preview-image" />
                  <div v-else class="preview-placeholder">
                    <q-spinner color="grey-5" size="2em" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTabStore } from 'src/stores/tab-store'
import { useRouter, useRoute } from 'vue-router'
import html2canvas from 'html2canvas'

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()
const tabs = ref([])

// Karta tıklama işleyicisi
const handleTabClick = (tab) => {
  tabStore.setActiveTab(tab.id)
  router.push(tab.route)
}

// Belirli bir süre beklemek için yardımcı fonksiyon
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Sekmelerin görüntülerini güncelleme fonksiyonu
const updateTabPreviews = async () => {
  // Mevcut route'u kaydet
  const currentRoute = route.path

  // Tüm sekmeleri al ve preview özelliği ekle
  tabs.value = tabStore.tabs.map(tab => ({
    ...tab,
    preview: null
  }))

  // Her sekme için görüntü al
  for (const tab of tabs.value) {
    try {
      // Sekmenin route'una git
      await router.push(tab.route)
      // Sayfanın yüklenmesi için kısa bir süre bekle
      await wait(500)

      // router-view elementini bul
      const routerView = document.querySelector('.content-layout')
      if (routerView) {
        // Görüntüyü al
        const canvas = await html2canvas(routerView, {
          scale: 0.5, // Görüntüyü yarı boyuta küçült
          useCORS: true, // Cross-origin kaynakları kullan
          logging: false, // Konsol loglarını kapat
          backgroundColor: '#ffffff'
        })
        // Canvas'ı base64 formatına çevir
        tab.preview = canvas.toDataURL('image/jpeg', 0.8)
      }
    } catch (error) {
      console.error(`Preview alınamadı (${tab.title}):`, error)
    }
  }

  // Orijinal route'a geri dön
  await router.push(currentRoute)
}

// Sekme listesi değiştiğinde görüntüleri güncelle
watch(() => tabStore.tabs, updateTabPreviews, { deep: true })

// Sayfa yüklendiğinde ilk görüntüleri al
onMounted(() => {
  updateTabPreviews()
})
</script>

<style lang="sass">
.split-page
  padding: 24px
  background: #f9f9f9
  height: 100%

  .page-container
    height: 100%
    max-width: 1200px
    margin: 0 auto

  .tabs-container
    height: 100%
    display: flex
    flex-direction: column
    background: #fff
    border-radius: 12px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)

  .tabs-header
    padding: 16px 24px
    border-bottom: 1px solid rgba(0,0,0,0.06)

  .tabs-title
    font-size: 18px
    font-weight: 500
    color: #202124
    display: flex
    align-items: center

    .q-icon
      color: #5f6368
      opacity: 0.87

  .tabs-scroll-area
    height: calc(100% - 65px) // Header yüksekliğini çıkar
    background: #fafafa
    overflow-y: auto

  .tab-previews
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
    gap: 16px
    padding: 16px

  .preview-card
    background: #fff
    border-radius: 8px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    transition: all 0.2s ease
    cursor: pointer

    &:hover
      box-shadow: 0 4px 6px rgba(0,0,0,0.1)
      transform: translateY(-2px)

  .preview-header
    padding: 12px 16px
    border-bottom: 1px solid rgba(0,0,0,0.06)

  .preview-title
    display: flex
    align-items: center
    font-size: 14px
    font-weight: 500
    color: #5f6368

  .preview-content
    padding: 0
    aspect-ratio: 16/9
    overflow: hidden

  .preview-frame
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    background: #f5f5f5

  .preview-image
    width: 100%
    height: 100%
    object-fit: cover
    object-position: top

  .preview-placeholder
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    background: #fafafa
</style> 