import { itemServices } from '../services/itemService.ts'
import { defineStore } from "pinia";

export const useConditionStore = defineStore("condition", {
  state: () => ({
    conditions: [],
  }),
  actions: {
    async fetchConditions(count: number) {
      this.conditions = await itemServices().fetchConditionsFromAPI();
    },

    getConditions() {
      return this.conditions;
    },
  },
});