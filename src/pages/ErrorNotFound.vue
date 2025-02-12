<template>
  <div class="error-page fullscreen flex flex-center">
    <div class="text-center">
      <div class="error-code">
        404
      </div>

      <div class="error-message">
        Aradığınız sayfa bulunamadı...
      </div>

      <q-btn
        class="home-button q-mt-xl"
        unelevated
        to="/"
        label="Ana Sayfaya Dön"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
//
</script>

<style lang="sass">
.error-page
  background: #f9f9f9
  color: #202124

  .error-code
    font-size: 30vh
    font-weight: 700
    color: #1976d2
    line-height: 1
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1)

  .error-message
    font-size: 32px
    font-weight: 500
    color: #424242
    opacity: 0.87
    margin-top: 16px
    letter-spacing: 0.25px

  .home-button
    background: #1976d2
    color: white
    font-size: 16px
    font-weight: 500
    padding: 12px 32px
    border-radius: 8px
    transition: all 0.2s ease

    &:hover
      background: #1565c0
      transform: translateY(-2px)
      box-shadow: 0 4px 8px rgba(0,0,0,0.1)
</style>
