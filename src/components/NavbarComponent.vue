<template>
  <header :class="['navbar', { open: isMenuOpen }]">
    <router-link to="/" class="logo-container" @click.native="handleLogoClick">
    <img src="/Logo-ferdig.png" alt="Logo" class="logo-icon" />
    <img src="/Grønttorget-ferdig.png" alt="Grønttorget" class="logo-text" />
    </router-link>

    <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
      <span></span>
    </button>

    <nav class="mobile-menu">
      <router-link v-if="isAdmin" to="/admin">Admin</router-link>

      <router-link to="/profile" @click="isMenuOpen = false">Profil</router-link>
      <router-link to="/profile/my_favorites" @click="isMenuOpen = false">Favoritter</router-link>
      <router-link to="/chats" @click="isMenuOpen = false">Chat</router-link>
      <router-link v-if="!isLoggedIn" to="/login" @click="isMenuOpen = false">Logg inn</router-link>
      <router-link v-else to="/logout" @click="isMenuOpen = false">Logg ut</router-link>
    </nav>

    <nav class="nav-links">
      <router-link v-if="isAdmin" to="/admin">Admin</router-link>

      <router-link to="/profile">Profil</router-link>
      <router-link to="/profile/my_favorites" @click="isMenuOpen = false">Favoritter</router-link>
      <router-link to="/chats">Chat</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Logg inn</router-link>
      <router-link v-else to="/logout">Logg ut</router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isAuthenticated());
const isAdmin = computed(() => userStore.isUserAdmin());

const isMenuOpen = ref(false);

function handleLogoClick(event: MouseEvent) {
  if (route.path === '/') {
    window.location.reload()
  }
}
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<style>
@import '../assets/navbar.css';
</style>
