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
  import { getAllCategoryNames } from '@/services/httpService'
  import { useRouter } from 'vue-router'
  
  const menuOpen = ref(false)
  const isWideScreen = ref(false)
  const categories = ref<string[]>([])
  const router = useRouter()
  
  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }
  
  function selectCategory(category: string) {
  console.log('Valgt kategori:', category)
  router.push({ name: 'CategoryListings', params: { categoryName: category } })
  menuOpen.value = false
}

  function handleResize() {
  isWideScreen.value = window.innerWidth >= 768
  }

  async function loadCategories() {
  const fetched = await getAllCategoryNames()
  categories.value = fetched
}
  onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  loadCategories()
})
  </script>

  <style>
  @import '../assets/CategoryComponent.css';
  </style>