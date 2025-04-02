<template>
  <div id="Item-Feed">
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

const feedItems = ref([]);

onMounted(async () => {
  const feedStore = useFeedStore();
  await feedStore.fetchRecommendedItems(10);
  feedItems.value = feedStore.getRecommendedItems();
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