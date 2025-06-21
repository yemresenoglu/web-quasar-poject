<template>
  <div class="empty-page">
    <!-- Invisible placeholder for webapp routes -->
    <!-- Real content is rendered by MainContent.vue webview -->
  </div>
</template>

<script setup>
// Empty page for webapp routes
// The actual content is handled by MainContent.vue webview
console.log('EmptyPage loaded for webapp route')
</script>

<style scoped>
.empty-page {
  display: none; /* Hide completely since webview takes over */
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style> 