<template>
    <nav class="admin-sidebar">
      <ul>
        <router-link
          v-for="item in menuItems"
          :key="item.url"
          :to="item.url"
          class="sidebar-item"
          :class="{ active: activeItem === item.url }"
          @click="activeItem = item.url"
        >
          <li>{{ item.label }}</li>
        </router-link>
      </ul>
    </nav>
</template>

<script lang="ts">
  export default {
    name: 'AdminSidebar',
    data() {
      return {
        activeItem: 'ListingManagement',
        menuItems: [
          { label: 'Users', url: 'user' },
          { label: 'Listings', url: 'listing' },
          { label: 'Categories', url: 'category' }
        ]
      }
    },
  }
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>
  