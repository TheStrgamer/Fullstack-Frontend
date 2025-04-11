<template>
    <div class="my-account-page-container">
        <div class="profile-picture-edit">
            <h1>Bruker informasjon</h1>
            <img class="profilePicture" :src="profilePictureUrl" alt="No image found" @error="profilePictureUrl = defaultProfileImage">
            <div v-if="editToggle">
                <ImageUpload
                    :multiple="false"
                    @update:images="selectedProfileImage = $event"
                />
            </div>  
            
        </div>
        <div class="information-edit">

            <div class="information-display" v-if="!editToggle">
                <div class="label-field">
                    <label for="firstnameField">Fornavn:</label>
                    <p class="information-display-field" id="firstnameField"> {{ firstName }}</p>
                </div>

                <div class="label-field">
                    <label for="lastnameField">Etternavn:</label>
                    <p class="information-display-field" id="lastnameField"> {{ lastName }}</p>
                </div>

                <div class="label-field">
                    <label for="emailField">Email:</label>
                    <p class="information-display-field" id="emailField"> {{ email }}</p>
                </div>

                <div class="label-field">
                    <label for="phonenumberField">Telefonnummer:</label>
                    <p class="information-display-field" id="phonenumberField"> {{  phonenumber }}</p>
                </div>
            </div>


            <div v-if="editToggle">
                <form @submit.prevent="onEdit" class = "input-form-flex">
                    <div>
                        <div class="label-field">
                            <label for="firstName">Fornavn</label>
                            <input v-model="inputFirstName" type="text" id="firstName" name="firstName" />
                        </div>
                        <p class="error-message">{{ firstNameErrorMessage }}</p>
                    </div>
                    <div>
                        <div class="label-field">
                            <label for="lastname">Etternavn</label>
                            <input v-model="inputLastName" type="text" id="lastName" name="lastName" />
                        </div>
                        <p class="error-message">{{ lastNameErrorMessage }}</p>
                    </div>
                    <div>
                        <div class="label-field">
                            <label for="email">Email</label>
                            <input v-model="inputEmail" type="text" id="email" name="email" />
                        </div>
                        <p class="error-message">{{ emailErrorMessage }}</p>
                    </div>
                    <div>
                        <div class="label-field">
                            <label for="phonenumber">Telefonnummer</label>
                            <input v-model="inputPhonenumber" type="text" id="phonenumber" name="phonenumber" />
                        </div>
                        <p class="error-message">{{ phonenumberErrorMessage }}</p>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn" @click="handleEditProfile">Avbryt</button>
                        <button type="submit" class="submit-btn" :disabled="!canSaveChanges">Lagre endringer</button>
                    </div>
                </form>
            </div>

            <CustomButton class="profile-edit-btn" v-if="!editToggle"
                title="Edit Profile"
                icon_path=""
                @clicked="handleEditProfile"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import CustomButton from './CustomButton.vue';
    import { fetchDataWithAuth, postDataWithAuth, getUrlFromEndpoint, postImages, putDataWithAuth } from '@/services/httpService';

    import defaultProfileImage from '@/assets/universal/images/defaultImage.jpg';

    import ImageUpload from './ImageUpload.vue';
import { useUserStore } from '@/stores/UserStore';


    const editToggle = ref(false);

    const selectedImages = ref<File[]>([]);

    const imgFile = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const phonenumber = ref('');
    const profilePictureUrl = ref('');


    const inputFirstName = ref('');
    const inputLastName = ref('');
    const inputEmail = ref('');
    const inputPhonenumber = ref('');

    const firstNameErrorMessage = ref('');
    const lastNameErrorMessage = ref('');
    const emailErrorMessage = ref('');
    const phonenumberErrorMessage = ref('');


    const fileInput = ref<HTMLInputElement | null>(null);
    const selectedProfileImage = ref<File[]>([]);


    function triggerFileInput() {
    fileInput.value?.click();
    }

    function onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;

        const files = Array.from(target.files);
        selectedProfileImage.value = files;

        profilePictureUrl.value = URL.createObjectURL(files[0]);
    }




    onMounted(async () => {
        setUserValueFields();
    });



    async function setUserValueFields() {
        const userInfo = await getProfileInfo();
        console.log("userInfo:", userInfo);


        if (!userInfo) return;

        firstName.value = userInfo.firstname ?? '';
        lastName.value = userInfo.surname ?? '';
        email.value = userInfo.email ?? '';
        phonenumber.value = userInfo.phonenumber ?? '';
        profilePictureUrl.value = getImageUrl(userInfo.profilePicture);
        console.log(profilePictureUrl.value);
    }


    function handleEditProfile() {
        editToggle.value = !editToggle.value;
        console.log("Edit profile: ", editToggle.value);

        if (editToggle.value) {
            inputFirstName.value = firstName.value;
            inputLastName.value = lastName.value;
            inputEmail.value = email.value;
            inputPhonenumber.value = phonenumber.value;
        }
    }


    async function getProfileInfo() {
        try {
            const response = await fetchDataWithAuth("users/my_account");
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading profile: ", error);
        }
    }

    const canSaveChanges = computed(() => {
        return emailIsValid(inputEmail.value) && phonenumberIsValid(inputPhonenumber.value) && fullNameIsValud(inputFirstName.value, inputLastName.value);
    });

    function emailIsValid(email: string) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function phonenumberIsValid(phonenumber: string) {
        if (phonenumber.length === 8) return true;
        return false;
    }

    function fullNameIsValud(firstName: string, lastName: string) {
        if(firstName.length !== 0 && lastName.length !== 0) return true;
        return false;
    }

    async function onEdit() {
        try {
            let profileImagePath = null;

                if (selectedProfileImage.value.length > 0) {

                    const imageFormData = new FormData();

                    imageFormData.append("images", selectedProfileImage.value[0]);
                    imageFormData.append("email", email.value);

                    console.log("Sending form: ", imageFormData);

                    const response = await postImages("images/upload/profile/image", imageFormData);
                    if (response.status === 200) {
                        profileImagePath = response.data;
                        selectedProfileImage.value = [];
                    }
                };
            
            const payload = {
                firstname: inputFirstName.value,
                surname: inputLastName.value,
                email: inputEmail.value,
                phonenumber: inputPhonenumber.value,
                profile_picture: profileImagePath, 
            };

            const response = await putDataWithAuth("users/update", payload);

            if (response.status === 200) {
                console.log("Updated user successfully");
                await setUserValueFields();
                handleEditProfile();
            }

        } catch (error) {
            console.error("Error editing profile: ", error);
        }
    }


    function getImageUrl(imagePath: string) {
        if (!imagePath) return defaultProfileImage;

        const cleanPath = imagePath.replace(/^\/+/, '');
        return getUrlFromEndpoint(cleanPath);
    }


</script>