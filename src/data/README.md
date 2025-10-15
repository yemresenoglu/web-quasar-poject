# Mock Data Kullanım Kılavuzu

Bu klasör IndexPage (Dashboard) için mock data dosyalarını içerir.

## Dosyalar

### `index-page-mock-data.js`
Ana mock data dosyası. Dashboard için gerekli tüm veri yapılarını içerir:

- **Process Statistics**: Detaylı iş sayıları
- **Job Status Statistics**: İş durumu istatistikleri  
- **Announcements**: Duyuru listesi
- **Chart Data**: Grafik verileri (Pie, Line, Bar charts)
- **User Location**: Kullanıcı konumu


## Kullanım

### 1. Temel Kullanım

```javascript
import { getMockDashboardData } from 'src/data/index-page-mock-data.js'

const mockData = getMockDashboardData()
console.log(mockData.processStats)
console.log(mockData.announcementList)
```

### 2. Dashboard Store'da Kullanım

```javascript
import { getMockDashboardData } from 'src/data/index-page-mock-data.js'

const fetchDashboardData = async () => {
  const mockData = getMockDashboardData()
  
  userLocation.value = mockData.userLocation
  processStats.value = mockData.processStats
  jobStatusStats.value = mockData.jobStatusStats
  announcementList.value = mockData.announcementList
  chartData.value = mockData.chartData
}
```

### 3. API Response Formatında

```javascript
import { getMockApiResponse } from 'src/data/index-page-mock-data.js'

const apiResponse = getMockApiResponse()
// { success: true, data: {...}, status: 200 }
```

## Veri Yapıları

### Process Statistics
```javascript
{
  id: 'hasar-kayit',
  name: 'Hasar Kayıt',
  icon: 'bi bi-file-earmark-text',
  pending: 12,
  assigned: 8,
  sent: 15
}
```

### Job Status Statistics
```javascript
{
  label: 'Bekleyen',
  count: 29,
  color: 'warning',
  icon: 'bi bi-clock'
}
// Diğer kategoriler: 'Üzerimdeki', 'Gönderdiğim'
```

### Announcements
```javascript
{
  id: 1,
  title: 'Sistem Bakımı Duyurusu',
  description: 'Bakım açıklaması...',
  date: '10.12.2024',
  priority: 'high',
  category: 'maintenance',
  icon: 'bi bi-tools',
  expanded: false
}
```

### Chart Data
```javascript
{
  workStatus: {
    labels: ['Bekleyen', 'Üzerimdeki', 'Gönderdiğim'],
    datasets: [{ data: [29, 20, 68], backgroundColor: [...] }]
  },
  weeklyTrend: { 
    labels: ['Bekleyen', 'Üzerimdeki', 'Gönderdiğim'] 
  },
  workloadByProcess: { 
    labels: ['Bekleyen', 'Üzerimdeki', 'Gönderdiğim'] 
  }
}
```

## Özellikler

- ✅ **Gerçekçi Veriler**: Gerçek dashboard'a uygun test verileri
- ✅ **Dinamik Tarih/Saat**: Otomatik güncellenen zaman bilgileri
- ✅ **Chart.js Uyumlu**: Grafik kütüphanesi ile uyumlu veri formatı
- ✅ **Rastgele Veri**: Test için dinamik veri üretimi
- ✅ **API Format**: Backend API response formatında mock data
- ✅ **Hata Yönetimi**: API hatalarında fallback olarak kullanım

## Geliştirme Ortamında Otomatik Kullanım

Dashboard store geliştirme ortamında (`NODE_ENV === 'development'`) otomatik olarak mock data kullanır. Production'da gerçek API çağrıları yapılır.

## Test

Mock data'yı test etmek için:

```javascript

getMockDashboardData() // Mock dashboard data'yı döndürür
```
