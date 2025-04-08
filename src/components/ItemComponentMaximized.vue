<template>
  <div v-if="itemLoaded" class="item-maximized">
    <!-- Kategori + Salgsstatus -->
    <div class="item-header-bar">
      <span class="item-category">{{ itemStore.categoryName }}</span>
      <span :class="['item-status', statusClass]">
        {{ getSaleStatusText(itemStore.sale_status) }}
      </span>
    </div>

    <!-- Bildekarusell -->
    <div class="image-carousel" v-if="images.length > 0">
      <button class="carousel-btn left" @click="prevImage" v-if="images.length > 1">&#10094;</button>

      <img :src="images[currentImageIndex]" :alt="itemStore.title" class="item-image" />

      <button class="carousel-btn right" @click="nextImage" v-if="images.length > 1">&#10095;</button>

      <div class="image-index-display">
        Bilde {{ currentImageIndex + 1 }} av {{ images.length }}
      </div>
    </div>


    <!-- Tittel + Pris -->
    <div class="item-info-row">
      <h1 class="item-title">{{ itemStore.title }}</h1>
      <span class="item-price-pill">{{ itemStore.price }} kr</span>
    </div>

    <!-- Tilstand + Størrelse -->
    <div class="item-info-row">
      <p class="item-subinfo">Tilstand: {{ itemStore.conditionName }}</p>
      <p class="item-subinfo" v-if="itemStore.size">Størrelse: {{ itemStore.size }}</p>
    </div>

    <!-- Beskrivelse -->
    <p class="item-description">{{ itemStore.full_description }}</p>

    <!-- Lokasjon -->
    <p class="item-location">
      Posisjon: {{ itemStore.latitude }}, {{ itemStore.longitude }}
    </p>

    <!-- Datoer -->
    <div class="item-dates">
      <p>Opprettet: {{ formatDate(itemStore.created_at) }}</p>
      <p>Oppdatert: {{ formatDate(itemStore.updated_at) }}</p>
    </div>
    <button v-if="isLoggedIn" class="negotiate-button" @click="negotiate">
      Negotiate
    </button>
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>Laster inn produkt...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import router from '@/router';
import { useRoute } from 'vue-router'
import { useItemStore } from '../stores/ItemStore.ts'
import { startConversation } from '@/services/chatService.ts'
import { useUserStore } from '@/stores/UserStore.ts'

const route = useRoute()
const itemId = route.query.id as string
const itemStore = useItemStore()
const userStore = useUserStore()
const itemLoaded = ref(false)

// Bildekarusell
const images = ref<string[]>([])
const currentImageIndex = ref(0)

const isLoggedIn = computed(() => userStore.isAuthenticated());

onMounted(async () => {
  try {
    await fetchItemData()
  } catch (error) {
    console.error('Failed to load item:', error)
  }
})

async function fetchItemData() {
  itemLoaded.value = false;

  await itemStore.fetchItem(itemId);

  const urls = itemStore.imageUrls
  .map((url: string) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}/${url}`.replace(/([^:]\/)\/+/g, "$1"); // Fjerner dobbel slash
  })
  .filter((url: string) => url);

  images.value = urls.length > 0 ? urls : ['/default-image.png'];

  itemLoaded.value = true;
}

const statusClass = computed(() => {
  const status = itemStore.sale_status
  if (typeof status === 'number') {
    return status === 0 ? 'forsale' : 'sold'
  }
  return String(status).toLowerCase().includes('solgt') ? 'sold' : 'forsale'
})

function getSaleStatusText(status: string | number): string {
  if (typeof status === 'number') {
    return status === 0 ? 'Til salgs' : 'Solgt'
  }
  return status || 'Ukjent status'
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Ukjent dato'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return dateString
  }
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

function prevImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

function negotiate() {
  const listingId = Number(itemId)
  startConversation(listingId)
    .then((response) => {
      console.log('Conversation started:', response, ". redirecting to chat")
      router.push({
        name: 'chat',
        params: { chatId: response },
      })
    })
    .catch((error) => {
      console.error('Error starting conversation:', error)
    })
}
</script>

<style>
@import '../assets/ItemComponentMaximized.css';
</style>