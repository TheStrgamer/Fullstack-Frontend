<template>
  <div id="Item-Feed">
    <div v-if="feedItems.length === 0">
      <p style="text-align: center;">Ingen annonser å vise for øyeblikket.</p>
    </div>
    <ItemCardMinimized
      v-for="item in feedItems"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFeedStore } from '../stores/FeedStore.ts';
import ItemCardMinimized from './ItemCardMinimized.vue';

// Define an interface for feed items
interface FeedItem {
  id: string | number;
}

const feedItems = ref<FeedItem[]>([]);

onMounted(async () => {
  const feedStore = useFeedStore();
  await feedStore.fetchRecommendedItems(10);
  feedItems.value = feedStore.getRecommendedItems;
});
</script>

<style>
#Item-Feed {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>