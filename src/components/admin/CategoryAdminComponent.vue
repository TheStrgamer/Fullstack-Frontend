<template>
    <div class="management-view">
      <div class="view-header">
        <h2>Category Management</h2>
        <router-link to="/admin/addCategory" class="add-btn" >Add Category</router-link>
      </div>
  
      <div class="search-bar">
        <input
          type="text"
          placeholder="Search categories..."
          v-model="searchQuery"
        />
      </div>
  
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('id')">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▼' : '▲' }}</span></th>
            <th @click="sortBy('name')">Name <span v-if="sortKey === 'name'">{{ sortAsc ? '▼' : '▲' }}</span></th>
            <th @click="sortBy('description')">Description <span v-if="sortKey === 'description'">{{ sortAsc ? '▼' : '▲' }}</span></th>
            <th @click="sortBy('listings')">Listings <span v-if="sortKey === 'listings'">{{ sortAsc ? '▼' : '▲' }}</span></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in filteredAndSortedCategories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>{{ category.listings }}</td>
            <td>
              <button class="action-btn">Edit</button>
              <button 
                class="action-btn delete-btn"
                @click="confirmDelete(category)"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
  import { fetchDataWithAuth } from '@/services/httpService';
  
  export default {
    name: 'CategoryAdminComponent',
    data() {
      return {
        categories: [],
        searchQuery: '',
        sortKey: 'id',
        sortAsc: true,
      };
    },
    computed: {
      filteredAndSortedCategories() {
        const query = this.searchQuery.toLowerCase();
        let filtered = this.categories.filter(category => {
          return (
            category.name?.toLowerCase().includes(query) ||
            category.description?.toLowerCase().includes(query)
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
        confirmDelete(category) {
            let message = 'This category has no listings.';
            if (category.listings > 0) {
             message = 'This category has ' + category.listings + ' listings. Their category will be set to "Other" if this category is deleted.';
            }
            this.$router.push({
                name: 'ConfirmDelete',
                params: {
                itemType: 'categories',
                itemId: category.id,
                extraMessage: message,
                },
                query: {
                itemName: category.name
                }
            });
        },
      async fetchCategories() {
        try {
          const response = await fetchDataWithAuth('admin/categories');
          if (!response || !Array.isArray(response.data)) {
            console.warn('Unexpected response:', response);
            return;
          }
          this.categories = response.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
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
      this.fetchCategories();
    }
  };
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>
  