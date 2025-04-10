<template>
    <div class="category-wrapper">

      <button class="category-toggle" @click="toggleMenu" aria-label="Vis kategorier">
        ☰ Kategorier
      </button>

      <ul class="category-list" v-if="menuOpen || isWideScreen">
        <FadeInComponent :duration="100 + 50*index" :direction="'top'" v-for="(category, index) in categories" :key="category">
          <li @click="selectCategory(category)">
            {{ category }}
          </li>
        </FadeInComponent>
      </ul>
    </div>
  </template>

  <script setup lang="ts">
  import FadeInComponent from './FadeInComponent.vue'
  import { ref, onMounted } from 'vue'

  const menuOpen = ref(false)
  const isWideScreen = ref(false)
  const categories = ref([
    'Alle',
    'Klær',
    'Sko',
    'Tilbehør',
    'Møbler',
    'Elektronikk',
    'Bøker'
  ])

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function selectCategory(category: string) {
    // TODO: emit event or use store
    console.log('Valgt kategori:', category)
  }

  function handleResize() {
  isWideScreen.value = window.innerWidth >= 768
  }
  onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
  </script>

  <style>
  @import '../assets/CategoryComponent.css';
  </style>