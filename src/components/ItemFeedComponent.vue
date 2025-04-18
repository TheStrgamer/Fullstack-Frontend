<template>
  <div id="Item-Feed">
    <div v-if="paginatedItems.length === 0">
      <p style="text-align: center;">Ingen annonser å vise for øyeblikket.</p>
    </div>
    <FadeInComponent
      v-for="(item, index) in paginatedItems"
      :key="item.id"
      :duration="index * 100 + 200"
      :direction="'bottom'"
    >
      <ItemCardMinimized
        :item="item"
        :key="item.id"
      />
    </FadeInComponent>
    <div class = "pagination-controls">
      <button @click="prevPage" :disabled="currentPage == 1">Forrige</button>
      <span>Side {{ currentPage }} av {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage == totalPages">Neste</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useFeedStore } from '../stores/FeedStore.ts';
import ItemCardMinimized from './ItemCardMinimized.vue';
import FadeInComponent from './FadeInComponent.vue';
import { fetchDataWithoutAuth } from '@/services/httpService'
import debounce from 'lodash/debounce';

const props = defineProps<{
  searchQuery?: string
}>()

const listings = ref([])

interface FeedItem {
  id: string | number;
}

const feedItems = ref<FeedItem[]>([]);

const currentPage = ref(1);
const itemsPerPage = ref(5);

async function fetchListings(query: string) {
  try {
    if (query) {
      const response = await fetchDataWithoutAuth(`listings/search?query=${encodeURIComponent(query)}`)
      listings.value = response.data
    } else {
      const response = await fetchDataWithoutAuth('listings/random?count=30')
      listings.value = response.data
    }
  } catch (error) {
    console.error('Feil ved henting av annonser:', error)
    listings.value = []
  }
}

function updateItemsPerPage() {
  if (window.innerWidth >= 768) {
    itemsPerPage.value = 12; // Tablet og oppover
  } else {
    itemsPerPage.value = 5; // Mobil
  }
}

const totalPages = computed(() =>
  Math.ceil(feedItems.value.length / itemsPerPage.value)
);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return feedItems.value.slice(start, start + itemsPerPage.value);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const debouncedSearch = debounce(async (query: string) => {
  await fetchListings(query)
  feedItems.value = listings.value
  currentPage.value = 1
}, 400)

watch(() => props.searchQuery, (newQuery) => {
  if (newQuery !== undefined) {
    debouncedSearch(newQuery);
  }
});

onMounted(() => {
  if (props.searchQuery !== undefined) {
    fetchListings(props.searchQuery);
  }
});
onMounted(async () => {
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);

  const feedStore = useFeedStore();
  await feedStore.fetchRecommendedItems(30);
  feedItems.value = feedStore.getRecommendedItems;
});

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage);
});
</script>

<style>
#Item-Feed {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  font-size: 1rem;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>