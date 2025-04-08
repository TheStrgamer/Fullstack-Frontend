<template>
    <div class="admin-panel">
      <AdminHeader />
      <div class="admin-container">
        <AdminSidebar @navigate="changeView" />
        <main class="admin-content">
          <component :is="currentView" />
        </main>
      </div>
    </div>
</template>

<script>
  import AdminHeader from '@/components/admin/AdminHeaderComponent.vue'
  import AdminSidebar from '@/components/admin/AdminSidebarComponent.vue'
  import ListingManagement from '@/components/admin/ListingAdminComponent.vue'
  import UserManagement from '@/components/admin/UserAdminComponent.vue'
  import CategoryManagement from '@/components/admin/CategoryAdminComponent.vue'

  export default {
    components: {
      AdminHeader,
      AdminSidebar,
      ListingManagement,
      UserManagement,
      CategoryManagement
    },
    data() {
      return {
        currentView: 'ListingManagement'
      }
    },
    methods: {
      changeView(view) {
        this.currentView = view
      }
    }
  }
</script>

<style scoped>
  @import url('../assets/admin.css');
</style>