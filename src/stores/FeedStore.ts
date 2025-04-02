import { fetchRecommendedItems } from '../services/FeedService.ts'
import { defineStore } from "pinia";
import type { Pinia } from "pinia";

export const useFeedStore = defineStore("feed", {
  state: () => ({
    recommendedItems: [],
  }),
  actions: {
    async fetchRecommendedItems(count: number) {
      this.recommendedItems = await fetchRecommendedItems(count);
    },

    getRecommendedItems() {
      return this.recommendedItems;
    },
  },
});