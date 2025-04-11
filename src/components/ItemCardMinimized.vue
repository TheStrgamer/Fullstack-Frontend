<template>
  <FadeInComponent :duration="400" :direction="'bottom'">
    <router-link :to="{ path: routePath, query: { id: item.id } }" class="no-link-style">
      <div class="item-card-minimized">
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

      </div>
    </router-link>
  </FadeInComponent>
</template>

<script setup lang="ts">
import { getUrlFromEndpoint, getImageUrlFromEndpoint } from '@/services/httpService';
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
  routePath: {
    type: String,
    default: "/item"
  },
  isFavoriteable: {
    type: Boolean,
    default: true
  }
});
const isFavorite = ref(!!props.item.isFavorited);


async function toggleFavoriteStatus(event: MouseEvent) {
  event.preventDefault();
  try {
    const newStatus = await toggleFavorite(props.item.id);
    isFavorite.value = !!newStatus;
  } catch (err) {
    console.error("Kunne ikke oppdatere favoritt:", err);
  }
}

function getImageUrl(imagePath: string) {
  if (!imagePath || imagePath == null) return '/default-image.png';
  const cleanPath = imagePath.replace(/^\/+/, '');
  return getUrlFromEndpoint(cleanPath);
}
</script>

<style scoped>
@import '../assets/ItemCardMinimized.css';
</style>
