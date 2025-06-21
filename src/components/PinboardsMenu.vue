<template>
  <q-menu
    ref="menuRef"
    class="pinboards-menu"
    transition-show="fade"
    transition-hide="fade"
    anchor="top right"
    self="center left"
    :offset="[20, 0]"
    :transition-duration="100"
  >
    <div class="pinboards-menu__container">
      <!-- Sabit header -->
      <div class="pinboards-menu__header">
        <div class="pinboards-menu__title">{{ $t('pinboards.title') }}</div>
        <q-btn 
          flat 
          round 
          dense 
          icon="bi-x-lg" 
          class="pinboards-menu__close" 
          @click="closeMenu"
        />
      </div>
      <div class="pinboards-menu__divider"></div>
      
      <q-scroll-area class="pinboards-menu__scroll" visible>
        <div class="pinboards-menu__content">
          <!-- Pinboards Bölümü -->
          <div class="pinboards-menu__section">
            <div class="pinboards-menu__section-header">
              <div class="pinboards-menu__section-title">{{ $t('pinboards.myPinboards') }}</div>
              <q-btn 
                flat 
                round 
                dense 
                icon="bi-plus-lg" 
                size="sm"
                class="pinboards-menu__add-btn"
                @click="showAddDialog = true"
              >
                <q-tooltip>{{ $t('pinboards.addPinboard') }}</q-tooltip>
              </q-btn>
            </div>
            <div class="pinboards-menu__list">
              <q-item 
                v-for="pinboard in filteredPinboards" 
                :key="pinboard.id"
                clickable 
                v-ripple 
                class="pinboards-menu__item"
                :class="{ 'pinboards-menu__item--pinned': pinboard.pinned }"
                @click="viewPinboard(pinboard)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon 
                    :name="getPinboardIcon(pinboard.type)" 
                    size="16px" 
                    :color="getPinboardColor(pinboard.priority)"
                  />
                </q-item-section>
                <q-item-section>
                  <div class="pinboards-menu__item-title">{{ pinboard.title }}</div>
                  <div class="pinboards-menu__item-subtitle">
                    {{ pinboard.damageFileNumber ? `Dosya: ${pinboard.damageFileNumber}` : $t(`pinboards.types.${pinboard.type}`) }}
                  </div>
                  <div class="pinboards-menu__item-meta">
                    <span class="pinboards-menu__priority" :class="`pinboards-menu__priority--${pinboard.priority}`">
                      {{ $t(`pinboards.priority.${pinboard.priority}`) }}
                    </span>
                    <span class="pinboards-menu__time">{{ formatTimeAgo(pinboard.createdAt) }}</span>
                  </div>
                </q-item-section>
                <q-item-section side>
                  <div class="pinboards-menu__actions">
                    <q-btn
                      flat
                      round
                      dense
                      :icon="pinboard.pinned ? 'bi-pin-fill' : 'bi-pin'"
                      size="sm"
                      class="pinboards-menu__pin-btn"
                      @click.stop="togglePin(pinboard.id)"
                    >
                      <q-tooltip>{{ pinboard.pinned ? $t('pinboards.unpin') : $t('pinboards.pin') }}</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="bi-trash"
                      size="sm"
                      class="pinboards-menu__delete-btn"
                      @click.stop="removePinboard(pinboard.id)"
                    >
                      <q-tooltip>{{ $t('pinboards.delete') }}</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              
              <!-- Empty State -->
              <div v-if="filteredPinboards.length === 0" class="pinboards-menu__empty">
                <q-icon name="bi-pin-angle" size="32px" class="q-mb-sm" />
                <div class="pinboards-menu__empty-title">{{ $t('pinboards.empty.title') }}</div>
                <div class="pinboards-menu__empty-subtitle">{{ $t('pinboards.empty.subtitle') }}</div>
              </div>
            </div>
          </div>

          <div class="pinboards-menu__divider"></div>

          <!-- Kategoriler Bölümü -->
          <div class="pinboards-menu__section">
            <div class="pinboards-menu__section-header">
              <div class="pinboards-menu__section-title">{{ $t('pinboards.categories') }}</div>
            </div>
            <div class="pinboards-menu__list">
              <q-item 
                v-for="category in categories" 
                :key="category.id"
                clickable 
                v-ripple 
                class="pinboards-menu__item"
                :class="{ 'pinboards-menu__item--active': activeCategory === category.id }"
                @click="setCategory(category.id)"
              >
                <q-item-section avatar class="q-pr-none">
                  <q-icon :name="category.icon" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="pinboards-menu__item-title">{{ $t(`pinboards.filters.${category.id}`) }}</div>
                </q-item-section>
                <q-item-section side>
                  <div class="pinboards-menu__category-count">{{ getCategoryCount(category.id) }}</div>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="pinboards-menu__divider"></div>

          <!-- Ayarlar Bölümü -->
          <div class="pinboards-menu__section">
            <div class="pinboards-menu__section-header">
              <div class="pinboards-menu__section-title">{{ $t('pinboards.settings') }}</div>
            </div>
            <div class="pinboards-menu__list">
              <q-item clickable v-ripple class="pinboards-menu__item">
                <q-item-section>
                  <div class="pinboards-menu__item-title">{{ $t('pinboards.autoSave') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="autoSave" dense class="pinboards-menu__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="pinboards-menu__item">
                <q-item-section>
                  <div class="pinboards-menu__item-title">{{ $t('pinboards.showInSidebar') }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="showInSidebar" dense class="pinboards-menu__toggle" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="pinboards-menu__item" @click="exportPinboards">
                <q-item-section avatar class="q-pr-none">
                  <q-icon name="bi-download" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="pinboards-menu__item-title">{{ $t('pinboards.export') }}</div>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>

    <!-- Add Pinboard Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card class="pinboards-add-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('pinboards.dialog.add.title') }}</div>
          <q-space />
          <q-btn icon="bi-x-lg" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- Title Input -->
          <q-input
            v-model="newPinboard.title"
            :label="$t('pinboards.dialog.add.titleLabel')"
            outlined
            class="q-mb-md"
            :placeholder="getPlaceholderForType(newPinboard.type, 'title')"
          />
          
          <!-- Damage File Number - Only show for insurance-related types -->
          <q-input
            v-if="isInsuranceType(newPinboard.type)"
            v-model="newPinboard.damageFileNumber"
            label="Hasar Dosya Numarası"
            outlined
            class="q-mb-md"
            placeholder="Örn: HSR-2024-001234"
          />
          
          <!-- Content Input -->
          <q-input
            v-model="newPinboard.content"
            :label="$t('pinboards.dialog.add.contentLabel')"
            type="textarea"
            rows="4"
            outlined
            class="q-mb-md"
            :placeholder="getPlaceholderForType(newPinboard.type, 'content')"
          />
          
          <!-- Type and Priority Row -->
          <div class="row q-gutter-md q-mb-md">
            <q-select
              v-model="newPinboard.type"
              :options="typeOptions"
              :label="$t('pinboards.dialog.add.typeLabel')"
              outlined
              emit-value
              map-options
              class="col"
              @update:model-value="onTypeChange"
            />
            <q-select
              v-model="newPinboard.priority"
              :options="priorityOptions"
              :label="$t('pinboards.dialog.add.priorityLabel')"
              outlined
              emit-value
              map-options
              class="col"
            />
          </div>
          
          <!-- Additional Options -->
          <div class="row items-center">
            <q-checkbox
              v-model="newPinboard.pinned"
              :label="$t('pinboards.dialog.add.pinnedField')"
              class="q-mr-md"
            />
            <q-space />
            <div class="text-caption text-grey-6">
              {{ getTypeDescription(newPinboard.type) }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup />
          <q-btn 
            color="primary" 
            :label="$t('actions.add')" 
            @click="addPinboard"
            :disable="!newPinboard.title || !newPinboard.content"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- View Pinboard Dialog -->
    <q-dialog v-model="showViewDialog" maximized>
      <q-card class="pinboards-view-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedPinboard?.title }}</div>
          <q-space />
          <q-btn icon="bi-pencil" flat round dense @click="editPinboard" class="q-mr-sm">
            <q-tooltip>{{ $t('actions.edit') }}</q-tooltip>
          </q-btn>
          <q-btn icon="bi-x-lg" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="pinboards-view-content">
            <pre>{{ selectedPinboard?.content }}</pre>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePinboardsStore } from 'src/stores/pinboards-store'

const pinboardsStore = usePinboardsStore()

const menuRef = ref(null)
const showAddDialog = ref(false)
const showViewDialog = ref(false)
const selectedPinboard = ref(null)
const autoSave = ref(true)
const showInSidebar = ref(true)
const activeCategory = ref('all')

// New pinboard form
const newPinboard = ref({
  title: '',
  damageFileNumber: '',
  content: '',
  type: 'note',
  priority: 'normal',
  pinned: false
})

// Type options for selection - Hybrid approach with general and insurance-specific types
const typeOptions = [
  { label: 'Not', value: 'note' },
  { label: 'Görev', value: 'task' },
  { label: 'Hatırlatıcı', value: 'reminder' },
  { label: 'Bağlantı', value: 'link' },
  { label: 'Hasar Notu', value: 'damage_note' },
  { label: 'Eksper Görevi', value: 'expert_task' },
  { label: 'Müşteri Hatırlatıcısı', value: 'customer_reminder' },
  { label: 'Ödeme Takibi', value: 'payment_tracking' },
  { label: 'Belge Talebi', value: 'document_request' },
  { label: 'Servis Koordinasyonu', value: 'service_coordination' }
]

// Priority options
const priorityOptions = [
  { label: 'Acil', value: 'urgent' },
  { label: 'Yüksek', value: 'high' },
  { label: 'Normal', value: 'normal' },
  { label: 'Düşük', value: 'low' }
]

// Categories - Updated with hybrid approach
const categories = ref([
  { id: 'all', icon: 'bi-list' },
  { id: 'notes', icon: 'bi-file-text' },
  { id: 'tasks', icon: 'bi-check-square' },
  { id: 'reminders', icon: 'bi-alarm' },
  { id: 'links', icon: 'bi-link-45deg' },
  { id: 'damage_notes', icon: 'bi-exclamation-triangle' },
  { id: 'expert_tasks', icon: 'bi-person-badge' },
  { id: 'customer_reminders', icon: 'bi-person-check' },
  { id: 'payment_tracking', icon: 'bi-credit-card' },
  { id: 'document_requests', icon: 'bi-file-earmark-arrow-up' },
  { id: 'service_coordination', icon: 'bi-tools' },
  { id: 'pinned', icon: 'bi-pin-fill' },
  { id: 'urgent', icon: 'bi-exclamation-triangle-fill' },
  { id: 'high', icon: 'bi-arrow-up-circle' }
])

// Computed
const pinboards = computed(() => pinboardsStore.pinboards)

const filteredPinboards = computed(() => {
  let filtered = pinboards.value
  
  switch (activeCategory.value) {
    case 'notes':
      filtered = filtered.filter(p => p.type === 'note')
      break
    case 'tasks':
      filtered = filtered.filter(p => p.type === 'task')
      break
    case 'reminders':
      filtered = filtered.filter(p => p.type === 'reminder')
      break
    case 'links':
      filtered = filtered.filter(p => p.type === 'link')
      break
    case 'damage_notes':
      filtered = filtered.filter(p => p.type === 'damage_note')
      break
    case 'expert_tasks':
      filtered = filtered.filter(p => p.type === 'expert_task')
      break
    case 'customer_reminders':
      filtered = filtered.filter(p => p.type === 'customer_reminder')
      break
    case 'payment_tracking':
      filtered = filtered.filter(p => p.type === 'payment_tracking')
      break
    case 'document_requests':
      filtered = filtered.filter(p => p.type === 'document_request')
      break
    case 'service_coordination':
      filtered = filtered.filter(p => p.type === 'service_coordination')
      break
    case 'pinned':
      filtered = filtered.filter(p => p.pinned)
      break
    case 'urgent':
      filtered = filtered.filter(p => p.priority === 'urgent')
      break
    case 'high':
      filtered = filtered.filter(p => p.priority === 'high')
      break
  }
  
  return filtered.slice(0, 20) // Son 20 pinboard
})

// Methods
const closeMenu = () => {
  menuRef.value.hide()
}

const addPinboard = () => {
  pinboardsStore.addPinboard({
    title: newPinboard.value.title,
    damageFileNumber: newPinboard.value.damageFileNumber,
    content: newPinboard.value.content,
    type: newPinboard.value.type,
    priority: newPinboard.value.priority,
    pinned: newPinboard.value.pinned
  })
  
  // Reset form
  newPinboard.value = {
    title: '',
    damageFileNumber: '',
    content: '',
    type: 'note',
    priority: 'normal',
    pinned: false
  }
  
  showAddDialog.value = false
}

const viewPinboard = (pinboard) => {
  selectedPinboard.value = pinboard
  showViewDialog.value = true
  closeMenu()
}

const editPinboard = () => {
  // Edit functionality can be implemented later
  console.log('Edit pinboard:', selectedPinboard.value)
}

const removePinboard = (id) => {
  pinboardsStore.removePinboard(id)
}

const togglePin = (id) => {
  pinboardsStore.togglePin(id)
}

const setCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const getCategoryCount = (categoryId) => {
  switch (categoryId) {
    case 'all':
      return pinboards.value.length
    case 'notes':
      return pinboards.value.filter(p => p.type === 'note').length
    case 'tasks':
      return pinboards.value.filter(p => p.type === 'task').length
    case 'reminders':
      return pinboards.value.filter(p => p.type === 'reminder').length
    case 'links':
      return pinboards.value.filter(p => p.type === 'link').length
    case 'damage_notes':
      return pinboards.value.filter(p => p.type === 'damage_note').length
    case 'expert_tasks':
      return pinboards.value.filter(p => p.type === 'expert_task').length
    case 'customer_reminders':
      return pinboards.value.filter(p => p.type === 'customer_reminder').length
    case 'payment_tracking':
      return pinboards.value.filter(p => p.type === 'payment_tracking').length
    case 'document_requests':
      return pinboards.value.filter(p => p.type === 'document_request').length
    case 'service_coordination':
      return pinboards.value.filter(p => p.type === 'service_coordination').length
    case 'pinned':
      return pinboards.value.filter(p => p.pinned).length
    case 'urgent':
      return pinboards.value.filter(p => p.priority === 'urgent').length
    case 'high':
      return pinboards.value.filter(p => p.priority === 'high').length
    default:
      return 0
  }
}

const getPinboardIcon = (type) => {
  const iconMap = {
    note: 'bi-file-text',
    task: 'bi-check-square',
    reminder: 'bi-alarm',
    link: 'bi-link-45deg',
    damage_note: 'bi-exclamation-triangle',
    expert_task: 'bi-person-badge',
    customer_reminder: 'bi-person-check',
    payment_tracking: 'bi-credit-card',
    document_request: 'bi-file-earmark-arrow-up',
    service_coordination: 'bi-tools'
  }
  return iconMap[type] || 'bi-pin-angle'
}

const getPinboardColor = (priority) => {
  const colorMap = {
    urgent: 'red',
    high: 'orange',
    normal: 'blue',
    low: 'grey'
  }
  return colorMap[priority] || 'blue'
}

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes}dk önce`
  if (hours < 24) return `${hours}sa önce`
  if (days < 7) return `${days}g önce`
  
  return date.toLocaleDateString('tr-TR')
}

const exportPinboards = () => {
  pinboardsStore.exportPinboards()
  closeMenu()
}

const getPlaceholderForType = (type, field) => {
  const placeholders = {
    title: {
      note: 'Örn: Önemli toplantı notları',
      task: 'Örn: Rapor hazırla',
      reminder: 'Örn: Müşteri ile görüşme',
      link: 'Örn: Önemli doküman linki',
      damage_note: 'Örn: Eksper raporu bekleniyor',
      expert_task: 'Örn: Saha incelemesi yapılacak',
      customer_reminder: 'Örn: Müşteri ile iletişim kur',
      payment_tracking: 'Örn: Ödeme onayı bekliyor',
      document_request: 'Örn: Ekspertiz raporu talep et',
      service_coordination: 'Örn: Servis randevusu ayarla'
    },
    content: {
      note: 'Notunuzun detaylarını buraya yazın...',
      task: 'Görevin detaylarını ve adımlarını yazın...',
      reminder: 'Hatırlatıcının detaylarını yazın...',
      link: 'Link açıklaması ve notlarınızı yazın...',
      damage_note: 'Hasar detayları ve önemli notları yazın...',
      expert_task: 'Eksper görevinin detaylarını ve gereksinimlerini yazın...',
      customer_reminder: 'Müşteri ile ilgili hatırlatıcı detaylarını yazın...',
      payment_tracking: 'Ödeme durumu ve takip notlarını yazın...',
      document_request: 'Talep edilen belgelerin detaylarını yazın...',
      service_coordination: 'Servis koordinasyon detaylarını yazın...'
    }
  }
  return placeholders[field][type] || 'Detayları buraya yazın...'
}

const isInsuranceType = (type) => {
  const insuranceTypes = ['damage_note', 'expert_task', 'customer_reminder', 'payment_tracking', 'document_request', 'service_coordination']
  return insuranceTypes.includes(type)
}

const getTypeDescription = (type) => {
  const descriptions = {
    note: 'Genel notlar ve bilgiler için',
    task: 'Yapılacak işler ve görevler için',
    reminder: 'Hatırlatıcılar ve randevular için',
    link: 'Önemli bağlantılar ve kaynaklar için',
    damage_note: 'Hasar süreçleri ile ilgili notlar',
    expert_task: 'Eksper görevleri ve saha çalışmaları',
    customer_reminder: 'Müşteri iletişimi ve takibi',
    payment_tracking: 'Ödeme süreçleri ve takibi',
    document_request: 'Belge talepleri ve dokümanlar',
    service_coordination: 'Servis koordinasyonu ve randevular'
  }
  return descriptions[type] || 'Genel kullanım için'
}

const onTypeChange = () => {
  // This method is called when the type changes
}
</script>

<style lang="sass">
.pinboards-menu
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

  &__add-btn
    color: #5f6368
    opacity: 0.87
    &:hover
      opacity: 1
      background: rgba(0,0,0,0.04)

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
    .pinboards-menu__item
      min-height: 64px
      padding: 12px 16px
      color: #666
      font-size: 14px
      border-left: 3px solid transparent
      transition: all 0.2s ease

      &--priority
        border-left-color: #f44336
        background: rgba(244, 67, 54, 0.04)

      &--active
        background: rgba(0,0,0,0.04)
        color: #202124

      .q-item__section--avatar
        min-width: 40px
        .q-icon
          opacity: 0.87

      .q-item__section--side
        min-width: 80px
        padding-left: 16px

      &:hover
        background: rgba(0,0,0,0.04)
        color: #202124

  &__item-title
    font-weight: 500
    margin-bottom: 4px
    line-height: 1.2

  &__item-subtitle
    font-size: 13px
    color: #5f6368
    opacity: 0.9
    margin-bottom: 4px
    line-height: 1.3

  &__item-meta
    display: flex
    align-items: center
    gap: 8px

  &__item-date
    font-size: 11px
    color: #5f6368
    opacity: 0.7

  &__item-actions
    display: flex
    align-items: center
    gap: 4px

  &__pin-btn
    color: #5f6368
    opacity: 0.6
    &--pinned
      color: #ff9800
      opacity: 1
    &:hover
      opacity: 1
      background: rgba(255, 152, 0, 0.1)

  &__delete-btn
    color: #5f6368
    opacity: 0.6
    &:hover
      opacity: 1
      background: rgba(244, 67, 54, 0.1)
      color: #f44336

  &__category-count
    background: rgba(0,0,0,0.1)
    border-radius: 12px
    padding: 2px 8px
    font-size: 11px
    color: #5f6368
    min-width: 20px
    text-align: center

  &__empty
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 32px 16px
    text-align: center
    color: #5f6368
    opacity: 0.7

  &__empty-title
    font-size: 14px
    font-weight: 500
    margin-bottom: 4px

  &__empty-subtitle
    font-size: 12px

.pinboards-add-dialog
  min-width: 500px
  max-width: 600px
  
  .q-card-section
    padding: 20px
    
  .q-card-actions
    padding: 16px 20px
    
  .text-h6
    color: #202124
    font-weight: 500
    
  .q-input
    .q-field__control
      border-radius: 8px
      
  .q-select
    .q-field__control
      border-radius: 8px
      
  .text-caption
    font-size: 12px
    line-height: 1.4

.pinboards-view-dialog
  .pinboards-view-content
    background: #f5f5f5
    border-radius: 8px
    padding: 16px
    margin-top: 16px
    
    pre
      white-space: pre-wrap
      word-wrap: break-word
      font-family: inherit
      margin: 0

.pinboards-menu__toggle.q-toggle
  .q-toggle__inner--truthy
    color: #9e9e9e !important
    .q-toggle__thumb:after
      background: #9e9e9e !important
  
  .q-toggle__track
    opacity: 0.3 !important
</style> 