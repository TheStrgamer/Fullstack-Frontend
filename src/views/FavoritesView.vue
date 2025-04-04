<template>
    <Navbar />
    <div class="favorites-page">
      <h1 class="favorites-title">Mine favoritter</h1>
      <div class="favorites-grid">
        <ItemCardMinimized
          v-for="item in favoriteItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useFeedStore } from '@/stores/FeedStore'
  import Navbar from '@/components/NavbarComponent.vue'
  import ItemCardMinimized from '@/components/ItemCardMinimized.vue'
  
  const feedStore = useFeedStore()
  const favoriteItems = ref<any[]>([])
  
//   onMounted(async () => {
//     await feedStore.fetchRecommendedItems(10)
  
//     // TODO: Replace with actual logic (filter based on user favorites)
//     favoriteItems.value = feedStore.getRecommendedItems().filter(item => item.isFavorite)
//   })
  </script>
  
  <style>
  @import '../assets/FavoritesView.css';
  </style>
  