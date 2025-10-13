<template>
  <div class="error-page fullscreen">
    <div class="page-container">
      <div class="error-content">
        <div class="error-icon-wrapper">
          <i class="bi bi-exclamation-triangle error-icon"></i>
        </div>
        
        <div class="error-code">
          {{ errorCode }}
        </div>

        <div class="error-title">
          {{ t('error.notFound.title') }}
        </div>

        <div class="error-message">
          {{ errorMessage }}
        </div>

        <div class="error-actions">
          <q-btn
            class="home-button"
            unelevated
            to="/"
            icon-left="bi-house"
            :label="homeButtonLabel"
            no-caps
          />
          <q-btn
            class="menu-button"
            unelevated
            to="/menu"
              icon-left="bi-grid-3x3-gap"
            :label="t('error.notFound.menuButton')"
            no-caps
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
const { t } = useI18n()

// Computed properties
const errorCode = computed(() => '404')
const errorMessage = computed(() => t('error.notFound.message'))
const homeButtonLabel = computed(() => t('error.notFound.homeButton'))
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';

.error-page {
  width: 100vw;
  height: 100vh;
  background: $background-page;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.page-container {
  width: 100%;
  max-width: 900px; // 600px → 900px (sayfanın yarısı kadar)
  margin: 0 auto;
}

.error-content {
  background: $background-card;
  border-radius: 12px;
  padding: 80px 64px; // Daha da büyük padding
  box-shadow: $box-shadow-card;
  border: 1px solid $border-lighter;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 500px; // Minimum yükseklik eklendi
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &:hover {
    box-shadow: $box-shadow-card-hover;
  }
}

.error-icon-wrapper {
  margin-bottom: 24px;
  
  .error-icon {
    font-size: 64px;
    color: $text-secondary; // #64748b - UI tasarımı ile uyumlu
    opacity: 0.87;
  }
}

.error-code {
  font-size: 96px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: -2px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.error-message {
  font-size: 15px;
  font-weight: 400;
  color: $text-secondary;
  opacity: 0.9;
  margin-bottom: 32px;
  line-height: 1.6;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.home-button,
.menu-button {
  background: $background-button;
  color: $text-secondary;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 24px;
  border-radius: 3px;
  border-left: 2px solid $border-accent;
  transition: all 0.2s ease;
  min-height: 40px;
  text-transform: uppercase !important; // Button label'ları uppercase
  letter-spacing: 0.5px; // Uppercase için letter-spacing
  
  :deep(.q-icon) {
    font-size: 14px;
    margin-right: 6px;
  }

  &:hover {
    background: $background-light;
    border-left-color: $border-accent;
    transform: translateY(-1px);
    box-shadow: $box-shadow-input-hover;
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 768px) {
  .page-container {
    max-width: 100%;
  }
  
  .error-content {
    padding: 48px 32px;
    min-height: 400px;
  }
  
  .error-code {
    font-size: 72px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    
    .home-button,
    .menu-button {
      width: 100%;
    }
  }
}
</style>
