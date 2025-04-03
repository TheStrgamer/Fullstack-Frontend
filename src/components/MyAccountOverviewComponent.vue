<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { copyFileSync } from 'fs';

    const token = localStorage.getItem("token");

    // console.log("token: ", token);

    onMounted(() => {
        // console.log("Page loaded");
        // console.log("token: ", token);
        displayProfileInfo();
    });

    let img = ref('');
    let fullname = ref('');
    let email = ref('');
    let phonenumber = ref('');

    async function displayProfileInfo() {
        const userInfo = await getProfileInfo();

        fullname.value = `${userInfo?.data.firstname} ${userInfo?.data.surname}`;
        email.value = userInfo?.data.email;
        phonenumber.value = userInfo?.data.phonenumber;
    }

    async function handleEditProfileClick() {
        console.log("Edit profile");
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

            // console.log(response);
            return response;
        } catch (error) {
            console.error("Error loading profile: ", error);
        }
    }

    

</script>


<template>
    <div class="content_box">
        <h1>Din Profil</h1> <br>
        <img class="profilePicture" src="../assets/defaultImage.jpg" alt="No image Found">
        <p>{{ fullname }}</p>
        <p> {{ email }}</p>
        <p>{{ phonenumber }}</p>

        <button @click="handleEditProfileClick">Edit Profile</button>
    </div>
    


</template>


<style>
@import '../assets/profile.css';
</style>
  