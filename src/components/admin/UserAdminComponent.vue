<template>
    <div class="management-view">
      <div class="view-header">
        <h2>User Management</h2>
        <button class="add-btn">Add User</button>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Search users...">
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in mockUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.surname }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role]">{{ user.role }}</span>
            </td>
            <td>{{ user.joined }}</td>
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
  import { fetchDataWithAuth } from '@/services/httpService';
  export default {
    name: 'UserAdminComponent',
    data() {
      return {
        mockUsers: [
          { id: 1, firstName: 'admin', surname: 'admin', email: 'admin@example.com', role: 'admin', joined: '2023-01-10' },
          { id: 2, firstName: 'Kåre', surname: 'Kakkelovn', email: 'kare@example.com', role: 'editor', joined: '2023-02-15' },
          { id: 3, firstName: 'Kalle', surname: 'Kontainer', email: 'kalle@example.com', role: 'user', joined: '2023-03-22' },
          { id: 4, firstName: 'Mor', surname: 'Di', email: 'mordi@example.com', role: 'user', joined: '2023-04-05' },
          { id: 5, firstName: 'Gustang', surname: 'Poe Bidau', email: 'gustang@poebidau.com', role: 'editor', joined: '2023-05-18' }
        ]
      }
    },

  }
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>