<template>
  <div class="admin-panel">
    <AdminHeader />
    <div class="admin-create-container">
      <main class="admin-content">
        <p v-if="feedback" class="feedback">{{ feedback }}</p>
        <InputFormComponent
          v-if="userLoaded"
          :headerText="'Edit User'"
          :fields="formFields"
          @submit="handleFormSubmit"
        />
        <p v-else>Loading user data...</p>
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

const props = defineProps<{
  userId: number
}>()

const router = useRouter()
const feedback = ref("")
const user = ref<any>(null)
const userLoaded = ref(false)

interface UserFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'checkbox'
  defaultValue: string | boolean
  required: boolean
  placeholder: string
}

const formFields = ref<UserFormField[]>([
  {
    name: 'firstname',
    label: 'First Name',
    type: 'text',
    defaultValue: '',
    required: true,
    placeholder: 'Enter first name',
  },
  {
    name: 'surname',
    label: 'Last Name',
    type: 'text',
    defaultValue: '',
    required: true,
    placeholder: 'Enter last name',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    defaultValue: '',
    required: true,
    placeholder: 'Enter email',
  },
  {
    name: 'phonenumber',
    label: 'Phone Number',
    type: 'text',
    defaultValue: '',
    required: true,
    placeholder: 'Enter phone number',
  },
  {
    name: 'isAdmin',
    label: 'Administrator?',
    type: 'checkbox',
    defaultValue: false,
    required: false,
    placeholder: '',
  }
])

const fetchUser = async (id: number) => {
  try {
    const response = await fetchDataWithAuth(`admin/users/${id}`)
    if (response?.data) {
      user.value = response.data
      formFields.value = formFields.value.map(field => {
        if (field.name === 'isAdmin') {
          return { ...field, defaultValue: user.value.role === 'ADMIN' }
        }
        return {
          ...field,
          defaultValue: user.value[field.name]
        }
      })
      userLoaded.value = true
    } else {
      feedback.value = "User not found"
    }
  } catch (error: any) {
    console.error('Error fetching user:', error)
    feedback.value = error.response?.data || "Failed to load user data"
  }
}

const updateUser = async (userData: any) => {
  const payload = {
    ...userData,
    role: userData.isAdmin ? 'ADMIN' : 'USER'
  }
  delete payload.isAdmin

  try {
    const response = await putDataWithAuth(
      `admin/users/update/${props.userId}`,
      payload
    )

    if (response?.data) {
      router.go(-1)
    } else {
      throw new Error(response?.data || "Update failed")
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    feedback.value = error.response?.data || "Failed to update user"
    // throw error
  }
}

const handleFormSubmit = async (formData: any) => {
  const unchanged = Object.entries(formData).every(
    ([key, value]) => value === user.value[key]
  )

  if (unchanged) {
    feedback.value = "No changes made."
    return
  }

  await updateUser(formData)
}

onMounted(() => {
  fetchUser(props.userId)
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
  