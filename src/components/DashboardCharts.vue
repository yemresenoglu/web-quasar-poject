<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-card class="dashboard-card">
        <q-card-section>
          <div class="text-h6">İş Durumu Dağılımı</div>
          <div class="chart-container">
            <Pie :data="workStatusData" :options="pieChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6">
      <q-card class="dashboard-card">
        <q-card-section>
          <div class="text-h6">Haftalık İş Trendi</div>
          <div class="chart-container">
            <Line :data="weeklyTrendData" :options="lineChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6">
      <q-card class="dashboard-card">
        <q-card-section>
          <div class="text-h6">Aylık Performans</div>
          <div class="chart-container">
            <Bar :data="monthlyPerformanceData" :options="barChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-6">
      <q-card class="dashboard-card">
        <q-card-section>
          <div class="text-h6">Müşteri Memnuniyeti Trendi</div>
          <div class="chart-container">
            <Line :data="satisfactionTrendData" :options="areaChartOptions" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { Line, Pie, Bar } from 'vue-chartjs'
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
    intersect: false,
    mode: 'index'
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
      usePointStyle: true
    }
  }
}

const workStatusData = {
  labels: ['Bekleyen', 'Devam Eden', 'Tamamlanan'],
  datasets: [{
    data: [24, 15, 18],
    backgroundColor: [colors.warning, colors.primary, colors.success],
    borderWidth: 0,
    hoverOffset: 4
  }]
}

const weeklyTrendData = {
  labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  datasets: [{
    label: 'Tamamlanan İşler',
    data: [12, 15, 18, 14, 20, 8, 5],
    borderColor: colors.primary,
    tension: 0.4,
    borderWidth: 2,
    pointBackgroundColor: colors.primary,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }, {
    label: 'Yeni İşler',
    data: [10, 13, 16, 12, 18, 6, 8],
    borderColor: colors.secondary,
    tension: 0.4,
    borderWidth: 2,
    pointBackgroundColor: colors.secondary,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}

const monthlyPerformanceData = {
  labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
  datasets: [{
    label: 'Hedef',
    data: [80, 85, 90, 85, 95, 100],
    backgroundColor: colors.info + '40',
    borderColor: colors.info,
    borderWidth: 2,
    borderRadius: 4,
    barThickness: 12
  }, {
    label: 'Gerçekleşen',
    data: [75, 82, 88, 83, 92, 97],
    backgroundColor: colors.success + '40',
    borderColor: colors.success,
    borderWidth: 2,
    borderRadius: 4,
    barThickness: 12
  }]
}

const satisfactionTrendData = {
  labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
  datasets: [{
    label: 'Memnuniyet Oranı',
    data: [85, 88, 87, 90, 92, 95],
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: colors.success,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}

const pieChartOptions = {
  ...commonOptions,
  cutout: '60%',
  plugins: {
    ...commonOptions.plugins,
    legend: {
      ...commonOptions.plugins.legend,
      position: 'bottom'
    }
  }
}

const lineChartOptions = {
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
}

const barChartOptions = {
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
}

const areaChartOptions = {
  ...commonOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#f0f0f0'
      },
      min: 60,
      max: 100
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}
</script>

<style lang="sass">
.chart-container
  height: 300px
  position: relative
  margin-top: 16px
  transition: all 0.3s ease

.dashboard-card
  background: #fff
  border-radius: 12px
  box-shadow: 0 1px 3px rgba(0,0,0,0.12)
  transition: all 0.3s ease
  overflow: hidden

  &:hover
    box-shadow: 0 4px 8px rgba(0,0,0,0.16)
    transform: translateY(-2px)

  .text-h6
    font-size: 16px
    font-weight: 500
    color: #202124
    margin-bottom: 8px
    padding: 0 8px
</style> 