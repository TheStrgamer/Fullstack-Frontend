<template>
    <nav class="admin-sidebar">
      <ul>
        <li 
          v-for="item in menuItems" 
          :key="item.component"
          :class="{ active: activeItem === item.component }"
          @click="navigate(item.component)"
        >
        <span>{{ item.label }}</span>
        </li>
      </ul>
    </nav>
</template>
  
<script>
  export default {
    name: 'AdminSidebar',
    data() {
      return {
        activeItem: 'ListingManagement',
        menuItems: [
          { label: 'Listings', component: 'ListingManagement' },
          { label: 'Users', component: 'UserManagement' },
          { label: 'Categories', component: 'CategoryManagement' }
        ]
      }
    },
    methods: {
      navigate(component) {
        this.activeItem = component
        this.$emit('navigate', component)
      }
    }
  }
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>
  