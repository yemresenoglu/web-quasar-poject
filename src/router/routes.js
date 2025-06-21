const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        name: 'home',
        component: () => import('pages/IndexPage.vue')
      },
      { 
        path: 'menu', 
        name: 'menu',
        component: () => import('pages/MenuPage.vue')
      },
      { 
        path: 'hasar-bildirimi', 
        name: 'hasar-bildirimi',
        component: () => import('src/pages/HasarBildirimiPage.vue')
      },
      { 
        path: 'hasar-takibi', 
        name: 'hasar-takibi',
        component: () => import('src/pages/HasarTakibiPage.vue')
      },
      { 
        path: 'hasar-dosyalari', 
        name: 'hasar-dosyalari',
        component: () => import('src/pages/HasarDosyalariPage.vue')
      },
      { 
        path: 'musteri-bilgileri', 
        name: 'musteri-bilgileri',
        component: () => import('src/pages/IndexPage.vue')
      },
      { 
        path: 'police-sorgulama', 
        name: 'police-sorgulama',
        component: () => import('src/pages/IndexPage.vue')
      },
      { 
        path: 'webapp/:appId', 
        name: 'webapp',
        component: () => import('src/pages/EmptyPage.vue')
      },
      { 
        path: 'performance', 
        name: 'performance',
        component: () => import('src/pages/PerformancePage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
