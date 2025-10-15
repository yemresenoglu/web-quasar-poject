/**
 * Mock data for HasarDosyaArabulucu page
 * Comprehensive mock data for all form sections
 */

// ===== DOSYA ÖZET BİLGİLERİ MOCK DATA =====
export const mockDosyaOzetData = {
  // Ana dosya bilgileri
  dosyaNo: '2025311003010',
  magdurNo: '2',
  policeNo: '311000144377772',
  
  // Sigortalı bilgileri
  sigortaliAdSoyad: 'YAVUZ BÜLENT TÜRELİ',
  sigortaliKusurOrani: '75%',
  sigortaliPlaka: '06HO8413',
  
  // Mağdur bilgileri
  magdurAdSoyad: 'MEHTAP ÇİFTCİ',
  magdurAracPlaka: '50AAA22',
  
  // Hasar bilgileri
  hasarNedeni: 'DEĞER KAYBI',
  altHasarNedeni: 'DEĞER KAYBI',
  altBrans: 'TRAFİK',
  hasarTarihi: '04/05/2023 11:21',
  ihbarTarihi: '04/07/2025 11:22'
}

// ===== İHBAR VEREN KİŞİ BİLGİLERİ MOCK DATA =====
export const mockIhbarVerenData = {
  yakinlikDerecesi: 'Sigortalı',
  ihbarYapanAdSoyad: 'YAVUZ BÜLENT TÜRELİ',
  gsm: '(545) 734 51 74',
  eposta: 'yavuz.tureli@email.com'
}

// ===== DEĞER KAYBI ARABULUCULUK MOCK DATA =====
export const mockDegerKaybiData = {
  // Teklif edilen tutarlar
  teklifEdilenTutar: 45000,
  vekaletTutari: 5000,
  
  // Anlaşma bilgileri
  anlasmaYapilacakIslem: '',
  anlasmaDurum: 'Anlaşma sağlandı',
  
  // Revize tutarları
  talepEdilenRevizeTutar: 48000,
  onaylananRevizeTutar: 46000,
  
  // Anlaşma sağlanan tutarlar
  anlasmaSaglananTutar: 43000,
  anlasmaSaglananVekaletTutari: 4500
}

// ===== EVRAK BİLGİLERİ MOCK DATA =====
export const mockEvrakData = [
  {
    id: 1,
    evrakAdi: 'Kaza Tespit Tutanağı',
    evrakBelgeDurum: 'Alındı',
    tarih: '15.01.2024',
    aciklama: 'Trafik kazası tespit tutanağı'
  },
  {
    id: 2,
    evrakAdi: 'Ruhsat Fotokopisi',
    evrakBelgeDurum: 'Bekleniyor',
    tarih: '-',
    aciklama: 'Araç ruhsat fotokopisi'
  },
  {
    id: 3,
    evrakAdi: 'Ehliyet Fotokopisi',
    evrakBelgeDurum: 'Alındı',
    tarih: '16.01.2024',
    aciklama: 'Sürücü ehliyet fotokopisi'
  },
  {
    id: 4,
    evrakAdi: 'Ekspertiz Raporu',
    evrakBelgeDurum: 'Bekleniyor',
    tarih: '-',
    aciklama: 'Araç ekspertiz raporu'
  },
  {
    id: 5,
    evrakAdi: 'Fotoğraf',
    evrakBelgeDurum: 'Alındı',
    tarih: '17.01.2024',
    aciklama: 'Hasar fotoğrafları'
  }
]

// ===== EVRAK TİPLERİ SEÇENEKLERİ (Talep Edilebilir Evrak Listesi) =====
export const getTalepEdilebilirEvrakListesi = () => {
  return [
    {
      id: 'KTT',
      name: 'Kaza Tespit Tutanağı',
      description: 'Trafik kazası tespit tutanağı',
      required: true,
      category: 'Temel Evraklar'
    },
    {
      id: 'RF',
      name: 'Ruhsat Fotokopisi',
      description: 'Araç ruhsat fotokopisi',
      required: true,
      category: 'Araç Evrakları'
    },
    {
      id: 'EF',
      name: 'Ehliyet Fotokopisi',
      description: 'Sürücü ehliyet fotokopisi',
      required: true,
      category: 'Sürücü Evrakları'
    },
    {
      id: 'ER',
      name: 'Ekspertiz Raporu',
      description: 'Araç ekspertiz raporu',
      required: false,
      category: 'Teknik Evraklar'
    },
    {
      id: 'TF',
      name: 'Tamir Faturası',
      description: 'Tamir işlemi faturası',
      required: false,
      category: 'Mali Evraklar'
    },
    {
      id: 'FOT',
      name: 'Fotoğraf',
      description: 'Hasar fotoğrafları',
      required: true,
      category: 'Görsel Evraklar'
    },
    {
      id: 'TRAFIK',
      name: 'Trafik Raporu',
      description: 'Trafik polisi raporu',
      required: false,
      category: 'Resmi Evraklar'
    },
    {
      id: 'SAGLIK',
      name: 'Sağlık Raporu',
      description: 'Yaralanma durumu raporu',
      required: false,
      category: 'Sağlık Evrakları'
    },
    {
      id: 'DIGER',
      name: 'Diğer',
      description: 'Diğer evraklar',
      required: false,
      category: 'Genel'
    }
  ]
}

// ===== ANLAŞMA İŞLEM SEÇENEKLERİ =====
export const getAnlasmaYapilacakIslemListesi = () => {
  return [
    {
      id: 'ANLASTIM',
      name: 'Anlaştım',
      description: 'Anlaşma sağlandı',
      category: 'Anlaşma Durumu'
    },
    {
      id: 'ANLASMADIM',
      name: 'Anlaşmadım',
      description: 'Anlaşma sağlanamadı',
      category: 'Anlaşma Durumu'
    },
    {
      id: 'ULASAMADIM',
      name: 'Ulaşamadım',
      description: 'Kişiye ulaşılamadı',
      category: 'Anlaşma Durumu'
    }
  ]
}

// ===== ESKİ FORMAT (Geriye uyumluluk için) =====
export const evrakOptions = getTalepEdilebilirEvrakListesi().map(item => item.name)
export const anlasmaIslemOptions = getAnlasmaYapilacakIslemListesi().map(item => item.name)

// ===== TAM DOSYA VERİSİ (TÜM BÖLÜMLERİ BİRLEŞTİRİLMİŞ) =====
export const mockFullFileData = {
  // Dosya özet bilgileri
  ...mockDosyaOzetData,
  
  // İhbar veren kişi bilgileri
  ihbarVeren: mockIhbarVerenData,
  
  // Değer kaybı arabuluculuk bilgileri
  degerKaybi: mockDegerKaybiData,
  
  // Evrak listesi
  evrakList: mockEvrakData
}

// ===== DOSYA NUMARASINA GÖRE VERİ GETİRME FONKSİYONU =====
export const getMockFileData = (dosyaNo) => {
  // Dosya numarasına göre farklı veriler döndür
  const fileVariations = {
    '2025311003010': {
      ...mockFullFileData,
      dosyaNo: '2025311003010',
      magdurNo: '2',
      sigortaliAdSoyad: 'YAVUZ BÜLENT TÜRELİ',
      magdurAdSoyad: 'MEHTAP ÇİFTCİ'
    },
    '2025001000001': {
      ...mockFullFileData,
      dosyaNo: '2025001000001',
      magdurNo: '1',
      sigortaliAdSoyad: 'AHMET YILMAZ',
      magdurAdSoyad: 'FATMA DEMİR',
      policeNo: '311000144377773',
      sigortaliPlaka: '34ABC123',
      magdurAracPlaka: '06XYZ789',
      degerKaybi: {
        ...mockDegerKaybiData,
        teklifEdilenTutar: 35000,
        vekaletTutari: 4000,
        anlasmaSaglananTutar: 32000,
        anlasmaYapilacakIslem: '',
        anlasmaDurum: 'Anlaşma sağlanamadı'
      }
    },
    '2025001000002': {
      ...mockFullFileData,
      dosyaNo: '2025001000002',
      magdurNo: '1',
      sigortaliAdSoyad: 'MEHMET KAYA',
      magdurAdSoyad: 'AYŞE ÖZKAN',
      policeNo: '311000144377774',
      sigortaliPlaka: '35DEF456',
      magdurAracPlaka: '07GHI012',
      degerKaybi: {
        ...mockDegerKaybiData,
        teklifEdilenTutar: 55000,
        vekaletTutari: 6000,
        anlasmaSaglananTutar: 50000,
        anlasmaYapilacakIslem: '',
        anlasmaDurum: 'Kişiye ulaşılamadı'
      }
    }
  }
  
  return fileVariations[dosyaNo] || {
    ...mockFullFileData,
    dosyaNo: dosyaNo || '2025311003010',
    magdurNo: '1'
  }
}

// ===== EVRAK EKLEME FONKSİYONU =====
export const addMockEvrak = (dosyaNo, evrakData) => {
  const newEvrak = {
    id: Date.now(),
    evrakAdi: evrakData.evrakAdi,
    evrakBelgeDurum: evrakData.evrakBelgeDurum || 'Bekleniyor',
    tarih: new Date().toLocaleDateString('tr-TR'),
    aciklama: evrakData.aciklama || ''
  }
  
  return {
    success: true,
    data: newEvrak
  }
}

// ===== DEĞER KAYBI GÜNCELLEME FONKSİYONU =====
export const updateMockDegerKaybi = (dosyaNo, degerKaybiData) => {
  return {
    success: true,
    data: {
      dosyaNo,
      ...degerKaybiData,
      updatedAt: new Date().toISOString()
    }
  }
}

// ===== API METHODLARI =====
export const getTalepEdilebilirEvrakListesiApi = () => {
  return {
    success: true,
    data: getTalepEdilebilirEvrakListesi()
  }
}

export const getAnlasmaYapilacakIslemListesiApi = () => {
  return {
    success: true,
    data: getAnlasmaYapilacakIslemListesi()
  }
}

// ===== API RESPONSE FORMATLARI =====
export const getMockApiResponse = (endpoint, data) => {
  switch (endpoint) {
    case 'getFileData':
      return {
        success: true,
        data: getMockFileData(data.dosyaNo)
      }
    
    case 'addEvrak':
      return addMockEvrak(data.dosyaNo, data.evrakData)
    
    case 'updateDegerKaybi':
      return updateMockDegerKaybi(data.dosyaNo, data.degerKaybiData)
    
    case 'getTalepEdilebilirEvrakListesi':
      return getTalepEdilebilirEvrakListesiApi()
    
    case 'getAnlasmaYapilacakIslemListesi':
      return getAnlasmaYapilacakIslemListesiApi()
    
    default:
      return {
        success: false,
        error: 'Endpoint not found'
      }
  }
}

// ===== DEFAULT EXPORT =====
export default {
  mockDosyaOzetData,
  mockIhbarVerenData,
  mockDegerKaybiData,
  mockEvrakData,
  evrakOptions,
  anlasmaIslemOptions,
  mockFullFileData,
  getMockFileData,
  addMockEvrak,
  updateMockDegerKaybi,
  getMockApiResponse,
  // Yeni API methodları
  getTalepEdilebilirEvrakListesi,
  getAnlasmaYapilacakIslemListesi,
  getTalepEdilebilirEvrakListesiApi,
  getAnlasmaYapilacakIslemListesiApi
}
