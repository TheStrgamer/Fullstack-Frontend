import { itemServices } from '../services/itemService.ts'
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
    categoryName: "",
    conditionName: "",
    size: "",
    imageUrls: [] as string[],
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
    setCategory(category: string) {
      this.categoryName = category;
    },
    setCondition(condition: string) {
      this.conditionName = condition;
    },
    setSize(size: string) {
      this.size = size;
    },
    // setItemImageURL(url: string) {
    //   this.imageUrls = url ? [url] : [];
    // },
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

    // Reset state
    resetState() {
      this.itemId = 0;
      this.title = "";
      this.sale_status = "";
      this.price = 0.0;
      this.full_description = "";
      this.brief_description = "";
      this.categoryName = "";
      this.conditionName = "";
      this.size = "";
      this.imageUrls = [];
      this.created_at = "";
      this.updated_at = "";
      this.latitude = 0.0;
      this.longitude = 0.0;
    },

    // Set all item properties at once
    setItem(item: any) {
      this.itemId = item.itemId ?? item.id ?? 0;
      this.title = item.title ?? "";
      this.sale_status = item.sale_status ?? item.saleStatus ?? "";
      this.price = item.price ?? 0;
      this.full_description = item.full_description ?? item.fullDescription ?? "";
      this.brief_description = item.brief_description ?? item.briefDescription ?? "";
      this.categoryName = item.categoryName ?? "";
      this.conditionName = item.conditionName ?? "";
      this.size = item.size ?? "";
      this.created_at = item.created_at ?? item.createdAt ?? "";
      this.updated_at = item.updated_at ?? item.updatedAt ?? "";
      this.latitude = item.latitude ?? 0;
      this.longitude = item.longitude ?? 0;
    
      console.log(" Fikk imageUrls fra item:", item.imageUrls);

      if (Array.isArray(item.imageUrls)) {
        this.imageUrls = item.imageUrls.filter((url: string) => !!url);
      } else if (typeof item.imageUrls === "string" && item.imageUrls !== "") {
        this.imageUrls = [item.imageUrls];
      } else {
        this.imageUrls = [];
      }

console.log(" Lagret imageUrls i store:", this.imageUrls);

    },

    // Create a new item
    async createItemListing(item: any) {
      try {
        const response = await itemServices().createItem(item);
        console.log("Item created successfully:", response);
      } catch (error) {
        console.error("Error creating item:", error);
      }
    },

    async fetchItem(itemId: string) {
      try {
        const item = await itemServices().fetchItemFromAPI(itemId);
        console.log(" Backend respons:", item);
        this.setItem(item);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    }
  }
});