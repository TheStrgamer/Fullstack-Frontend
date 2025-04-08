<template>
  <div class="management-view">
    <div class="view-header">
      <h2>User Management</h2>
    </div>

    <div class="search-bar">
      <input
        type="text"
        placeholder="Search users..."
        v-model="searchQuery"
      />
    </div>
 
    <table class="data-table">
      <thead>
        <tr>
          <th @click="sortBy('id')">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('firstname')">First Name <span v-if="sortKey === 'firstname'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('surname')">Surname <span v-if="sortKey === 'surname'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('email')">Email <span v-if="sortKey === 'email'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('phonenumber')">Phonenumber <span v-if="sortKey === 'phonenumber'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('role')">Role <span v-if="sortKey === 'role'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('listings')">Listings <span v-if="sortKey === 'listings'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredAndSortedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.surname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phonenumber }}</td>
          <td>
            <span :class="['role-badge', user.role]">{{ user.role }}</span>
          </td>
          <td>{{ user.listings }}</td>
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
      users: [],
      searchQuery: '',
      sortKey: 'id',
      sortAsc: true,
    };
  },
  computed: {
    filteredAndSortedUsers() {
      let filtered = this.users.filter(user => {
        const query = this.searchQuery.toLowerCase();
        return (
          user.firstname.toLowerCase().includes(query) ||
          user.surname.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phonenumber && user.phonenumber.toString().includes(query))
        );
      });

      if (this.sortKey) {
        filtered.sort((a, b) => {
          const aVal = a[this.sortKey];
          const bVal = b[this.sortKey];
          if (aVal == null) return 1;
          if (bVal == null) return -1;
          if (typeof aVal === 'string') {
            return this.sortAsc
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          } else {
            return this.sortAsc ? aVal - bVal : bVal - aVal;
          }
        });
      }

      return filtered;
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetchDataWithAuth('admin/users');
        if (!response || !Array.isArray(response.data)) {
          console.warn('Unexpected response:', response);
          return;
        }
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
  @import url('../../assets/admin.css');
</style>