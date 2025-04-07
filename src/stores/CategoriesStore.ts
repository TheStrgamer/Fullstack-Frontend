import { itemServices } from '../services/itemService.ts'
import { defineStore } from "pinia";

interface Category {
  id: number;
  name: string;
  description: string;
  parent_category: number | null;
}

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [] as Category[],
  }),
  actions: {
    async fetchCategories() {
      this.categories = await itemServices().fetchCategoriesFromAPI();
    },

    getCategories() {
      return this.categories;
    },
  },
});