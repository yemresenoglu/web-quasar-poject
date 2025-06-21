// This is just an example,
// so you can safely delete all default props below

export default {
  // Common
  failed: 'Action failed',
  success: 'Action was successful',

  // Navigation
  menu: {
    home: 'Home',
    menu: 'Menu',
    settings: 'Settings',
    account: 'Account',
    more: 'More'
  },

  // Integrated Service
  integratedService: {
    add: 'Add Integrated Service',
    icon: 'Icon',
    name: 'Service Name',
    url: 'Service URL',
    cancel: 'Cancel',
    addButton: 'Add',
    errors: {
      required: 'Please fill in all fields',
      creation: 'An error occurred while adding the service'
    },
    success: 'Integrated service added successfully'
  },

  // Service View
  serviceView: {
    loading: 'Loading...',
    pin: 'Pin',
    unpin: 'Unpin',
    reload: 'Reload',
    close: 'Close'
  },

  // Tabs
  tabs: {
    search: 'Search Tabs',
    openTabs: 'Open Tabs',
    close: 'Close Tab'
  },

  // Workspace
  workspace: {
    create: 'Create Workspace',
    icon: 'Icon',
    name: 'Workspace Name',
    cancel: 'Cancel',
    createButton: 'Create',
    errors: {
      required: 'Please fill in both icon and name fields',
      creation: 'An error occurred while creating the workspace'
    },
    success: 'Workspace created successfully'
  },

  // Header
  header: {
    openMenu: 'Open Menu',
    tools: 'Page Tools',
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close'
  },

  // Sidebar
  sidebar: {
    workspaces: 'Workspaces',
    services: 'Services',
    tools: 'Tools',
    start: 'Start',
    menu: 'Menu',
    more: 'More',
    account: 'My Account'
  },

  // Drawer
  drawer: {
    tools: {
      favorites: 'My Favorites',
      pinboards: 'My Pinboards',
      history: 'History',
      notifications: 'Notifications',
      account: 'My Account',
      settings: 'Application Settings'
    }
  },

  // Favorites
  favorites: {
    title: 'Favorites',
    pages: 'Pages',
    quickAccess: 'Quick Access',
    settings: 'Settings',
    addPage: 'Add Page',
    remove: 'Remove from Favorites',
    showInSidebar: 'Show in sidebar',
    autoAdd: 'Auto add',
    empty: {
      title: 'No favorites yet',
      subtitle: 'You can add frequently used pages here'
    },
    dialog: {
      title: 'Add Favorite',
      titleField: 'Title',
      routeField: 'Page Route',
      iconField: 'Icon',
      cancel: 'Cancel',
      add: 'Add'
    }
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    recent: 'Recent Notifications',
    filters: 'Filters',
    settings: 'Settings',
    markAsRead: 'Mark as read',
    markAsUnread: 'Mark as unread',
    delete: 'Delete',
    markAllAsRead: 'Mark all as read',
    clearAll: 'Clear all',
    clearRead: 'Clear read',
    enableSound: 'Sound notifications',
    enableDesktop: 'Desktop notifications',
    empty: {
      title: 'No notifications yet',
      subtitle: 'New notifications will appear here'
    },
    filterOptions: {
      all: 'All',
      unread: 'Unread',
      system: 'System',
      damage: 'Damage',
      payment: 'Payment',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error'
    },
    types: {
      damage: 'Damage Report',
      payment: 'Payment',
      system: 'System',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error'
    },
    timeAgo: {
      now: 'Now',
      minute: 'minute ago',
      minutes: 'minutes ago',
      hour: 'hour ago',
      hours: 'hours ago',
      day: 'day ago',
      days: 'days ago'
    }
  },

  // Pinboards
  pinboards: {
    title: 'Pinboards',
    myPinboards: 'My Pinboards',
    recent: 'Recent Pinboards',
    pinned: 'Pinned',
    categories: 'Categories',
    settings: 'Settings',
    addPinboard: 'Add Pinboard',
    viewPinboard: 'View Pinboard',
    editPinboard: 'Edit Pinboard',
    deletePinboard: 'Delete Pinboard',
    duplicatePinboard: 'Duplicate Pinboard',
    togglePin: 'Toggle Pin',
    exportPinboards: 'Export Pinboards',
    importPinboards: 'Import Pinboards',
    clearAll: 'Clear All',
    clearCompleted: 'Clear Completed',
    autoSave: 'Auto save',
    showInSidebar: 'Show in sidebar',
    pin: 'Pin',
    unpin: 'Unpin',
    delete: 'Delete',
    export: 'Export',
    empty: {
      title: 'No pinboards yet',
      subtitle: 'You can add your notes, tasks, and important information here'
    },
    dialog: {
      add: {
        title: 'Add New Pinboard',
        titleField: 'Title',
        titleLabel: 'Title',
        contentField: 'Content',
        contentLabel: 'Content',
        typeField: 'Type',
        typeLabel: 'Type',
        priorityField: 'Priority',
        priorityLabel: 'Priority',
        pinnedField: 'Pin',
        cancel: 'Cancel',
        add: 'Add'
      },
      view: {
        title: 'Pinboard Details',
        createdAt: 'Created',
        updatedAt: 'Updated',
        close: 'Close'
      }
    },
    types: {
      note: 'Note',
      task: 'Task',
      reminder: 'Reminder',
      link: 'Link',
      damage_note: 'Damage Note',
      expert_task: 'Expert Task',
      customer_reminder: 'Customer Reminder',
      payment_tracking: 'Payment Tracking',
      document_request: 'Document Request',
      service_coordination: 'Service Coordination'
    },
    priorities: {
      urgent: 'Urgent',
      high: 'High',
      normal: 'Normal',
      low: 'Low'
    },
    priority: {
      urgent: 'Urgent',
      high: 'High',
      normal: 'Normal',
      low: 'Low'
    },
    filters: {
      all: 'All',
      notes: 'Notes',
      tasks: 'Tasks',
      reminders: 'Reminders',
      links: 'Links',
      damage_notes: 'Damage Notes',
      expert_tasks: 'Expert Tasks',
      customer_reminders: 'Customer Reminders',
      payment_tracking: 'Payment Tracking',
      document_requests: 'Document Requests',
      service_coordination: 'Service Coordination',
      pinned: 'Pinned',
      urgent: 'Urgent',
      high: 'High Priority'
    },
    actions: {
      pin: 'Pin',
      unpin: 'Unpin',
      edit: 'Edit',
      duplicate: 'Duplicate',
      delete: 'Delete',
      export: 'Export',
      import: 'Import'
    },
    timeAgo: {
      now: 'Now',
      minute: 'minute ago',
      minutes: 'minutes ago',
      hour: 'hour ago',
      hours: 'hours ago',
      day: 'day ago',
      days: 'days ago'
    }
  },

  // Page Titles
  pages: {
    index: 'Home',
    menu: 'Menu',
    splitView: 'Split View',
    hasarBildirimi: 'Damage Report'
  },

  // Actions
  actions: {
    add: 'Add',
    addMore: 'Add more',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm'
  },

  // Messages
  messages: {
    confirmDelete: 'Are you sure you want to delete?',
    saved: 'Successfully saved',
    error: 'An error occurred'
  },

  // Settings
  settings: {
    title: 'Application Settings',
    language: 'Language',
    theme: 'Theme',
    general: {
      title: 'General Settings'
    },
    performance: {
      title: 'Performance Mode',
      subtitle: 'Enable for faster performance'
    },
    notificationSettings: {
      title: 'Notification Settings',
      sound: 'Sound Notifications',
      desktop: 'Desktop Notifications',
      email: 'Email Notifications'
    },
    privacySettings: {
      title: 'Privacy & Security',
      dataCollection: 'Data Collection',
      historyTracking: 'History Tracking',
      autoLogin: 'Auto Login'
    },
    data: {
      title: 'Data Management',
      export: 'Export Data',
      import: 'Import Data',
      clear: 'Clear All Data',
      clearConfirm: {
        title: 'Clear Data',
        message: 'All application data will be deleted. This action cannot be undone. Do you want to continue?'
      }
    },
    aboutSection: {
      title: 'About',
      version: 'Version',
      help: 'Help',
      feedback: 'Feedback'
    },
    messages: {
      languageChanged: 'Language changed successfully',
      themeChanged: 'Theme changed successfully',
      dataExported: 'Data exported successfully',
      dataImported: 'Data imported successfully',
      dataCleared: 'All data cleared',
      importError: 'Error occurred while importing data'
    },
    sidebar: {
      title: 'Sidebar Settings',
      workspaces: 'Workspaces',
      services: 'Integrated Services',
      tools: 'Tools',
      settings: 'Sidebar Settings',
      show: 'Show sidebar',
      hide: 'Auto-hide sidebar'
    },
    appearance: {
      title: 'Appearance',
      theme: 'Theme',
      accentColor: 'Accent Color',
      highContrast: 'High Contrast'
    }
  },

  // History
  history: {
    title: 'History',
    search: 'Search in history...',
    recent: 'Recent History',
    mostVisited: 'Most Visited',
    quickActions: 'Quick Actions',
    settings: 'Settings',
    clearCategory: 'Clear Category',
    addToFavorites: 'Add to Favorites',
    remove: 'Remove',
    enableTracking: 'Enable history tracking',
    autoCleanup: 'Auto cleanup',
    empty: {
      title: 'No history yet',
      subtitle: 'Pages you visit and operations you perform will appear here'
    },
    categories: {
      all: 'All',
      page: 'Pages',
      file: 'Files',
      operation: 'Operations',
      search: 'Searches'
    },
    types: {
      page: 'Page',
      file: 'File',
      operation: 'Operation',
      search: 'Search',
      damage: 'Damage',
      payment: 'Payment',
      customer: 'Customer',
      expert: 'Expert',
      service: 'Service'
    },
    timeAgo: {
      now: 'Now',
      minute: 'minute ago',
      minutes: 'minutes ago',
      hour: 'hour ago',
      hours: 'hours ago',
      day: 'day ago',
      days: 'days ago'
    }
  },

    
    // Menu Page
    menuPage: {
      search: 'Search in menu...',
      categories: {
        damageOperations: 'Damage Operations',
        customerOperations: 'Customer Operations',
        expertOperations: 'Expert Operations',
        serviceOperations: 'Service Operations',
        financialOperations: 'Financial Operations',
        reportsAnalytics: 'Reports & Analytics',
        systemManagement: 'System Management',
        helpSupport: 'Help & Support'
      },
      items: {
        // Damage Operations
        damageReport: 'Damage Report',
        damageTracking: 'Damage Tracking',
        damageFiles: 'Damage Files',
        expertAssignments: 'Expert Assignments',
        serviceAssignments: 'Service Assignments',
        paymentApprovals: 'Payment Approvals',
        
        // Customer Operations
        customerInfo: 'Customer Information',
        policyQuery: 'Policy Query',
        communicationHistory: 'Communication History',
        customerRequests: 'Customer Requests',
        notifications: 'SMS/Email Notifications',
        
        // Expert Operations
        expertList: 'Expert List',
        expertReports: 'Expert Reports',
        performanceTracking: 'Performance Tracking',
        fieldTasks: 'Field Tasks',
        expertPayments: 'Expert Payments',
        youtubeTest: 'YouTube Test',
        
        // Service Operations
        contractedServices: 'Contracted Services',
        serviceReports: 'Service Reports',
        partRequests: 'Part Requests',
        invoiceOperations: 'Invoice Operations',
        qualityControl: 'Quality Control',
        
        // Financial Operations
        damagePayments: 'Damage Payments',
        expenseManagement: 'Expense Management',
        invoiceApprovals: 'Invoice Approvals',
        recourseOperations: 'Recourse Operations',
        accountingRecords: 'Accounting Records',
        
        // Reports & Analytics
        damageStatistics: 'Damage Statistics',
        performanceReports: 'Performance Reports',
        riskAnalysis: 'Risk Analysis',
        costAnalysis: 'Cost Analysis',
        periodicReports: 'Periodic Reports',
        
        // System Management
        userManagement: 'User Management',
        rolesPermissions: 'Roles & Permissions',
        systemSettings: 'System Settings',
        logRecords: 'Log Records',
        backup: 'Backup',
        
        // Help & Support
        userGuide: 'User Guide',
        faq: 'FAQ',
        supportRequests: 'Support Requests',
        trainingVideos: 'Training Videos',
        contact: 'Contact'
      }
    },

    // Account
    account: {
      title: 'My Account',
      statistics: 'Statistics',
      recentActivities: 'Recent Activities',
      refreshActivities: 'Refresh Activities',
      accountActions: 'Account Actions',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      security: 'Security',
      exportData: 'Export Data',
      logout: 'Logout',
      
      // Profile fields
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      
      // Password fields
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      
      // Security settings
      twoFactorAuth: 'Two-Factor Authentication',
      twoFactorAuthDesc: 'Protect your account with an extra layer of security',
      sessionTimeout: 'Session Timeout',
      sessionTimeoutDesc: 'Automatic logout time',
      
      // Statistics
      stats: {
        damageFiles: 'Damage Files',
        completedTasks: 'Completed Tasks',
        pendingApprovals: 'Pending Approvals'
      },
      
      // Time ago
      timeAgo: {
        now: 'Now',
        minutes: 'minutes ago',
        hours: 'hours ago',
        days: 'days ago'
      },
      
      // Empty state
      empty: {
        title: 'No activities yet',
        subtitle: 'Your recent activities will appear here'
      }
    }

}
