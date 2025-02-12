const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        components: {
          default: () => import('pages/IndexPage.vue'),
          split: () => import('pages/SplitIndexPage.vue')
        }
      },
      { 
        path: 'menu', 
        components: {
          default: () => import('pages/MenuPage.vue'),
          split: () => import('pages/SplitIndexPage.vue')
        }
      },
      { 
        path: 'hasar-bildirimi', 
        components: {
          default: () => import('src/pages/HasarBildirimiPage.vue'),
          split: () => import('pages/SplitIndexPage.vue')
        }
      },
      { 
        path: 'hasar-takibi', 
        components: {
          default: () => import('src/pages/HasarTakibiPage.vue'),
          split: () => import('pages/SplitIndexPage.vue')
        }
      },
      { 
        path: 'hasar-dosyalari', 
        components: {
          default: () => import('src/pages/HasarDosyalariPage.vue'),
          split: () => import('pages/SplitIndexPage.vue')
        }
      },
      { 
        path: 'split',
        components: {
          default: () => import('pages/SplitIndexPage.vue'),
          split: () => import('pages/SplitIndexPage.vue')
        }
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
