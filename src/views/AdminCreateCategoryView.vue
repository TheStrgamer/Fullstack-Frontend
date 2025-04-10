<template>
  <div class="admin-panel">
    <AdminHeader />
    <div class="admin-create-container">
      <main class="admin-content">
        <p class="feedback">{{ feedback }}</p>
        <InputFormComponent
          :headerText="'Create new category'"
          :fields="formFields"
          @submit="handleFormSubmit"
        />
      </main>
      <div class="table-small">
        <h2>Categories</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminHeader from '@/components/admin/AdminHeaderComponent.vue'
import InputFormComponent from '@/components/admin/InputFormComponent.vue'
import { fetchDataWithAuth, postDataWithAuth } from '@/services/httpService'

interface Category {
  id: number
  name: string
  description: string
  [key: string]: string | number // Index signature
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea'
  defaultValue: string
  required: boolean
  placeholder: string
  error?: string
}

const feedback = ref('')
const categories = ref<Category[]>([])
const formFields = ref<FormField[]>([
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    defaultValue: '',
    required: true,
    placeholder: 'Enter category name',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    defaultValue: '',
    required: true,
    placeholder: 'Enter category description',
  }
])

const handleFormSubmit = async (formData: Record<string, any>) => {
  const { name, description } = formData

  if (!name || !description) {
    return
  }

  if (categories.value.some(category => category.name === name)) {
    feedback.value = "Category with this name already exists."
    console.error('Category with this name already exists:', name)
    return
  }

  try {
    await postCategory({
      name,
      description
    })
  } catch (error) {
    console.error('Error creating category:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetchDataWithAuth('admin/categories')
    if (!response?.data || !Array.isArray(response.data)) {
      console.warn('Unexpected response:', response)
      return
    }
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const postCategory = async (categoryData: { name: string; description: string }) => {
  try {
    const response = await postDataWithAuth(
      'admin/categories/add',
      categoryData
    )

    if (response?.data) {
      window.location.reload()
    } else {
      console.warn('Unexpected response:', response)
    }
  } catch (error) {
    throw error
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
@import url('../assets/admin.css');
</style>