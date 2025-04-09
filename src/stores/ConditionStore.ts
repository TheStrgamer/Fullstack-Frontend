import { itemServices } from '../services/itemService.ts'
import { defineStore } from "pinia";

interface Condition {
  id: number;
  name: string;
}

export const useConditionStore = defineStore("condition", {
  state: () => ({
    conditions: [] as Condition[],
    isLoading: false,
  }),
  actions: {
    async fetchConditions(force = false) {
      if (this.conditions.length && !force) return;

      this.isLoading = true;
      try {
        this.conditions = await itemServices().fetchConditionsFromAPI();
      } catch (error) {
        console.error("Failed to fetch conditions:", error);
        this.conditions = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});
