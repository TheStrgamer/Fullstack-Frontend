<template>
    <form @submit.prevent="onLogin" class = "input-form-flex">

        <div>
            <input v-model="email" type="text" id="email" name="email" placeholder="email" />
            <p class="error-message">{{ emailErrorMessage }}</p>
        </div>        
        <div>
            <input v-model="password" type="password" id="password" name="password" placeholder="password" />
            <p class="error-message">{{ passwordErrorMessage }}</p>
        </div>
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

                emailErrorMessage: '',
                passwordErrorMessage: '',
            }
        },
        methods: {
            verifyEmail() {
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailPattern.test(this.email);
            },
            verifyPassword() {
                return this.password.length >= 3;
            },
            verifyField(field: string, id: string) {
                let fieldValid = false;
                switch (field) {
                    case 'email':
                        fieldValid = this.verifyEmail();
                        if (!fieldValid) {
                            this.emailErrorMessage = 'Please enter a valid email';
                        } else {
                            this.emailErrorMessage = '';
                        }
                        break;
                    case 'password':
                        fieldValid = this.verifyPassword();
                        if (!fieldValid) {
                            this.passwordErrorMessage = 'Password must be at least 3 characters long';
                        } else {
                            this.passwordErrorMessage = '';
                        }
                        break;
                    default:
                        break;
                    
                }
                const element = document.getElementById(id);
                if (element) {
                    if (fieldValid) {
                        element.classList.remove('invalid-field');
                    } else {
                        element.classList.add('invalid-field');
                    }
                }
                return fieldValid;
            },
            verifyForm() {
                let isValid = true;
                isValid = this.verifyField('email', 'email') && isValid;
                isValid = this.verifyField('password', 'password') && isValid;
            return isValid;
            },
            async onLogin() {
                if (!this.verifyForm()) {
                    return;
                }
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

                    router.push('/');
                    
                } catch (error) {
                    console.error('Login error:', error);
                }
                
            },
        }
    }
</script>
  