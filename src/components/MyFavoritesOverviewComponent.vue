<script setup lang="ts">
    import ItemCardMinimized from './ItemCardMinimized.vue';
    import FadeInComponent from './FadeInComponent.vue';


    import { ref, onMounted, onActivated } from 'vue';

    import { fetchDataWithAuth } from '@/services/httpService';


    interface ListingDTO {
        id: number,
        title: string,
        brief_description: string,
        price: number
    }

    const listings = ref<ListingDTO[]>([]);

    onMounted(getListings);
    onActivated(getListings);

    async function getListings() {
        try {
            const response = await fetchDataWithAuth("listings/favorites");
            listings.value = response.data;
            // console.log(response);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    }
</script>


<template>
    <div class="mu-listings-page">
        <div class="my-listsings-topbar">
            <h1>Mine favoritter</h1>
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
                ></ItemCardMinimized>   
            </FadeInComponent>
        </div>  
    </div>
    
</template>

<style>
    @import '../assets/profile.css'; 
</style>