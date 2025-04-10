<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Søk etter produkter..."
        class="search-input"
      />
      <button class="search-button" @click="onSearch">Søk</button>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'

  const searchQuery = ref('')

  function onSearch() {
    // TODO: emit event or use store to trigger filtering
    console.log('Søker etter:', searchQuery.value)
  }
  </script>

  <style>
  @import '../assets/SearchBarComponent.css';
  </style>
  