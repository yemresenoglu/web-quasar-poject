const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { 
          title: 'Giriş Yap',
          titleKey: 'pageTitles.login',
          requiresAuth: false,
          hideFromMenu: true 
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
        meta: { 
          title: 'Başlangıç',
          titleKey: 'pageTitles.home',
          icon: 'house' 
        }
      },
      { 
        path: 'menu', 
        name: 'menu',
        component: () => import('pages/MenuPage.vue'),
        meta: { 
          title: 'Menü',
          titleKey: 'pageTitles.menu',
          icon: 'grid-3x3-gap' 
        }
      },
      { 
        path: 'hasar-sorgula-arabulucu', 
        name: 'hasar-sorgula-arabulucu',
        component: () => import('src/pages/HasarDosyaSorgulaArabulucu.vue'),
        meta: { 
          title: 'Hasar Dosya Sorgula (Arabulucu)',
          titleKey: 'pageTitles.hasarSorgulaArabulucu',
          icon: 'scales' 
        }
      },
      { 
        path: 'hasar-dosya-arabulucu/:dosyaNo', 
        name: 'hasar-dosya-arabulucu',
        component: () => import('src/pages/HasarDosyaArabulucu.vue'),
        meta: { 
          title: 'Hasar Dosya (Arabulucu)',
          titleKey: 'pageTitles.hasarDosyaArabulucu',
          icon: 'scales' 
        }
      },
      { 
        path: 'account/edit-profile', 
        name: 'account-edit-profile',
        component: () => import('src/pages/AccountEditProfile.vue'),
        meta: { 
          title: 'Profil Düzenle',
          titleKey: 'pageTitles.accountEditProfile',
          icon: 'person',
          requiresAuth: true,
          hideFromMenu: true
        }
      },
      { 
        path: 'account/change-password', 
        name: 'account-change-password',
        component: () => import('src/pages/AccountChangePassword.vue'),
        meta: { 
          title: 'Şifre Değiştir',
          titleKey: 'pageTitles.accountChangePassword',
          icon: 'key',
          requiresAuth: true,
          hideFromMenu: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      titleKey: 'pageTitles.notFound'
    }
  }
]

export default routes
