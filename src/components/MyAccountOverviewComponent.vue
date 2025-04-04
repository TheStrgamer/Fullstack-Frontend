<template>
    <div class="my-account-page-container">
        <div class="profile-picture-edit">
            <h1>Account Information</h1>
            <img class="profilePicture" src="../assets/universal/images/defaultImage.jpg" alt="No image Found">
            <CustomButton class="profile-edit-btn" 
                title="Edit Profile Image" 
                icon_path=""
                @clicked="handleEditProfileClick"
            />
        </div>
        <div class="information-edit">

            <div class="information-display" v-if="!editToggle">
                <div class="label-field">
                    <label for="firstnameField">First Name:</label>
                    <p class="information-display-field" id="firstnameField"> {{ firstName }}</p>
                </div>

                <div class="label-field">
                    <label for="lastnameField">Last Name:</label>
                    <p class="information-display-field" id="lastnameField"> {{ lastName }}</p>
                </div>

                <div class="label-field">
                    <label for="emailField">Email:</label>
                    <p class="information-display-field" id="emailField"> {{ email }}</p>
                </div>

                <div class="label-field">
                    <label for="phonenumberField">Phonenumber:</label>
                    <p class="information-display-field" id="phonenumberField"> {{  phonenumber }}</p>
                </div>
            </div>

            
            <div v-if="editToggle">
                <form @submit.prevent="onEdit" class = "input-form-flex">
                    <div>
                        <div class="label-field">
                            <label for="firstName">First Name</label>
                            <input v-model="inputFirstName" type="text" id="firstName" name="firstName" />
                        </div>
                        <p class="error-message">{{ firstNameErrorMessage }}</p>
                    </div>
                    <div>
                        <div class="label-field">
                            <label for="lastname">Last Name</label>
                            <input v-model="inputLastName" type="text" id="lastName" name="lastName" />
                        </div>
                        <p class="error-message">{{ lastNameErrorMessage }}</p>
                    </div>
                    <div>
                        <div class="label-field">
                            <label for="phonenumber">Phonenumber</label>
                            <input v-model="inputPhonenumber" type="text" id="phonenumber" name="phonenumber" />
                        </div>
                        <p class="error-message">{{ phonenumberErrorMessage }}</p>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn" @click="handleEditProfileClick">Cancel</button>
                        <button type="submit" class="submit-btn" :disabled="!canSaveChanges">Save Changes</button>
                    </div>
                </form>
            </div>

            <CustomButton class="profile-edit-btn" v-if="!editToggle"
                title="Edit Profile" 
                icon_path=""
                @clicked="handleEditProfileClick"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import axios from 'axios';
    import CustomButton from './CustomButton.vue';
    import { onMounted } from 'vue';
    import { computed } from 'vue';

    // edit toggle
    const editToggle = ref(false);
    // const editToggle = ref(true);

    // token
    const token = localStorage.getItem("token");

    // user values
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const phonenumber = ref('');


    // input values
    const inputFirstName = ref('');
    const inputLastName = ref('');
    const inputPhonenumber = ref('');

    // error messages
    const firstNameErrorMessage = ref('');
    const lastNameErrorMessage = ref('');
    const emailErrorMessage = ref('');
    const phonenumberErrorMessage = ref('');




    onMounted(async () => {
        setUserValueFields();
    });


    // helper functions

    async function setUserValueFields() {
        const userInfo = await getProfileInfo();

        if (!userInfo) return;

        firstName.value = userInfo.firstname ?? '';
        lastName.value = userInfo.surname ?? '';
        email.value = userInfo.email ?? '';
        phonenumber.value = userInfo.phonenumber ?? '';


        console.log("retrived user info");
    }
    function handleEditProfileClick() {
        editToggle.value = !editToggle.value;
        console.log("Edit profile: ", editToggle.value);

        if (editToggle.value) {
            // Populate inputs with current values
            inputFirstName.value = firstName.value;
            inputLastName.value = lastName.value;
            inputPhonenumber.value = phonenumber.value;
        }
    }

    async function getProfileInfo() {
        try {
            const response = await axios.post("http://localhost:8080/api/users/my_account", 
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading profile: ", error);
        }
    }

    // validation functions
    const canSaveChanges = computed(() => {
        return phonenumberIsValid(inputPhonenumber.value) && fullNameIsValud(inputFirstName.value, inputLastName.value);
    });

    // function emailIsValid(email) {
    //     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //     return emailPattern.test(email);
    // }

    function phonenumberIsValid(phonenumber) {
        if (phonenumber.length === 8) return true;
        return false;
    }

    function fullNameIsValud(firstName, lastName) {
        if(firstName.length !== 0 && lastName.length !== 0) return true;
        return false;
    }

    async function onEdit() {
        try {
            console.log("Editing profile");
            const response = await axios.post("http://localhost:8080/api/users/update",
            {
                firstname: inputFirstName.value,
                surname: inputLastName.value,
                phonenumber: inputPhonenumber.value
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status == 200) {
                console.log("Updated user succesfully");
                setUserValueFields();
                handleEditProfileClick();
            }

        } catch (error) {
            console.error("Error editing profile: ", error);
        }
    }

</script>