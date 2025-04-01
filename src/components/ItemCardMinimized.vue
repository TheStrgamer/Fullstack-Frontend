<template>
  <router-link :to="{ path: '/item', query: { id: item.id } }" class="no-link-style">
    <div class="item-card-minimized">
      <img id="minimized-item-picture" :src="item.imageUrl" :alt="item.title">
      <h3 id="item-header">{{ item.title }}</h3>
      <p id="item-prize">{{ item.price }}</p>
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
      imageUrl: ''
    })
  }
});
</script>

<style>
.item-card-minimized {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  max-height: 40%;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

#minimized-item-picture {
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
}
</style>