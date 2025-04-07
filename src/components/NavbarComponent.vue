<template>
  <header :class="['navbar', { open: isMenuOpen }]">
    <router-link to="/" class="logo-container">
    <img src="/Logo-ferdig.png" alt="Logo" class="logo-icon" />
    <img src="/Grønttorget-ferdig.png" alt="Grønttorget" class="logo-text" />
    </router-link>

    <!-- Hamburger toggle (hidden on larger screens) -->
    <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu"> 
      <span></span>
    </button>

    <!-- Mobile dropdown menu -->
    <nav class="mobile-menu">
      <router-link to="/example" @click="isMenuOpen = false">Example</router-link>
      <router-link to="/profile" @click="isMenuOpen = false">Profile</router-link>
      <router-link v-if="!isLoggedIn" to="/login" @click="isMenuOpen = false">Login</router-link>
      <router-link v-else to="/logout" @click="isMenuOpen = false">Log out</router-link>
    </nav>

    <!-- Desktop/tablet nav links (always visible on larger screens) -->
    <nav class="nav-links">
      <router-link to="/example">Example</router-link>
      <router-link to="/profile">Profile</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <router-link v-else to="/logout">Log out</router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isAuthenticated());

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<style>
@import '../assets/navbar.css';
</style>
