<script setup lang="ts">
    import { useUserStore } from '@/stores/UserStore';
    import ItemCardMinimized from './ItemCardMinimized.vue';
    import FadeInComponent from './FadeInComponent.vue';


    import axios from 'axios';
    import { ref, onMounted, onActivated } from 'vue';


    interface ListingDTO {
        id: number,
        title: string,
        brief_description: string,
        price: number
    }

    const userstore = useUserStore();
    const token = userstore.jwtToken;
    const listings = ref<ListingDTO[]>([]);

    onMounted(getListings);
    onActivated(getListings);

    async function getListings() {
        try {
            const response = await axios.get('http://localhost:8080/api/listings/getMyListings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            listings.value = response.data;
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    }
</script>


<template>
    <div class="mu-listings-page">
        <div class="my-listsings-topbar">
            <h1>Mine produkter</h1>
           
            <router-link to="/createlisting">New</router-link>
        </div>


        <div class="my-listings-content">
            <div v-if="listings.length === 0">
                <p style="text-align: center;">Ingen annonser å vise for øyeblikket.</p>
            </div>
            <FadeInComponent
                v-for="(item, index) in listings"
                :key="item.id"
                :duration="index * 100 + 200"
                :direction="'bottom'">
                <ItemCardMinimized
                    :item="item"
                    :key="item.id"
                    route-path="item/update"
                ></ItemCardMinimized>   
            </FadeInComponent>
        </div>  
    </div>
    
</template>

<style>
    @import '../assets/profile.css'; 
</style>