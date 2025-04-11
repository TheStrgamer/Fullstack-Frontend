<script setup lang="ts">
import ProfileLinkCard from './ProfileLinkCard.vue';

</script>

<template>
    <div class="profile">
        <div>
            <h1>Your Profile</h1>
        </div>
        
        <div>
            <div class="profile_content_box">
                <ProfileLinkCard
                    to="/profile/my_account"
                    icon_path="/icons/settings.svg"
                    title="My Account"
                    description="View your account information"
                />

                <ProfileLinkCard 
                    to="/profile/my_listings" 
                    icon_path="/icons/listings.svg"
                    title="My Listings" 
                    description="View your active ads"
                />

                <ProfileLinkCard
                    to="/profile/my_favorites"
                    icon_path="/icons/ads.svg"
                    title="My Favorites"
                    description="View your favorited ads"
                />

                <ProfileLinkCard 
                    to="/" 
                    icon_path="/icons/ads.svg"
                    title="TEMP" 
                    description="View your favorited ads"
                />
            </div>
        </div>
    </div>

</template>

<style>@import '../assets/profile.css'; </style>