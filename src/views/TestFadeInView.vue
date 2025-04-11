<template>
  <div style="height: 2000px;">
    <!-- Spacer to ensure the component starts outside the viewport -->
    <div style="height: 1000px;"></div>

    <!-- Controlled instance of FadeInComponent -->
    <FadeInComponent :duration="400" direction="top" class="test-fade-in">
      <p>Test FadeInComponent</p>
    </FadeInComponent>
  </div>
</template>

<script setup lang="ts">
import FadeInComponent from '@/components/FadeInComponent.vue';
</script>

<style scoped>
.test-fade-in {
  border: 1px solid black;
  padding: 20px;
  text-align: center;
}
</style>