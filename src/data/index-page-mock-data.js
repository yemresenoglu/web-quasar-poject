// IndexPage Mock Data
// Dashboard için gerçekçi test verileri

export const mockDashboardData = {
  // Kullanıcı konumu
  userLocation: 'İstanbul, Türkiye',

  // Process Statistics - Detaylı iş sayıları
  processStats: [
    {
      id: 'hasar-kayit',
      name: 'Hasar Kayıt',
      icon: 'bi bi-file-earmark-text',
      pending: 12,
      assigned: 8,
      sent: 15
    },
    {
      id: 'hasar-inceleme',
      name: 'Hasar İnceleme',
      icon: 'bi bi-search',
      pending: 7,
      assigned: 5,
      sent: 23
    },
    {
      id: 'hasar-onay',
      name: 'Hasar Onay',
      icon: 'bi bi-check-circle',
      pending: 4,
      assigned: 3,
      sent: 18
    },
    {
      id: 'hasar-odeme',
      name: 'Hasar Ödeme',
      icon: 'bi bi-credit-card',
      pending: 6,
      assigned: 4,
      sent: 12
    }
  ],

  // Job Status Statistics - İş durumu istatistikleri
  jobStatusStats: [
    {
      label: 'Bekleyen',
      count: 29,
      color: 'warning',
      icon: 'bi bi-clock'
    },
    {
      label: 'Üzerimdeki',
      count: 20,
      color: 'info',
      icon: 'bi bi-person-check'
    },
    {
      label: 'Gönderdiğim',
      count: 68,
      color: 'positive',
      icon: 'bi bi-send'
    }
  ],

  // Announcements - Duyurular
  announcementList: [
    {
      id: 1,
      title: 'Sistem Bakımı Duyurusu',
      description: 'Sistem bakımı nedeniyle 15 Aralık 2024 tarihinde 02:00-06:00 saatleri arasında hizmet kesintisi yaşanacaktır. Bu süre zarfında sisteme erişim sağlanamayacaktır.',
      date: '10.12.2024',
      priority: 'high',
      category: 'maintenance',
      icon: 'bi bi-tools',
      expanded: false
    },
    {
      id: 2,
      title: 'Yeni Özellik: E-İmza Desteği',
      description: 'Artık hasar dosyalarınızı elektronik imza ile imzalayabilirsiniz. Bu özellik sayesinde daha hızlı ve güvenli işlem yapabilirsiniz.',
      date: '08.12.2024',
      priority: 'medium',
      category: 'update',
      icon: 'bi bi-pen',
      expanded: false
    },
    {
      id: 3,
      title: 'Güvenlik Güncellemesi',
      description: 'Sistem güvenliğini artırmak için yeni güvenlik önlemleri eklendi. Lütfen şifrenizi güncelleyin.',
      date: '05.12.2024',
      priority: 'high',
      category: 'security',
      icon: 'bi bi-shield-check',
      expanded: false
    },
    {
      id: 4,
      title: 'Yeni Rapor Formatları',
      description: 'Hasar raporları için yeni format seçenekleri eklendi. Daha detaylı ve görsel raporlar oluşturabilirsiniz.',
      date: '03.12.2024',
      priority: 'low',
      category: 'info',
      icon: 'bi bi-file-earmark-bar-graph',
      expanded: false
    }
  ],

  // Chart Data - Grafik verileri
  chartData: {
    // İş Durumu Dağılımı (Pie Chart)
    workStatus: {
      labels: ['Bekleyen', 'Üzerimdeki', 'Gönderdiğim'],
      datasets: [
        {
          data: [29, 20, 68],
          backgroundColor: [
            '#FF9800', // warning - Bekleyen
            '#2196F3', // info - Üzerimdeki
            '#4CAF50'  // positive - Gönderdiğim
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#fff'
        }
      ]
    },

    // Haftalık İş Trendi (Line Chart)
    weeklyTrend: {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [
        {
          label: 'Bekleyen',
          data: [12, 19, 15, 25, 22, 8, 5],
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FF9800',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Üzerimdeki',
          data: [8, 12, 18, 15, 20, 6, 4],
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2196F3',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Gönderdiğim',
          data: [15, 22, 18, 28, 25, 12, 8],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }
      ]
    },

    // Süreç Bazlı İş Yükü (Horizontal Bar Chart)
    workloadByProcess: {
      labels: [
        'Hasar Kayıt',
        'Hasar İnceleme',
        'Hasar Onay',
        'Hasar Ödeme',
        'Hasar Kapanış'
      ],
      datasets: [
        {
          label: 'Bekleyen',
          data: [12, 7, 4, 6, 2],
          backgroundColor: '#FF9800',
          borderColor: '#FF9800',
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false
        },
        {
          label: 'Üzerimdeki',
          data: [8, 5, 3, 4, 1],
          backgroundColor: '#2196F3',
          borderColor: '#2196F3',
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false
        },
        {
          label: 'Gönderdiğim',
          data: [15, 23, 18, 12, 8],
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    }
  }
}

// Mock data'yı kullanmak için yardımcı fonksiyonlar
export const getMockDashboardData = () => {
  return {
    ...mockDashboardData,
    // Tarih ve saat bilgilerini dinamik olarak güncelle
    currentDateTime: new Date().toLocaleTimeString('tr-TR'),
    currentDate: new Date().toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}

// API response formatında mock data
export const getMockApiResponse = () => {
  return {
    success: true,
    data: {
      userLocation: mockDashboardData.userLocation,
      processStats: mockDashboardData.processStats,
      jobStatusStats: mockDashboardData.jobStatusStats,
      announcements: mockDashboardData.announcementList,
      charts: mockDashboardData.chartData
    },
    status: 200
  }
}

// Test için rastgele veri üretici
export const generateRandomStats = () => {
  const processes = ['Hasar Kayıt', 'Hasar İnceleme', 'Hasar Onay', 'Hasar Ödeme']
  
  return processes.map((name, index) => ({
    id: `process-${index + 1}`,
    name,
    icon: `bi bi-${['file-earmark-text', 'search', 'check-circle', 'credit-card'][index]}`,
    pending: Math.floor(Math.random() * 20) + 1,
    assigned: Math.floor(Math.random() * 15) + 1,
    sent: Math.floor(Math.random() * 30) + 10
  }))
}

export default mockDashboardData
