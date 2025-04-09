<template>
    <div class="admin-panel">
      <AdminHeader />
      <div class="admin-create-container">
        <main class="admin-content">
          <p class="feedback">{{ feedback }}</p>
          <InputFormComponent :headerText="'Create new category'" :fields="formFields" @submit="handleFormSubmit" />
        </main>
        <div class="table-small">
          <h2>Categories</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.id">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>{{ category.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
<script>
  import AdminHeader from '@/components/admin/AdminHeaderComponent.vue'
  import InputFormComponent from '@/components/admin/InputFormComponent.vue'
  import { fetchDataWithAuth, postDataWithAuth } from '@/services/httpService';

  export default {
    components: {
      AdminHeader,
      InputFormComponent,
    },
    data() {
      return {
        feedback: "",
        categories: [],
        formFields: [
            {
            name: 'name',
            label: 'Name',
            type: 'text',
            defaultValue: '',
            required: true,
            placeholder: 'Enter category name',
            },
            {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            defaultValue: '',
            required: true,
            placeholder: 'Enter category description',
            },
        ]
      }
    },
    mounted() {
      this.fetchCategories();
    },
    methods: {
      handleFormSubmit(formData) {
        let name = formData.name;
        let description = formData.description;
        if (!name || !description) {
          return;
        }
        for (let category of this.categories) {
          if (category.name === name) {
            this.feedback = "Category with this name already exists.";
            console.error('Category with this name already exists:', name);
            return;
          }
        }
        console.log('Form submitted with data:', formData);
        const newCategory = JSON.stringify({
          name: formData.name,
          description: formData.description,
        });
        this.postCategory(newCategory);
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
      async postCategory(category) {
        try {
          const response = await postDataWithAuth('admin/categories/add', category);
          if (!response || !response.data) {
            console.warn('Unexpected response:', response);
            return;
          }
          window.location.reload();
        } catch (error) {
          console.error('Error creating category:', error);
        }
      },
    },
  }
</script>

<style scoped>
  @import url('../assets/admin.css');
</style>