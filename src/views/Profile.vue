<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import ProfileOverviewComponent from '../components/ProfileOverviewComponent.vue';
</script>

<template>
  <Navbar />
  <main class="main">
    <div class="centered-content-box">
        <ProfileOverviewComponent></ProfileOverviewComponent>
    </div>
  </main>
</template>