<template>
  <q-menu
    class="page-tools"
    transition-show="jump-down"
    transition-hide="jump-up"
    :offset="[0, 8]"
  >
    <div class="page-tools__container">
      <!-- Arama Çubuğu -->
      <div class="page-tools__search">
        <div class="page-tools__search-input-wrapper">
          <q-icon name="bi-search" size="14px" class="q-mr-sm" />
          <input
            v-model="searchQuery"
            class="page-tools__search-input"
            placeholder="Sayfada ara..."
            @keyup.enter="handleSearch"
          />
          <div v-if="totalMatches > 0" class="page-tools__search-counter">
            {{ currentMatch }}/{{ totalMatches }}
          </div>
          <div class="page-tools__search-actions">
            <q-btn
              v-if="totalMatches > 0"
              flat
              round
              dense
              size="12px"
              icon="bi-chevron-up"
              @click="previousMatch"
              class="page-tools__nav-btn"
            />
            <q-btn
              v-if="totalMatches > 0"
              flat
              round
              dense
              size="12px"
              icon="bi-chevron-down"
              @click="nextMatch"
              class="page-tools__nav-btn"
            />
            <q-btn
              v-if="searchQuery"
              flat
              round
              dense
              size="12px"
              icon="bi-x-lg"
              @click="clearSearch"
              class="page-tools__clear-btn"
            />
          </div>
          
        </div>
        
      </div>

      <q-separator class="page-tools__separator" />

      <!-- Sekme Ayarları -->
      <div class="page-tools__section">
        <div class="page-tools__section-title">
          <q-icon name="bi-window-stack" size="16px" class="q-mr-sm" />
          Sekme Ayarları
        </div>
        <q-list padding class="page-tools__list">
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-plus-lg" size="16px" />
            </q-item-section>
            <q-item-section>Yeni Sekme</q-item-section>
            <q-item-section side>
              <div class="page-tools__shortcut">Ctrl+T</div>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-x-lg" size="16px" />
            </q-item-section>
            <q-item-section>Sekmeyi Kapat</q-item-section>
            <q-item-section side>
              <div class="page-tools__shortcut">Ctrl+W</div>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-arrow-counterclockwise" size="16px" />
            </q-item-section>
            <q-item-section>Sekmeyi Yenile</q-item-section>
            <q-item-section side>
              <div class="page-tools__shortcut">Ctrl+R</div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Görünüm -->
      <q-separator class="page-tools__separator" />
      <div class="page-tools__section">
        <div class="page-tools__section-title">
          <q-icon name="bi-display" size="16px" class="q-mr-sm" />
          Görünüm
        </div>
        <q-list padding class="page-tools__list">
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-fullscreen" size="16px" />
            </q-item-section>
            <q-item-section>Tam Ekran</q-item-section>
            <q-item-section side>
              <div class="page-tools__shortcut">F11</div>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="page-tools__item" @click="handleSplitViewToggle">
            <q-item-section avatar>
              <q-icon name="bi-layout-split" size="16px" />
            </q-item-section>
            <q-item-section>Bölünmüş Görünüm</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-zoom-in" size="16px" />
            </q-item-section>
            <q-item-section>Yakınlaştır</q-item-section>
            <q-item-section side>
              <div class="page-tools__shortcut">Ctrl++</div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Araçlar -->
      <q-separator class="page-tools__separator" />
      <div class="page-tools__section">
        <div class="page-tools__section-title">
          <q-icon name="bi-tools" size="16px" class="q-mr-sm" />
          Araçlar
        </div>
        <q-list padding class="page-tools__list">
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-gear" size="16px" />
            </q-item-section>
            <q-item-section>Ayarlar</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-keyboard" size="16px" />
            </q-item-section>
            <q-item-section>Klavye Kısayolları</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="page-tools__item">
            <q-item-section avatar>
              <q-icon name="bi-question-circle" size="16px" />
            </q-item-section>
            <q-item-section>Yardım ve Geri Bildirim</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useSplitViewStore } from 'src/stores/split-view-store'

// Split view store
const splitViewStore = useSplitViewStore()

// Arama state'leri
const searchQuery = ref('')
const currentMatch = ref(0)
const totalMatches = ref(0)
const matches = ref([])

// Arama işlemleri
const handleSearch = () => {
  if (!searchQuery.value) return
  clearHighlights()
  
  const searchText = searchQuery.value.toLowerCase()
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node = walker.nextNode()
  matches.value = []
  
  while (node !== null) {
    const nodeValue = node.nodeValue.toLowerCase()
    let index = nodeValue.indexOf(searchText)
    
    while (index !== -1) {
      matches.value.push({
        node,
        index
      })
      index = nodeValue.indexOf(searchText, index + 1)
    }
    node = walker.nextNode()
  }

  totalMatches.value = matches.value.length
  currentMatch.value = matches.value.length > 0 ? 1 : 0
  
  if (matches.value.length > 0) {
    highlightMatch(matches.value[0])
  }
}

// Vurgulama işlemleri
const clearHighlights = () => {
  const highlights = document.querySelectorAll('.page-tools__highlight')
  highlights.forEach(el => {
    const parent = el.parentNode
    parent.replaceChild(document.createTextNode(el.textContent), el)
    parent.normalize()
  })
}

const highlightMatch = (match) => {
  clearHighlights()
  const range = document.createRange()
  const span = document.createElement('span')
  span.className = 'page-tools__highlight'
  
  range.setStart(match.node, match.index)
  range.setEnd(match.node, match.index + searchQuery.value.length)
  range.surroundContents(span)
  
  span.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}

// Navigasyon
const nextMatch = () => {
  if (currentMatch.value < totalMatches.value) {
    currentMatch.value++
    highlightMatch(matches.value[currentMatch.value - 1])
  }
}

const previousMatch = () => {
  if (currentMatch.value > 1) {
    currentMatch.value--
    highlightMatch(matches.value[currentMatch.value - 1])
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  currentMatch.value = 0
  totalMatches.value = 0
  matches.value = []
  clearHighlights()
}

// Split view toggle handler
const handleSplitViewToggle = () => {
  splitViewStore.toggle()
}
</script>

<style lang="sass">
.page-tools
  &__container
    background: #fff
    border-radius: 8px
    min-width: 400px
    padding: 8px 0
    box-shadow: 0 2px 12px rgba(0,0,0,0.15)

  &__section
    padding: 4px 0

  &__section-title
    display: flex
    align-items: center
    padding: 8px 16px
    font-size: 12px
    font-weight: 500
    color: #5f6368
    letter-spacing: 0.25px

    .q-icon
      color: #5f6368
      opacity: 0.87

  &__list
    padding: 0

  &__item
    min-height: 36px
    padding: 0 16px
    font-size: 13px
    color: #202124
    border-radius: 0
    transition: all 0.2s ease

    .q-icon
      font-size: 16px
      color: #5f6368
      opacity: 0.87

    &:hover
      background: rgba(0, 0, 0, 0.04)
      .q-icon
        opacity: 1

  &__shortcut
    font-size: 11px
    color: #5f6368
    opacity: 0.8
    margin-left: 16px

  &__separator
    margin: 4px 0
    opacity: 0.1

  // Arama bölümü stilleri
  &__search
    padding: 8px 16px

  &__search-input-wrapper
    display: flex
    align-items: center
    background: rgba(0, 0, 0, 0.04)
    border-radius: 4px
    padding: 6px 8px
    transition: all 0.2s ease

    &:focus-within
      background: rgba(0, 0, 0, 0.06)
      .q-icon
        opacity: 1

    .q-icon
      color: #5f6368
      opacity: 0.87

  &__search-input
    flex: 1
    border: none
    background: transparent
    outline: none
    font-size: 13px
    color: #202124
    min-width: 150px
    max-width: 180px

    &::placeholder
      color: #5f6368
      opacity: 0.8

  &__search-counter
    font-size: 12px
    color: #5f6368
    opacity: 0.8
    margin: 0 8px
    min-width: 32px
    text-align: center

  &__search-actions
    display: flex
    align-items: center
    gap: 2px

  &__nav-btn,
  &__clear-btn
    width: 20px
    height: 20px
    .q-icon
      font-size: 14px
      color: #5f6368
      opacity: 0.87
    &:hover
      background: rgba(0, 0, 0, 0.04)
      .q-icon
        opacity: 1

  // Vurgulama stili
  &__highlight
    background: rgba(255, 213, 79, 0.4)
    border-radius: 2px
    padding: 0 2px
</style> 