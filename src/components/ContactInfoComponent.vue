<template>
  <div class="contact-info-component">
    <div class="profile-picture">
      <img v-if="isLoggedIn"
          class="profilePicture"
          :src="profilePictureUrl"
          alt="No image found"
          @error="profilePictureUrl = ''"
        />
    </div>
    <div class="information" v-if="isLoggedIn">
      <div class="information-display">
        <div class="label-field">
          <label for="firstnameField">Navn:</label>
          <p class="information-display-field" id="firstnameField">{{ firstName + " " + lastName }}</p>
        </div>

        <div class="label-field">
          <label for="emailField">Email:</label>
          <p class="information-display-field" id="emailField">{{ email }}</p>
        </div>

        <div class="label-field">
          <label for="phonenumberField">Mobilnummer:</label>
          <p class="information-display-field" id="phonenumberField">{{ phonenumber }}</p>
        </div>
      </div>
    </div>
    <div class="information" v-else>
      <p>Du må være innlogget for å se kontakt informasjon.</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { fetchDataWithAuth, getUrlFromEndpoint } from "@/services/httpService";
  import defaultProfileImage from "@/assets/universal/images/defaultImage.jpg";
  import { useUserStore } from "@/stores/UserStore.ts";

  export default {
    name: "ContactInfoComponent",
    props: {
      userId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const firstName = ref("");
      const lastName = ref("");
      const email = ref("");
      const phonenumber = ref("");
      const profilePictureUrl = ref(defaultProfileImage);
      const userStore = useUserStore();
      const isLoggedIn = computed(() => userStore.isAuthenticated());

      onMounted(async () => {
        await setUserValueFields();
      });

      async function setUserValueFields() {
        if (!isLoggedIn.value) return;
        const userInfo = await getProfileInfo();
        if (userInfo) {
            firstName.value = userInfo.firstname ?? "";
            lastName.value = userInfo.surname ?? "";
            email.value = userInfo.email ?? "";
            phonenumber.value = userInfo.phonenumber ?? "";
            profilePictureUrl.value = getImageUrl(userInfo.profilePicture);
        }
      }

      async function getProfileInfo() {
        try {
          const response = await fetchDataWithAuth("users/" + props.userId+ "/info");
          return response.data;
        } catch (error) {
          console.error("Error loading profile: ", error);
          return null;
        }
      }

      function getImageUrl(imagePath: string) {
      if (!imagePath) return defaultProfileImage;
        const cleanPath = imagePath.replace(/^\/+/, "");
        return getUrlFromEndpoint(cleanPath);
      }

      return {
        firstName,
        lastName,
        email,
        phonenumber,
        profilePictureUrl,
        isLoggedIn,
      };
    },
  };
</script>

<style scoped>
  @import url("../assets/contactInfo.css");
</style>
  