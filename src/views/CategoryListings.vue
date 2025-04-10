<template>
    <Navbar />
    <div class="main-layout">
      <CategoryComponent />
      <div class="main-content">
        <SearchBarComponent />
            <div class="category-heading">
                <span class="category-pill">{{ categoryName }}</span>
            </div>

        <div class="listings-grid">
          <ItemCardMinimized
            v-for="item in listings"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import Navbar from '../components/NavbarComponent.vue'
import SearchBarComponent from '@/components/SearchBarComponent.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import ItemCardMinimized from '@/components/ItemCardMinimized.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getListingsByCategory } from '@/services/httpService'

const route = useRoute()
const categoryName = ref(route.params.categoryName as string)

interface ListingDTO {
  id: number;
  title: string;
  brief_description: string;
  price: number;
  // legg til mer hvis vi bruker mer
}

const listings = ref<ListingDTO[]>([])

async function fetchListings(category: string) {
  try {
    const data = await getListingsByCategory(category)
    listings.value = data
  } catch (error) {
    console.error('Kunne ikke hente kategoribaserte annonser:', error)
  }
}

onMounted(() => {
  fetchListings(categoryName.value)
})

watch(() => route.params.categoryName, (newCategory) => {
  categoryName.value = newCategory as string
  fetchListings(categoryName.value)
})

</script>

<style>
@import '../assets/CategoryListings.css';
</style>