<template>
  <div class="admin-panel">
    <AdminHeader />
    <div class="admin-create-container">
      <main class="admin-content">
        <p v-if="feedback" class="feedback">{{ feedback }}</p>
        <InputFormComponent 
          v-if="categoryLoaded"
          :headerText="'Edit category'" 
          :fields="formFields" 
          @submit="handleFormSubmit" 
        />
        <p v-else>Loading category data...</p>
      </main>
    </div>
  </div>
</template>

<script>
  import AdminHeader from '@/components/admin/AdminHeaderComponent.vue'
  import InputFormComponent from '@/components/admin/InputFormComponent.vue'
  import { fetchDataWithAuth, putDataWithAuth } from '@/services/httpService';

export default {
    components: {
      AdminHeader,
      InputFormComponent,
    },
    props: {
      categoryId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        feedback: "",
        category: null,
        categoryLoaded: false,
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
      this.fetchCategory(this.categoryId);
    },
    methods: {
      async handleFormSubmit(formData) {
        if (!formData.name || !formData.description) {
          this.feedback = "Please fill in all required fields";
          return;
        }

        if (formData.name === this.category.name && 
            formData.description === this.category.description) {
          this.feedback = "No changes made.";
          return;
        }

        try {
          const updatedCategory = {
            name: formData.name,
            description: formData.description,
          };
          await this.postCategory(updatedCategory);
        } catch (error) {
          console.error('Error updating category:', error);
          this.feedback = error.response?.data || "Failed to update category";
        }
      },
      async fetchCategory(id) {
        try {
          const response = await fetchDataWithAuth(`admin/categories/${id}`);
          if (response?.data) {
            this.category = response.data;
            this.formFields = this.formFields.map(field => ({
              ...field,
              defaultValue: this.category[field.name]
            }));
            this.categoryLoaded = true;
          } else {
            this.feedback = "Category not found";
          }
        } catch (error) {
          console.error('Error fetching category:', error);
          this.feedback = error.response?.data || "Failed to load category data";
        }
      },
      async postCategory(categoryData) {
        const response = await putDataWithAuth(
          `admin/categories/update/${this.categoryId}`,
          categoryData
        );
        
        if (response?.data) {
          this.$router.go(-1);
        } else {
          throw new Error(response?.data || "Update failed");
        }
      },
    },
  }
</script>
  
<style scoped>
  @import url('../assets/admin.css');
  
  .feedback {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
    text-align: center;
  }
  
  .feedback:not([class*="error"]) {
    background-color: #d4edda;
    color: #155724;
  }
  
  .feedback.error {
    background-color: #f8d7da;
    color: #721c24;
  }
</style>