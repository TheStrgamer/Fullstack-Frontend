<template>
  <router-link :to="{ path: '/item', query: { id: item.id } }" class="no-link-style">
    <div class="item-card-minimized">
      <img
        v-if="item.imagePath"
        class="item-image"
        :src="getImageUrl(item.imagePath)"
        :alt="item.title"
      />

      <div class="item-info-row">
        <h3 class="item-title">{{ item.title }}</h3>
        <span class="item-price-pill">{{ item.price }} kr</span>
      </div>

      <p class="item-description">{{ item.briefDescription }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { getUrlFromEndpoint } from '@/services/httpService';

defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '',
      price: '',
      imagePath: '',
      briefDescription: ''
    })
  }
});

// Genererer full URL til bildet
function getImageUrl(imagePath: string) {
  if (!imagePath) return '/fallback.png';
  const cleanPath = imagePath.replace(/^\/+/, '');
  return getUrlFromEndpoint(cleanPath);
}
</script>

<style>
@import '../assets/ItemCardMinimized.css';
</style>
