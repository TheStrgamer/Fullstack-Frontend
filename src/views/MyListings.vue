<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import MyListingsOverviewComponent from '../components/MyListingsOverviewComponent.vue'
</script>


<template>
    <Navbar />
    <main class="main">
      <div class="centered-content-box">
          <MyListingsOverviewComponent></MyListingsOverviewComponent>
      </div>
    </main>
  </template>