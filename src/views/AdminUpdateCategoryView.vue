<template>
  <div class="admin-panel">
    <AdminHeader />
    <div class="admin-create-container">
      <main class="admin-content">
        <p v-if="feedback" class="feedback">{{ feedback }}</p>
        <InputFormComponent
          v-if="categoryLoaded"
          :headerText="'Edit category'"
          :fields="formFields"
          @submit="handleFormSubmit"
        />
        <p v-else>Loading category data...</p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '../components/admin/AdminHeaderComponent.vue'
import InputFormComponent from '../components/admin/InputFormComponent.vue'
import { fetchDataWithAuth, putDataWithAuth } from '@/services/httpService'

interface Category {
  id: number
  name: string
  description: string
  [key: string]: string | number // Add index signature
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'checkbox'
  defaultValue: string | boolean
  required: boolean
  placeholder: string
  error?: string
}

interface CategoryFormData {
  name: string
  description: string
  [key: string]: string | boolean // Match form field types
}

const props = defineProps<{
  categoryId: number
}>()

const router = useRouter()
const feedback = ref('')
const category = ref<Category | null>(null)
const categoryLoaded = ref(false)
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
  const categoryData: CategoryFormData = {
    name: String(formData.name),
    description: String(formData.description)
  }

  if (!categoryData.name || !categoryData.description) {
    feedback.value = "Please fill in all required fields"
    return
  }

  if (category.value &&
      categoryData.name === category.value.name &&
      categoryData.description === category.value.description) {
    feedback.value = "No changes made."
    return
  }

  try {
    await postCategory(categoryData)
  } catch (error: any) {
    console.error('Error updating category:', error)
    feedback.value = error.response?.data || "Failed to update category"
  }
}

const fetchCategory = async (id: number) => {
  try {
    const response = await fetchDataWithAuth(`admin/categories/${id}`)
    if (response?.data) {
      category.value = response.data
      formFields.value = formFields.value.map(field => ({
        ...field,
        defaultValue: category.value ? String(category.value[field.name]) : ''
      }))
      categoryLoaded.value = true
    } else {
      feedback.value = "Category not found"
    }
  } catch (error: any) {
    console.error('Error fetching category:', error)
    feedback.value = error.response?.data || "Failed to load category data"
  }
}

const postCategory = async (categoryData: { name: string; description: string }) => {
  try {
    const response = await putDataWithAuth(
      `admin/categories/update/${props.categoryId}`,
      categoryData
    )
    if (response?.data) {
      router.go(-1)
    } else {
      throw new Error(response?.data || "Update failed")
    }
  } catch (error) {
    throw error
  }
}

onMounted(() => {
  fetchCategory(props.categoryId)
})
</script>
<style scoped>
@import url('../assets/admin.css');

.feedback {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  text-align: center;
}

.feedback:not([class*="error"]) {
  background-color: #d4edda;
  color: #155724;
}

.feedback.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>