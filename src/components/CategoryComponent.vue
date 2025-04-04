<template>
    <div class="category-wrapper">
      <button class="category-toggle" @click="toggleMenu" aria-label="Vis kategorier">
        ☰ Kategorier
      </button>
  
      <ul class="category-list" v-show="menuOpen || isWideScreen">
        <li v-for="category in categories" :key="category" @click="selectCategory(category)">
          {{ category }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
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