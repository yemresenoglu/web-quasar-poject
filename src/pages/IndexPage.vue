<template>
  <q-page class="dashboard">
    <!-- Üst Bilgi Kartları -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section class="text-center">
            <div class="location-info">
              <q-icon name="bi-geo-alt" size="16px" class="q-mr-xs" color="primary" />
              <span class="text-subtitle2">{{ userLocation }}</span>
            </div>
            <div class="text-h6 q-mt-sm">{{ currentDateTime }}</div>
            <div class="text-subtitle2">{{ currentDate }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2">Bekleyen İşler</div>
            <div class="text-h4 text-primary q-mt-sm">24</div>
            <div class="text-caption text-grey">12 Acil / 12 Normal</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2">Günlük Tamamlanan</div>
            <div class="text-h4 text-positive q-mt-sm">18</div>
            <div class="text-caption text-grey">8 Hasar / 10 Müşteri</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2">Bekleyen Bildirimler</div>
            <div class="text-h4 text-negative q-mt-sm">7</div>
            <div class="text-caption text-grey">3 Önemli / 4 Normal</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Sol Taraf - İş Havuzu, Grafikler ve Bölgesel Dağılım -->
      <div class="col-12 col-md-8">
        <!-- İş Havuzu -->
        <q-card class="dashboard-card q-mb-md">
          <q-card-section>
            <div class="text-h6">İş Havuzu</div>
            <q-tabs
              v-model="activeTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
            >
              <q-tab name="pending" label="Bekleyen İşler" />
              <q-tab name="inProgress" label="Devam Eden" />
              <q-tab name="completed" label="Tamamlanan" />
            </q-tabs>

            <q-separator class="q-my-md" />

            <q-list separator>
              <q-item v-for="task in tasks" :key="task.id" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon :name="task.icon" :color="task.color" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ task.title }}</q-item-label>
                  <q-item-label caption>{{ task.description }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-badge :color="task.priority === 'Acil' ? 'negative' : 'grey'">
                    {{ task.priority }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Grafikler -->
        <DashboardCharts />

        <!-- Bölgesel Dağılım -->
        <q-card class="dashboard-card q-mt-md">
          <q-card-section>
            <div class="text-h6">Bölgesel Dağılım</div>
            <div class="row q-col-gutter-md q-mt-sm">
              <div v-for="location in locationStats" :key="location.region" class="col-12 col-md-4">
                <div class="location-stat-card">
                  <div class="location-stat-info">
                    <div class="location-stat-title">{{ location.region }}</div>
                    <div class="location-stat-count">{{ location.count }} aktif iş</div>
                  </div>
                  <q-circular-progress
                    :value="location.percentage"
                    size="50px"
                    :thickness="0.2"
                    color="primary"
                    track-color="grey-3"
                    class="q-ml-sm"
                  >
                    <div class="location-stat-percentage">{{ location.percentage }}%</div>
                  </q-circular-progress>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Sağ Taraf - Bildirimler ve Hızlı İşlemler -->
      <div class="col-12 col-md-4">
        <!-- Bildirimler -->
        <q-card class="dashboard-card q-mb-md">
          <q-card-section>
            <div class="text-h6">Bildirimler</div>
            <q-list separator>
              <q-item v-for="notification in notifications" :key="notification.id" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon :name="notification.icon" :color="notification.color" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ notification.title }}</q-item-label>
                  <q-item-label caption>{{ notification.time }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Hızlı İşlemler -->
        <q-card class="dashboard-card q-mb-md">
          <q-card-section>
            <div class="text-h6">Hızlı İşlemler</div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6" v-for="action in quickActions" :key="action.title">
                <q-btn 
                  :color="action.color" 
                  class="full-width"
                  :icon="action.icon"
                  :label="action.title"
                  no-caps
                  unelevated
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Performans Özeti -->
        <q-card class="dashboard-card q-mb-md">
          <q-card-section>
            <div class="text-h6">Performans Özeti</div>
            <div class="performance-stats q-mt-md">
              <div class="performance-item" v-for="(stat, index) in performanceStats" :key="index">
                <div class="performance-info">
                  <div class="performance-label">{{ stat.label }}</div>
                  <div class="performance-value">{{ stat.value }}</div>
                </div>
                <q-linear-progress
                  :value="stat.progress"
                  :color="stat.color"
                  class="q-mt-sm"
                  size="4px"
                  rounded
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Operasyon Özeti -->
        <q-card class="dashboard-card operation-card">
          <q-card-section class="operation-content">
            <div class="operation-header">
              <div class="operation-title">
                <q-icon name="bi-clipboard2-pulse" size="18px" class="q-mr-sm" color="primary"/>
                <span>Operasyon Durumu</span>
              </div>
              <q-btn-group flat>
                <q-btn flat dense size="sm" icon="bi-arrow-left" color="grey-7"/>
                <q-btn flat dense size="sm" icon="bi-arrow-right" color="grey-7"/>
              </q-btn-group>
            </div>
            
            <div class="operation-grid q-mt-md">
              <div v-for="(op, index) in operationStats" :key="index" class="operation-item">
                <q-icon :name="op.icon" :color="op.color" size="18px" class="q-mb-sm"/>
                <div class="operation-item-count">{{ op.count }}</div>
                <div class="operation-item-label">{{ op.label }}</div>
              </div>
            </div>

            <q-separator class="q-my-md"/>

            <div class="operation-footer">
              <div class="operation-status">
                <div class="status-item">
                  <q-icon name="bi-clock-history" size="14px" color="grey-7" class="q-mr-xs"/>
                  <span class="text-grey-7">Son güncelleme: 5 dk önce</span>
                </div>
                <div class="status-item q-ml-md">
                  <q-icon name="bi-activity" size="14px" color="positive" class="q-mr-xs"/>
                  <span class="text-positive">Sistem aktif</span>
                </div>
              </div>
              <q-btn flat dense color="primary" icon-right="bi-box-arrow-up-right" label="Detaylı Rapor" no-caps/>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DashboardCharts from 'src/components/DashboardCharts.vue'

const activeTab = ref('pending')
const currentDateTime = ref('')
const currentDate = ref('')
const userLocation = ref('Konum alınıyor...')

// Saat ve tarih güncelleme
const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleTimeString('tr-TR')
  currentDate.value = now.toLocaleDateString('tr-TR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=tr`
          )
          const data = await response.json()
          userLocation.value = data.address.city || data.address.town || data.address.county || data.address.state || 'Bilinmiyor'
        } catch (error) {
          console.error('Konum bilgisi alınırken hata oluştu:', error)
          userLocation.value = 'Konum alınamadı'
        }
      },
      () => {
        userLocation.value = 'Konum alınamadı'
      }
    )
  } else {
    userLocation.value = 'Konum servisi desteklenmiyor'
  }
}

let timer
onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
  getUserLocation()
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

// Örnek veriler
const tasks = [
  {
    id: 1,
    title: 'Trafik Kazası Hasarı',
    description: 'İstanbul/Kadıköy - 2 Araçlı Maddi Hasarlı Kaza',
    priority: 'Acil',
    icon: 'bi-car-front',
    color: 'red'
  },
  {
    id: 2,
    title: 'Müşteri Görüşmesi',
    description: 'Hasar Dosyası Güncelleme Talebi',
    priority: 'Normal',
    icon: 'bi-person',
    color: 'blue'
  },
  {
    id: 3,
    title: 'Eksper Raporu İnceleme',
            description: 'Hasar Sorgulama - Aktif',
    priority: 'Acil',
    icon: 'bi-file-text',
    color: 'orange'
  },
  {
    id: 4,
    title: 'Servis Anlaşması',
    description: 'Yeni Servis Başvurusu Değerlendirme',
    priority: 'Normal',
    icon: 'bi-tools',
    color: 'grey'
  }
]

const notifications = [
  {
    id: 1,
    title: 'Yeni Hasar Kaydı',
    time: '5 dakika önce',
    icon: 'bi-exclamation-triangle',
    color: 'red'
  },
  {
    id: 2,
    title: 'Eksper Raporu Hazır',
    time: '15 dakika önce',
    icon: 'bi-file-text',
    color: 'green'
  },
  {
    id: 3,
    title: 'Müşteri Mesajı',
    time: '1 saat önce',
    icon: 'bi-chat',
    color: 'blue'
  }
]

const quickActions = [
  {
    title: 'Yeni Hasar',
    icon: 'bi-plus-lg',
    color: 'primary'
  },
  {
    title: 'Eksper Ata',
    icon: 'bi-person-plus',
    color: 'secondary'
  },
  {
    title: 'Rapor Oluştur',
    icon: 'bi-file-text',
    color: 'accent'
  },
  {
    title: 'Servis Ara',
    icon: 'bi-tools',
    color: 'dark'
  }
]

// Konum verileri
const locationStats = [
  {
    region: 'İstanbul',
    count: 45,
    percentage: 35
  },
  {
    region: 'Ankara',
    count: 28,
    percentage: 22
  },
  {
    region: 'İzmir',
    count: 20,
    percentage: 16
  },
  {
    region: 'Bursa',
    count: 15,
    percentage: 12
  },
  {
    region: 'Antalya',
    count: 12,
    percentage: 9
  },
  {
    region: 'Diğer',
    count: 8,
    percentage: 6
  }
]

// Performans istatistikleri
const performanceStats = [
  {
    label: 'Ortalama Yanıt Süresi',
    value: '2.5 saat',
    progress: 0.85,
    color: 'primary'
  },
  {
    label: 'Müşteri Memnuniyeti',
    value: '92%',
    progress: 0.92,
    color: 'positive'
  },
  {
    label: 'Zamanında Tamamlama',
    value: '88%',
    progress: 0.88,
    color: 'secondary'
  },
  {
    label: 'Kaynak Kullanımı',
    value: '75%',
    progress: 0.75,
    color: 'accent'
  }
]

// Operasyon istatistikleri
const operationStats = [
  {
    icon: 'bi-file-earmark-text',
    color: 'primary',
    count: '156',
    label: 'Aktif Dosya'
  },
  {
    icon: 'bi-exclamation-triangle',
    color: 'negative',
    count: '23',
    label: 'Acil Hasar'
  },
  {
    icon: 'bi-person-lines-fill',
    color: 'secondary',
    count: '45',
    label: 'Eksper Atama'
  },
  {
    icon: 'bi-currency-dollar',
    color: 'positive',
    count: '89',
    label: 'Ödeme Onayı'
  },
  {
    icon: 'bi-briefcase',
    color: 'warning',
    count: '34',
    label: 'Rücu Takip'
  },
  {
    icon: 'bi-shield-check',
    color: 'info',
    count: '78',
    label: 'Poliçe Kontrol'
  }
]
</script>

<style lang="sass">
.dashboard
  width: 100%
  height: 100%
  background: #f9f9f9
  padding: 24px
  min-height: 100vh

  .dashboard-card
    background: #fff
    border-radius: 12px
    box-shadow: 0 1px 3px rgba(0,0,0,0.12)
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.06)
    &:hover
      box-shadow: 0 4px 8px rgba(0,0,0,0.1)

  .text-h6
    font-size: 16px
    font-weight: 500
    color: #202124
    margin: 0
    letter-spacing: 0.25px

  .text-h4
    font-weight: 500
    letter-spacing: 0.25px

  .text-subtitle2
    color: #424242
    font-size: 14px

  .text-caption
    color: #616161
    font-size: 12px

  .location-info
    .q-icon
      color: #1976d2
      opacity: 0.9

  .q-tab
    font-size: 14px
    font-weight: 500
    padding: 0 16px
    min-height: 36px
    color: #424242
    &--active
      color: #1976d2

  .q-item
    border-radius: 8px
    margin-bottom: 4px
    transition: all 0.2s ease
    &:hover
      background: rgba(25, 118, 210, 0.04)
    .q-icon
      font-size: 18px
      opacity: 0.8

  .q-badge
    font-size: 12px
    padding: 4px 8px
    font-weight: 500

  .location-stat-card
    background: #fff
    border-radius: 8px
    padding: 16px
    display: flex
    align-items: center
    justify-content: space-between
    transition: all 0.2s ease
    border: 1px solid rgba(0,0,0,0.06)
    &:hover
      box-shadow: 0 2px 4px rgba(0,0,0,0.1)

    .location-stat-title
      font-size: 14px
      font-weight: 500
      color: #202124

    .location-stat-count
      font-size: 12px
      color: #616161
      margin-top: 4px

    .location-stat-percentage
      font-size: 12px
      font-weight: 500
      color: #1976d2

  .performance-stats
    .performance-item
      margin-bottom: 16px
      .performance-label
        font-size: 14px
        color: #424242
      .performance-value
        font-size: 16px
        font-weight: 500
        color: #202124
        margin-top: 4px

  .operation-card
    .operation-header
      display: flex
      justify-content: space-between
      align-items: center
      .operation-title
        display: flex
        align-items: center
        font-size: 16px
        font-weight: 500
        color: #202124
        .q-icon
          color: #1976d2
          opacity: 0.9

    .operation-grid
      display: grid
      grid-template-columns: repeat(2, 1fr)
      gap: 16px
      .operation-item
        text-align: center
        padding: 16px
        background: rgba(25, 118, 210, 0.04)
        border-radius: 8px
        transition: all 0.2s ease
        &:hover
          background: rgba(25, 118, 210, 0.08)
        .operation-item-count
          font-size: 24px
          font-weight: 500
          color: #202124
          margin: 8px 0
        .operation-item-label
          font-size: 12px
          color: #616161

    .operation-footer
      display: flex
      justify-content: space-between
      align-items: center
      .operation-status
        display: flex
        align-items: center
        .status-item
          display: flex
          align-items: center
          font-size: 12px

  .q-btn
    border-radius: 8px
    font-weight: 500
    transition: all 0.2s ease
    &.q-btn--unelevated
      &:hover
        box-shadow: 0 2px 4px rgba(0,0,0,0.1)
        transform: translateY(-1px)
</style>
