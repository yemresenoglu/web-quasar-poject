export default {
  // Page Titles (for browser tab)
  pageTitles: {
    home: 'Home',
    menu: 'Menu',
    login: 'Login',
    hasarSorgulaArabulucu: 'Damage File Search',
    hasarDosyaArabulucu: 'Damage File Detail',
    accountEditProfile: 'Edit Profile',
    accountChangePassword: 'Change Password',
    notFound: 'Page Not Found'
  },

  // Page Header
  pageHeader: {
    actions: {
      print: 'Print',
      download: 'Download',
      share: 'Share'
    },
    messages: {
      printing: 'Printing...',
      downloading: 'Downloading...',
      shareFeature: 'Share feature coming soon'
    }
  },

  // Common actions
  common: {
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    addMore: 'Add more',
    back: 'Back',
    result: 'result',
    found: 'found'
  },

  // Login page
  login: {
    title: 'SOMPO Damage Operations',
    subtitle: 'Damage Management System',
    userCode: 'User Code',
    password: 'Password',
    captcha: 'Security Code',
    loginButton: 'Sign In',
    forgotPassword: 'Forgot Password',
    forgotPasswordTitle: 'Password Reset',
    forgotPasswordDescription: 'Enter your email address and we will send you a password reset link.',
    email: 'Email Address',
    sendResetLink: 'Send Link',
    refreshCaptcha: 'Refresh Code',
    invalidCaptcha: 'Security code is incorrect',
    successMessage: 'Successfully signed in',
    errorMessage: 'Invalid user code or password',
    resetLinkSent: 'Password reset link has been sent to your email address',
    resetLinkError: 'Failed to send password reset link',
    footer: 'For secure login, do not share your password with anyone',
    help: 'Help',
    contact: 'Contact'
  },

  // Validation messages
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    passwordMismatch: 'Passwords do not match',
    invalidFormat: 'Invalid format',
    userCodeFormat: 'User code must contain only uppercase letters and numbers',
    phoneFormat: 'Please enter a valid phone number'
  },

  // Notification types
  notification: {
    success: 'Success',
    error: 'Error',
    info: 'Information',
    warning: 'Warning'
  },

  // Taskbar
  taskbar: {
    start: 'Start',
    menu: 'Menu',
    account: 'My Account'
  },

  // Quick Access (in AccountMenu)
  quickAccess: {
    title: 'Quick Access',
    empty: 'No quick access items yet',
    pinToTaskbar: 'Pin to taskbar',
    unpinFromTaskbar: 'Unpin from taskbar',
    addToQuickAccess: 'Add to Quick Access',
    removeFromQuickAccess: 'Remove from Quick Access'
  },

  // Taskbar Settings (in AccountMenu)
  taskbarSettings: {
    title: 'Taskbar',
    autoHide: 'Auto Hide',
    position: 'Position',
    showLeft: 'Show on Left',
    showBottom: 'Show on Bottom',
    showRight: 'Show on Right'
  },

  // Quick Menu (used in MenuPage)
  quickMenu: {
    title: 'Quick Menu',
    addToQuickAccess: 'Add to Quick Access',
    removeFromQuickAccess: 'Remove from Quick Access'
  },
    
    // Menu Page
    menuPage: {
      search: 'Search in menu...',
      noResults: 'No Results Found',
      tryDifferentSearch: 'Try a different search term',
      clearSearch: 'Clear Search',
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
        damageTracking: 'Damage Tracking',
        damageQuery: 'Damage File Query',
      damageQueryMediator: 'Damage File Query (Mediator)',
        expertAssignments: 'Expert Assignments',
        serviceAssignments: 'Service Assignments',
        paymentApprovals: 'Payment Approvals',
        
        // Customer Operations
        customerInfo: 'Customer Information',
        policyQuery: 'Policy Query',
        communicationHistory: 'Communication History',
        customerRequests: 'Customer Requests',
        
        // Expert Operations
        expertList: 'Expert List',
        expertReports: 'Expert Reports',
        performanceTracking: 'Performance Tracking',
        fieldTasks: 'Field Tasks',
        expertPayments: 'Expert Payments',
        
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
    menuDescription: 'User account information, department selection, tasks and account operations menu',
    profile: 'Profile',
      actions: 'Account Actions',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      logout: 'Logout',
      active: 'Active',
    lastLogin: 'Last Login',
      editDepartment: 'Edit Department',
      selectDepartment: 'Select Department',
      departmentSelected: 'Department Selected',
      myTasks: 'My Tasks',
      taskSelected: 'Task Selected',
      selectTask: 'Select Task',
      noTasks: 'No tasks available',
      
      // Profile fields
      firstName: 'First Name',
      lastName: 'Last Name',
      userCode: 'User Code',
      department: 'Department',
      email: 'Email',
      phone: 'Phone',
      position: 'Position',
      defaultUser: 'User',
      defaultFullName: 'Yunus Emre Şenoğlu',
      defaultUserCode: 'YUNUSEMRE',
      defaultDepartment: 'Mediation',
      defaultEmail: 'user@example.com',
      defaultPhone: '+90 555 123 45 67',
      defaultPosition: 'No Task Selected',
      
      // Password fields
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      
      // Profile page specific
      profileInfo: 'Profile Information',
      profileUpdatedSuccessfully: 'Profile updated successfully',
      profileUpdateFailed: 'Error occurred while updating profile',
      passwordChangedSuccessfully: 'Password changed successfully',
      passwordChangeFailed: 'Password change failed',
      passwordChangeError: 'Password change error',
      
      // Password security tips
      passwordSecurityTips: 'Security Tips',
      passwordTip1: 'Must be at least 6 characters long',
      passwordTip2: 'Should contain uppercase, lowercase, numbers and special characters',
      passwordTip3: 'Avoid easily guessable words',
      passwordTip4: 'Change your password regularly',
      
      notifications: {
        profileUpdated: 'Profile updated successfully',
        passwordChanged: 'Password changed successfully',
        passwordChangeFailed: 'Password change failed',
        securityUpdated: 'Security settings updated successfully',
        departmentChanged: 'Department changed successfully',
        taskCompleted: 'Task completed',
        taskReopened: 'Task reopened',
        updateFailed: 'Update failed'
      }
  },

  // Dashboard
  dashboard: {
    // Top info cards
    pendingJobs: 'Pending Jobs',
    myJobs: 'My Jobs',
    sentJobs: 'Sent Jobs',
    
    // Detailed job counts
    detailedJobCounts: 'Detailed Job Counts',
    pending: 'Pending',
    assigned: 'Assigned',
    sent: 'Sent',
    
    // Process types
    processes: {
      valueLossMediation: 'Value Loss Mediation',
      severeDamagePertMediation: 'Severe Damage Pert Mediation',
      bodilyDamageVoluntaryMediation: 'Bodily Damage Voluntary Mediation'
    },
    
    // Job status
    jobStatus: 'Job Status',
    todaySent: 'Today Sent',
    todayReceived: 'Today Received',
    pendingApproval: 'Pending Approval',
    completed: 'Completed',
    activeFiles: 'Active Files',
    expertAssignments: 'Expert Assignments',
    
    // Charts
    charts: {
      workStatusDistribution: 'Work Status Distribution',
      weeklyWorkTrend: 'Weekly Work Trend',
      processBasedWorkload: 'Process-Based Workload',
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      completedJobs: 'Completed Jobs',
      newJobs: 'New Jobs'
    },
    
    // Status messages
    status: {
      lastUpdate: 'Last update: 5 min ago',
      systemActive: 'System active',
      detailedReport: 'Detailed Report'
    },
    
    // Location messages
    location: {
      gettingLocation: 'Getting location...',
      permissionDenied: 'Location permission denied',
      locationUnavailable: 'Location unavailable',
      locationTimeout: 'Location request timeout',
      locationServiceUnavailable: 'Location service unavailable'
    },
    
    // Announcement list
    announcements: {
      title: 'Announcement List',
      empty: 'No announcements available',
      noAnnouncements: 'No announcements available',
      viewAll: 'View All',
      readMore: 'Read More',
      showLess: 'Show Less',
      categories: {
        system: 'System',
        maintenance: 'Maintenance',
        security: 'Security',
        update: 'Update',
        general: 'General'
      },
      priorities: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      items: {
        maintenance: {
          title: 'System Maintenance Announcement',
          description: 'Planned system maintenance will be performed this weekend.'
        },
        security: {
          title: 'Security Update',
          description: 'New security measures have been implemented.'
        },
        update: {
          title: 'New Feature: Report Module',
          description: 'Advanced reporting features are now available.'
        }
      },
      testNotification: 'Dashboard Loaded - Custom Notification Test',
      unknownLocation: 'Unknown'
    }
  },

  // Damage File Query (Mediator)
  damageQueryMediator: {
    title: 'Damage File Query (Mediator)',
    refresh: 'Refresh',
    exportResults: 'Export Results',
    
    // Tab labels
    tabs: {
      damage: 'Damage'
    },
    
    // Section titles
    sections: {
      damageInfo: 'Damage Information'
    },
    
    searchForm: {
      fileNumber: 'File Number',
      victimNumber: 'Victim Number',
      searchButton: 'Search',
      clearButton: 'Clear'
    },
    results: {
      title: 'Search Results',
      noResults: 'No results found',
      fileNumber: 'File Number',
      policyNumber: 'Policy Number',
      insuredName: 'Insured',
      insuredPlate: 'Insured Plate',
      insuredFaultRate: 'Fault Rate',
      victimName: 'Victim',
      victimPlate: 'Victim Plate',
      subBranch: 'Sub Branch',
      damageReason: 'Damage Reason',
      subDamageReason: 'Sub Damage Reason',
      reportDate: 'Report Date',
      damageDate: 'Damage Date',
      actions: 'Actions'
    }
  },

  // Damage File Query
  damageQuery: {
    title: 'Damage File Query',
    refresh: 'Refresh',
    exportResults: 'Export Results',
    
    // Tab labels
    tabs: {
      damage: 'Damage',
      insured: 'Insured',
      victim: 'Victim',
      responsible: 'Responsible Person'
    },
    
    // Form labels
    form: {
      fileNumber: 'File Number',
      reportNumber: 'Report Number',
      fileStatus: 'File General Status',
      subBranch: 'Sub Branch',
      productCode: 'Product Code',
      damageReason: 'Damage Reason',
      preReportStartDate: 'Pre-Report Start Date',
      preReportEndDate: 'Pre-Report End Date',
      reportStartDate: 'Report Start Date',
      reportEndDate: 'Report End Date',
      damageStartDate: 'Damage Start Date',
      damageEndDate: 'Damage End Date',
      sideFile: 'Side File',
      fileType: 'File Type',
      priority: 'Priority',
      status: 'Status',
      policyNumber: 'Policy Number',
      insuredName: 'Insured Name',
      insuredSurname: 'Insured Surname',
      insuredPlate: 'Insured Plate',
      victimName: 'Victim Name',
      victimPlate: 'Victim Plate',
      legalNumber: 'Legal Number',
      hasRecourse: 'Has Recourse?',
      subDamageReason: 'Sub Damage Reason'
    },
    
    // Table columns
    table: {
      priority: 'Priority',
      status: 'Status',
      fileNumber: 'File Number',
      reportNumber: 'Report Number',
      sideFile: 'Side File',
      preReportReason: 'Pre-Report Reason',
      fileType: 'File Type',
      policyNumber: 'Policy Number',
      insuredName: 'Insured Name',
      insuredPlate: 'Insured Plate',
      insuredSurname: 'Insured Surname',
      victimName: 'Victim Name',
      victimPlate: 'Victim Plate',
      legalNumber: 'Legal Number',
      hasRecourse: 'Has Recourse?',
      subBranch: 'Sub Branch',
      damageReason: 'Damage Reason',
      subDamageReason: 'Sub Damage Reason',
      actions: 'Actions'
    },
    
    // Actions
    actions: {
      search: 'Search',
      clear: 'Clear',
      viewDetails: 'View Details',
      edit: 'Edit',
      delete: 'Delete'
    },
    
    // Messages
    messages: {
      noResults: 'No results found',
      searchResults: 'Search Results',
      loading: 'Loading...'
    }
  },

  // Validation
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {min} characters',
    passwordMismatch: 'Passwords do not match'
  },

  // Error pages
  error: {
    notFound: {
      title: 'Page Not Found',
      message: 'The page you are looking for could not be found or may have been moved.',
      homeButton: 'Go to Home',
      menuButton: 'Go to Menu'
    }
  },

  // Hasar Dosya page
  hasarDosya: {
    title: 'Damage Files',
    actions: {
      print: 'Print',
      download: 'Download',
      share: 'Share',
      upload: 'Upload',
      addNote: 'Add Note'
    },
    sections: {
      reportInfo: 'Report Information',
      eventInfo: 'Event Information',
      policyInfo: 'Policy Information',
      coverageInfo: 'Coverage',
      victimInfo: 'Victim Information',
      expertInfo: 'Expert Information',
      paymentInfo: 'Payment Information',
      documents: 'Documents',
      notesAndProcess: 'Notes and Process',
      expertResults: 'Expert Results'
    },
    labels: {
      reportDate: 'Report Date',
      reportTime: 'Report Time',
      reporter: 'Reporter',
      contact: 'Contact',
      reportType: 'Report Type',
      reportDescription: 'Report Description',
      eventDate: 'Event Date',
      eventTime: 'Event Time',
      eventLocation: 'Event Location',
      city: 'City / District',
      eventDescription: 'Event Description',
      policyNumber: 'Policy Number',
      policyHolder: 'Policy Holder',
      policyStartDate: 'Start Date',
      policyEndDate: 'End Date',
      premium: 'Premium',
      coverageType: 'Coverage Type',
      coverageLimit: 'Coverage Limit',
      victimName: 'Name Surname',
      victimId: 'ID Number',
      victimPhone: 'Phone',
      victimEmail: 'Email',
      estimatedDamage: 'Estimated Damage',
      address: 'Address',
      expertName: 'Expert Name',
      expertCompany: 'Company',
      expertContact: 'Contact',
      assignmentDate: 'Assignment Date',
      reportDate: 'Report Date',
      approvedAmount: 'Approved Amount',
      deductible: 'Deductible',
      netPayment: 'Net Payment',
      paymentType: 'Payment Type',
      paymentDate: 'Payment Date',
      paymentAmount: 'Payment Amount',
      paymentStatus: 'Payment Status',
      paymentDescription: 'Payment Description',
      documentCategory: 'Category',
      documentName: 'Document Name',
      documentDate: 'Document Date',
      documentSize: 'Document Size',
      noteTitle: 'Note Title',
      noteDate: 'Note Date',
      noteAuthor: 'Note Author',
      noteContent: 'Note Content'
    },
    messages: {
      printing: 'File is being printed...',
      downloading: 'File is being downloaded...',
      shareFeature: 'Share feature will be available soon',
      selectDocumentType: 'Please select document type',
      documentRequestSent: '{type} document request sent',
      uploadFeature: 'Document upload feature will be available soon',
      viewingDocument: '{name} is being viewed...',
      downloadingDocument: '{name} is being downloaded...',
      addNoteFeature: 'Add note feature will be available soon',
      editNoteFeature: 'Edit note feature will be available soon',
      deleteNoteFeature: 'Delete note feature will be available soon',
      loadingFile: '{fileNumber} file is being loaded...',
      searchPlaceholder: 'Search file...'
    },
    fileTitle: 'Damage File - {fileNumber}'
  },

  // Hasar Dosya Arabulucu page
  hasarDosyaArabulucu: {
    title: 'Damage File (Mediator)',
    actions: {
      print: 'Print',
      download: 'Download',
      share: 'Share'
    },
    sections: {
      dosyaOzet: 'File Summary Information',
      ihbarVeren: 'Notifier Information',
      degerKaybiArabuluculuk: 'Value Loss Mediation Process',
      evrak: 'Document Information'
    },
    labels: {
      dosyaNo: 'File Number',
      policeNo: 'Policy Number',
      sigortaliAdSoyad: 'Insured Name',
      sigortaliPlaka: 'Insured Plate',
      magdurAdSoyad: 'Victim Name',
      magdurAracPlaka: 'Victim Vehicle Plate',
      hasarNedeni: 'Damage Reason',
      hasarTarihi: 'Damage Date',
      ihbarYapanAdSoyad: 'Notifier Name',
      gsm: 'GSM',
      teklifEdilenTutar: 'Offered Amount',
      vekaletTutari: 'Power of Attorney Fee',
      toplamTutar: 'Total Amount',
      anlasmaYapilacakIslem: 'Action to be Agreed Upon',
      anlasmaDurum: 'Agreement Status',
      talepEdilenRevizeTutar: 'Requested Revised Amount',
      onaylananRevizeTutar: 'Approved Revised Amount',
      anlasmaSaglananTutar: 'Agreed Amount',
      anlasmaSaglananVekaletTutari: 'Agreed Power of Attorney Fee',
      anlasmaSaglananToplamTutar: 'Agreed Total Amount',
      actions: 'Actions'
    },
    messages: {
      printing: 'File is being printed...',
      downloading: 'File is being downloaded...',
      shareFeature: 'Share feature will be available soon',
      selectDocumentType: 'Please select document type',
      documentRequestSent: '{type} document request sent',
      viewingDocument: 'View',
      degerKaybiSaved: 'Value loss mediation information saved'
    },
    evrak: {
      selectType: 'Document type',
      requestDocument: 'Request Document'
    }
  }
}