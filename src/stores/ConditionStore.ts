import { itemServices } from '../services/itemService.ts'
import { defineStore } from "pinia";

interface Condition {
  id: number;
  name: string;
}

export const useConditionStore = defineStore("condition", {
  state: () => ({
    conditions: [] as Condition[],
  }),
  actions: {
    async fetchConditions() {
      this.conditions = await itemServices().fetchConditionsFromAPI();
    },

    getConditions() {
      return this.conditions;
    },
  },
});