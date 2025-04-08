<template>
    <div class="management-view">
      <div class="view-header">
        <h2>Listing Management</h2>
      </div>
      

      <div class="search-bar">
      <input
        type="text"
        placeholder="Search listings..."
        v-model="searchQuery"
      />
    </div>
 
    <table class="data-table">
      <thead>
        <tr>
          <th @click="sortBy('id')">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('title')">Title <span v-if="sortKey === 'title'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('shortDescription')">Short Description <span v-if="sortKey === 'shortDescription'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('price')">Price <span v-if="sortKey === 'price'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('category')">Category <span v-if="sortKey === 'category'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('status')">Status <span v-if="sortKey === 'status'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('creatorName')">Creator <span v-if="sortKey === 'creatorName'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('createdDate')">Created <span v-if="sortKey === 'createdDate'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('updatedDate')">Updated <span v-if="sortKey === 'updatedDate'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('latitude')">Coords <span v-if="sortKey === 'latitude'">{{ sortAsc ? '▼' : '▲' }}</span></th>
          <th @click="sortBy('longDescription')">Long Description <span v-if="sortKey === 'longDescription'">{{ sortAsc ? '▼' : '▲' }}</span></th>

          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="listing in filteredAndSortedListings" :key="listing.id">
          <td>{{ listing.id }}</td>
          <td>{{ listing.title }}</td>
          <td>{{ listing.shortDescription }}</td>
          <td>{{ listing.price }}</td>
          <td>{{ listing.category }}</td>
          <td>
            <span :class="['status-badge', listing.status]">{{ listing.status }}</span>
          </td>
          <td>{{ listing.creatorName }}</td>
          <td>{{ formatDate(listing.createdDate) }}</td>
          <td>{{ formatDate(listing.updatedDate) }}</td>
          <td>{{ formatCoords(listing.latitude, listing.longitude) }}</td>
          <td>{{ listing.longDescription }}</td>    
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
  name: 'ListingAdminComponent',
  data() {
    return {
      listings: [],
      searchQuery: '',
      sortKey: 'id',
      sortAsc: true,
    };
  },
  computed: {
    filteredAndSortedListings() {
        const query = this.searchQuery.toLowerCase();

        return this.listings
            .filter(listing => {
            return (
                listing.title?.toLowerCase().includes(query) ||
                listing.shortDescription?.toLowerCase().includes(query) ||
                listing.creatorName?.toLowerCase().includes(query) ||
                listing.category?.toLowerCase().includes(query) ||
                String(listing.status).includes(query) ||
                listing.condition?.toLowerCase?.().includes(query) ||
                String(listing.price)?.includes(query) ||
                String(listing.latitude)?.includes(query) ||
                String(listing.longitude)?.includes(query) ||
                new Date(listing.createdDate).toLocaleString().toLowerCase().includes(query) ||
                new Date(listing.updatedDate).toLocaleString().toLowerCase().includes(query)
            );
            })
            .sort((a, b) => {
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

  },
  methods: {
    async fetchListings() {
      try {
        const response = await fetchDataWithAuth('admin/listings');
        if (!response || !Array.isArray(response.data)) {
          console.warn('Unexpected response:', response);
          return;
        }
        this.listings = response.data;
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toISOString().slice(0, 16).replace('T', ' ');
    },
    formatCoords(lat, lon) {
      return `${lat}, ${lon}`;
    }
  },
  mounted() {
    this.fetchListings();
  }
};
</script>

<style scoped>
  @import url('../../assets/admin.css');
.data-table {
  font-size: 0.8rem;
}
.data-table td.description-cell {
  max-width: 220px;
  overflow-x: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.data-table td.description-cell:hover {
  overflow-x: auto;
}
.action-btn {
  font-size: 0.75rem;
  padding: 4px 8px;
}
</style>
