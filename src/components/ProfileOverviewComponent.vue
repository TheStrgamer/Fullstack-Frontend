<script setup lang="ts">
import ProfileLinkCard from './ProfileLinkCard.vue';

</script>

<template>
    <div class="profile">
        <div>
            <h1>Your Profile</h1>
        </div>
        
        <div>
            <!-- priofile linking buttons -->
            <div class="profile_content_box">
                <!-- My Account Button -->
                <ProfileLinkCard
                    to="/profile/my_account"
                    icon_path="/icons/settings.svg"
                    title="My Account"
                    description="View your account information"
                />

                <!-- My Listings Button -->
                <ProfileLinkCard 
                    to="/profile/my_listings" 
                    icon_path="/icons/listings.svg"
                    title="My Listings" 
                    description="View your active ads"
                />

                <!-- My Favorite Ads -->
                <ProfileLinkCard
                    to="/profile/my_favorites"
                    icon_path="/icons/ads.svg"
                    title="My Favorites"
                    description="View your favorited ads"
                />

                <!-- temp -->
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