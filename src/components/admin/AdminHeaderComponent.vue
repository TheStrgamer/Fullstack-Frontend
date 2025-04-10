<template>
    <header class="admin-header">
      <div class="header-content">
        <router-link class="headerlink" to="/admin">
            <h1>Admin Panel</h1>
        </router-link>
          <a class="return" href="/" >Back to main</a>
      </div>
    </header>
</template>

<script lang="ts">
  export default {
    name: 'AdminHeader'
  }
</script>
<style scoped>
  @import url('../../assets/admin.css');
</style>
