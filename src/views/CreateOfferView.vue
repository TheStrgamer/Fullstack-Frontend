<template>
  <NavbarComponent />  
  <div class="create-offer-view">
    <h1 class="offer-title">Gi bud</h1>


    <div v-if="title || imageUrl">
      <img :src="imageUrl" alt="Listing Image" class="offer-image" v-if="imageUrl" />
    </div>
    <h2 class="offer-subtitle">{{ title }}</h2>
    <p class="offer-id">Selges av : {{ sellerName }} for {{ originalPrice }}</p>


    <div class="price-input-container">
        <input
            id="price"
            v-model.number="price"
            type="number"
            class="price-input"
            placeholder="Skriv inn tilbudt pris"
            :min="0"
            @input="checkPositive"
        />
    </div>

    <button
      @click="submitOffer"
      class="offer-submit-button"
    >
    Send bud
    </button>
  </div>
</template>

<script setup lang="ts">
  import NavbarComponent from '@/components/NavbarComponent.vue'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getUrlFromEndpoint, fetchDataWithAuth } from '@/services/httpService'

  const route = useRoute()
  const listingId = route.params.id as string

  const title = ref('')
  const imageUrl = ref('')
  const price = ref<number | null>(null)
  const originalPrice = ref<number | null>(null)
  const sellerName = ref('')

  function checkPositive() {
    if (price.value && price.value < 0) {
        price.value = Math.abs(price.value);
    }
  }

  async function getData() {
        try {
            const response = await fetchDataWithAuth(`listings/mini/id/${listingId}`)
            console.log('Response:', response.data)

            return {
                title: response.data.title,
                imageUrl: getUrlFromEndpoint(response.data.imagePath.slice(1)),
                originalPrice: response.data.price,
                sellerName: response.data.creatorName
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            return { title: '', imageUrl: '' }
        }
    
  }

  onMounted(async () => {
    const data = await getData()
    title.value = data.title
    imageUrl.value = data.imageUrl
    originalPrice.value = data.originalPrice
    sellerName.value = data.sellerName
  })

  function submitOffer() {
    console.log('Offer submitted:', { listingId, price: price.value })
  }
</script>
<style scoped>
    @import url('../assets/offer.css');
</style>
  