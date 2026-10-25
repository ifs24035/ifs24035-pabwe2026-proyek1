import { defineStore } from "pinia";
import { catalogApi } from "../api/catalogApi";

export const useCatalogStore = defineStore("catalog", {
  state: () => ({ categories: [] }),
  actions: {
    async loadCategories(force = false) {
      if (this.categories.length && !force) return this.categories;
      this.categories = await catalogApi.categories();
      return this.categories;
    },
  },
});