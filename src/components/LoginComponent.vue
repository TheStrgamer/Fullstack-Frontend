<template>
  <form @submit.prevent="onLogin" class="input-form-flex">
    <input v-model="email" type="text" id="email" name="email" placeholder="email" />
    <input v-model="password" type="password" id="password" name="password" placeholder="password" />
    <button type="submit">Login</button>
    <p>Don't have an account? <router-link to="/register">Register</router-link></p>
  </form>
</template>

<script lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/UserStore';
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'RegisterComponent',
  setup() {
    const userStore = useUserStore();
    const email = ref('');
    const password = ref('');

    const onLogin = async () => {
      console.log('login with email:', email.value, ' password:', password.value);
      try {
        await userStore.getTokenAndSaveInStore(email.value, password.value);
        await router.push("/");
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    return {
      email,
      password,
      onLogin,
    };
  },
});
</script>