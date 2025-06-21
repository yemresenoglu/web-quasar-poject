import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useMenuPageStore = defineStore('menu-page-store', () => {
  const { t } = useI18n()

  const originalMenuData = ref({
    menu: [
      {
        id: 'damage-operations',
        translationKey: 'menuPage.categories.damageOperations',
        icon: "bi-exclamation-triangle-fill",
        items: [
          { id: 'damage-report', translationKey: 'menuPage.items.damageReport', icon: "bi-exclamation-triangle-fill", route: '/hasar-bildirimi', type: 'internal' },
          { id: 'damage-tracking', translationKey: 'menuPage.items.damageTracking', icon: "bi-search", route: '/hasar-takibi', type: 'internal' },
          { id: 'damage-files', translationKey: 'menuPage.items.damageFiles', icon: "bi-folder-fill", route: '/hasar-dosyalari', type: 'internal' },
          { id: 'expert-assignments', translationKey: 'menuPage.items.expertAssignments', icon: "bi-person-fill", url: 'https://eksper-demo.sirketim.com.tr', type: 'external' },
          { id: 'service-assignments', translationKey: 'menuPage.items.serviceAssignments', icon: "bi-tools", url: 'https://google.com/search?q=service+management', type: 'external' },
          { id: 'payment-approvals', translationKey: 'menuPage.items.paymentApprovals', icon: "bi-cash", url: 'https://github.com', type: 'external' }
        ]
      },
      {
        id: 'customer-operations',
        translationKey: 'menuPage.categories.customerOperations',
        icon: "bi-people-fill",
        items: [
          { id: 'customer-info', translationKey: 'menuPage.items.customerInfo', icon: "bi-person-fill", route: '/musteri-bilgileri', type: 'internal' },
          { id: 'policy-query', translationKey: 'menuPage.items.policyQuery', icon: "bi-shield-fill-check", route: '/police-sorgulama', type: 'internal' },
          { id: 'communication-history', translationKey: 'menuPage.items.communicationHistory', icon: "bi-clock-history", route: '/iletisim-gecmisi', type: 'internal' },
          { id: 'customer-requests', translationKey: 'menuPage.items.customerRequests', icon: "bi-chat-left-text-fill", route: '/musteri-talepleri', type: 'internal' },
          { id: 'notifications', translationKey: 'menuPage.items.notifications', icon: "bi-bell-fill", route: '/bildirimler', type: 'internal' }
        ]
      },
      {
        id: 'expert-operations',
        translationKey: 'menuPage.categories.expertOperations',
        icon: "bi-tools",
        items: [
          { id: 'expert-list', translationKey: 'menuPage.items.expertList', icon: "bi-file-text-fill", route: '/eksper-listesi', type: 'internal' },
          { id: 'expert-reports', translationKey: 'menuPage.items.expertReports', icon: "bi-file-text-fill", url: 'https://docs.google.com/spreadsheets', type: 'external' },
          { id: 'performance-tracking', translationKey: 'menuPage.items.performanceTracking', icon: "bi-graph-up", url: 'https://analytics.google.com', type: 'external' },
          { id: 'field-tasks', translationKey: 'menuPage.items.fieldTasks', icon: "bi-geo-alt-fill", url: 'https://maps.google.com', type: 'external' },
          { id: 'expert-payments', translationKey: 'menuPage.items.expertPayments', icon: "bi-wallet2", url: 'https://stripe.com/dashboard', type: 'external' },
          { id: 'youtube-test', translationKey: 'menuPage.items.youtubeTest', icon: "bi-youtube", url: 'https://www.youtube.com/', type: 'external' }
        ]
      },
      {
        id: 'service-operations',
        translationKey: 'menuPage.categories.serviceOperations',
        icon: "bi-wrench",
        items: [
          { id: 'contracted-services', translationKey: 'menuPage.items.contractedServices', icon: "bi-wrench", route: '/servisler', type: 'internal' },
          { id: 'service-reports', translationKey: 'menuPage.items.serviceReports', icon: "bi-file-text-fill", route: '/servis-raporlari', type: 'internal' },
          { id: 'part-requests', translationKey: 'menuPage.items.partRequests', icon: "bi-gear-fill", route: '/parca-talepleri', type: 'internal' },
          { id: 'invoice-operations', translationKey: 'menuPage.items.invoiceOperations', icon: "bi-receipt", route: '/fatura-islemleri', type: 'internal' },
          { id: 'quality-control', translationKey: 'menuPage.items.qualityControl', icon: "bi-check-circle-fill", route: '/kalite-kontrol', type: 'internal' }
        ]
      },
      {
        id: 'financial-operations',
        translationKey: 'menuPage.categories.financialOperations',
        icon: "bi-bank",
        items: [
          { id: 'damage-payments', translationKey: 'menuPage.items.damagePayments', icon: "bi-cash", route: '/hasar-odemeleri', type: 'internal' },
          { id: 'expense-management', translationKey: 'menuPage.items.expenseManagement', icon: "bi-bank", route: '/masraf-yonetimi', type: 'internal' },
          { id: 'invoice-approvals', translationKey: 'menuPage.items.invoiceApprovals', icon: "bi-check-square-fill", route: '/fatura-onaylari', type: 'internal' },
          { id: 'recourse-operations', translationKey: 'menuPage.items.recourseOperations', icon: "bi-arrow-left-right", route: '/rucu-islemleri', type: 'internal' },
          { id: 'accounting-records', translationKey: 'menuPage.items.accountingRecords', icon: "bi-journal-text", route: '/muhasebe', type: 'internal' }
        ]
      },
      {
        id: 'reports-analytics',
        translationKey: 'menuPage.categories.reportsAnalytics',
        icon: "bi-graph-up",
        items: [
          { id: 'damage-statistics', translationKey: 'menuPage.items.damageStatistics', icon: "bi-bar-chart-fill", route: '/hasar-istatistikleri', type: 'internal' },
          { id: 'performance-reports', translationKey: 'menuPage.items.performanceReports', icon: "bi-graph-up", route: '/performans-raporlari', type: 'internal' },
          { id: 'risk-analysis', translationKey: 'menuPage.items.riskAnalysis', icon: "bi-exclamation-triangle-fill", route: '/risk-analizleri', type: 'internal' },
          { id: 'cost-analysis', translationKey: 'menuPage.items.costAnalysis', icon: "bi-arrow-up-right", route: '/maliyet-analizleri', type: 'internal' },
          { id: 'periodic-reports', translationKey: 'menuPage.items.periodicReports', icon: "bi-calendar-range", route: '/donemsel-raporlar', type: 'internal' }
        ]
      },
      {
        id: 'system-management',
        translationKey: 'menuPage.categories.systemManagement',
        icon: "bi-gear-fill",
        items: [
          { id: 'user-management', translationKey: 'menuPage.items.userManagement', icon: "bi-people-fill", route: '/kullanici-yonetimi', type: 'internal' },
          { id: 'roles-permissions', translationKey: 'menuPage.items.rolesPermissions', icon: "bi-shield-lock-fill", route: '/rol-yetkiler', type: 'internal' },
          { id: 'system-settings', translationKey: 'menuPage.items.systemSettings', icon: "bi-sliders", route: '/sistem-ayarlari', type: 'internal' },
          { id: 'log-records', translationKey: 'menuPage.items.logRecords', icon: "bi-journal-text", route: '/log-kayitlari', type: 'internal' },
          { id: 'backup', translationKey: 'menuPage.items.backup', icon: "bi-cloud-arrow-up-fill", route: '/yedekleme', type: 'internal' }
        ]
      },
      {
        id: 'help-support',
        translationKey: 'menuPage.categories.helpSupport',
        icon: "bi-question-circle-fill",
        items: [
          { id: 'user-guide', translationKey: 'menuPage.items.userGuide', icon: "bi-book-fill", route: '/kullanim-kilavuzu', type: 'internal' },
          { id: 'faq', translationKey: 'menuPage.items.faq', icon: "bi-question-circle", route: '/sss', type: 'internal' },
          { id: 'support-requests', translationKey: 'menuPage.items.supportRequests', icon: "bi-headset", route: '/destek-talepleri', type: 'internal' },
          { id: 'training-videos', translationKey: 'menuPage.items.trainingVideos', icon: "bi-play-circle-fill", route: '/egitim-videolari', type: 'internal' },
          { id: 'contact', translationKey: 'menuPage.items.contact', icon: "bi-envelope-fill", route: '/iletisim', type: 'internal' }
        ]
      }
    ]
  })

  // Computed property to get translated menu data
  const translatedMenuData = computed(() => {
    return originalMenuData.value.menu.map(category => ({
      ...category,
      text: t(category.translationKey),
      items: category.items.map(item => ({
        ...item,
        text: t(item.translationKey)
      }))
    }))
  })

  return {
    originalMenuData,
    translatedMenuData
  }
})