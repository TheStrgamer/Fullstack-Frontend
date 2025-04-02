<template>
  <div class="item-maximized">
    <!-- Kategori + Salgsstatus -->
    <div class="item-header-bar">
      <span class="item-category">{{ itemStore.getCategoryName() }}</span>
      <span :class="['item-status', statusClass]">
        {{ itemStore.getSaleStatus() }}
      </span>
    </div>

    <!-- Bildekarusell -->
    <div class="image-carousel">
      <button class="carousel-btn left" @click="prevImage" v-if="images.length > 1">&#10094;</button>
      <img :src="images[currentImageIndex]" :alt="itemStore.getTitle" class="item-image" />
      <button class="carousel-btn right" @click="nextImage" v-if="images.length > 1">&#10095;</button>
    </div>

    <!-- Tittel + Pris -->
    <div class="item-info-row">
      <h1 class="item-title">{{ itemStore.getTitle() }}</h1>
      <span class="item-price-pill">{{ itemStore.getPrice() }} kr</span>
    </div>

    <!-- Tilstand + Størrelse -->
    <div class="item-info-row">
      <p class="item-subinfo">Tilstand: {{ itemStore.getCondition() }}</p>
      <p class="item-subinfo">Størrelse: {{ itemStore.getSize() }}</p>
    </div>

    <!-- Beskrivelse -->
    <p class="item-description">{{ itemStore.getFullDescription() }}</p>

    <!-- Lokasjon -->
    <p class="item-location">
      Posisjon: {{ itemStore.getLatitude() }}, {{ itemStore.getLongitude() }}
    </p>

    <!-- Datoer -->
    <div class="item-dates">
      <p>Opprettet: {{ itemStore.getCreatedAt() }}</p>
      <p>Oppdatert: {{ itemStore.getUpdatedAt() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useItemStore } from '../stores/ItemStore.ts'

const route = useRoute()
const itemId = route.query.id as string
const itemStore = useItemStore()

// onMounted(() => {
//   itemStore.fetchItem(itemId)

//   // Dummy flerbilder (du kan hente fra store senere)
//   images.value = [
//     itemStore.getItemImageURL,
//     'https://picsum.photos/seed/alt1/500/400',
//     'https://picsum.photos/seed/alt2/500/400',
//   ]
// })

// const statusClass = computed(() => {
//   return itemStore.getSaleStatus.toLowerCase() === 'solgt' ? 'sold' : 'forsale'
// })

// Bildekarusell
const images = ref<string[]>([])
const currentImageIndex = ref(0)

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

function prevImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length
}
</script>


<style>
@import '../assets/ItemComponentMaximized.css';
</style>