<template>
    <button @click="emit('clicked')">
      <img v-if="icon_path" :src="icon_path" alt="" style="width: 1rem; margin-right: 0.5rem;" />
      {{ title }}
    </button>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    icon_path: string;
    title: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'clicked'): void;
  }>();
  </script>
  
  <style>
  @import '../assets/customButton.css';
  </style>
  