<template>
    <div class="admin-panel">
      <AdminHeader />
      <div class="admin-container">
        <AdminSidebar/>
        <main class="admin-content">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </main>
      </div>
    </div>
</template>

<script setup lang="ts">
import AdminHeader from '../components/admin/AdminHeaderComponent.vue';
import AdminSidebar from '../components/admin/AdminSidebarComponent.vue';
</script>

<style scoped>
  @import url('../assets/admin.css');
</style>