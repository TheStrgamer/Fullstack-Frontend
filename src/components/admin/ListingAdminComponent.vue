<template>
    <div class="management-view">
      <div class="view-header">
        <h2>Listing Management</h2>
        <button class="add-btn">Add Listing</button>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Search listings...">
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="listing in mockListings" :key="listing.id">
            <td>{{ listing.id }}</td>
            <td>{{ listing.title }}</td>
            <td>{{ listing.category }}</td>
            <td>
              <span :class="['status-badge', listing.status]">{{ listing.status }}</span>
            </td>
            <td>{{ listing.created }}</td>
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
    name: 'ListingAdminComponent',
    data() {
      return {
        mockListings: [
          { id: 1, title: 'Claymore', category:'swords', status: 'active', created: '2023-05-15' },
          { id: 2, title: 'Lawbringers halberd', category:'halberds', status: 'inactive', created: '2023-06-22' },
          { id: 3, title: 'NOM NOM', category:'Monkey soup', status: 'pending', created: '2023-07-10' },
          { id: 4, title: 'Powerking light', category:'powerking', status: 'active', created: '2023-08-05' },
          { id: 5, title: 'Railgun', category:'Modern weapons', status: 'active', created: '2023-09-18' }
        ]
      }
    }
  }
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>