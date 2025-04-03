import { itemServices } from '../services/itemService.ts'
import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchCategories(count: number) {
      this.categories = await itemServices().fetchCategoriesFromAPI();
    },

    getCategories() {
      return this.categories;
    },
  },
});