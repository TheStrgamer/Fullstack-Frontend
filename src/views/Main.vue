<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import SearchBarComponent from '@/components/SearchBarComponent.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import ItemFeedComponent from '@/components/ItemFeedComponent.vue'
</script>

<template>
  <Navbar />
  <div class="main-layout">
    <CategoryComponent />
    <div class="main-content">
      <SearchBarComponent />
      <ItemFeedComponent />
    </div>
  </div>
</template>

<style>
@import '../assets/Main.css';
</style>
