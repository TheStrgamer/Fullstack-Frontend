<template>
    <div class="position-elements">
        <div class="position-element" v-if="fullAddress">
            <label>Adresse: </label>
            <span>{{ fullAddress }}</span>
        </div>
        <div class="position-element" v-if="city">
            <label>By: </label>
            <span>{{ city }}</span>
        </div>
        <div class="position-element" v-if="country">
            <label>Land: </label>
            <span>{{ country }}</span>
        </div>
        <div class="position-element" v-if="area">
            <label>Område: </label>
            <span>{{ area }}</span>
        </div>
        <div class="position-element" v-if="postnumber">
            <label>Postnummer: </label>
            <span>{{ postnumber }}</span>
        </div>
    </div>

</template>
<script lang="ts">
import { coordsToAddress } from '@/services/geoCodingService';

export default {
    name: 'PositionElementsComponent',
    props: {
        latitude: {
        type: Number,
        required: true,
        },
        longitude: {
        type: Number,
        required: true,
        },
    },
    data() {
        return {
        fullAddress: '',
        city: '',
        country: '',
        area: '',
        postnumber: '',
        };
    },
    methods: {
        async coordsToAddress() {
        try {
            const latitude = this.latitude.toString();
            const longitude = this.longitude.toString();
            const result = await coordsToAddress(latitude, longitude);
            if (!result) {
                alert('No results found');
            return;
            }
            this.fullAddress = result.fullAddress;
            this.city = result.city;
            this.country = result.country;
            this.area = result.area;
            this.postnumber = result.postnumber;
        } catch (err: any) {
            alert(err.message || 'Failed to fetch address');
            console.error(err);
        }
        },
    },
    mounted() {
        this.coordsToAddress();
    },
}
</script>