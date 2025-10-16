<template>
  <q-page class="menu-page" @contextmenu="handleGlobalContextMenu" @click="closeContextMenu">
    <div class="menu-page__search-container">
      <div class="menu-page__search-wrapper">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          :placeholder="t('menuPage.search')"
          class="menu-page__search-input"
        >
          <template v-slot:prepend>
            <i class="bi bi-search"></i>
          </template>
          <template v-slot:append>
            <i v-if="searchQuery" class="bi bi-x cursor-pointer" @click="clearSearch"></i>
          </template>
        </q-input>
      </div>
    </div>
    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="menu-page__container">
      <div v-for="n in 6" :key="n" class="menu-page__category">
        <div class="menu-page__category-header">
          <q-skeleton type="QAvatar" size="24px" class="q-mr-sm" />
          <q-skeleton type="text" width="40%" />
        </div>
        <q-list class="menu-page__list">
          <q-item v-for="i in 8" :key="i" class="menu-page__item">
            <q-item-section avatar>
              <q-skeleton type="QAvatar" size="24px" />
            </q-item-section>
            <q-item-section>
              <q-skeleton type="text" :width="`${60 + i * 5}%`" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasSearchResults" class="empty-state">
      <i class="bi bi-inbox"></i>
      <p class="empty-state__title">{{ $t('menuPage.noResults') }}</p>
      <p class="empty-state__description">{{ $t('menuPage.tryDifferentSearch') }}</p>
      <q-btn
        flat
        color="primary"
        :label="$t('menuPage.clearSearch')"
        @click="clearSearch"
        :aria-label="$t('menuPage.clearSearch')"
        class="q-mt-md"
      />
    </div>

    <!-- Menu Container -->
    <div v-else class="menu-page__container">
      <div v-for="menuItem in filteredMenuData" :key="menuItem.id" class="menu-page__category">
        <div class="menu-page__category-header">
          <i :class="menuItem.icon" class="q-mr-sm"></i>
          <h3 class="menu-page__category-title">{{ menuItem.text }}</h3>
        </div>
        <q-list class="menu-page__list">
          <q-item
            v-for="item in menuItem.items"
            :key="item.id"
            clickable
            v-ripple
            :class="[
              'menu-page__item',
              { 'menu-page__item--context-menu': hoveredItem?.id === item.id },
            ]"
            @click="openInTab(item)"
            @mouseenter="handleItemHover(item)"
            @mouseleave="handleItemLeave()"
            @contextmenu="openContextMenu($event, item)"
          >
            <q-item-section avatar v-if="item.icon">
              <i :class="item.icon"></i>
            </q-item-section>
            <q-item-section>
              <div class="menu-page__item-content">
                <span class="menu-page__item-text">{{ item.text }}</span>
                <q-chip
                  v-if="item.quickAccess"
                  size="xs"
                  color="blue"
                  text-color="white"
                  class="menu-page__chip"
                >
                  <i class="bi bi-lightning q-mr-xs"></i>
                  {{ $t('quickMenu.title') }}
                </q-chip>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Custom Context Menu -->
    <div
      v-if="showContextMenu && selectedItem"
      class="menu-page__context-menu"
      :style="contextMenuStyle"
      @click.stop
    >
      <div class="menu-page__context-menu-item" @click="toggleQuickAccess">
        <i
          :class="[
            selectedItem?.quickAccess ? 'bi bi-check-circle' : 'bi bi-circle',
            { 'menu-page__context-menu-icon--active': selectedItem?.quickAccess },
          ]"
        ></i>
        <span class="menu-page__context-menu-text">
          {{
            selectedItem?.quickAccess
              ? $t('quickMenu.removeFromQuickAccess')
              : $t('quickMenu.addToQuickAccess')
          }}
        </span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMenuPageStore } from 'src/stores/menu-page-store'
import { useAuthStore } from 'src/stores/auth-store'

// Composables
const { t } = useI18n()
const menuPageStore = useMenuPageStore()
const router = useRouter()
const authStore = useAuthStore()

// Store state (direkt store'dan al - reactive)
const isLoading = computed(() => menuPageStore.isLoading)
const searchQuery = computed({
  get: () => menuPageStore.searchQuery,
  set: (value) => menuPageStore.setSearchQuery(value),
})
const showContextMenu = computed(() => menuPageStore.showContextMenu)
const selectedItem = computed(() => menuPageStore.selectedItem)
const hoveredItem = computed(() => menuPageStore.hoveredItem)
const contextMenuStyle = computed(() => menuPageStore.contextMenuStyle)

// Menu data with translations
const translatedMenuData = computed(() => {
  return menuPageStore.menuData.map((category) => ({
    ...category,
    // Eğer translationKey varsa çevir, yoksa text'i kullan
    text: category.translationKey ? t(category.translationKey) : category.text,
    items: category.items.map((item) => ({
      ...item,
      // Eğer translationKey varsa çevir, yoksa text'i kullan
      text: item.translationKey ? t(item.translationKey) : item.text,
    })),
  }))
})

// Filtered menu data based on search query
const filteredMenuData = computed(() => {
  if (!menuPageStore.searchQuery || menuPageStore.searchQuery.trim() === '') {
    return translatedMenuData.value
  }

  const query = menuPageStore.searchQuery.toLowerCase().trim()

  return translatedMenuData.value
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.text.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)),
      ),
    }))
    .filter((category) => category.items.length > 0)
})

// Check if search has results
const hasSearchResults = computed(() => {
  return filteredMenuData.value.length > 0
})

// Methods (store actions'lara delegate et)
const clearSearch = () => {
  menuPageStore.clearSearch()
}

const openInTab = (item) => {
  if (!item.route) return

  // Debug: Route'u logla
  console.log('🟢 MenuPage navigating to:', {
    id: item.id,
    route: item.route,
    translationKey: item.translationKey,
  })

  router.push(item.route)
}

const handleItemHover = (item) => {
  menuPageStore.handleItemHover(item)
}

const handleItemLeave = () => {
  menuPageStore.handleItemLeave()
}

const openContextMenu = (event, item) => {
  menuPageStore.openContextMenu(event, item)
}

const toggleQuickAccess = () => {
  if (menuPageStore.selectedItem) {
    menuPageStore.toggleQuickAccess(menuPageStore.selectedItem.id)
    menuPageStore.closeContextMenu()
  }
}

const closeContextMenu = () => {
  menuPageStore.closeContextMenu()
}

const handleGlobalContextMenu = (event) => {
  menuPageStore.handleGlobalContextMenu(event)
}

// Lifecycle
onMounted(async () => {
  // Start loading from store
  menuPageStore.startLoading(600)

  // Kullanıcı bilgilerini kontrol et ve menüyü yükle
  const userOid = authStore.user?.oid
  if (userOid) {
    console.log('🟢 MenuPage loading with userOid:', userOid)

    // Development mode'da cache'i temizle
    if (process.env.NODE_ENV === 'development') {
      menuPageStore.clearMenuCache(userOid)
    }

    await menuPageStore.loadMenuData(userOid)
  } else {
    console.warn('⚠️ UserOid not available for menu - using demo data')
    await menuPageStore.loadMenuData('DEMO_USER')
  }
})
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

// BEM: Block - menu-page
.menu-page {
  width: 100%;
  height: 100%;
  background: $background-page;
  padding: 24px;

  // BEM: Element - search container
  &__search-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto 24px;
  }

  // BEM: Element - search wrapper
  &__search-wrapper {
    max-width: 600px;
    margin: 0 auto;
  }

  // BEM: Element - search input
  &__search-input {
    :deep(.q-field__control) {
      height: 40px;
      min-height: 40px;
      background: $background-input;
      border: 1px solid $border-light;
      border-radius: 6px;
      transition: all 0.2s ease;

      &::before {
        border: none;
      }

      &:hover {
        border-color: $border-hover;
        box-shadow: $box-shadow-input-hover;
      }
    }

    :deep(.q-field__marginal) {
      height: 40px;
    }

    :deep(.q-field__native) {
      font-size: 14px;
      padding: 0 10px;
      line-height: 1.4;
      height: 40px;
    }

    :deep(.q-field__prepend),
    :deep(.q-field__append) {
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 4px;

      .q-icon,
      i {
        font-size: 18px;
        color: $text-secondary;
        opacity: 0.87;
      }
    }

    &.q-field--focused {
      :deep(.q-field__control) {
        border-color: $border-accent;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
      }
    }
  }

  // BEM: Element - container
  &__container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  // BEM: Element - category
  &__category {
    background: $background-card;
    border-radius: 12px;
    padding: 24px;
    box-shadow: $box-shadow-card;
    transition: all 0.2s ease;
    border: 1px solid $border-lighter;

    &:hover {
      box-shadow: $box-shadow-card-hover;
      transform: translateY(-2px);
    }
  }

  // BEM: Element - category header
  &__category-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-lighter;

    .q-icon,
    i {
      font-size: 20px;
      color: $text-secondary;
      opacity: 0.87;
    }
  }

  // BEM: Element - category title
  &__category-title {
    font-size: 18px;
    font-weight: 600;
    color: $text-secondary;
    margin: 0;
    letter-spacing: 0.3px;
  }

  // BEM: Element - list
  &__list {
    padding: 0;
  }

  // BEM: Element - item
  &__item {
    min-height: 32px;
    padding: 4px 8px;
    color: $text-secondary;
    font-size: 13px;
    border-radius: 2px;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    position: relative;

    :deep(.q-item__section--avatar) {
      min-width: unset;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 2px;
      transition: all 0.2s ease;

      .q-icon,
      i {
        width: 24px;
        height: 24px;
        border-radius: 2px;
        font-size: 14px;
        color: $text-secondary;
        opacity: 0.87;
        display: flex;
        justify-content: center;
        align-items: center;
        transition:
          opacity 0.2s ease,
          color 0.2s ease;
      }
    }

    &:hover {
      background: $background-light;
      border-left: 2px solid $border-accent;
      cursor: pointer;

      :deep(.q-item__section--avatar .q-icon),
      :deep(.q-item__section--avatar i) {
        opacity: 1;
      }
    }

    // BEM: Modifier - context menu enabled
    &--context-menu {
      &:hover {
        cursor: context-menu;
      }
    }

    &:active {
      background: $background-light;
    }
  }

  // BEM: Element - item content
  &__item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  // BEM: Element - item text
  &__item-text {
    flex-grow: 1;
    font-size: 13px;
    font-weight: 500;
    color: $text-secondary;
  }

  // BEM: Element - quick access chip
  &__chip {
    margin-left: 10px;
    font-size: 12px;
    padding: 4px 10px;
    height: 22px;
    background: $background-light !important;
    color: $text-secondary !important;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.15);
    border-radius: 11px;
    border: 1px solid $border-light;

    :deep(.q-icon),
    :deep(i) {
      color: $text-secondary !important;
      font-size: 10px;
    }
  }

  // BEM: Element - context menu
  &__context-menu {
    background: $background-card;
    border: 1px solid $border-light;
    border-radius: 2px;
    box-shadow: 0 2px 8px $shadow-md;
    min-width: 200px;
    padding: 4px;
  }

  // BEM: Element - context menu item
  &__context-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 32px;
    padding: 4px 8px;
    border-radius: 2px;
    transition: all 0.2s ease;
    cursor: pointer;

    .q-icon,
    i {
      color: $text-secondary;
      opacity: 0.87;
      font-size: 14px;
    }

    &:hover {
      background: $background-light;
      border-left: 2px solid $border-accent;

      .q-icon,
      i {
        opacity: 1;
      }
    }
  }

  // BEM: Element - context menu text
  &__context-menu-text {
    font-size: 13px;
    font-weight: 500;
    color: $text-secondary;
  }

  // BEM: Element + Modifier - context menu icon active (#64748b)
  &__context-menu-icon--active {
    color: $text-secondary !important;
    opacity: 1 !important;
  }
}

// Empty State
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;

  i {
    font-size: 80px;
    color: $text-secondary;
    opacity: 0.5;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $text-secondary;
    margin: 0 0 8px 0;
  }

  &__description {
    font-size: 14px;
    color: $text-secondary;
    opacity: 0.7;
    margin: 0;
  }
}
</style>
