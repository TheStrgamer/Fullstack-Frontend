<template>
  <div>
    <h1 class="title">Create new listing</h1>
    <form class="create-item-form" @submit="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" required />
      </div>

      <div class="form-group">
        <label for="brief_description">Brief description</label>
        <textarea id="brief_description" name="brief_description" required></textarea>
      </div>

      <div class="form-group">
        <label for="full_description">Long Description</label>
        <textarea id="full_description" name="full_description" required></textarea>
      </div>

      <div class="form-group">
        <label for="price">Price</label>
        <input type="number" id="price" name="price" step="0.01" required />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" name="category" required>
          <option value="" disabled selected>Select a category</option>
          <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="condition">Condition</label>
        <select id="condition" name="condition" required>
          <option value="" disabled selected>Select a condition</option>
          <option v-for="condition in conditionStore.conditions" :key="condition.id" :value="condition.id">
            {{ condition.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="size">Size (optional)</label>
        <input type="text" id="size" name="size" />
      </div>

      <div class="form-group">
        <label for="latitude">Latitude</label>
        <input type="text" id="latitude" name="latitude" />
      </div>

      <div class="form-group">
        <label for="longitude">Longitude</label>
        <input type="text" id="longitude" name="longitude" />
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '@/stores/CategoriesStore.ts'
import { useConditionStore } from '@/stores/ConditionStore.ts'
import { useItemStore } from '@/stores/ItemStore.ts'
import { useUserStore } from '@/stores/UserStore.ts'
import { onMounted, ref } from 'vue'

const categoriesStore = useCategoriesStore();
const conditionStore = useConditionStore();
const itemStore = useItemStore();
const userStore = useUserStore();

onMounted(async () => {
  await categoriesStore.fetchCategories();
  await conditionStore.fetchConditions();
});

// Handle form submission
const handleSubmit = async (event: Event) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const categoryId = formData.get('category') as string;
  const conditionId = formData.get('condition') as string;

  const category = categoriesStore.categories.find(cat => cat.id.toString() === categoryId);
  const condition = conditionStore.conditions.find(cond => cond.id.toString() === conditionId);

  const itemData = {
    title: formData.get('title') as string,
    brief_description: formData.get('brief_description') as string,
    full_description: formData.get('full_description') as string,
    price: parseFloat(formData.get('price') as string) || 0,
    category: category,
    condition: condition,
    size: formData.get('size') as string || "",
    sale_status: "available",
    latitude: parseFloat(formData.get('latitude') as string) || 0,
    longitude: parseFloat(formData.get('longitude') as string) || 0,
  };

  try {
    itemStore.createItemListing(itemData);

    form.reset();
  } catch (error) {
    console.error('Failed to create item:', error);
  }
};
</script>

<style>
.create-item-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button[type="submit"]:hover {
  background-color: #45a049;
}
</style>