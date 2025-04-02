<template>
  <div class="item main">
    <img id="image" :src="itemStore.itemImageURL" />
    <h1 id="title">{{}}</h1>
    <div class="details">
      <p id="category">Kategori: {{ itemStore.getCategory() }}</p>
      <p id="condition">Tilstand: {{ itemStore.getCondition() }}</p>
      <p id="price">Pris: {{ itemStore.getPrice() }} kr</p>
      <p id="size">Størrelse: {{ itemStore.getSize() }}</p>
    </div>
    <p id="description">
      {{ itemStore.getFullDescription() }}
    </p>
    <p id="location">Posisjon: {{ itemStore.getLatitude() }}, {{ itemStore.getLongitude() }}</p>
    <div class="dates">
      <p id="created">Created: {{ itemStore.getCreatedAt() }}</p>
      <p id="updated">Updated: {{ itemStore.getUpdatedAt() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useItemStore } from '../stores/ItemStore.ts'

const route = useRoute()
const itemId = route.query.id as string
const itemStore = useItemStore()

onMounted(() => {
  itemStore.fetchItem(itemId)
})
</script>

<style>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

#image {
  max-width: 60%;
  max-height: 500px;
  object-fit: cover;
}

.details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 60%;
}

.dates {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 15%;
}
</style>