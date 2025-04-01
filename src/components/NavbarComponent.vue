<template>
  <header :class="['navbar', { open: isMenuOpen }]">
      <router-link to="/" class="home-link">Home</router-link> 
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu"> 
        <span></span>
      </button>
      <nav class="mobile-menu">
        <router-link to="/example" @click="isMenuOpen = false">Example</router-link>  <!-- TODO make actual routing pages -->
        <router-link to="/example" @click="isMenuOpen = false">Example</router-link>  <!-- TODO make actual routing pages -->
        <router-link to="/login" @click="isMenuOpen = false">Login</router-link>     <!-- TODO make actual routing pages -->
      </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>
