<template>
    <form @submit.prevent="onRegister" class = "input-form-flex">
        <p id="responseMessage">{{ responseMessage }}</p>
        <div>
            <input v-model="firstName" type="text" id="firstName" name="firstName" placeholder="fornavn" />
            <p class="error-message">{{ firstNameErrorMessage }}</p>
        </div>
        <div>
            <input v-model="lastName" type="text" id="lastName" name="lastName" placeholder="etternavn" />
            <p class="error-message">{{ lastNameErrorMessage }}</p>
        </div>
        <div>
            <input v-model="email" type="text" id="email" name="email" placeholder="email" />
            <p class="error-message">{{ emailErrorMessage }}</p>
        </div>
        <div>
            <input v-model="phonenumber" type="text" id="phonenumber" name="phonenumber" placeholder="telefonnummer" />
            <p class="error-message">{{ phonenumberErrorMessage }}</p>
        </div>
        <div>
            <input v-model="password" type="password" id="password" name="password" placeholder="passord" />
            <p class="error-message">{{ passwordErrorMessage }}</p>
        </div>
        <div>
            <input v-model="passwordConfirm" type="password" id="passwordConfirm" name="passwordConfirm" placeholder="bekreft passord" />
        </div>
        <button type="submit" >Register</button>
        <p>Har du en bruker? <router-link to="/login">Logg inn</router-link></p>
    </form>
  </template>


<script lang="ts">
    import axios from 'axios';
    import { postDataWithoutAuth } from '@/services/httpService';
    export default {
        name: 'RegisterComponent',
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                passwordConfirm: '',
                phonenumber: '',

                firstNameErrorMessage: '',
                lastNameErrorMessage: '',
                emailErrorMessage: '',
                passwordErrorMessage: '',
                phonenumberErrorMessage: '',
                responseMessage: '',
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
            verifyPasswordsMatch() {
                return this.password === this.passwordConfirm;
            },
            verifyStringNotEmpty(str: string) {
                return str.trim() !== '';
            },
            verifyPhoneNumber() {
                const phonePattern = /^\d{8}$/; //TODO change to work with country codes
                return phonePattern.test(this.phonenumber);
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
                            fieldValid = this.verifyPasswordsMatch();
                            if (!fieldValid) {
                                this.passwordErrorMessage = 'Passwords do not match';
                            } else {
                                this.passwordErrorMessage = '';
                            }
                        }
                        break;
                    case 'phonenumber':
                        fieldValid = this.verifyPhoneNumber();
                        if (!fieldValid) {
                            this.phonenumberErrorMessage = 'Phone number must be 8 digits long';
                        } else {
                            this.phonenumberErrorMessage = '';
                        }
                        break;
                    case 'firstName':
                        fieldValid = this.verifyStringNotEmpty(this.firstName);
                        if (!fieldValid) {
                            this.firstNameErrorMessage = 'First name cannot be empty';
                        } else {
                            this.firstNameErrorMessage = '';
                        }
                        break;
                    case 'lastName':
                        fieldValid = this.verifyStringNotEmpty(this.lastName);
                        if (!fieldValid) {
                            this.lastNameErrorMessage = 'Last name cannot be empty';
                        } else {
                            this.lastNameErrorMessage = '';
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
                isValid = this.verifyField('firstName', 'firstName') && isValid;
                isValid = this.verifyField('lastName', 'lastName') && isValid;
                isValid = this.verifyField('email', 'email') && isValid;
                isValid = this.verifyField('phonenumber', 'phonenumber') && isValid;
                isValid = this.verifyField('password', 'password') && isValid;
            return isValid;
            },

            setResponseMessage(message: string, isError: boolean) {
                this.responseMessage = message;
                if (isError) {
                    document.getElementById('responseMessage')?.classList.add('error-message');
                } else {
                    document.getElementById('responseMessage')?.classList.remove('error-message');
                }
            },

            async onRegister() {
                this.setResponseMessage('', false);
                if (!this.verifyForm()) {
                    console.log('Invalid form');
                    return;
                }
                console.log('registered with first name: ', this.firstName, 'last name: ', this.lastName, 'email: ', this.email, 'password: ', this.password, 'phonenumber: ', this.phonenumber)
                try {
                    const response = await postDataWithoutAuth('users/register', {
                        email: this.email,
                        password: this.password,
                        firstname: this.firstName,
                        surname: this.lastName,
                        phonenumber: this.phonenumber
                    });
                    console.log('User registered successfully');
                    this.$router.push('/login');

                } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            const { status, data } = error.response;
                            switch (status) {
                                case 400:
                                    this.setResponseMessage('Invalid parameters', true);
                                    break;

                                case 409:
                                    if (data === "Email is already in use") {
                                        this.emailErrorMessage = 'Email is already in use';
                                    } else if (data === "Phone number is already in use") {
                                        this.phonenumberErrorMessage = 'Phone number is already in use';
                                    } else {
                                        this.setResponseMessage('Conflict error occurred', true);
                                    }
                                    break;
                                default:
                                    console.error(`Error: ${status} - ${data}`);
                                    break;
                            }
                        }
                        else if (error.request) {
                            this.setResponseMessage('No response from the server. Please check your connection.', true);
                        }
                        else {
                            console.error(`Request error: ${error.message}`);
                            this.setResponseMessage('An error occurred. Please try again later.', true);
                        }
                    } else {
                        console.error("An unexpected error occurred:", error);
                        this.setResponseMessage('An unexpected error occurred. Please try again later.', true);
                    }
                }
            },
        },
    }
</script>
  