<template>
  <div class="account-menu__section">
    <div class="account-menu__section-header">
      <div class="account-menu__section-title">{{ $t('themeSettings.title') }}</div>
    </div>
    
    <div class="theme-info">
      <div class="theme-info__text">
        Uygulama görünümünü kişiselleştirmek için bir tema seçin. Seçiminiz otomatik olarak kaydedilir.
      </div>
    </div>
    
    <div class="account-menu__list">
      <!-- Light Theme Card -->
      <div 
        class="theme-card"
        :class="{ 'theme-card--active': !uiStore.darkMode && !uiStore.sompoMode }"
        @click="selectTheme('light')"
        role="button"
        tabindex="0"
        :aria-label="$t('themeSettings.lightTheme')"
        @keydown.enter="selectTheme('light')"
        @keydown.space.prevent="selectTheme('light')"
      >
               <div class="theme-card__preview">
                 <div class="theme-card__colors">
                   <div class="color-swatch color-swatch--primary" style="background: #ffffff;" title="Ana Arka Plan"></div>
                   <div class="color-swatch color-swatch--secondary" style="background: #f8fafc;" title="İkincil Arka Plan"></div>
                   <div class="color-swatch color-swatch--accent" style="background: #e2e8f0;" title="Vurgu Rengi"></div>
                   <div class="color-swatch color-swatch--border" style="background: #cbd5e1;" title="Kenarlık Rengi"></div>
                   <div class="color-swatch color-swatch--text" style="background: #1e293b;" title="Metin Rengi"></div>
                   <div class="color-swatch color-swatch--accent2" style="background: #3b82f6;" title="Primary Renk"></div>
                 </div>
          <div class="theme-card__icon">
            <i class="bi bi-sun" style="font-size: 16px;"></i>
          </div>
        </div>
        <div class="theme-card__content">
          <div class="theme-card__title">{{ $t('themeSettings.lightTheme') }}</div>
          <div class="theme-card__description">{{ $t('themeSettings.lightDescription') }}</div>
          <div class="theme-card__features">
            <span class="feature-tag">
              <i class="bi bi-eye" style="font-size: 10px; margin-right: 4px;"></i>
              Göz Dostu
            </span>
            <span class="feature-tag">
              <i class="bi bi-sun" style="font-size: 10px; margin-right: 4px;"></i>
              Parlak
            </span>
          </div>
        </div>
        <div class="theme-card__selector">
          <div 
            class="theme-selector"
            :class="{ 'theme-selector--active': !uiStore.darkMode && !uiStore.sompoMode }"
          >
            <div class="theme-selector__dot">
              <i v-if="!uiStore.darkMode && !uiStore.sompoMode" class="bi bi-check" style="font-size: 10px; color: white;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Dark Theme Card -->
      <div 
        class="theme-card"
        :class="{ 'theme-card--active': uiStore.darkMode && !uiStore.sompoMode }"
        @click="selectTheme('dark')"
        role="button"
        tabindex="0"
        :aria-label="$t('themeSettings.darkTheme')"
        @keydown.enter="selectTheme('dark')"
        @keydown.space.prevent="selectTheme('dark')"
      >
               <div class="theme-card__preview">
                 <div class="theme-card__colors">
                   <div class="color-swatch color-swatch--primary" style="background: #030514;" title="Ana Arka Plan"></div>
                   <div class="color-swatch color-swatch--secondary" style="background: #242735;" title="İkincil Arka Plan"></div>
                   <div class="color-swatch color-swatch--accent" style="background: #374151;" title="Vurgu Rengi"></div>
                   <div class="color-swatch color-swatch--border" style="background: #4b5563;" title="Kenarlık Rengi"></div>
                   <div class="color-swatch color-swatch--text" style="background: #f8fafc;" title="Metin Rengi"></div>
                   <div class="color-swatch color-swatch--accent2" style="background: #60a5fa;" title="Primary Renk"></div>
                 </div>
          <div class="theme-card__icon">
            <i class="bi bi-moon" style="font-size: 16px;"></i>
          </div>
        </div>
        <div class="theme-card__content">
          <div class="theme-card__title">{{ $t('themeSettings.darkTheme') }}</div>
          <div class="theme-card__description">{{ $t('themeSettings.darkDescription') }}</div>
          <div class="theme-card__features">
            <span class="feature-tag">
              <i class="bi bi-moon" style="font-size: 10px; margin-right: 4px;"></i>
              Gece Modu
            </span>
            <span class="feature-tag">
              <i class="bi bi-battery-charging" style="font-size: 10px; margin-right: 4px;"></i>
              Batarya Tasarrufu
            </span>
          </div>
        </div>
        <div class="theme-card__selector">
          <div 
            class="theme-selector"
            :class="{ 'theme-selector--active': uiStore.darkMode && !uiStore.sompoMode }"
          >
            <div class="theme-selector__dot">
              <i v-if="uiStore.darkMode && !uiStore.sompoMode" class="bi bi-check" style="font-size: 10px; color: white;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Sompo Theme Card -->
      <div 
        class="theme-card"
        :class="{ 'theme-card--active': uiStore.sompoMode && !uiStore.darkMode }"
        @click="selectTheme('sompo')"
        role="button"
        tabindex="0"
        :aria-label="$t('themeSettings.sompoTheme')"
        @keydown.enter="selectTheme('sompo')"
        @keydown.space.prevent="selectTheme('sompo')"
      >
               <div class="theme-card__preview">
                 <div class="theme-card__colors">
                   <div class="color-swatch color-swatch--primary" style="background: #f8f3f4;" title="Ana Arka Plan"></div>
                   <div class="color-swatch color-swatch--secondary" style="background: #f8dee0;" title="İkincil Arka Plan"></div>
                   <div class="color-swatch color-swatch--accent" style="background: #f3c5c5;" title="Vurgu Rengi"></div>
                   <div class="color-swatch color-swatch--border" style="background: #f3c5c5;" title="Kenarlık Rengi"></div>
                   <div class="color-swatch color-swatch--text" style="background: #1e293b;" title="Metin Rengi"></div>
                   <div class="color-swatch color-swatch--accent2" style="background: #b42029;" title="SOMPO Kırmızı"></div>
                 </div>
          <div class="theme-card__icon">
            <div class="sompo-logo-icon">
              <div class="sompo-circle-fill"></div>
              <div class="sompo-circle-stroke"></div>
            </div>
          </div>
        </div>
        <div class="theme-card__content">
          <div class="theme-card__title">{{ $t('themeSettings.sompoTheme') }}</div>
          <div class="theme-card__description">{{ $t('themeSettings.sompoDescription') }}</div>
          <div class="theme-card__features">
            <span class="feature-tag">
              <i class="bi bi-heart" style="font-size: 10px; margin-right: 4px;"></i>
              Marka Kimliği
            </span>
            <span class="feature-tag">
              <i class="bi bi-palette" style="font-size: 10px; margin-right: 4px;"></i>
              Özel Renkler
            </span>
          </div>
        </div>
        <div class="theme-card__selector">
          <div 
            class="theme-selector"
            :class="{ 'theme-selector--active': uiStore.sompoMode && !uiStore.darkMode }"
          >
            <div class="theme-selector__dot">
              <i v-if="uiStore.sompoMode && !uiStore.darkMode" class="bi bi-check" style="font-size: 10px; color: white;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useUIStore } from 'src/stores/ui-store'
import { createLogger } from 'src/utils/logger.js'

const { t: $t } = useI18n()
const uiStore = useUIStore()
const logger = createLogger('AccountThemeSettings')

const selectTheme = (theme) => {
  logger.info('Theme selection:', theme)
  
  // Tema adlarını belirle
  const themeNames = {
    light: 'Aydınlık Tema',
    dark: 'Karanlık Tema', 
    sompo: 'SOMPO Tema'
  }
  
  switch (theme) {
    case 'light':
      uiStore.setDarkMode(false)
      uiStore.setSompoMode(false)
      break
    case 'dark':
      uiStore.setDarkMode(true)
      uiStore.setSompoMode(false)
      break
    case 'sompo':
      uiStore.setDarkMode(false)
      uiStore.setSompoMode(true)
      break
  }
  
  // Kullanıcıya bildirim göster
  uiStore.showSuccess(`${themeNames[theme]} aktif edildi`)
  
  logger.info('Theme changed to:', theme)
}
</script>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.account-menu__section {
  padding: 8px 0;
}

.account-menu__section-header {
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}

.account-menu__section-title {
  color: $text-secondary;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  padding: 0;
}

.theme-info {
  padding: 0 16px 8px;
}

.theme-info__text {
  font-size: 11px;
  color: $text-secondary;
  line-height: 1.4;
  opacity: 0.8;
}

.account-menu__list {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// Theme Card Styles
.theme-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid $border-lighter;
  border-radius: 8px;
  background: $background-card;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
  
    &:hover {
      background: $background-light;
      border-color: $border-accent;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      
      .theme-card__colors {
        .color-swatch {
          transform: scale(1.1);
        }
      }
      
      &::before {
        opacity: 1;
      }
    }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:focus {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
  
  &--active {
    border-color: $primary;
    background: rgba($primary, 0.05);
    box-shadow: 0 0 0 1px rgba($primary, 0.2);
    
    &:hover {
      background: rgba($primary, 0.1);
      box-shadow: 0 0 0 1px rgba($primary, 0.3);
    }
    
    .theme-card__title {
      color: $primary;
      font-weight: 700;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: $primary;
      border-radius: 50%;
      animation: theme-pulse 2s infinite;
    }
  }
}

.theme-card__preview {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.theme-card__colors {
  display: flex;
  gap: 3px;
}

  .color-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: help;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
      z-index: 1;
      position: relative;
    }
    
    &--primary {
      border-radius: 2px 0 0 2px;
    }
    
    &--accent2 {
      border-radius: 0 2px 2px 0;
    }
    
    &--text {
      border-radius: 0;
    }
  }

.theme-card__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
}

.theme-card__content {
  flex: 1;
  min-width: 0;
}

.theme-card__title {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2px;
  
  // Light mode'da tema başlıklarının rengini düzelt
  .body--light & {
    color: #1e293b;
  }
}

.theme-card__description {
  font-size: 11px;
  color: $text-secondary;
  line-height: 1.4;
  margin-bottom: 6px;
}

.theme-card__features {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  color: $text-secondary;
  background: rgba($text-secondary, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  // Hover durumunda renk değişmez, tema rengi korunur
}

.theme-card__selector {
  flex-shrink: 0;
}

.theme-selector {
  width: 20px;
  height: 20px;
  border: 2px solid $text-secondary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: $primary;
    transform: scale(1.1);
  }
  
  &--active {
    border-color: $primary;
  }
}

.theme-selector__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .theme-selector--active & {
    background: $primary;
  }
}

// Sompo Logo Icon
.sompo-logo-icon {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sompo-circle-fill {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #b42029;
  border-radius: 50%;
  z-index: 2;
}

.sompo-circle-stroke {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #b42029;
  border-radius: 50%;
  z-index: 1;
}

// Dark mode adjustments
body.dark-mode {
  .theme-card {
    border-color: $border-lighter;
    
    &:hover {
      background: $background-light;
      border-color: $border-accent;
    }
    
    &--active {
      border-color: $primary;
      background: rgba($primary, 0.1);
      
      &:hover {
        background: rgba($primary, 0.15);
      }
    }
  }
}

// Sompo mode adjustments
body.sompo-mode {
  .theme-card {
    border-color: rgba(243, 197, 197, 0.3);
    
    &:hover {
      background: rgba(248, 222, 223, 0.5);
      border-color: rgba(180, 32, 41, 0.3);
    }
    
    &--active {
      border-color: rgba(180, 32, 41, 0.6);
      background: rgba(180, 32, 41, 0.05);
      
      &:hover {
        background: rgba(180, 32, 41, 0.1);
      }
    }
  }
  
  .theme-selector {
    border-color: rgba(180, 32, 41, 0.4);
    
    &--active {
      border-color: rgba(180, 32, 41, 1);
    }
  }
  
  .theme-selector__dot {
    .theme-selector--active & {
      background: rgba(180, 32, 41, 1);
    }
  }
}

// Animasyon tanımları
@keyframes theme-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
