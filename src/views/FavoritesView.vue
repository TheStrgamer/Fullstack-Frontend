<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import MyFavoritesOverviewComponent from '../components/MyFavoritesOverviewComponent.vue'
</script>


<template>
    <Navbar />
    <main class="main">
      <div class="centered-content-box">
          <MyFavoritesOverviewComponent></MyFavoritesOverviewComponent>
      </div>
    </main>
  </template>