<script setup lang="ts">

defineProps<{
    to: string;
    icon_path: string;
    title: string;
    description: string;
}>();

</script>

<template>

<router-link :to="to" class="profile-link-card">
    <div class="card-content">
      <!-- <img :src="icon_path" alt="icon" class="card-icon" /> -->
      <div class="card-text">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-description">{{ description }}</p>
      </div>
    </div>
  </router-link>
</template>


<style>
@import '../assets/profile.css';
</style>