<template>
  <div v-if="itemLoaded" class="item-maximized">
    <div class="top-bar">
      <h1 class="item-title">{{ itemStore.title }}</h1>

          <button
            v-if="isLoggedIn"
            class="favorite-btn"
            :class="{ active: isFavorite }"
            @click="toggleFavoriteStatus"
          >
            <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
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
    <div class="item-info-row price-row">
      <span :class="['item-status', statusClass]">
        {{ getSaleStatusText(itemStore.sale_status) }}
      </span>
      <span class="item-price-pill">{{ itemStore.price }} kr</span>
    </div>

    <!-- Kategori + Salgsstatus -->
    <div class="category-row">
      <span class="item-category"><strong>Kategori:</strong> {{ itemStore.categoryName }}</span>
    </div>

    <!-- Tilstand + Størrelse -->
    <div class="item-info-row">
      <p class="item-subinfo"><strong>Tilstand:</strong> {{ itemStore.conditionName }}</p>
      <p class="item-subinfo" v-if="itemStore.size"><strong>Størrelse:</strong> {{ itemStore.size }}</p>
    </div>

    <!-- Beskrivelse -->
    <div class="description">
      <h3 class="section-title">Beskrivelse</h3>
      <p class="item-description">{{ itemStore.full_description }}</p>
    </div>

    <!-- Lokasjon -->
    <div class="location">
      <h3 class="section-title">Lokasjon</h3>
      <PositionElementsComponent :latitude="itemStore.latitude" :longitude="itemStore.longitude"></PositionElementsComponent>
    </div>

    <!-- Selger -->
     <h3 class="section-title">Selger</h3>
    <ContactInfoComponent :userId="itemStore.creatorId" />

    <!-- Negotiate Button -->
    <button v-if="isLoggedIn" class="negotiate-button" @click="negotiate">
      <i class="fas fa-comments"></i> Kontakt selger
    </button>

        <!-- Datoer -->
    <div class="item-dates">
      <p><strong>Opprettet:</strong> {{ formatDate(itemStore.created_at) }}</p>
      <p><strong>Oppdatert:</strong> {{ formatDate(itemStore.updated_at) }}</p>
    </div>
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
import PositionElementsComponent from './PositionElementsComponent.vue';
import ContactInfoComponent from './ContactInfoComponent.vue';
import { useItemStore } from '../stores/ItemStore.ts'
import { startConversation } from '@/services/chatService.ts'
import { useUserStore } from '@/stores/UserStore.ts'
import { toggleFavorite, checkFavoriteStatus } from '@/services/favoriteService';
import { getUrlFromEndpoint } from '@/services/httpService.ts'

const route = useRoute()
const itemId = route.query.id as string
const itemStore = useItemStore()
const userStore = useUserStore()
const itemLoaded = ref(false)
const isFavorite = ref(false);

// Bildekarusell
const images = ref<string[]>([])
const currentImageIndex = ref(0)

const isLoggedIn = computed(() => userStore.isAuthenticated());

onMounted(async () => {
  if (isLoggedIn.value) {
    isFavorite.value = await checkFavoriteStatus(Number(itemId));
  }
  try {
    await fetchItemData()
  } catch (error) {
    console.error('Failed to load item:', error)
  }
})

function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/default-image.png';
  if (imagePath.startsWith('http')) return imagePath;

  const cleanPath = imagePath.replace(/^\/+/, '');
  return getUrlFromEndpoint(cleanPath);
}

async function fetchItemData() {
  itemLoaded.value = false;

  await itemStore.fetchItem(itemId);

  const urls = itemStore.imageUrls.map(getImageUrl)
  .map(getImageUrl)
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
      console.log("current route:", router.currentRoute.value)
    })
    .catch((error) => {
      console.error('Error starting conversation:', error)
    })
}

async function toggleFavoriteStatus() {
  try {
    await toggleFavorite(Number(itemId));
    isFavorite.value = !isFavorite.value;
  } catch (err) {
    console.error("Kunne ikke oppdatere favoritt:", err);
  }
}
</script>

<style scoped>
@import '../assets/ItemComponentMaximized.css';
</style>