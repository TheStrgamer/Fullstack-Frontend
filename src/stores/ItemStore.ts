import { fetchItemFromAPI } from '../services/itemService.ts'
import { defineStore } from "pinia";
import type { Pinia } from "pinia";

// Define the store full data related to a single item
export const useItemStore = defineStore("item", {
  state: () => ({
    itemId: 0,
    title: "",
    sale_status: "",
    price: 0.0,
    full_description: "",
    brief_description: "",
    category: Object,
    condition: Object,
    size: "",
    itemImageURL: "",
    created_at: "",
    updated_at: "",
    latitude: 0.0,
    longitude: 0.0,
  }),
  actions: {
    // Setters
    setItemId(id: number) {
      this.itemId = id;
    },
    setTitle(title: string) {
      this.title = title;
    },
    setSaleStatus(status: string) {
      this.sale_status = status;
    },
    setPrice(price: number) {
      this.price = price;
    },
    setFullDescription(description: string) {
      this.full_description = description;
    },
    setBriefDescription(description: string) {
      this.brief_description = description;
    },
    setCategory(category: any) {
      this.category = category;
    },
    setCondition(condition: any) {
      this.condition = condition;
    },
    setSize(size: string) {
      this.size = size;
    },
    setItemImageURL(url: string) {
      this.itemImageURL = url;
    },
    setCreatedAt(date: string) {
      this.created_at = date;
    },
    setUpdatedAt(date: string) {
      this.updated_at = date;
    },
    setLatitude(lat: number) {
      this.latitude = lat;
    },
    setLongitude(long: number) {
      this.longitude = long;
    },

    // Getters
    getItemId() {
      return this.itemId;
    },
    getTitle() {
      return this.title;
    },
    getSaleStatus() {
      return this.sale_status;
    },
    getPrice() {
      return this.price;
    },
    getFullDescription() {
      return this.full_description;
    },
    getBriefDescription() {
      return this.brief_description;
    },
    getCategoryName() {
      return this.category.name;
    },
    getCondition() {
      return this.condition.name;
    },
    getSize() {
      return this.size;
    },
    getItemImageURL() {
      return this.itemImageURL;
    },
    getCreatedAt() {
      return this.created_at;
    },
    getUpdatedAt() {
      return this.updated_at;
    },
    getLatitude() {
      return this.latitude;
    },
    getLongitude() {
      return this.longitude;
    },

    // Reset state
    resetState() {
      this.itemId = 0;
      this.title = "";
      this.sale_status = "";
      this.price = 0.0;
      this.full_description = "";
      this.brief_description = "";
      this.category = Object;
      this.condition = Object;
      this.size = "";
      this.itemImageURL = "";
      this.created_at = "";
      this.updated_at = "";
      this.latitude = 0.0;
      this.longitude = 0.0;
    },

    // Set all item properties at once
    setItem(item: {
      itemId?: number;
      title?: string;
      sale_status?: string;
      price?: number;
      full_description?: string;
      brief_description?: string;
      category?: any;
      condition?: any;
      size?: string;
      itemImageURL?: string;
      created_at?: string;
      updated_at?: string;
      latitude?: number;
      longitude?: number;
    }) {
      if (item.itemId !== undefined) this.itemId = item.itemId;
      if (item.title !== undefined) this.title = item.title;
      if (item.sale_status !== undefined) this.sale_status = item.sale_status;
      if (item.price !== undefined) this.price = item.price;
      if (item.full_description !== undefined) this.full_description = item.full_description;
      if (item.brief_description !== undefined) this.brief_description = item.brief_description;
      if (item.category !== undefined) this.category = item.category;
      if (item.condition !== undefined) this.condition = item.condition;
      if (item.size !== undefined) this.size = item.size;
      if (item.itemImageURL !== undefined) this.itemImageURL = item.itemImageURL;
      if (item.created_at !== undefined) this.created_at = item.created_at;
      if (item.updated_at !== undefined) this.updated_at = item.updated_at;
      if (item.latitude !== undefined) this.latitude = item.latitude;
      if (item.longitude !== undefined) this.longitude = item.longitude;
    },

    fetchItem(itemId: string) {
      fetchItemFromAPI(itemId)
        .then((item: any) => {
          this.setItem(item);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }
});