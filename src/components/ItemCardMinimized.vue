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

    </router-link>
    </div>
  </FadeInComponent>
</template>

<script setup lang="ts">
import { getUrlFromEndpoint } from '@/services/httpService';
import FadeInComponent from './FadeInComponent.vue';
import { useUserStore } from '@/stores/UserStore';
import { ref, computed} from 'vue';
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
const isFavorite = ref(props.item.isFavorited);

async function toggleFavoriteStatus(event: MouseEvent) {
  event.preventDefault(); // forhindrer routing når man klikker på hjertet

  try {
    await toggleFavorite(props.item.id);
    isFavorite.value = !isFavorite.value;
  } catch (err) {
    console.error("Kunne ikke oppdatere favoritt:", err);
  }
}

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
