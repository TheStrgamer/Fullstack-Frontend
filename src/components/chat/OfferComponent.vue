<template>
  <div class="offer-card">
    <p class="offer-info">Tilbudt av: {{ senderName }}</p>
    <p class="offer-info">For : {{ price }}kr </p>
    <p class="offer-info">Status: {{ offerStatus }}</p>
    <p class="offer-info">Sist oppdatert: {{ updatedAt }}</p>

    <button v-if="!offeredByMe && offerStatus === 0" @click="acceptOffer" class="accept-button">
      Accept Offer
    </button>
  </div>
</template>
  
<script lang="ts">
  
  export default {
    name: 'OfferComponent',
    props: {
        offerId: {
            type: Number,
        },
      senderName: {
        type: String,
      },
        price: {
            type: Number,
        },
        offerStatus: {
            type: Number,
        },
        updatedAt: {
            type: String,
        },
        offeredByMe: {
            type: Boolean,
        },

  },
  methods: {
    acceptOffer() {
        console.log('Offer accepted:', this.offerId);
    }
  },
}
</script>
  
<style scoped>
  .offer-card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-bottom: 1rem;
  }
  
  .offer-id {
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .offer-info {
    margin: 0.5rem 0;
    font-size: 1rem;
  }
  
  .accept-button {
    background-color: var(--primary);
    color: var(--white);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    border: none;
  }
  
  .accept-button:hover {
    background-color: var(--secondary);
  }
  </style>
  