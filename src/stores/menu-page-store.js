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
          { id: 'damage-report', translationKey: 'menuPage.items.damageReport', icon: "bi-exclamation-triangle-fill", route: '/hasar-bildirimi' },
          { id: 'damage-tracking', translationKey: 'menuPage.items.damageTracking', icon: "bi-search", route: '/hasar-takibi' },
          { id: 'damage-files', translationKey: 'menuPage.items.damageFiles', icon: "bi-folder-fill", route: '/hasar-dosyalari' },
          { id: 'expert-assignments', translationKey: 'menuPage.items.expertAssignments', icon: "bi-person-fill", route: '/eksper-atamalari' },
          { id: 'service-assignments', translationKey: 'menuPage.items.serviceAssignments', icon: "bi-tools", route: '/servis-atamalari' },
          { id: 'payment-approvals', translationKey: 'menuPage.items.paymentApprovals', icon: "bi-cash", route: '/odeme-onaylari' }
        ]
      },
      {
        id: 'customer-operations',
        translationKey: 'menuPage.categories.customerOperations',
        icon: "bi-people-fill",
        items: [
          { id: 'customer-info', translationKey: 'menuPage.items.customerInfo', icon: "bi-person-fill", route: '/musteri-bilgileri' },
          { id: 'policy-query', translationKey: 'menuPage.items.policyQuery', icon: "bi-shield-fill-check", route: '/police-sorgulama' },
          { id: 'communication-history', translationKey: 'menuPage.items.communicationHistory', icon: "bi-clock-history", route: '/iletisim-gecmisi' },
          { id: 'customer-requests', translationKey: 'menuPage.items.customerRequests', icon: "bi-chat-left-text-fill", route: '/musteri-talepleri' },
          { id: 'notifications', translationKey: 'menuPage.items.notifications', icon: "bi-bell-fill", route: '/bildirimler' }
        ]
      },
      {
        id: 'expert-operations',
        translationKey: 'menuPage.categories.expertOperations',
        icon: "bi-tools",
        items: [
          { id: 'expert-list', translationKey: 'menuPage.items.expertList', icon: "bi-file-text-fill", route: '/eksper-listesi' },
          { id: 'expert-reports', translationKey: 'menuPage.items.expertReports', icon: "bi-file-text-fill", route: '/eksper-raporlari' },
          { id: 'performance-tracking', translationKey: 'menuPage.items.performanceTracking', icon: "bi-graph-up", route: '/eksper-performans' },
          { id: 'field-tasks', translationKey: 'menuPage.items.fieldTasks', icon: "bi-geo-alt-fill", route: '/saha-gorevleri' },
          { id: 'expert-payments', translationKey: 'menuPage.items.expertPayments', icon: "bi-wallet2", route: '/eksper-odemeleri' }
        ]
      },
      {
        id: 'service-operations',
        translationKey: 'menuPage.categories.serviceOperations',
        icon: "bi-wrench",
        items: [
          { id: 'contracted-services', translationKey: 'menuPage.items.contractedServices', icon: "bi-wrench", route: '/servisler' },
          { id: 'service-reports', translationKey: 'menuPage.items.serviceReports', icon: "bi-file-text-fill", route: '/servis-raporlari' },
          { id: 'part-requests', translationKey: 'menuPage.items.partRequests', icon: "bi-gear-fill", route: '/parca-talepleri' },
          { id: 'invoice-operations', translationKey: 'menuPage.items.invoiceOperations', icon: "bi-receipt", route: '/fatura-islemleri' },
          { id: 'quality-control', translationKey: 'menuPage.items.qualityControl', icon: "bi-check-circle-fill", route: '/kalite-kontrol' }
        ]
      },
      {
        id: 'financial-operations',
        translationKey: 'menuPage.categories.financialOperations',
        icon: "bi-bank",
        items: [
          { id: 'damage-payments', translationKey: 'menuPage.items.damagePayments', icon: "bi-cash", route: '/hasar-odemeleri' },
          { id: 'expense-management', translationKey: 'menuPage.items.expenseManagement', icon: "bi-bank", route: '/masraf-yonetimi' },
          { id: 'invoice-approvals', translationKey: 'menuPage.items.invoiceApprovals', icon: "bi-check-square-fill", route: '/fatura-onaylari' },
          { id: 'recourse-operations', translationKey: 'menuPage.items.recourseOperations', icon: "bi-arrow-left-right", route: '/rucu-islemleri' },
          { id: 'accounting-records', translationKey: 'menuPage.items.accountingRecords', icon: "bi-journal-text", route: '/muhasebe' }
        ]
      },
      {
        id: 'reports-analytics',
        translationKey: 'menuPage.categories.reportsAnalytics',
        icon: "bi-graph-up",
        items: [
          { id: 'damage-statistics', translationKey: 'menuPage.items.damageStatistics', icon: "bi-bar-chart-fill", route: '/hasar-istatistikleri' },
          { id: 'performance-reports', translationKey: 'menuPage.items.performanceReports', icon: "bi-graph-up", route: '/performans-raporlari' },
          { id: 'risk-analysis', translationKey: 'menuPage.items.riskAnalysis', icon: "bi-exclamation-triangle-fill", route: '/risk-analizleri' },
          { id: 'cost-analysis', translationKey: 'menuPage.items.costAnalysis', icon: "bi-arrow-up-right", route: '/maliyet-analizleri' },
          { id: 'periodic-reports', translationKey: 'menuPage.items.periodicReports', icon: "bi-calendar-range", route: '/donemsel-raporlar' }
        ]
      },
      {
        id: 'system-management',
        translationKey: 'menuPage.categories.systemManagement',
        icon: "bi-gear-fill",
        items: [
          { id: 'user-management', translationKey: 'menuPage.items.userManagement', icon: "bi-people-fill", route: '/kullanici-yonetimi' },
          { id: 'roles-permissions', translationKey: 'menuPage.items.rolesPermissions', icon: "bi-shield-lock-fill", route: '/rol-yetkiler' },
          { id: 'system-settings', translationKey: 'menuPage.items.systemSettings', icon: "bi-sliders", route: '/sistem-ayarlari' },
          { id: 'log-records', translationKey: 'menuPage.items.logRecords', icon: "bi-journal-text", route: '/log-kayitlari' },
          { id: 'backup', translationKey: 'menuPage.items.backup', icon: "bi-cloud-arrow-up-fill", route: '/yedekleme' }
        ]
      },
      {
        id: 'help-support',
        translationKey: 'menuPage.categories.helpSupport',
        icon: "bi-question-circle-fill",
        items: [
          { id: 'user-guide', translationKey: 'menuPage.items.userGuide', icon: "bi-book-fill", route: '/kullanim-kilavuzu' },
          { id: 'faq', translationKey: 'menuPage.items.faq', icon: "bi-question-circle", route: '/sss' },
          { id: 'support-requests', translationKey: 'menuPage.items.supportRequests', icon: "bi-headset", route: '/destek-talepleri' },
          { id: 'training-videos', translationKey: 'menuPage.items.trainingVideos', icon: "bi-play-circle-fill", route: '/egitim-videolari' },
          { id: 'contact', translationKey: 'menuPage.items.contact', icon: "bi-envelope-fill", route: '/iletisim' }
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