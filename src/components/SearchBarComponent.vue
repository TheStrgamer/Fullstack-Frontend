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
  import { ref, defineEmits } from 'vue'

  const searchQuery = ref('')
  const emits = defineEmits<{
    (e: 'search', query: string): void
  }>()

  function onSearch() {
    emits('search', searchQuery.value)
  }
  </script>

  <style>
  @import '../assets/SearchBarComponent.css';
  </style>
  