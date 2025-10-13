<template>
  <div class="row q-col-gutter-md">
    <!-- İlk Satır -->
    <div class="col-12 col-md-6">
      <q-card class="dashboard-charts__card">
        <q-card-section>
          <div class="text-h6">{{ t('dashboard.charts.workStatusDistribution') }}</div>
          <div class="dashboard-charts__container">
            <Pie :data="workStatusData" :options="pieChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6">
      <q-card class="dashboard-charts__card">
        <q-card-section>
          <div class="text-h6">{{ t('dashboard.charts.weeklyWorkTrend') }}</div>
          <div class="dashboard-charts__container">
            <Line :data="weeklyTrendData" :options="lineChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- İkinci Satır -->
    <div class="col-12">
      <q-card class="dashboard-charts__card dashboard-charts__card--horizontal">
        <q-card-section>
          <div class="text-h6">{{ t('dashboard.charts.processBasedWorkload') }}</div>
          <div class="dashboard-charts__container dashboard-charts__container--horizontal">
            <Bar :data="workloadByProcessData" :options="horizontalBarOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { Line, Pie, Bar } from 'vue-chartjs'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from 'src/stores/dashboard-store'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js'

// Composables
const { t } = useI18n()
const dashboardStore = useDashboardStore()

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  BarElement,
  Filler
)

const colors = {
  primary: '#2196F3',
  secondary: '#FF9800',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#00BCD4',
  background: 'rgba(255, 255, 255, 0.9)'
}

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: true,
    mode: 'nearest'
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: colors.background,
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#eee',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      animation: {
        duration: 0
      },
      enabled: true,
      external: null
    }
  }
}

// Computed properties from store
const workStatusData = computed(() => dashboardStore.chartData.workStatus)
const weeklyTrendData = computed(() => dashboardStore.chartData.weeklyTrend)
const workloadByProcessData = computed(() => dashboardStore.chartData.workloadByProcess)

const pieChartOptions = computed(() => ({
  ...commonOptions,
  cutout: '60%',
  plugins: {
    ...commonOptions.plugins,
    legend: {
      ...commonOptions.plugins.legend,
      position: 'bottom'
    }
  }
}))

const lineChartOptions = computed(() => ({
  ...commonOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#f0f0f0'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}))

const horizontalBarOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 10,
      right: 30,
      top: 10,
      bottom: 10
    }
  },
  interaction: {
    mode: 'nearest',
    intersect: false,
    axis: 'y'
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        font: {
          size: 11,
          family: "var(--font-primary)",
          weight: '500'
        },
        color: '#5f6368',
        boxWidth: 8,
        boxHeight: 8
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      titleColor: '#202124',
      bodyColor: '#5f6368',
      borderColor: '#e8eaed',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: {
        size: 13,
        weight: '600',
        family: "var(--font-primary)"
      },
      bodyFont: {
        size: 12,
        family: "var(--font-primary)"
      },
      displayColors: true,
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || ''
          const value = context.parsed.x || 0
          const processName = context.label || ''
          return `${processName} - ${label}: ${value} iş`
        }
      }
    }
  },
  scales: {
    x: {
      stacked: false,
      beginAtZero: true,
      max: 35,
      ticks: {
        stepSize: 5,
        font: {
          size: 11,
          family: "var(--font-primary)"
        },
        color: '#80868b',
        padding: 8
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.04)',
        lineWidth: 1,
        drawBorder: false,
        drawTicks: false
      },
      border: {
        display: false
      }
    },
    y: {
      stacked: false,
      ticks: {
        font: {
          size: 11.5,
          family: "var(--font-primary)",
          weight: '500'
        },
        color: '#3c4043',
        padding: 10,
        crossAlign: 'far',
        autoSkip: false
      },
      grid: {
        display: false,
        drawBorder: false
      },
      border: {
        display: false
      }
    }
  },
  barThickness: 16,
  categoryPercentage: 0.85,
  barPercentage: 0.75,
  borderRadius: 4,
  borderSkipped: false
}))
</script>

<style lang="sass" scoped>
.dashboard-charts
  &__card
    border-radius: 12px
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
    transition: all 0.3s ease
    
    &:hover
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
      transform: translateY(-2px)
    
    &--horizontal
      background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)
      border: 1px solid rgba(0, 0, 0, 0.06)
      
      .text-h6
        font-size: 15px
        font-weight: 600
        color: #202124
        letter-spacing: -0.2px
      
  &__container
    height: 300px
    position: relative
    margin-top: 16px
    
    &--horizontal
      height: 360px

// Mobile responsive
@media (max-width: 768px)
  .dashboard-charts
    &__container
      height: 250px
      
      &--horizontal
        height: 320px
</style>