// Hasar Mock Data
// Hasar dosyaları, evraklar ve hasar işlemleri için mock veriler

export const mockHasarData = {
  // Mock hasar dosya listesi
  hasarDosyalari: [
    {
      id: 'HD001',
      dosyaNo: '2025311003010',
      magdurNo: '1',
      hasarTuru: 'Trafik Kazası',
      hasarTarihi: '2024-01-15',
      plaka: '34ABC123',
      ruhsatSahibi: 'Ahmet Yılmaz',
      eksperAdi: 'Mehmet Demir',
      durum: 'İnceleme Aşamasında',
      tutar: 45000.00,
      createdDate: '2024-01-15T09:30:00Z',
      updatedDate: '2024-01-15T14:20:00Z',
      priority: 'high'
    },
    {
      id: 'HD002',
      dosyaNo: '2025311003011',
      magdurNo: '2',
      hasarTuru: 'Yangın',
      hasarTarihi: '2024-01-14',
      plaka: '06XYZ789',
      ruhsatSahibi: 'Fatma Kaya',
      eksperAdi: 'Ali Özkan',
      durum: 'Eksper Atandı',
      tutar: 78000.00,
      createdDate: '2024-01-14T11:15:00Z',
      updatedDate: '2024-01-15T10:45:00Z',
      priority: 'medium'
    },
    {
      id: 'HD003',
      dosyaNo: '2025311003012',
      magdurNo: '3',
      hasarTuru: 'Çalıntı',
      hasarTarihi: '2024-01-13',
      plaka: '35DEF456',
      ruhsatSahibi: 'Mustafa Şahin',
      eksperAdi: 'Ayşe Yıldız',
      durum: 'Rapor Bekleniyor',
      tutar: 120000.00,
      createdDate: '2024-01-13T16:20:00Z',
      updatedDate: '2024-01-15T08:30:00Z',
      priority: 'low'
    },
    {
      id: 'HD004',
      dosyaNo: '2025311003013',
      magdurNo: '4',
      hasarTuru: 'Trafik Kazası',
      hasarTarihi: '2024-01-12',
      plaka: '07GHI789',
      ruhsatSahibi: 'Zeynep Arslan',
      eksperAdi: 'Hasan Çelik',
      durum: 'Ödeme Onaylandı',
      tutar: 32000.00,
      createdDate: '2024-01-12T13:45:00Z',
      updatedDate: '2024-01-15T12:00:00Z',
      priority: 'high'
    },
    {
      id: 'HD005',
      dosyaNo: '2025311003014',
      magdurNo: '5',
      hasarTuru: 'Dolu',
      hasarTarihi: '2024-01-11',
      plaka: '41JKL012',
      ruhsatSahibi: 'Emre Öztürk',
      eksperAdi: 'Selin Aydın',
      durum: 'Dosya Kapandı',
      tutar: 8500.00,
      createdDate: '2024-01-11T10:30:00Z',
      updatedDate: '2024-01-14T15:45:00Z',
      priority: 'low'
    }
  ],

  // Mock evrak listesi
  evraklar: [
    {
      id: 'EV001',
      dosyaNo: '2025311003010',
      evrakTuru: 'Poliçe',
      evrakAdi: 'Motorlu Araç Sigortası Poliçesi',
      dosyaBoyutu: '2.5 MB',
      yuklemeTarihi: '2024-01-15T09:45:00Z',
      yukleyen: 'Yunus Emre Şenoğlu',
      durum: 'Onaylandı',
      aciklama: 'Orijinal poliçe belgesi'
    },
    {
      id: 'EV002',
      dosyaNo: '2025311003010',
      evrakTuru: 'Rapor',
      evrakAdi: 'Trafik Kazası Raporu',
      dosyaBoyutu: '1.8 MB',
      yuklemeTarihi: '2024-01-15T11:20:00Z',
      yukleyen: 'Mehmet Demir',
      durum: 'İncelemede',
      aciklama: 'Emniyet raporu'
    },
    {
      id: 'EV003',
      dosyaNo: '2025311003011',
      evrakTuru: 'Fotoğraf',
      evrakAdi: 'Hasar Fotoğrafları',
      dosyaBoyutu: '15.2 MB',
      yuklemeTarihi: '2024-01-14T12:30:00Z',
      yukleyen: 'Ali Özkan',
      durum: 'Onaylandı',
      aciklama: 'Yangın hasar fotoğrafları'
    }
  ],

  // Mock hasar türleri
  hasarTurleri: [
    { id: 'HT001', name: 'Trafik Kazası', code: 'TRAFIK_KAZASI', color: 'red' },
    { id: 'HT002', name: 'Yangın', code: 'YANGIN', color: 'orange' },
    { id: 'HT003', name: 'Çalıntı', code: 'CALINTI', color: 'purple' },
    { id: 'HT004', name: 'Dolu', code: 'DOLU', color: 'blue' },
    { id: 'HT005', name: 'Sel', code: 'SEL', color: 'cyan' },
    { id: 'HT006', name: 'Hırsızlık', code: 'HIRSIZLIK', color: 'brown' }
  ],

  // Mock durumlar
  durumlar: [
    { id: 'D001', name: 'Yeni Dosya', code: 'YENI_DOSYA', color: 'grey' },
    { id: 'D002', name: 'İnceleme Aşamasında', code: 'INCELEME', color: 'blue' },
    { id: 'D003', name: 'Eksper Atandı', code: 'EKSPER_ATANDI', color: 'orange' },
    { id: 'D004', name: 'Rapor Bekleniyor', code: 'RAPOR_BEKLENIYOR', color: 'yellow' },
    { id: 'D005', name: 'Rapor Alındı', code: 'RAPOR_ALINDI', color: 'green' },
    { id: 'D006', name: 'Ödeme Onaylandı', code: 'ODEME_ONAYLANDI', color: 'positive' },
    { id: 'D007', name: 'Dosya Kapandı', code: 'DOSYA_KAPANDI', color: 'dark' }
  ],

  // Mock eksperler
  eksperler: [
    {
      id: 'EK001',
      adi: 'Mehmet Demir',
      uzmanlik: 'Trafik Kazası',
      telefon: '+90 532 111 22 33',
      email: 'mehmet.demir@eksper.com',
      aktif: true,
      degerlendirme: 4.8
    },
    {
      id: 'EK002',
      adi: 'Ali Özkan',
      uzmanlik: 'Yangın',
      telefon: '+90 533 444 55 66',
      email: 'ali.ozkan@eksper.com',
      aktif: true,
      degerlendirme: 4.6
    },
    {
      id: 'EK003',
      adi: 'Ayşe Yıldız',
      uzmanlik: 'Çalıntı',
      telefon: '+90 534 777 88 99',
      email: 'ayse.yildiz@eksper.com',
      aktif: true,
      degerlendirme: 4.9
    }
  ],

  // Mock istatistikler
  istatistikler: {
    toplamDosya: 1247,
    aktifDosya: 89,
    bekleyenDosya: 23,
    tamamlananDosya: 1135,
    ortalamaTutar: 45230.50,
    toplamTutar: 56400000.00,
    aylikArtis: 12.5
  },

  // Mock arama filtreleri
  aramaFiltreleri: {
    tarihAraligi: {
      baslangic: '2024-01-01',
      bitis: '2024-01-31'
    },
    tutarAraligi: {
      min: 0,
      max: 500000
    },
    durumlar: ['İnceleme Aşamasında', 'Eksper Atandı', 'Rapor Bekleniyor'],
    hasarTurleri: ['Trafik Kazası', 'Yangın', 'Çalıntı'],
    eksperler: ['Mehmet Demir', 'Ali Özkan', 'Ayşe Yıldız']
  }
}

// Mock API response'ları
export const mockHasarResponses = {
  // Hasar dosya listesi başarılı response
  hasarDosyalariSuccess: {
    success: true,
    data: mockHasarData.hasarDosyalari,
    pagination: {
      page: 1,
      pageSize: 10,
      totalPages: 125,
      totalItems: 1247
    },
    status: 200
  },

  // Tek hasar dosyası başarılı response
  hasarDosyasiSuccess: {
    success: true,
    data: mockHasarData.hasarDosyalari[0],
    status: 200
  },

  // Evrak listesi başarılı response
  evraklarSuccess: {
    success: true,
    data: mockHasarData.evraklar,
    status: 200
  },

  // Evrak yükleme başarılı response
  evrakYuklemeSuccess: {
    success: true,
    data: {
      id: 'EV004',
      message: 'Evrak başarıyla yüklendi'
    },
    status: 200
  },

  // Hasar türleri başarılı response
  hasarTurleriSuccess: {
    success: true,
    data: mockHasarData.hasarTurleri,
    status: 200
  },

  // Durumlar başarılı response
  durumlarSuccess: {
    success: true,
    data: mockHasarData.durumlar,
    status: 200
  },

  // Eksperler başarılı response
  eksperlerSuccess: {
    success: true,
    data: mockHasarData.eksperler,
    status: 200
  },

  // İstatistikler başarılı response
  istatistiklerSuccess: {
    success: true,
    data: mockHasarData.istatistikler,
    status: 200
  },

  // Hata response'ları
  hasarDosyasiNotFound: {
    success: false,
    error: {
      code: 'DOSYA_NOT_FOUND',
      message: 'Hasar dosyası bulunamadı'
    },
    status: 404
  },

  evrakYuklemeError: {
    success: false,
    error: {
      code: 'EVRAK_YUKLEME_ERROR',
      message: 'Evrak yüklenirken hata oluştu'
    },
    status: 500
  },

  yetkiError: {
    success: false,
    error: {
      code: 'INSUFFICIENT_PERMISSIONS',
      message: 'Bu işlem için yetkiniz bulunmamaktadır'
    },
    status: 403
  }
}

// Mock validation fonksiyonları
export const mockHasarValidations = {
  // Dosya numarası validation
  validateDosyaNo: (dosyaNo) => {
    if (!dosyaNo || dosyaNo.trim().length < 10) {
      return { valid: false, message: 'Dosya numarası en az 10 karakter olmalıdır' }
    }
    if (!/^\d{13}$/.test(dosyaNo)) {
      return { valid: false, message: 'Dosya numarası 13 rakamdan oluşmalıdır' }
    }
    return { valid: true }
  },

  // Mağdur numarası validation
  validateMagdurNo: (magdurNo) => {
    if (!magdurNo || magdurNo.trim().length === 0) {
      return { valid: false, message: 'Mağdur numarası gereklidir' }
    }
    if (!/^\d+$/.test(magdurNo)) {
      return { valid: false, message: 'Mağdur numarası sadece rakam içermelidir' }
    }
    return { valid: true }
  },

  // Tutar validation
  validateTutar: (tutar) => {
    if (!tutar || tutar <= 0) {
      return { valid: false, message: 'Tutar 0\'dan büyük olmalıdır' }
    }
    if (tutar > 1000000) {
      return { valid: false, message: 'Tutar 1.000.000 TL\'den küçük olmalıdır' }
    }
    return { valid: true }
  },

  // Evrak validation
  validateEvrak: (evrak) => {
    const errors = []
    
    if (!evrak.evrakTuru || evrak.evrakTuru.trim().length === 0) {
      errors.push('Evrak türü gereklidir')
    }
    
    if (!evrak.evrakAdi || evrak.evrakAdi.trim().length === 0) {
      errors.push('Evrak adı gereklidir')
    }
    
    if (!evrak.dosya || evrak.dosya.size === 0) {
      errors.push('Evrak dosyası gereklidir')
    }
    
    if (evrak.dosya && evrak.dosya.size > 10 * 1024 * 1024) { // 10MB
      errors.push('Dosya boyutu 10MB\'dan küçük olmalıdır')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Mock API simulation fonksiyonları
export const simulateHasarApi = {
  // Hasar dosyalarını getir
  fetchHasarDosyalari: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    let filteredData = [...mockHasarData.hasarDosyalari]
    
    // Filtreleme uygula
    if (filters.dosyaNo) {
      filteredData = filteredData.filter(d => d.dosyaNo.includes(filters.dosyaNo))
    }
    
    if (filters.durum) {
      filteredData = filteredData.filter(d => d.durum === filters.durum)
    }
    
    if (filters.hasarTuru) {
      filteredData = filteredData.filter(d => d.hasarTuru === filters.hasarTuru)
    }
    
    return {
      success: true,
      data: filteredData,
      pagination: {
        page: filters.page || 1,
        pageSize: filters.pageSize || 10,
        totalPages: Math.ceil(filteredData.length / (filters.pageSize || 10)),
        totalItems: filteredData.length
      },
      status: 200
    }
  },

  // Tek hasar dosyası getir
  fetchHasarDosyasi: async (dosyaNo) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const dosya = mockHasarData.hasarDosyalari.find(d => d.dosyaNo === dosyaNo)
    
    if (!dosya) {
      return mockHasarResponses.hasarDosyasiNotFound
    }
    
    return {
      success: true,
      data: dosya,
      status: 200
    }
  },

  // Evrakları getir
  fetchEvraklar: async (dosyaNo) => {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const evraklar = mockHasarData.evraklar.filter(e => e.dosyaNo === dosyaNo)
    
    return {
      success: true,
      data: evraklar,
      status: 200
    }
  },

  // Evrak yükle
  uploadEvrak: async (evrakData) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const validation = mockHasarValidations.validateEvrak(evrakData)
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        },
        status: 400
      }
    }
    
    return mockHasarResponses.evrakYuklemeSuccess
  },

  // İstatistikleri getir
  fetchIstatistikler: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockHasarResponses.istatistiklerSuccess
  },

  // Hasar türlerini getir
  fetchHasarTurleri: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockHasarResponses.hasarTurleriSuccess
  },

  // Durumları getir
  fetchDurumlar: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockHasarResponses.durumlarSuccess
  },

  // Eksperleri getir
  fetchEksperler: async () => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockHasarResponses.eksperlerSuccess
  }
}

// Helper functions
export const getMockHasarDosyalari = () => mockHasarData.hasarDosyalari
export const getMockEvraklar = () => mockHasarData.evraklar
export const getMockHasarTurleri = () => mockHasarData.hasarTurleri
export const getMockDurumlar = () => mockHasarData.durumlar
export const getMockEksperler = () => mockHasarData.eksperler
export const getMockIstatistikler = () => mockHasarData.istatistikler

// API response formatında mock data
export const getMockHasarApiResponse = (endpoint) => {
  switch (endpoint) {
    case 'dosyalar':
      return mockHasarResponses.hasarDosyalariSuccess
    case 'evraklar':
      return mockHasarResponses.evraklarSuccess
    case 'istatistikler':
      return mockHasarResponses.istatistiklerSuccess
    case 'hasarTurleri':
      return mockHasarResponses.hasarTurleriSuccess
    case 'durumlar':
      return mockHasarResponses.durumlarSuccess
    case 'eksperler':
      return mockHasarResponses.eksperlerSuccess
    default:
      return mockHasarResponses.hasarDosyalariSuccess
  }
}

export default mockHasarData
