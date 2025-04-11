<script setup lang="ts">
  import { convertTypeAcquisitionFromJson } from 'typescript';
  import { ref, computed, watch } from 'vue';

  
  const props = withDefaults(defineProps<{
    existingImageUrls?: string[];
    multiple?: boolean;
    display?: boolean;
  }>(), {
    multiple: true,
    display: true
  });

  const emit = defineEmits<{
    (e: 'update:images', files: File[]): void;
    (e: 'update:existingImages', urls: string[]): void;
  }>();

  const fileInput = ref<HTMLInputElement | null>(null);
  const newImages = ref<File[]>([]);
  const previewImages = ref<string[]>([]);
  const existingImages = ref<string[]>([]);

  watch(
    () => props.existingImageUrls,
    (newUrls) => {
      existingImages.value = [...(newUrls ?? [])];
    },
    { immediate: true }
  );



  const allPreviewImages = computed(() =>
    [
      ...existingImages.value.map((url) => ({ url, isNew: false })),
      ...previewImages.value.map((url) => ({ url, isNew: true })),
    ]
  );

  console.log("Preview Images", allPreviewImages);

  function triggerFileInput() {
    fileInput.value?.click();
  }

  function handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      newImages.value.push(...selectedFiles);
      previewImages.value.push(...selectedFiles.map(file => URL.createObjectURL(file)));
      emit('update:images', newImages.value);
    }
  }

  function handleRemoveImage(index: number) {
    const item = allPreviewImages.value[index];
    if (item.isNew) {
      const localIndex = previewImages.value.indexOf(item.url);
      if (localIndex !== -1) {
        previewImages.value.splice(localIndex, 1);
        newImages.value.splice(localIndex, 1);
        emit('update:images', newImages.value);
      }
    } else {
      const localIndex = existingImages.value.indexOf(item.url);
      if (localIndex !== -1) {
        existingImages.value.splice(localIndex, 1);
        emit('update:existingImages', existingImages.value);
      }
    }
  }
</script>


<template>
    <div>
      <button @click="triggerFileInput" class="upload-button">
        📷 Last opp bilder
      </button>
  
      <input
        ref="fileInput"
        type = file
        accept="image/*"
        :multiple="multiple"
        style="display: none"
        @change="handleFileChange"
      />
  
      <ul v-if="allPreviewImages.length">
        <li v-for="(img, index) in allPreviewImages" :key="index">
          <img :src="img.url" alt="preview" class="preview-img" />
          <button class="remove-button" @click="handleRemoveImage(index)">X</button>
        </li>
      </ul>

    </div>
  </template>
  

  
  <style scoped>
  .upload-button {
    background-color: var(--button, #2E4732);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .remove-button {
    background-color: #f5f5f500;
    color: var(--invalid);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 1rem;

  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .preview-img {
    max-width: 150px;
    margin: 0.5rem 0;
    border-radius: 8px;
  }
  </style>
  