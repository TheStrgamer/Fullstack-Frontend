<template>
    <form @submit.prevent="onLogin" class = "input-form-flex">

        <input v-model="email" type="text" id="email" name="email" placeholder="email" />
        <input v-model="password" type="password" id="password" name="password" placeholder="password" />
        <button type="submit" >Login</button>
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </template>


<script lang="ts">
    import router from '@/router';
import axios from 'axios';
    export default {
        name: 'RegisterComponent',
        data() {
            return {
                email: '',
                password: '',
            }
        },
        methods: {
            async onLogin() {
                console.log('login with email:', this.email, ' password:', this.password);
                try {
                    const response = await axios.post('http://localhost:8080/api/users/login', {
                        email: this.email,
                        password: this.password
                    });

                    if(!response) {
                        console.log(response);
                        throw new Error("Login Failed!");
                    }

                    console.log('Login successful:', response.data);
                    localStorage.setItem("token", response.data);
                    router.push('/');
                    
                } catch (error) {
                    console.error('Login error:', error);
                }
                
            },
        }
    }
</script>
  