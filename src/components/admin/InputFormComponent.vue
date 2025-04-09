<template>
  <div class="dynamic-form">
    <h2>{{ headerText }}</h2>
    <form @submit.prevent="handleSubmit">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <label :for="field.name">{{ field.label }}</label>
        <input
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'number'"
          :type="field.type"
          v-model="formData[field.name]"
          :name="field.name"
          :placeholder="field.placeholder"
        />
        <input
          v-if="field.type === 'checkbox'"
          type="checkbox"
          v-model="formData[field.name]"
          :name="field.name"
        />
        <textarea
          v-if="field.type === 'textarea'"
          v-model="formData[field.name]"
          :name="field.name"
          :placeholder="field.placeholder"
        ></textarea>
        <div v-if="field.error" class="error-message">{{ field.error }}</div>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'checkbox'
  defaultValue: string | boolean
  required: boolean
  placeholder: string
  error?: string
}

  const props = defineProps<{
    fields: FormField[]
    headerText?: string
  }>()

  const emit = defineEmits<{
    (e: 'submit', formData: Record<string, any>): void
  }>()

  const formData = ref<Record<string, any>>({})

  // Initialize form data
  watch(() => props.fields, (fields) => {
    formData.value = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '')
      return acc
    }, {} as Record<string, any>)
  }, { immediate: true })

  const validateForm = (): boolean => {
    let isValid = true
    props.fields.forEach((field) => {
      if (field.required && !formData.value[field.name]) {
        field.error = `${field.label} is required.`
        isValid = false
      } else {
        field.error = undefined
      }
    })
    return isValid
  }

  const handleSubmit = () => {
    if (validateForm()) {
      emit('submit', formData.value)
    }
  }
</script>

<style scoped>
@import '@/assets/adminForm.css';
</style>