// Wrap element in this component to give it a fade-in effect
<template>
    <div
      ref="elementRef"
      :class="['fade-in-container', isVisible ? 'visible' : '', className]"
    >
      <slot />
    </div>
  </template>
<script setup lang="ts">

import { onMounted, ref } from 'vue';

const props = defineProps({
  duration: { type: Number, default: 700 },
  className: { type: String, default: '' }
});

const elementRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1 });

  if (elementRef.value) {
    observer.observe(elementRef.value);
  }
});
</script>

<style scoped>
.fade-in-container {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.7s ease-out;
}

.fade-in-container.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
