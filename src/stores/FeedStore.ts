import { fetchRecommendedItems, fetchRandomItems } from '../services/FeedService.ts'
import { defineStore } from "pinia";
import { useUserStore } from './UserStore.ts';
import type { Pinia } from "pinia";

export const useFeedStore = defineStore("feed", {
  state: () => ({
    recommendedItems: [],
  }),
  getters: {
    getRecommendedItems: (state) => state.recommendedItems,
  },
  actions: {
    async fetchRecommendedItems(count: number) {
      const userStore = useUserStore();
      try {
        if (userStore.isAuthenticated()) {
          this.recommendedItems = await fetchRecommendedItems(count, userStore.jwtToken);
        } else {
          this.recommendedItems = await fetchRandomItems(count);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        this.recommendedItems = []; // fallback to empty array
    }
  },
},
});