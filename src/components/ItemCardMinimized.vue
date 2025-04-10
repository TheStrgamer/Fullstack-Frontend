<template>
  <FadeInComponent :duration="400" :direction="'bottom'">
    <div class="item-card-minimized">
      <!-- Topp-rad med hjerteknapp -->
      <div class="top-bar">
        <button
        v-if="isLoggedIn && isFavoriteable"
        class="favorite-btn"
        :class="{ active: isFavorite }"
        @click.stop.prevent="toggleFavoriteStatus"
        >
        <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>
      </div>
    <router-link :to="{ path: '/item', query: { id: item.id } }" class="no-link-style">
      <img
        class="item-image"
        :src="getImageUrl(item.imagePath)"
        :alt="item.title"
      />

      <div class="item-info-row">
        <h3 class="item-title">{{ item.title }}</h3>
        <span class="item-price-pill">{{ item.price }} kr</span>
      </div>

      <p class="item-description">{{ item.briefDescription }}</p>

    </router-link>
    </div>
  </FadeInComponent>
</template>

<script setup lang="ts">
import { getUrlFromEndpoint } from '@/services/httpService';
import FadeInComponent from './FadeInComponent.vue';
import { useUserStore } from '@/stores/UserStore';
import { ref, computed, watch} from 'vue';
import { toggleFavorite } from '@/services/favoriteService';

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isAuthenticated());

const props = defineProps({
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
  },
  isFavoriteable: {
    type: Boolean,
    default: true
  }
});
const isFavorite = ref(!!props.item.isFavorited); // startverdi, og så lar vi den leve


async function toggleFavoriteStatus(event: MouseEvent) {
  event.preventDefault();
  try {
    const newStatus = await toggleFavorite(props.item.id);
    isFavorite.value = !!newStatus; // defensivt
    console.log("Ny favorittstatus mottatt fra server:", newStatus);
  } catch (err) {
    console.error("Kunne ikke oppdatere favoritt:", err);
  }
}

// Genererer full URL til bildet
function getImageUrl(imagePath: string) {
  if (!imagePath || imagePath == null) return '/default-image.png';
  const cleanPath = imagePath.replace(/^\/+/, '');
  return getUrlFromEndpoint(cleanPath);
}
</script>

<style>
@import '../assets/ItemCardMinimized.css';
</style>
