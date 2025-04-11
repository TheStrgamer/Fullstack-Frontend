<template>
  <NavbarComponent />  
  <div class="create-offer-view">
    <h1 class="offer-title">Gi bud</h1>

    <div v-if="title || imageUrl">
      <img :src="imageUrl" alt="Listing Image" class="offer-image" v-if="imageUrl" />
    </div>
    <h2 class="offer-subtitle">{{ title }}</h2>
    <p class="offer-id">Selges av : {{ sellerName }} for {{ originalPrice }}</p>

    <form @submit.prevent="submitOffer" class="price-input-container">
      <input
          id="price"
          v-model.number="price"
          type="number"
          class="price-input"
          placeholder="Skriv inn tilbudt pris"
          :min="0"
          @input="checkPositive"
      />
      <button type="submit" class="offer-submit-button"> Send bud </button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import NavbarComponent from '@/components/NavbarComponent.vue'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import router from '@/router';
  import { getUrlFromEndpoint, fetchDataWithAuth, postDataWithAuth } from '@/services/httpService'

  const route = useRoute()
  const listingId = route.params.id as string
  const negotiationId = route.params.chatId as string

  const title = ref('')
  const imageUrl = ref('')
  const price = ref<number | null>(null)
  const originalPrice = ref<number | null>(null)
  const sellerName = ref('')

  interface offerSend {
    negotiationId: string
    listingId: string
    currentOffer: number
  }

  function checkPositive() {
    if (price.value && price.value < 0) {
        price.value = Math.abs(price.value);
    }
  }

  async function getData() {
        try {
            const response = await fetchDataWithAuth(`listings/mini/id/${listingId}`)
            console.log('Response:', response.data)
            if (response.data.imagePath === null) {
                return { 
                    title: response.data.title,
                    imageUrl: '',
                    originalPrice: response.data.price,
                    sellerName: response.data.creatorName
                }
            }
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

  async function submitOffer() {
    if (price.value) {
        try {
            if (!price.value || price.value <= 0) {
                console.error('Invalid price value')
                return
            }
            const response = await postDataWithAuth('negotiation/offer/create', {
                negotiationId: negotiationId,
                listingId: listingId,
                currentOffer: price.value
            } as offerSend)
            console.log('Offer submitted:', response.data)
            router.push({ name: 'chat', params: { id: negotiationId } })

        } catch (error) {
            console.error('Error submitting offer:', error)
        }
    } else {
        console.error('Price is required to submit an offer')
    }
  }

  onMounted(async () => {
    const data = await getData()
    title.value = data.title
    imageUrl.value = data.imageUrl
    originalPrice.value = data.originalPrice
    sellerName.value = data.sellerName
  })
  
</script>
<style scoped>
    @import url('../assets/offer.css');
</style>
  