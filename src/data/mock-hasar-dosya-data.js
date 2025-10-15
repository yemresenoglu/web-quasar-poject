// Mock Hasar Dosya Data
// HasarDosyaSorgulaArabulucu.vue için test verileri

export const mockHasarDosyaData = [
  // Dosya 1: 2 mağdur
  {
    oid: "A1B2C3D4E5F",
    dosyaNo: "2025001000001",
    magdurNo: "1",
    policeNo: "311000144377772",
    sigortaliAdSoyad: "YAVUZ BÜLENT TÜRELİ",
    sigortaliPlaka: "06HO8413",
    sigortaliKusurOrani: "100%",
    magdurAdSoyad: "MEHTAP ÇİFTCİ",
    magdurAracPlaka: "50AAA22",
    hasarTarihi: "04/05/2023 11:21",
    ihbarTarihi: "04/07/2025 11:22",
    hasarYeri: "İstanbul, Beşiktaş",
    hasarSebebi: "Çarpışma",
    hasarTutari: 25000,
    durum: "Açık",
    altBrans: "TRAFİK",
    hasarNedeni: "DEĞER KAYBI"
  },
  {
    oid: "B2C3D4E5F6G",
    dosyaNo: "2025001000001",
    magdurNo: "2",
    policeNo: "311000144377772",
    sigortaliAdSoyad: "YAVUZ BÜLENT TÜRELİ",
    sigortaliPlaka: "06HO8413",
    magdurAdSoyad: "AHMET DEMİR",
    magdurAracPlaka: "34BB123",
    hasarTarihi: "04/05/2023 11:21",
    ihbarTarihi: "04/07/2025 11:22",
    hasarYeri: "İstanbul, Beşiktaş",
    hasarSebebi: "Çarpışma",
    hasarTutari: 15000,
    durum: "Açık",
    altBrans: "TRAFİK",
    hasarNedeni: "DEĞER KAYBI"
  },

  // Dosya 2: 1 mağdur
  {
    oid: "C3D4E5F6G7H",
    dosyaNo: "2025002000002",
    magdurNo: "1",
    policeNo: "311000155588883",
    sigortaliAdSoyad: "FATMA ÖZKAN",
    sigortaliPlaka: "35CC456",
    sigortaliKusurOrani: "50%",
    magdurAdSoyad: "MUSTAFA YILMAZ",
    magdurAracPlaka: "06DD789",
    hasarTarihi: "15/03/2023 14:30",
    ihbarTarihi: "15/03/2023 15:45",
    hasarYeri: "Ankara, Çankaya",
    hasarSebebi: "Kayma",
    hasarTutari: 18000,
    durum: "Kapatıldı",
    altBrans: "TRAFİK",
    hasarNedeni: "TAMİR BEDELİ"
  },

  // Dosya 3: 3 mağdur
  {
    oid: "D4E5F6G7H8I",
    dosyaNo: "2025003000003",
    magdurNo: "1",
    policeNo: "311000166699994",
    sigortaliAdSoyad: "ALİ KAYA",
    sigortaliPlaka: "41EE012",
    sigortaliKusurOrani: "75%",
    magdurAdSoyad: "AYŞE ÇELİK",
    magdurAracPlaka: "07FF345",
    hasarTarihi: "22/01/2023 09:15",
    ihbarTarihi: "22/01/2023 10:30",
    hasarYeri: "İzmir, Konak",
    hasarSebebi: "Çarpışma",
    hasarTutari: 32000,
    durum: "Beklemede",
    altBrans: "TRAFİK",
    hasarNedeni: "KARIŞIK"
  },
  {
    oid: "E5F6G7H8I9J",
    dosyaNo: "2025003000003",
    magdurNo: "2",
    policeNo: "311000166699994",
    sigortaliAdSoyad: "ALİ KAYA",
    sigortaliPlaka: "41EE012",
    magdurAdSoyad: "EMRE ŞAHİN",
    magdurAracPlaka: "16GG678",
    hasarTarihi: "22/01/2023 09:15",
    ihbarTarihi: "22/01/2023 10:30",
    hasarYeri: "İzmir, Konak",
    hasarSebebi: "Çarpışma",
    hasarTutari: 28000,
    durum: "Beklemede",
    altBrans: "TRAFİK",
    hasarNedeni: "KARIŞIK"
  },
  {
    oid: "F6G7H8I9J0K",
    dosyaNo: "2025003000003",
    magdurNo: "3",
    policeNo: "311000166699994",
    sigortaliAdSoyad: "ALİ KAYA",
    sigortaliPlaka: "41EE012",
    magdurAdSoyad: "ZEYNEP ARSLAN",
    magdurAracPlaka: "34HH901",
    hasarTarihi: "22/01/2023 09:15",
    ihbarTarihi: "22/01/2023 10:30",
    hasarYeri: "İzmir, Konak",
    hasarSebebi: "Çarpışma",
    hasarTutari: 45000,
    durum: "Beklemede",
    altBrans: "TRAFİK",
    hasarNedeni: "KARIŞIK"
  },

  // Dosya 4: 2 mağdur
  {
    oid: "G7H8I9J0K1L",
    dosyaNo: "2025004000004",
    magdurNo: "1",
    policeNo: "311000177700005",
    sigortaliAdSoyad: "HASAN YILDIZ",
    sigortaliPlaka: "58II234",
    sigortaliKusurOrani: "0%",
    magdurAdSoyad: "SELMA ÖZDEMİR",
    magdurAracPlaka: "06JJ567",
    hasarTarihi: "10/12/2022 16:45",
    ihbarTarihi: "10/12/2022 18:00",
    hasarYeri: "Bursa, Osmangazi",
    hasarSebebi: "Çarpışma",
    hasarTutari: 22000,
    durum: "Tamamlandı",
    altBrans: "TRAFİK",
    hasarNedeni: "DEĞER KAYBI"
  },
  {
    oid: "H8I9J0K1L2M",
    dosyaNo: "2025004000004",
    magdurNo: "2",
    policeNo: "311000177700005",
    sigortaliAdSoyad: "HASAN YILDIZ",
    sigortaliPlaka: "58II234",
    magdurAdSoyad: "İBRAHİM KORKMAZ",
    magdurAracPlaka: "35KK890",
    hasarTarihi: "10/12/2022 16:45",
    ihbarTarihi: "10/12/2022 18:00",
    hasarYeri: "Bursa, Osmangazi",
    hasarSebebi: "Çarpışma",
    hasarTutari: 19000,
    durum: "Tamamlandı",
    altBrans: "TRAFİK",
    hasarNedeni: "DEĞER KAYBI"
  },

  // Dosya 5: 1 mağdur
  {
    oid: "I9J0K1L2M3N",
    dosyaNo: "2025005000005",
    magdurNo: "1",
    policeNo: "311000188811116",
    sigortaliAdSoyad: "ELİF KARA",
    sigortaliPlaka: "07LL123",
    sigortaliKusurOrani: "25%",
    magdurAdSoyad: "MURAT AYDIN",
    magdurAracPlaka: "34MM456",
    hasarTarihi: "28/11/2022 11:20",
    ihbarTarihi: "28/11/2022 12:35",
    hasarYeri: "Antalya, Muratpaşa",
    hasarSebebi: "Kayma",
    hasarTutari: 12000,
    durum: "İptal",
    altBrans: "TRAFİK",
    hasarNedeni: "TAMİR BEDELİ"
  }
]

// Dosya numarasına göre arama fonksiyonu
export const searchByDosyaNo = (dosyaNo, magdurNo = null) => {
  let results = mockHasarDosyaData.filter(item => item.dosyaNo === dosyaNo)
  
  if (magdurNo) {
    results = results.filter(item => item.magdurNo === magdurNo)
  }
  
  return results
}

// Tüm dosyaları getir (benzersiz dosya numaraları)
export const getAllUniqueFiles = () => {
  const uniqueFiles = []
  const seenDosyaNos = new Set()
  
  mockHasarDosyaData.forEach(item => {
    if (!seenDosyaNos.has(item.dosyaNo)) {
      seenDosyaNos.add(item.dosyaNo)
      
      // Bu dosya için tüm mağdurları bul
      const allMagdurs = mockHasarDosyaData.filter(i => i.dosyaNo === item.dosyaNo)
      
      uniqueFiles.push({
        dosyaNo: item.dosyaNo,
        policeNo: item.policeNo,
        sigortaliAdSoyad: item.sigortaliAdSoyad,
        sigortaliPlaka: item.sigortaliPlaka,
        hasarTarihi: item.hasarTarihi,
        ihbarTarihi: item.ihbarTarihi,
        hasarYeri: item.hasarYeri,
        hasarSebebi: item.hasarSebebi,
        hasarTutari: item.hasarTutari,
        durum: item.durum,
        altBrans: item.altBrans,
        hasarNedeni: item.hasarNedeni,
        magdurSayisi: allMagdurs.length,
        magdurlar: allMagdurs.map(m => ({
          magdurNo: m.magdurNo,
          magdurAdSoyad: m.magdurAdSoyad,
          magdurAracPlaka: m.magdurAracPlaka,
          oid: m.oid
        }))
      })
    }
  })
  
  return uniqueFiles
}

// API response formatında mock data
export const getMockSearchResponse = (dosyaNo, magdurNo = null) => {
  const results = searchByDosyaNo(dosyaNo, magdurNo)
  
  return {
    success: true,
    data: {
      files: results,
      totalCount: results.length,
      dosyaNo: dosyaNo,
      magdurNo: magdurNo
    },
    status: 200,
    message: magdurNo 
      ? `Dosya ${dosyaNo} - Mağdur ${magdurNo} için ${results.length} sonuç bulundu`
      : `Dosya ${dosyaNo} için ${results.length} sonuç bulundu`
  }
}

// Tüm dosyaları API response formatında döndür
export const getAllFilesResponse = () => {
  const files = getAllUniqueFiles()
  
  return {
    success: true,
    data: {
      files: files,
      totalCount: files.length
    },
    status: 200,
    message: `Toplam ${files.length} dosya bulundu`
  }
}

// Test için rastgele dosya getir
export const getRandomFile = () => {
  const files = getAllUniqueFiles()
  const randomIndex = Math.floor(Math.random() * files.length)
  return files[randomIndex]
}

// Test için rastgele mağdur getir
export const getRandomMagdur = () => {
  const randomIndex = Math.floor(Math.random() * mockHasarDosyaData.length)
  return mockHasarDosyaData[randomIndex]
}

export default mockHasarDosyaData
