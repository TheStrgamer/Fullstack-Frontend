<template>
  <div class="admin-panel">
    <AdminHeader />
    <div class="admin-create-container">
      <main class="admin-content">
        <p v-if="feedback" class="feedback">{{ feedback }}</p>
        <InputFormComponent 
          v-if="userLoaded"
          :headerText="'Edit User'" 
          :fields="formFields" 
          @submit="handleFormSubmit" 
        />
        <p v-else>Loading user data...</p>
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
      userId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        feedback: "",
        user: null,
        userLoaded: false,
        formFields: [
          {
            name: 'firstname',
            label: 'First Name',
            type: 'text',
            defaultValue: '',
            required: true,
            placeholder: 'Enter first name',
          },
          {
            name: 'surname',
            label: 'Last Name',
            type: 'text',
            defaultValue: '',
            required: true,
            placeholder: 'Enter last name',
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            defaultValue: '',
            required: true,
            placeholder: 'Enter email',
          },
          {
            name: 'phonenumber',
            label: 'Phone Number',
            type: 'text',
            defaultValue: '',
            required: true,
            placeholder: 'Enter phone number',
          },
          {
            name: 'isAdmin',
            label: 'Administrator?',
            type: 'checkbox',
            defaultValue: false, //user is not admin by default
            required: false,
        }
        ]
      };
    },
    mounted() {
      this.fetchUser(this.userId);
    },
    methods: {
      async handleFormSubmit(formData) {
        const unchanged = Object.entries(formData).every(
          ([key, value]) => value === this.user[key]
        );
  
        if (unchanged) {
          this.feedback = "No changes made.";
          return;
        }
  
        try {
          await this.updateUser(formData);
        } catch (error) {
          console.error('Error updating user:', error);
          this.feedback = error.response?.data || "Failed to update user";
        }
      },
      async fetchUser(id) {
        try {
          const response = await fetchDataWithAuth(`admin/users/${id}`);
          if (response?.data) {
            this.user = response.data;
            this.formFields = this.formFields.map(field => {
                if (field.name === 'isAdmin') {
                    return { ...field, defaultValue: this.user.role === 'ADMIN' };
                }
                return {
                    ...field,
                    defaultValue: this.user[field.name]
                };
            });
            this.userLoaded = true;
          } else {
            this.feedback = "User not found";
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          this.feedback = error.response?.data || "Failed to load user data";
        }
      },
      async updateUser(userData) {
        const payload = {
        ...userData,
        role: userData.isAdmin ? 'ADMIN' : 'USER'
        };
        delete payload.isAdmin;
        const response = await putDataWithAuth(
          `admin/users/update/${this.userId}`,
          payload
        );
        
        if (response?.data) {
          this.$router.go(-1);
        } else {
          throw new Error(response?.data || "Update failed");
        }
      }
    }
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
  