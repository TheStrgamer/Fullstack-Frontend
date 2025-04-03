<template>
  <div>
    <h1 class="title">Create new listing</h1>
    <form class="create-item-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" required />
      </div>

      <div class="form-group">
        <label for="description">Brief description</label>
        <textarea id="description" required></textarea>
      </div>

      <div class="form-group">
        <label for="condition">Long Description</label>
        <textarea id="description" required></textarea>
      </div>

      <div class="form-group">
        <label for="price">Price</label>
        <input type="number" id="price" required />
      </div>

      <div class="form-group">
        <label for="latitude">Latitude</label>
        <input type="text" id="latitude"/>
      </div>

      <div class="form-group">
        <label for="longitude">longitude</label>
        <input type="text" id="longitude"/>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">

</script>

<style>

</style>