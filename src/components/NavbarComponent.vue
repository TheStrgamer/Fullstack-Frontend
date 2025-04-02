<template>
  <header :class="['navbar', { open: isMenuOpen }]">
    <router-link to="/" class="home-link">Home</router-link> 

    <!-- Hamburger toggle (hidden on larger screens) -->
    <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu"> 
      <span></span>
    </button>

    <!-- Mobile dropdown menu -->
    <nav class="mobile-menu">
      <router-link to="/example" @click="isMenuOpen = false">Example</router-link>
      <router-link to="/profile" @click="isMenuOpen = false">Profile</router-link>
      <router-link to="/login" @click="isMenuOpen = false">Login</router-link>
    </nav>

    <!-- Desktop/tablet nav links (always visible on larger screens) -->
    <nav class="nav-links">
      <router-link to="/example">Example</router-link>
      <router-link to="/profile">Profile</router-link>
      <router-link to="/login">Login</router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<style>
@import '../assets/navbar.css';
</style>
