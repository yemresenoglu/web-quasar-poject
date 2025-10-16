<template>
  <q-page class="index-page">
    <!-- Skeleton Loading State -->
    <template v-if="isLoading">
      <div class="row q-col-gutter-md q-mb-md">
        <div v-for="n in 4" :key="n" class="col-12 col-md-3">
          <q-card class="index-page__card">
            <q-card-section>
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="text" width="80%" height="40px" class="q-mt-sm" />
              <q-skeleton type="text" width="50%" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-card class="index-page__card q-mb-md">
            <q-card-section>
              <q-skeleton type="rect" height="300px" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card class="index-page__card">
            <q-card-section>
              <q-skeleton type="rect" height="600px" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>

    <!-- Actual Content -->
    <template v-else>
      <!-- Üst Bilgi Kartları -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-3">
          <q-card class="index-page__card">
            <q-card-section>
              <div class="text-subtitle2 index-page__logo-container">
                <img src="src/assets/logo.png" alt="Sompo Sigorta Logo" class="index-page__logo" />
                <span class="index-page__company-name"
                  >Sompo Sigorta | Sigortacılık Ürün ve Hizmetleri</span
                >
              </div>
              <div class="text-h4 q-mt-sm index-page__clock-time">{{ currentDateTime }}</div>
              <div class="text-caption">{{ currentDate }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="index-page__card">
            <q-card-section>
              <div class="text-subtitle2">{{ t('dashboard.pendingJobs') }}</div>
              <div class="text-h4 index-page__stat-number q-mt-sm">
                {{ summaryStats.pendingJobs }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="index-page__card">
            <q-card-section>
              <div class="text-subtitle2">{{ t('dashboard.myJobs') }}</div>
              <div class="text-h4 index-page__stat-number q-mt-sm">{{ summaryStats.myJobs }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="index-page__card">
            <q-card-section>
              <div class="text-subtitle2">{{ t('dashboard.sentJobs') }}</div>
              <div class="text-h4 index-page__stat-number q-mt-sm">{{ summaryStats.sentJobs }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <!-- Sol Taraf - Detaylı İş Sayıları ve Grafikler -->
        <div class="col-12 col-md-8">
          <!-- Detaylı İş Sayıları -->
          <q-card class="index-page__card q-mb-md">
            <q-card-section>
              <div class="text-h6">{{ t('dashboard.detailedJobCounts') }}</div>
              <div class="row q-col-gutter-md q-mt-sm">
                <div v-for="stat in processStats" :key="stat.id" class="col-12 col-md-4">
                  <div class="index-page__process-stat">
                    <div class="index-page__process-stat-header">
                      <i :class="stat.icon"></i>
                      <span class="index-page__process-stat-name">{{ stat.name }}</span>
                    </div>
                    <div class="index-page__process-stat-numbers">
                      <div class="index-page__stat-item index-page__stat-item--pending">
                        <div class="index-page__stat-icon-container">
                          <i class="bi bi-clock-history index-page__stat-icon"></i>
                        </div>
                        <span class="index-page__stat-label">{{ t('dashboard.pending') }}</span>
                        <span class="index-page__stat-value">{{ stat.pending }}</span>
                      </div>
                      <div class="index-page__stat-item index-page__stat-item--assigned">
                        <div class="index-page__stat-icon-container">
                          <i class="bi bi-person-check index-page__stat-icon"></i>
                        </div>
                        <span class="index-page__stat-label">{{ t('dashboard.assigned') }}</span>
                        <span class="index-page__stat-value">{{ stat.assigned }}</span>
                      </div>
                      <div class="index-page__stat-item index-page__stat-item--sent">
                        <div class="index-page__stat-icon-container">
                          <i class="bi bi-send index-page__stat-icon"></i>
                        </div>
                        <span class="index-page__stat-label">{{ t('dashboard.sent') }}</span>
                        <span class="index-page__stat-value">{{ stat.sent }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Grafikler -->
          <DashboardCharts />
        </div>

        <!-- Sağ Taraf - İş Durumu ve Duyurular -->
        <div class="col-12 col-md-4">
          <!-- İş Havuzları -->
          <q-card class="index-page__card q-mb-md">
            <q-card-section>
              <div class="text-h6">İş Havuzları</div>
              <div class="row q-col-gutter-md q-mt-sm">
                <div v-for="pool in jobPools" :key="pool.id" class="col-12 col-md-6">
                  <div class="index-page__job-pool-stat">
                    <div class="index-page__job-pool-stat-header">
                      <i :class="[pool.icon, pool.colorClass]"></i>
                      <span class="index-page__job-pool-stat-name">{{ pool.name }}</span>
                    </div>
                    <div class="index-page__job-pool-stat-numbers">
                      <div
                        class="index-page__job-pool-stat-item index-page__job-pool-stat-item--pending"
                      >
                        <div class="index-page__job-pool-stat-icon-container">
                          <i
                            :class="[pool.icon, pool.colorClass]"
                            class="index-page__job-pool-stat-icon"
                          ></i>
                        </div>
                        <span class="index-page__job-pool-stat-label">Toplam Dosya</span>
                        <span class="index-page__job-pool-stat-value">{{ pool.count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Duyurular -->
          <q-card class="index-page__card">
            <q-card-section>
              <div class="text-h6">{{ t('dashboard.announcements.title') }}</div>

              <!-- Empty State -->
              <div v-if="announcementList.length === 0" class="announcements-empty">
                <i class="bi bi-megaphone" style="font-size: 48px; color: grey"></i>
                <p class="announcements-empty__text">
                  {{ t('dashboard.announcements.noAnnouncements') }}
                </p>
              </div>

              <!-- Announcements List -->
              <div v-else class="announcements">
                <div
                  v-for="announcement in announcementList"
                  :key="announcement.id"
                  class="announcement"
                >
                  <div class="announcement__item">
                    <div class="announcement__header">
                      <div
                        class="announcement__icon"
                        :class="`announcement__icon--${announcement.category}`"
                      >
                        <i :class="announcement.icon" style="font-size: 16px"></i>
                      </div>
                      <div
                        class="announcement__priority"
                        :class="`announcement__priority--${announcement.priority}`"
                      >
                        {{ t(`dashboard.announcements.priorities.${announcement.priority}`) }}
                      </div>
                    </div>
                    <div class="announcement__content">
                      <h4 class="announcement__title">{{ announcement.title }}</h4>
                      <p
                        class="announcement__description"
                        :class="{ 'announcement__description--expanded': announcement.expanded }"
                      >
                        {{ announcement.description }}
                      </p>
                      <q-btn
                        v-if="announcement.description && announcement.description.length > 100"
                        flat
                        dense
                        size="sm"
                        :label="
                          announcement.expanded
                            ? t('dashboard.announcements.showLess')
                            : t('dashboard.announcements.readMore')
                        "
                        :aria-label="
                          announcement.expanded
                            ? t('dashboard.announcements.showLess')
                            : t('dashboard.announcements.readMore')
                        "
                        color="primary"
                        class="announcement__read-more"
                        @click="toggleAnnouncementExpand(announcement.id)"
                      />
                    </div>
                    <div class="announcement__footer">
                      <div class="announcement__date">
                        <i class="bi bi-calendar-event q-mr-xs" style="font-size: 12px"></i>
                        {{ announcement.date }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from 'src/stores/dashboard-store'
import { useUIStore } from 'src/stores/ui-store'
import { useAuthStore } from 'src/stores/auth-store'

// Lazy load DashboardCharts component for better performance
const DashboardCharts = defineAsyncComponent(() => import('src/components/DashboardCharts.vue'))

// Composables
const { t } = useI18n()
const dashboardStore = useDashboardStore()
const uiStore = useUIStore()
const authStore = useAuthStore()

// Loading state
const isLoading = ref(true)

// Computed properties from store
const currentDateTime = computed(() => dashboardStore.currentDateTime)
const currentDate = computed(() => dashboardStore.currentDate)
const processStats = computed(() => dashboardStore.processStats)
const announcementList = computed(() => dashboardStore.announcementList)
const summaryStats = computed(() => dashboardStore.summaryStats)

// İş Havuzları - Kullanıcının oluşturduğu sorgu listeleri (CSS Custom Properties ile)
const jobPools = computed(() => [
  {
    id: 'incelenecek-evraklar',
    name: 'İncelemeye Hazır Evraklı Dosyalar',
    count: 15,
    colorClass: 'job-pool-color--pending', // CSS class ile renk yönetimi
    icon: 'bi bi-file-earmark-check',
  },
  {
    id: 'odeme-yapilmamis',
    name: 'Ödeme Yapılmamış Dosyalar',
    count: 8,
    colorClass: 'job-pool-color--assigned', // CSS class ile renk yönetimi
    icon: 'bi bi-credit-card',
  },
  {
    id: 'eksik-belgeler',
    name: 'Eksik Belgeli Dosyalar',
    count: 12,
    colorClass: 'job-pool-color--sent', // CSS class ile renk yönetimi
    icon: 'bi bi-file-earmark-excel',
  },
  {
    id: 'onay-bekleyen',
    name: 'Onay Bekleyen Dosyalar',
    count: 6,
    colorClass: 'job-pool-color--pending', // CSS class ile renk yönetimi
    icon: 'bi bi-clock-history',
  },
  {
    id: 'arabuluculuk',
    name: 'Arabuluculuk Dosyaları',
    count: 4,
    colorClass: 'job-pool-color--assigned', // CSS class ile renk yönetimi
    icon: 'bi bi-people',
  },
  {
    id: 'yuksek-oncelik',
    name: 'Yüksek Öncelikli Dosyalar',
    count: 3,
    colorClass: 'job-pool-color--sent', // CSS class ile renk yönetimi
    icon: 'bi bi-exclamation-triangle',
  },
])

// Methods
const toggleAnnouncementExpand = (announcementId) => {
  const announcement = announcementList.value.find((a) => a.id === announcementId)
  if (announcement) {
    announcement.expanded = !announcement.expanded
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Önce zamanı güncelle
  dashboardStore.updateDateTime()

  // Önce session kontrolü yap
  await authStore.checkSession()

  // AuthStore'dan userOid'i al
  const userOid = authStore.user?.oid
  if (userOid) {
    console.log('🟢 Dashboard starting with userOid:', userOid)
    dashboardStore.startRealTimeUpdates(userOid)
  } else {
    console.warn('⚠️ UserOid not available for dashboard - starting with demo data')
    // Kullanıcı giriş yapmamış olsa bile demo verilerle dashboard'u başlat
    dashboardStore.startRealTimeUpdates('DEMO_USER')
  }

  // Simulate initial data loading
  setTimeout(() => {
    isLoading.value = false
  }, 800)

  // Test notification - Custom CSS'i görmek için
  setTimeout(() => {
    uiStore.showSuccess(t('dashboard.announcements.testNotification'))
  }, 1200)
})

onBeforeUnmount(() => {
  dashboardStore.stopRealTimeUpdates()
})
</script>

<style lang="sass" scoped>
.index-page
  padding: 16px

  &__card
    border-radius: 12px
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  &__logo-container
    display: flex
    align-items: center
    gap: 8px

  &__logo
    width: 24px
    height: 24px
    object-fit: contain

  &__company-name
    font-size: 12px
    font-weight: 500
    color: #5f6368
    line-height: 1.3

    // Mobile responsive
    @media (max-width: 768px)
      font-size: 11px
      line-height: 1.2
    transition: all 0.3s ease

    &:hover
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
      transform: translateY(-2px)

  &__clock-time
    font-family: var(--font-monospace)
    font-weight: 400
    color: #5f6368
    letter-spacing: -0.5px

  &__stat-number
    font-weight: 600
    color: #1976d2

  &__process-stat
    padding: 12px
    border-radius: 4px
    background: #ffffff
    border: 1px solid #e9ecef

  &__process-stat-header
    display: flex
    align-items: center
    margin-bottom: 16px

    i
      font-size: 18px
      color: #495057

  &__process-stat-name
    margin-left: 8px
    font-weight: 600
    font-size: 14px
    color: #495057

  &__process-stat-numbers
    display: flex
    justify-content: space-between
    gap: 8px

  &__stat-item
    text-align: center
    flex: 1
    padding: 8px
    border-radius: 8px
    background: transparent
    border: 1px solid #e9ecef
    display: flex
    flex-direction: column
    align-items: center
    gap: 4px
    position: relative

    &--pending
      background: transparent
      border-color: #e9ecef

    &--assigned
      background: transparent
      border-color: #e9ecef

    &--sent
      background: transparent
      border-color: #e9ecef

  &__stat-icon-container
    width: 24px
    height: 24px
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 2px

  &__stat-icon
    font-size: 12px

    .index-page__stat-item--pending &
      color: #FF9800

    .index-page__stat-item--assigned &
      color: #2196F3

    .index-page__stat-item--sent &
      color: #4CAF50

  &__stat-label
    display: block
    font-size: 11px
    color: #6c757d
    margin-bottom: 4px
    font-weight: 500

  &__stat-value
    display: block
    font-size: 16px
    font-weight: 600
    color: #495057

  // İş Havuzları - Detaylı İş Sayıları ile BİREBİR aynı CSS yapısı
  &__job-pool-stat
    padding: 12px
    border-radius: 4px
    background: #ffffff // Normal card background
    border: 1px solid #e9ecef

  &__job-pool-stat-header
    display: flex
    align-items: center
    margin-bottom: 16px

    i
      font-size: 18px
      color: #495057 // Detaylı İş Sayıları ile aynı icon color

  &__job-pool-stat-name
    margin-left: 8px
    font-weight: 600
    font-size: 14px
    color: #495057 // Normal text color

  &__job-pool-stat-numbers
    display: flex
    justify-content: space-between
    gap: 8px

  &__job-pool-stat-item
    text-align: center
    flex: 1
    padding: 8px
    border-radius: 8px
    background: transparent
    border: 1px solid #e9ecef
    display: flex
    flex-direction: column
    align-items: center
    gap: 4px
    position: relative

    &--pending
      background: transparent
      border-color: #e9ecef

    &--assigned
      background: transparent
      border-color: #e9ecef

    &--sent
      background: transparent
      border-color: #e9ecef

  &__job-pool-stat-icon-container
    width: 24px
    height: 24px
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 2px

  &__job-pool-stat-icon
    font-size: 12px

    .index-page__job-pool-stat-item--pending &
      color: #FF9800

    .index-page__job-pool-stat-item--assigned &
      color: #2196F3

    .index-page__job-pool-stat-item--sent &
      color: #4CAF50

  &__job-pool-stat-label
    display: block
    font-size: 11px
    color: #6c757d // Normal label color
    margin-bottom: 4px
    font-weight: 500

  &__job-pool-stat-value
    display: block
    font-size: 16px
    font-weight: 600
    color: #495057 // Normal value color

// Job Pool Color Classes - Chart renk paleti ile
.job-pool-color--pending
  color: #FF9800 !important

.job-pool-color--assigned
  color: #2196F3 !important

.job-pool-color--sent
  color: #4CAF50 !important

.announcements
  margin-top: 16px

.announcement
  &__item
    padding: 16px
    border-radius: 8px
    background: #f8f9fa
    border: 1px solid #e9ecef
    margin-bottom: 12px

    &:last-child
      margin-bottom: 0

  &__header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 12px

  &__icon
    width: 24px
    height: 24px
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center

    &--maintenance
      background: rgba(244, 67, 54, 0.1)
      color: #d32f2f

    &--security
      background: rgba(255, 152, 0, 0.1)
      color: #f57c00

    &--update
      background: rgba(76, 175, 80, 0.1)
      color: #388e3c

    &--info
      background: rgba(33, 150, 243, 0.1)
      color: #1976d2

  &__priority
    padding: 2px 6px
    border-radius: 8px
    font-size: 10px
    font-weight: 600

    &--high
      background: rgba(244, 67, 54, 0.15)
      color: #d32f2f

    &--medium
      background: rgba(255, 152, 0, 0.15)
      color: #f57c00

    &--low
      background: rgba(76, 175, 80, 0.15)
      color: #388e3c

  &__content
    margin-bottom: 12px

  &__title
    font-size: 14px
    font-weight: 600
    color: #202124
    margin: 0 0 6px 0
    line-height: 1.4

  &__description
    font-size: 12px
    color: #5f6368
    margin: 0
    line-height: 1.4
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical
    overflow: hidden

    &--expanded
      display: block
      -webkit-line-clamp: unset
      overflow: visible

  &__read-more
    margin-top: 8px
    font-size: 11px
    text-transform: none
    padding: 0
    min-height: auto

  &__footer
    display: flex
    justify-content: space-between
    align-items: center

  &__date
    display: flex
    align-items: center
    font-size: 11px

// Mobile responsive
@media (max-width: 768px)
  .dashboard
    padding: 12px

  // .status-grid utility class'i artık global utilities.scss'de tanımlı

  .process-stat__numbers
    flex-direction: column
    gap: 8px

  .announcement__item
    padding: 12px
</style>
