<template>
    <div class="management-view">
      <div class="view-header">
        <h2>Category Management</h2>
        <button class="add-btn">Add Category</button>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Search categories...">
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Listings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in mockCategories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.listings }}</td>
            <td>
              <button class="action-btn">View</button>
              <button class="action-btn">Edit</button>
              <button class="action-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  export default {
    name: 'CategoryAdminComponent',
    data() {
      return {
        mockCategories: [
          { id: 1, name: 'Sword', listings: 42 },
          { id: 2, name: 'Halberds', listings: 35 },
          { id: 3, name: 'Spears', listings: 18 },
          { id: 4, name: 'Monkey soup', listings: 27 },
          { id: 5, name: 'Powerking', listings: 13 }
        ]
      }
    }
  }
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>