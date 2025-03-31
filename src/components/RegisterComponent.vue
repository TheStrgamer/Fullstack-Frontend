<template>
    <form @submit.prevent="onLogin" class = "input-form-flex">

        <input v-model="firstName" type="text" id="firstName" name="firstName" placeholder="firstName" />
        <input v-model="lastName" type="text" id="lastName" name="lastName" placeholder="lastName" />
        <input v-model="email" type="text" id="email" name="email" placeholder="email" />
        <input v-model="phonenumber" type="text" id="phonenumber" name="phonenumber" placeholder="phonenumber" />
        <input v-model="password" type="password" id="password" name="password" placeholder="password" />
        <button type="submit" >Register</button>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </template>


<script lang="ts">
    export default {
        name: 'RegisterComponent',
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phonenumber: '',
            }
        },
        methods: {
            onLogin() {
                console.log('registered with first name: ', this.firstName, 'last name: ', this.lastName, 'email: ', this.email, 'password: ', this.password, 'phonenumber: ', this.phonenumber)
            },
        },
    }
</script>
  