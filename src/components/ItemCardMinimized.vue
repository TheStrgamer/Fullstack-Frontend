<template>
  <router-link to="/" class="no-link-style">
    <div class="item-card-minimized">
      <img id="minimized-item-picture" src="https://media.snl.no/media/283790/article_topimage_buss.jpg">
      <h3 id="item-header">sdfkjalødfkslaølkjdføsalkdfs</h3>
      <p id="item-prize">100kr</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
</script>

<style>
.item-card-minimized {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  max-height: 40%;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

#minimized-item-picture {
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
}
</style>