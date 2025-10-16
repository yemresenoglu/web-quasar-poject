export default {
  // Page Titles (for browser tab)
  pageTitles: {
    home: 'Başlangıç',
    menu: 'Menü',
    login: 'Giriş Yap',
    hasarSorgulaArabulucu: 'Hasar Dosya Sorgula',
    hasarDosyaArabulucu: 'Hasar Dosya Detay',
    accountEditProfile: 'Profil Düzenle',
    accountChangePassword: 'Şifre Değiştir',
    notFound: 'Sayfa Bulunamadı',
  },

  // Page Header
  pageHeader: {
    actions: {
      print: 'Yazdır',
      download: 'İndir',
      share: 'Paylaş',
    },
    messages: {
      printing: 'Yazdırılıyor...',
      downloading: 'İndiriliyor...',
      shareFeature: 'Paylaşım özelliği yakında eklenecek',
    },
  },

  // Dark Mode
  darkMode: {
    switchToDark: 'Karanlık Tema',
    switchToLight: 'Aydınlık Tema',
  },

  // Theme Settings
  themeSettings: {
    title: 'Tema Seçimi',
    lightTheme: 'Aydınlık Tema',
    lightDescription: 'Klasik beyaz arka plan, günlük kullanım için ideal',
    darkTheme: 'Karanlık Tema',
    darkDescription: 'Koyu arka plan, göz yorgunluğunu azaltır',
    sompoTheme: 'SOMPO Tema',
    sompoDescription: 'SOMPO Sigorta | Sigortacılık Ürün ve Hizmetleri özelinde',
  },

  // Common actions
  common: {
    cancel: 'İptal',
    save: 'Kaydet',
    close: 'Kapat',
    confirm: 'Onayla',
    delete: 'Sil',
    edit: 'Düzenle',
    add: 'Ekle',
    addMore: 'Daha fazla ekle',
    back: 'Geri',
    result: 'sonuç',
    found: 'bulundu',
    view: 'Görüntüle',
    openInNewTab: 'Yeni Sekmede Aç',
  },

  // Login page
  login: {
    title: 'SOMPO Hasar Operasyon',
    subtitle: 'Hasar Yönetim Sistemi',
    userCode: 'Kullanıcı Kodu',
    password: 'Şifre',
    captcha: 'Güvenlik Kodu',
    loginButton: 'Giriş Yap',
    forgotPassword: 'Şifremi Unuttum',
    forgotPasswordTitle: 'Şifre Sıfırlama',
    forgotPasswordDescription: 'E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.',
    email: 'E-Posta',
    sendResetLink: 'Bağlantı Gönder',
    refreshCaptcha: 'Kodu Yenile',
    invalidCaptcha: 'Güvenlik kodu hatalı',
    successMessage: 'Başarıyla giriş yapıldı',
    errorMessage: 'Kullanıcı kodu veya şifre hatalı',
    resetLinkSent: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
    resetLinkError: 'Şifre sıfırlama bağlantısı gönderilemedi',
    footer: 'Güvenli giriş için şifrenizi kimseyle paylaşmayın',
    help: 'Yardım',
    contact: 'İletişim',
  },

  // Validation messages
  validation: {
    required: 'Bu alan zorunludur',
    email: 'Geçerli bir e-posta adresi giriniz',
    minLength: 'En az {min} karakter olmalıdır',
    maxLength: 'En fazla {max} karakter olmalıdır',
    passwordMismatch: 'Şifreler eşleşmiyor',
    invalidFormat: 'Geçersiz format',
    userCodeFormat: 'Kullanıcı kodu sadece büyük harf ve rakam içermelidir',
    phoneFormat: 'Geçerli bir telefon numarası giriniz',
  },

  // Notification types
  notification: {
    success: 'Başarılı',
    error: 'Hata',
    info: 'Bilgi',
    warning: 'Uyarı',
  },

  // Taskbar (Görev Çubuğu)
  taskbar: {
    start: 'Başlat',
    menu: 'Menü',
    account: 'Hesabım',
  },

  // Quick Access (in AccountMenu)
  quickAccess: {
    title: 'Hızlı Erişim',
    empty: 'Henüz hızlı erişim öğesi yok',
    pinToTaskbar: 'Görev çubuğuna sabitle',
    unpinFromTaskbar: 'Görev çubuğundan kaldır',
    addToQuickAccess: 'Hızlı İşlemlere Ekle',
    removeFromQuickAccess: 'Hızlı İşlemlerden Kaldır',
  },

  // Taskbar Settings (in AccountMenu)
  taskbarSettings: {
    title: 'Görev Çubuğu',
    autoHide: 'Otomatik Gizle',
    position: 'Konum',
    showLeft: 'Solda Göster',
    showBottom: 'Aşağıda Göster',
    showRight: 'Sağda Göster',
  },

  // Quick Menu (used in MenuPage)
  quickMenu: {
    title: 'Hızlı Menü',
    addToQuickAccess: 'Hızlı İşlemlere Ekle',
    removeFromQuickAccess: 'Hızlı İşlemlerden Kaldır',
  },

  // Menu Page
  menuPage: {
    search: 'Menüde ara...',
    noResults: 'Sonuç Bulunamadı',
    tryDifferentSearch: 'Farklı bir arama terimi deneyin',
    clearSearch: 'Aramayı Temizle',
    categories: {
      damageOperations: 'Hasar İşlemleri',
      customerOperations: 'Müşteri İşlemleri',
      expertOperations: 'Eksper İşlemleri',
      serviceOperations: 'Servis İşlemleri',
      financialOperations: 'Finansal İşlemler',
      reportsAnalytics: 'Raporlar & Analizler',
      systemManagement: 'Sistem Yönetimi',
      helpSupport: 'Yardım & Destek',
      // Yeni kategoriler
      hasarDosya: 'Hasar Dosya',
      evrakYonetimi: 'Evrak Yönetimi',
      raporlar: 'Raporlar',
      sistemYonetimi: 'Sistem Yönetimi',
    },
    items: {
      // Hasar İşlemleri
      damageTracking: 'Hasar Takibi',
      damageQuery: 'Hasar Dosya Sorgula',
      damageQueryMediator: 'Hasar Dosya Sorgula (Arabulucu)',
      expertAssignments: 'Eksper Atamaları',
      serviceAssignments: 'Servis Atamaları',
      paymentApprovals: 'Ödeme Onayları',

      // Müşteri İşlemleri
      customerInfo: 'Müşteri Bilgileri',
      policyQuery: 'Poliçe Sorgulama',
      communicationHistory: 'İletişim Geçmişi',
      customerRequests: 'Müşteri Talepleri',

      // Eksper İşlemleri
      expertList: 'Eksper Listesi',
      expertReports: 'Eksper Raporları',
      performanceTracking: 'Performans Takibi',
      fieldTasks: 'Saha Görevleri',
      expertPayments: 'Eksper Ödemeleri',

      // Servis İşlemleri
      contractedServices: 'Anlaşmalı Servisler',
      serviceReports: 'Servis Raporları',
      partRequests: 'Parça Talepleri',
      invoiceOperations: 'Fatura İşlemleri',
      qualityControl: 'Kalite Kontrol',

      // Finansal İşlemler
      damagePayments: 'Hasar Ödemeleri',
      expenseManagement: 'Masraf Yönetimi',
      invoiceApprovals: 'Fatura Onayları',
      recourseOperations: 'Rücu İşlemleri',
      accountingRecords: 'Muhasebe Kayıtları',

      // Raporlar & Analizler
      damageStatistics: 'Hasar İstatistikleri',
      performanceReports: 'Performans Raporları',
      riskAnalysis: 'Risk Analizleri',
      costAnalysis: 'Maliyet Analizleri',
      periodicReports: 'Dönemsel Raporlar',

      // Sistem Yönetimi
      userManagement: 'Kullanıcı Yönetimi',
      rolesPermissions: 'Rol ve Yetkiler',
      systemSettings: 'Sistem Ayarları',
      logRecords: 'Log Kayıtları',
      backup: 'Yedekleme',

      // Yardım & Destek
      userGuide: 'Kullanım Kılavuzu',
      faq: 'Sık Sorulan Sorular',
      supportRequests: 'Destek Talepleri',
      trainingVideos: 'Eğitim Videoları',
      contact: 'İletişim',

      // Yeni menü öğeleri
      hasarDosyaSorgulamaArabulucu: 'Hasar Dosya Sorgulama (Arabulucu)',
      hasarDosyaEkleme: 'Hasar Dosya Ekleme',
      hasarDosyaListesi: 'Hasar Dosya Listesi',
      hasarDosyaRaporlari: 'Hasar Dosya Raporları',

      evrakYukleme: 'Evrak Yükleme',
      evrakListesi: 'Evrak Listesi',
      evrakOnay: 'Evrak Onay',

      gunlukRapor: 'Günlük Rapor',
      aylikRapor: 'Aylık Rapor',
      ozetRapor: 'Özet Rapor',

      kullaniciYonetimi: 'Kullanıcı Yönetimi',
      yetkiYonetimi: 'Yetki Yönetimi',
      sistemAyarlari: 'Sistem Ayarları',
    },
  },

  // Account
  account: {
    title: 'Hesabım',
    menuDescription: 'Kullanıcı hesap bilgileri, birim seçimi, görevler ve hesap işlemleri menüsü',
    profile: 'Profil',
    actions: 'Hesap İşlemleri',
    editProfile: 'Profili Düzenle',
    changePassword: 'Şifre Değiştir',
    logout: 'Çıkış Yap',
    active: 'Aktif',
    lastLogin: 'Son Giriş',
    editDepartment: 'Birim Düzenle',
    selectDepartment: 'Birim Seç',
    departmentSelected: 'Birim Seçili',
    myTasks: 'Görevlerim',
    taskSelected: 'Görev Seçili',
    selectTask: 'Görevi Seç',
    noTasks: 'Görev bulunmuyor',

    // Profile fields
    firstName: 'Adı',
    lastName: 'Soyadı',
    userCode: 'Kullanıcı Kodu',
    department: 'Birim',
    email: 'E-Posta',
    phone: 'Telefon',
    position: 'Pozisyon',
    defaultUser: 'Kullanıcı',
    defaultFullName: 'Yunus Emre Şenoğlu',
    defaultUserCode: 'YUNUSEMRE',
    defaultDepartment: 'Arabuluculuk',
    defaultEmail: 'kullanici[at]example.com',
    defaultPhone: '+90 555 123 45 67',
    defaultPosition: 'Görev Seçilmedi',

    // Password fields
    currentPassword: 'Mevcut Şifre',
    newPassword: 'Yeni Şifre',
    confirmPassword: 'Şifre Tekrarı',

    // Profile page specific
    profileInfo: 'Profil Bilgileri',
    profileUpdatedSuccessfully: 'Profil başarıyla güncellendi',
    profileUpdateFailed: 'Profil güncellenirken hata oluştu',
    passwordChangedSuccessfully: 'Şifre başarıyla değiştirildi',
    passwordChangeFailed: 'Şifre değiştirme başarısız',
    passwordChangeError: 'Şifre değiştirme hatası',

    // Password security tips
    passwordSecurityTips: 'Güvenlik İpuçları',
    passwordTip1: 'En az 6 karakter uzunluğunda olmalıdır',
    passwordTip2: 'Büyük ve küçük harf, rakam ve özel karakter içermelidir',
    passwordTip3: 'Kolay tahmin edilebilir kelimeler kullanmayın',
    passwordTip4: 'Şifrenizi düzenli olarak değiştirin',

    notifications: {
      profileUpdated: 'Profil başarıyla güncellendi',
      passwordChanged: 'Şifre başarıyla değiştirildi',
      passwordChangeFailed: 'Şifre değiştirme başarısız oldu',
      securityUpdated: 'Güvenlik ayarları başarıyla güncellendi',
      departmentChanged: 'Birim başarıyla değiştirildi',
      taskCompleted: 'Görev tamamlandı',
      taskReopened: 'Görev yeniden açıldı',
      updateFailed: 'Güncelleme başarısız oldu',
    },
  },

  // Dashboard
  dashboard: {
    pendingJobs: 'Bekleyen İşler',
    myJobs: 'Üzerimdeki İşler',
    sentJobs: 'Gönderdiğim İşler',
    detailedJobCounts: 'Detaylı İş Sayıları',
    pending: 'Bekleyen',
    assigned: 'Üzerimdeki',
    sent: 'Gönderdiğim',
    jobStatus: 'İş Durumu',
    charts: {
      workStatusDistribution: 'İş Durumu Dağılımı',
      weeklyWorkTrend: 'Haftalık İş Trendi',
      processBasedWorkload: 'Süreç Bazlı İş Yükü',
    },
    announcements: {
      title: 'Duyuru Listesi',
      noAnnouncements: 'Henüz duyuru bulunmuyor',
      readMore: 'Devamını Oku',
      showLess: 'Daha Az Göster',
      priorities: {
        high: 'Yüksek',
        medium: 'Orta',
        low: 'Düşük',
      },
      testNotification: 'Dashboard Yüklendi - Custom Notification Test',
    },
  },

  // Hasar Dosya Sorgula (Arabulucu)
  damageQueryMediator: {
    title: 'Hasar Dosya Sorgula (Arabulucu)',
    refresh: 'Yenile',
    exportResults: 'Sonuçları Dışa Aktar',

    // Tab labels
    tabs: {
      damage: 'Hasar',
    },

    // Section titles
    sections: {
      damageInfo: 'Hasar Bilgileri',
    },

    searchForm: {
      fileNumber: 'Dosya No',
      victimNumber: 'Mağdur No',
      searchButton: 'Bul',
      clearButton: 'Temizle',
    },
    results: {
      title: 'Sorgulama Sonuçları',
      noResults: 'Sonuç bulunamadı',
      columns: {
        fileNumber: 'Dosya No',
        victimNumber: 'Mağdur No',
        policyNumber: 'Poliçe No',
        insuredName: 'Sigortalı',
        victimName: 'Mağdur',
        damageDate: 'Hasar Tarihi',
        status: 'Durum',
        actions: 'İşlemler',
      },
      fileNumber: 'Dosya No',
      policyNumber: 'Poliçe No',
      insuredName: 'Sigortalı',
      insuredPlate: 'Sigortalı Plaka',
      insuredFaultRate: 'Kusur Oranı',
      victimName: 'Mağdur',
      victimPlate: 'Mağdur Plaka',
      subBranch: 'Alt Branş',
      damageReason: 'Hasar Nedeni',
      subDamageReason: 'Alt Hasar Nedeni',
      reportDate: 'İhbar Tarihi',
      damageDate: 'Hasar Tarihi',
      actions: 'İşlemler',
    },
    messages: {
      enterSearchCriteria: 'Arama kriterlerini girin',
      searchCleared: 'Arama temizlendi',
      searchCompleted: 'Arama tamamlandı',
      noResultsFound: 'Sonuç bulunamadı',
      loadingResults: 'Sonuçlar yükleniyor...',
      openedInNewTab: 'Yeni sekmede açıldı',
      editingFile: 'Dosya düzenleniyor: {fileNumber}',
      searchError: 'Arama sırasında hata oluştu',
    },
  },

  // Error pages
  error: {
    notFound: {
      title: 'Sayfa Bulunamadı',
      message: 'Aradığınız sayfa bulunamadı veya taşınmış olabilir.',
      homeButton: 'Ana Sayfaya Dön',
      menuButton: 'Menüye Git',
    },
  },

  // Hasar Dosya Arabulucu page
  hasarDosyaArabulucu: {
    title: 'Hasar Dosya (Arabulucu)',
    actions: {
      print: 'Yazdır',
      download: 'İndir',
      share: 'Paylaş',
    },
    sections: {
      dosyaOzet: 'Dosya Özet Bilgileri',
      ihbarVeren: 'İhbar Veren Kişi Bilgileri',
      degerKaybiArabuluculuk: 'Değer Kaybı Arabuluculuk',
      degerKaybi: 'Değer Kaybı Arabuluculuk',
      evrak: 'Evrak Bilgileri',
    },
    labels: {
      dosyaNo: 'Dosya No',
      policeNo: 'Poliçe No',
      sigortaliAdSoyad: 'Sigortalı Ad Soyad',
      sigortaliPlaka: 'Sigortalı Plaka',
      sigortaliKusurOrani: 'Sigortalı Kusur Oranı',
      magdurAdSoyad: 'Mağdur Ad Soyad',
      magdurAracPlaka: 'Mağdur Araç Plaka',
      hasarNedeni: 'Hasar Nedeni',
      altHasarNedeni: 'Alt Hasar Nedeni',
      hasarTarihi: 'Hasar Tarihi',
      ihbarTarihi: 'İhbar Tarihi',
      altBrans: 'Alt Branş',
      ihbarYapanAdSoyad: 'İhbar Yapan Ad Soyad',
      gsm: 'GSM',
      eposta: 'E-posta',
      yakinlikDerecesi: 'Yakınlık Derecesi',
      teklifEdilenTutar: 'Teklif Edilen Tutar',
      vekaletTutari: 'Vekalet Tutarı',
      toplamTutar: 'Toplam Tutar',
      anlasmaYapilacakIslem: 'Anlaşma Yapılacak İşlem',
      anlasmaDurum: 'Anlaşma Durum',
      talepEdilenRevizeTutar: 'Talep Edilen Revize Tutar',
      onaylananRevizeTutar: 'Onaylanan Revize Tutar',
      anlasmaSaglananTutar: 'Anlaşma Sağlanan Tutar',
      anlasmaSaglananVekaletTutari: 'Anlaşma Sağlanan Vekalet Tutarı',
      anlasmaSaglananToplamTutar: 'Anlaşma Sağlanan Toplam Tutar',
      aracYasi: 'Araç Yaşı',
      aracDegeri: 'Araç Değeri',
      hasarBedeli: 'Hasar Bedeli',
      degerKaybiOrani: 'Değer Kaybı Oranı',
      hesaplananDegerKaybi: 'Hesaplanan Değer Kaybı',
      actions: 'İşlemler',
    },
    messages: {
      printing: 'Dosya yazdırılıyor...',
      downloading: 'Dosya indiriliyor...',
      shareFeature: 'Paylaşım özelliği yakında eklenecek',
      selectDocumentType: 'Lütfen evrak türü seçin',
      documentRequestSent: '{type} evrak talebi gönderildi',
      viewingDocument: 'Görüntüle',
      degerKaybiSaved: 'Değer kaybı arabuluculuk bilgileri kaydedildi',
    },
    evrak: {
      selectType: 'Evrak türü',
      requestDocument: 'Evrak Talep Et',
      documentName: 'Belge Adı',
      status: 'Durum',
      date: 'Tarih',
      actions: 'İşlemler',
      addButton: 'Belge Ekle',
    },
  },
}
