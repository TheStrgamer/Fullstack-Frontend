<template>
  <Navbar />
  <div class="main-layout">
    <CategoryComponent />
    <div class="main-content">
      <SearchBarComponent @search="handleSearch"/>
      <ItemFeedComponent :searchQuery="searchQuery"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import SearchBarComponent from '@/components/SearchBarComponent.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import ItemFeedComponent from '@/components/ItemFeedComponent.vue'
import { ref } from 'vue'

const searchQuery = ref('')
const handleSearch = (query: string) => {
  searchQuery.value = query
  console.log('Søker etter:', searchQuery.value)
}
</script>


<style>
@import '../assets/main.css';
</style>
