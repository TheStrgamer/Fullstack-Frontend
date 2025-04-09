<template>
    <div class="admin-panel">
      <AdminHeader />
      <div class="admin-container">
        <AdminSidebar/>
        <main class="admin-content">
            <KeepAlive>
                <router-view />
            </KeepAlive>
        </main>
      </div>
    </div>
</template>

<script>
  import AdminHeader from '@/components/admin/AdminHeaderComponent.vue'
  import AdminSidebar from '@/components/admin/AdminSidebarComponent.vue'
  export default {
    components: {
      AdminHeader,
      AdminSidebar
    },
    data() {
      return {
        currentView: 'ListingManagement'
      }
    },
  }
</script>

<style scoped>
  @import url('../assets/admin.css');
</style>