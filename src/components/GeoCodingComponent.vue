<template>
  <div>
    <form @submit.prevent="addressToCoords" class="input-form-flex" style="height: 100px;">
      <AutoComplete v-model:address = "address" />
      <button type="submit">Submit</button>
    </form>

    <form @submit.prevent="coordsToAddress" class="input-form-flex" style="height: 100px;">
      <input v-model="latitude" type="text" placeholder="Latitude" />
      <input v-model="longitude" type="text" placeholder="Longitude" />
      <button type="submit">Submit</button>
    </form>

    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <p>Address: {{ fullAddress }}</p>
    <p>Area: {{ area }}</p>
    <p>Postnumber: {{ postnumber }}</p>
    <p>City: {{ city }}</p>
    <p>Country: {{ country }}</p>
  </div>
</template>

<script lang="ts">
  import AutoComplete from './AutoCompleteAddressSearchComponent.vue';
  import { addressToCoords, coordsToAddress } from '@/services/geoCodingService';

  export default {
    name: 'RegisterComponent',
    components: {
      AutoComplete,
    },
    data() {
      return {
        address: '',
        fullAddress: '',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
        area: '',
        postnumber: '',
      };
    },
    methods: {
      async addressToCoords() {
        try {
          const result = await addressToCoords(this.address);
          if (!result) {
            alert('No results found');
            return;
          }
          console.log(result);

          this.latitude = result.latitude;
          this.longitude = result.longitude;
          this.fullAddress = result.fullAddress;
          this.city = result.city;
          this.country = result.country;
          this.area = result.area;
          this.postnumber = result.postnumber;
        } catch (err: any) {
          alert(err.message || 'Failed to fetch coordinates');
          console.error(err);
        }
      },

      async coordsToAddress() {
        try {
          const result = await coordsToAddress(this.latitude, this.longitude);
            if (!result) {
                alert('No results found');
                return;
            }
          this.fullAddress = result.fullAddress;
          this.city = result.city;
          this.country = result.country;
          this.area = result.area;
          this.postnumber = result.postnumber;
          this.address = result.fullAddress;
        } catch (err: any) {
          alert(err.message || 'Failed to fetch address');
          console.error(err);
        }
      },
    },
  };
</script>
  