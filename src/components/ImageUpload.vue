<template>
    <div>
      <button @click="triggerFileInput" class="upload-button">
        📷 Upload Images
      </button>
  
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleFileChange"
      />
  
      <ul v-if="previewImages.length">
        <li v-for="(img, index) in previewImages" :key="index">
          <img :src="img" alt="preview" class="preview-img" />
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const emit = defineEmits<{
    (e: 'update:images', files: File[]): void;
  }>();
  
  const fileInput = ref<HTMLInputElement | null>(null);
  const previewImages = ref<string[]>([]);
  
  function triggerFileInput() {
    fileInput.value?.click();
  }
  
  function handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      emit('update:images', selectedFiles);
  
      // Create image previews
      previewImages.value = selectedFiles.map(file => URL.createObjectURL(file));
    }
  }
  </script>
  
  <style scoped>
  .upload-button {
    background-color: var(--button, #2E4732);
    color: white;
    border: none;
    /* padding: 0.6rem 1rem; */
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .preview-img {
    max-width: 150px;
    margin: 0.5rem 0;
    border-radius: 8px;
  }
  </style>
  