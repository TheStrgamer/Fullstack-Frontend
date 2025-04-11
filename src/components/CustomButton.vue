<template>
  <button class="custom-button" @click="emit('clicked')">
    <img v-if="icon_path" :src="icon_path" alt="" />
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
