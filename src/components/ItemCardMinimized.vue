<template>
  <router-link :to="{ path: '/item', query: { id: item.id } }" class="no-link-style">
    <div class="item-card-minimized">
      <img class="item-image" :src="item.imageUrl" :alt="item.title" />
      
      <div class="item-info-row">
        <h3 class="item-title">{{ item.title }}</h3>
        <span class="item-price-pill">{{ item.price }} kr</span>
      </div>
      
      <p class="item-description">{{ item.brief_description }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">

defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '',
      price: '',
      imageUrl: '',
      brief_description: ''
    })
  }
});
</script>

<style>
@import '../assets/ItemCardMinimized.css';
</style>