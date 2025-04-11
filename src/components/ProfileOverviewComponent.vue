<script setup lang="ts">
import ProfileLinkCard from './ProfileLinkCard.vue';

</script>

<template>
    <div class="profile">
        <div>
            <h1>Din profil</h1>
        </div>
        
        <div>
            <div class="profile_content_box">
                <ProfileLinkCard
                    to="/profile/my_account"
                    icon_path="/icons/settings.svg"
                    title="Min Bruker"
                    description="Få en oversikt over bruker informasjonen din"
                />

                <ProfileLinkCard 
                    to="/profile/my_listings" 
                    icon_path="/icons/listings.svg"
                    title="Mine Annonser" 
                    description="Få en oversikt over dine annonser"
                />

                <ProfileLinkCard
                    to="/profile/my_favorites"
                    icon_path="/icons/ads.svg"
                    title="Mine Favoritter"
                    description="Få en oversikt over annonser som du har markert som en av dine favoritter"
                />

            </div>
        </div>
    </div>

</template>

<style>@import '../assets/profile.css'; </style>