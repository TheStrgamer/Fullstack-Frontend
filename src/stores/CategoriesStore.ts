import { itemServices } from '../services/itemService.ts'
import { defineStore } from "pinia";

interface Category {
  id: number;
  name: string;
  description: string;
  parent_category: number | null;
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    isLoading: false
  }),

  actions: {
    async fetchCategories(): Promise<void> {
      this.isLoading = true;

      try {
        const response = await itemServices().fetchCategoriesFromAPI();
        this.categories = response;
      } catch (error) {
        console.error("Failed to fetch conditions:", error);
      } finally {
        this.isLoading = false;
      }
    },

    getCategories(): Category[] {
      return this.categories;
    },
  },
});