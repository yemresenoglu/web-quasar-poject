<template>
  <q-layout view="lHh lpR fFf">
    <Header />
    <Sidebar v-model="leftDrawerOpen" />
    <ContentView />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import Header from 'src/components/Header.vue'
import Sidebar from 'src/components/Sidebar.vue'
import ContentView from 'src/components/ContentView.vue'

const leftDrawerOpen = ref(false)
</script>

<style lang="sass">


#q-app
  background: linear-gradient(135deg, #d7e1ea, #f5f1ff)

*
  -ms-overflow-style: none
  scrollbar-width: none

::-webkit-scrollbar
  display: none
</style>