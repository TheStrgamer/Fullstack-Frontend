<template>
  <Navbar />
  <div class="main-layout">
    <CategoryComponent />
    <div class="main-content">
      <SearchBarComponent v-if="isHome" @search="handleSearch"/>
      <ItemFeedComponent v-if="isHome" :searchQuery="searchQuery" />
      <ItemFeedComponent v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import SearchBarComponent from '@/components/SearchBarComponent.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import ItemFeedComponent from '@/components/ItemFeedComponent.vue'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const searchQuery = ref('')
const route = useRoute()
const isHome = ref(false)

watchEffect(() => {
  isHome.value = route.name === 'home'
})

const handleSearch = (query: string) => {
  searchQuery.value = query
  console.log('🔎 Søker etter:', searchQuery.value)
}
</script>


<style>
@import '../assets/main.css';
</style>
