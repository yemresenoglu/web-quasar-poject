<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Login layout - no taskbar or header needed
</script>

<style lang="sass">
.q-layout
  background: linear-gradient(135deg, #d7e1ea, #f5f1ff)
  min-height: 100vh
</style>
