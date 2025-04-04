<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import MyAccountOverviewComponent from '../components/MyAccountOverviewComponent.vue'
</script>

<template>
  <Navbar />
  <main class="main">
    <div class="centered-content-box">
        <MyAccountOverviewComponent></MyAccountOverviewComponent>
    </div>
  </main>
</template>