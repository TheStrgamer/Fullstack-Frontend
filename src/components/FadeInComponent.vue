// Wrap element in this component to give it a fade-in effect
<template>
  <div
      ref="elementRef"
      :class="[
        'fade-in-container',
        isVisible ? 'visible' : '',
        `from-${direction}`
      ]"
      :style="{ transitionDuration: duration + 'ms' }"
    >
    <slot />
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';

const props = defineProps({
  duration: { type: Number, default: 700 },
    direction: {
        type: String,
        default: 'top',
        validator: (value: string) => ['top', 'bottom', 'left', 'right'].includes(value)
    }

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
  transition: all 0.7s ease-out;
}

.from-top {
  transform: translateY(-20px);
}
.from-bottom {
  transform: translateY(20px);
}
.from-left {
  transform: translateX(-20px);
}
.from-right {
  transform: translateX(20px);
}


.fade-in-container.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
