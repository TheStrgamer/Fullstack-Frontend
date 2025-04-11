<template>
  <div>
    <h1 class="title">Create new listing</h1>
    <form class="create-item-form" @submit.prevent="handleSubmit">

      <div class="form-group">
        <ImageUpload @update:images="selectedImages = $event" />
      </div>

      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="listing.title" type="text" id="title" required />
      </div>

      <div class="form-group">
        <label for="brief_description">Brief description</label>
        <textarea v-model="listing.brief_description" id="brief_description" required></textarea>
      </div>

      <div class="form-group">
        <label for="full_description">Long Description</label>
        <textarea v-model="listing.full_description" id="full_description" required></textarea>
      </div>

      <div class="form-group">
        <label for="price">Price</label>
        <input v-model="listing.price" type="number" id="price" step="0.01" required />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select v-model="listing.category" required>
          <option value="" disabled>Select a category</option>
          <option
            v-for="category in categoriesStore.categories"
            :key="category.id"
            :value="category.id?.toString()"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="condition">Condition</label>
        <select v-model="listing.condition" required>
          <option value="" disabled>Select a condition</option>
          <option
            v-for="condition in conditionStore.conditions"
            :key="condition.id"
            :value="condition.id?.toString()"
          >
            {{ condition.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="size">Size (optional)</label>
        <input v-model="listing.size" type="text" id="size" />
      </div>

      <div class="form-group">
        <label for="Address">Address</label>
        <AutoCompleteAddressSearchComponent
          v-model:address="listing.address"
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
  <br><br>
</template>


<script setup lang="ts">
import { useCategoriesStore } from '@/stores/CategoriesStore.ts'
import { useConditionStore } from '@/stores/ConditionStore.ts'
import { useItemStore } from '@/stores/ItemStore.ts'
import { useUserStore } from '@/stores/UserStore.ts'
import { onMounted, reactive } from 'vue'
import AutoCompleteAddressSearchComponent from './AutoCompleteAddressSearchComponent.vue'
import { addressToCoords }  from '@/services/geoCodingService'
import axios from 'axios';
import { ref } from 'vue';
import { createElementBlock } from 'vue'

import ImageUpload from '@/components/ImageUpload.vue'
import { postImages } from '@/services/httpService'
import router from '@/router'

const categoriesStore = useCategoriesStore();
const conditionStore = useConditionStore();
const itemStore = useItemStore();
const userStore = useUserStore();

const selectedImages = ref<File[]>([]);

// Form Data
const listing = reactive({
  title: '',
  brief_description: '',
  full_description: '',
  price: '',
  category: '',
  condition: '',
  size: '',
  address: '',
})

Object.assign(listing, {
  title: '',
  brief_description: '',
  full_description: '',
  price: '',
  category: '',
  condition: '',
  size: '',
  address: '',
});


onMounted(async () => {
  await categoriesStore.fetchCategories();
  await conditionStore.fetchConditions();
});



// Handle form submission
const handleSubmit = async () => {

  // const category = categoriesStore.categories.find(cat => cat.id.toString() === category.value);
  // const condition = conditionStore.conditions.find(cond => cond.id.toString() === condition.value);
  const geoData = await addressToCoords(listing.address);

  const lat = geoData?.latitude ? parseFloat(geoData.latitude) : 0;
  const long = geoData?.longitude ? parseFloat(geoData.longitude) : 0;


  const selectedCategory = categoriesStore.categories.find(
    (cat) => cat.id.toString() === listing.category
  )
  const selectedCondition = conditionStore.conditions.find(
    (cond) => cond.id.toString() === listing.condition
  )

  const itemData = {
    title: listing.title,
    brief_description: listing.brief_description,
    full_description: listing.full_description,
    price: parseFloat(listing.price || '0'),
    category: selectedCategory?.id,
    condition: selectedCondition?.id,
    size: listing.size || '',
    sale_status: 'available',
    latitude: lat,
    longitude: long
  }

  try {
    const createdListing = await itemStore.createItemListing(itemData);
    if (!createdListing || !createdListing.id) {
      throw new Error("No listing ID returned from server");
    }
    
    // Build FormData for image upload
    const formData = new FormData();
    formData.append("id", createdListing.id);

    selectedImages.value.forEach((file) => {
      formData.append("images", file);
    });

    // upload new images
    console.log("Sending formatted images to server:", formData);
    const response = await postImages("images/uploadListing", formData);

    console.log("Images uploaded:", response.data);

    console.log("Successfully created listing");
    await router.push("/pofile");
  } catch (error) {
    console.error("Error creating item and/or uploading images:", error);
    throw error;
  }
}
</script>

<style scoped>
@import '../assets/createItem.css';
</style>