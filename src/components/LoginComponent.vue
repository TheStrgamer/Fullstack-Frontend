<template>
    <form @submit.prevent="onLogin" class = "input-form-flex">

        <input v-model="email" type="text" id="email" name="email" placeholder="email" />
        <input v-model="password" type="password" id="password" name="password" placeholder="password" />
        <button type="submit" >Login</button>
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </template>


<script lang="ts">
    export default {
        name: 'RegisterComponent',
        data() {
            return {
                email: '',
                password: '',
            }
        },
        methods: {
            onLogin() {
                console.log('login with email:', this.email, ' password:', this.password)
            },
        },
    }
</script>
  