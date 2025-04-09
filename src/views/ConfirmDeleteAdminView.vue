<template>
  <div class="confirmation-page">
    <div class="confirmation-card">
      <h2>Are you sure you want to delete "{{ $route.query.itemName }}"?</h2>
      <p class="confirmation-message" v-if="extraMessageText">{{ extraMessageText }}</p>
      <div class="confirmation-actions">
        <button @click="confirmDelete" class="btn btn-danger">Yes, Delete</button>
        <button @click="cancelDelete" class="btn btn-cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { deleteDataWithAuth } from '@/services/httpService'

  const props = defineProps<{
    itemName: string
    itemId: string | number
    itemType: string
    extraMessage?: string
  }>()

  const emit = defineEmits<{
    (e: 'deleteConfirmed', id: string | number): void
  }>()

  const router = useRouter()
  const extraMessageText = ref(props.extraMessage || '')

  const confirmDelete = async () => {
    try {
      const endpoint = `admin/${props.itemType}/delete/${props.itemId}`
      const response = await deleteDataWithAuth(endpoint)

      if (response.status === 200) {
        emit('deleteConfirmed', props.itemId)
      }
    } catch (error: unknown) {
      console.error('Error deleting item:', error)
      extraMessageText.value = error instanceof Error
        ? error.message
        : 'An error occurred while deleting the item.'
      return
    }
    router.go(-1)
  }

  const cancelDelete = () => {
    router.go(-1)
  }
</script>

<style scoped>
  .confirmation-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 70px);
    background-color: #f5f5f5;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .confirmation-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    text-align: center;
  }

  .confirmation-card h2 {
    color: #3d4954;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .confirmation-message {
    color: #3d4954;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .confirmation-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 120px;
  }

  .btn-danger {
    background-color: #933434;
    color: #f5f5f5;
  }

  .btn-danger:hover {
    background-color: #7a2a2a;
    transform: translateY(-1px);
  }

  .btn-cancel {
    background-color: #505f6d;
    color: #f5f5f5;
  }

  .btn-cancel:hover {
    background-color: #3d4954;
    transform: translateY(-1px);
  }
</style>