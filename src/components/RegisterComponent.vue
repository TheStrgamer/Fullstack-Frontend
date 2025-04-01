<template>
    <form @submit.prevent="onRegister" class = "input-form-flex">

        <input v-model="firstName" type="text" id="firstName" name="firstName" placeholder="first name" />
        <input v-model="lastName" type="text" id="lastName" name="lastName" placeholder="last name" />
        <input v-model="email" type="text" id="email" name="email" placeholder="email" />
        <input v-model="phonenumber" type="text" id="phonenumber" name="phonenumber" placeholder="phonenumber" />
        <input v-model="password" type="password" id="password" name="password" placeholder="password" />
        <button type="submit" >Register</button>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </template>


<script lang="ts">
    import axios from 'axios';
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
            async onRegister() {
                console.log('registered with first name: ', this.firstName, 'last name: ', this.lastName, 'email: ', this.email, 'password: ', this.password, 'phonenumber: ', this.phonenumber)
                try {
                    const response = await axios.post('http://localhost:8080/api/users/register', {
                        email: this.email,
                        password: this.password,
                        firstname: this.firstName,
                        surname: this.lastName,
                        phonenumber: this.phonenumber
                    });
                    if (response.data === 0) {
                        console.log('User registered successfully');
                        this.$router.push('/login');
                    } else {
                        console.log('User registration failed');                        
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        },
    }
</script>
  