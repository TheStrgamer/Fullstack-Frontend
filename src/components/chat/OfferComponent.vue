<template>
  <div class="offer-card" :class="getStatusClass(offerStatus)">
    <div class="offer-header">
      <span class="offer-price">{{ price }} kr</span>
      <span class="offer-status" :class="getStatusClass(offerStatus, true)">{{ getStatusLabel(offerStatus) }}</span>
    </div>
    <div class="offer-details">
      <p><strong>Tilbudt av:</strong> {{ senderName }}</p>
      <p><strong>Sist oppdatert:</strong> {{ updatedAt }}</p>
    </div>
    <div class="offer-details">
      <p v-if="offerStatus === 2">Tilbudet er avslått.</p>
      <p v-else-if="offerStatus === 3">Tilbudet er slettet.</p>
    </div>

    <div class="offer-actions" v-if="offerStatus === 1 && !amISeller">
      <p>Tilbudet er akseptert.</p>
      <button @click="buyWithOffer" class="accept-button">
        Kjøp
      </button>
    </div>
    <div class="offer-actions" v-if="!offeredByMe && offerStatus === 0">
      <button @click="acceptOffer" class="accept-button">
        Godta tilbud
      </button>
      <button @click="rejectOffer" class="red-button">
        Avslå tilbud
      </button>
    </div>
    <div class="offer-actions" v-else-if="offeredByMe && offerStatus === 0">
      <p>Tilbudet er sendt, vent på svar.</p>

      <button @click="deleteOffer" class="red-button">
        Slett tilbud
      </button>   
    </div>
  </div>
</template>

<script lang="ts">
import { putDataWithAuth, deleteDataWithAuth } from '@/services/httpService';


  export default {
    name: 'OfferComponent',
    props: {
      AmIBuyer: {
        type: Boolean,
        default: false,
      },  
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
      amISeller: {
        type: Boolean,
      },
    },
    methods: {
      async buyWithOffer() {
        try {
            const response = await putDataWithAuth(`purchase/fromOffer/${this.offerId}`, {});
            console.log('Offer accepted:', response.data);
            this.$router.push({ name: 'home' });
        } catch (error) {
            console.error('Navigation error:', error);
        }
      },

      async acceptOffer() {
        console.log('Offer accepted:', this.offerId);
        try {
          const response = await putDataWithAuth(`negotiation/offer/accept/${this.offerId}`, {});
          console.log('Offer accepted:', response.data);
        } catch (error) {
          console.error('Error accepting offer:', error);
        }
      },
      async rejectOffer() {
            console.log('Offer rejected:', this.offerId);
            try {
                const response = await putDataWithAuth(`negotiation/offer/reject/${this.offerId}`, {});
                console.log('Offer rejected:', response.data);
            } catch (error) {
                console.error('Error rejecting offer:', error);
            }
        },
      async deleteOffer() {
            console.log('Offer deleted:', this.offerId);
            try {
                const response = await deleteDataWithAuth(`negotiation/offer/remove/${this.offerId}`);
                console.log('Offer deleted:', response.data);
            } catch (error) {
                console.error('Error deleting offer:', error);
            }
        },
      getStatusLabel(status?: number): string {
        switch (status) {
          case 0:
            return 'Aktiv';
          case 1:
            return 'Akseptert';
          case 2:
            return 'Avslått';
          case 3:
            return 'Slettet';
          default:
            return 'Ukjent';
        }
      },
      getStatusClass(status?: number, isStatusIcon?: boolean): string {
        switch (status) {
          case 0:
            if (isStatusIcon) {
              return 'active';
            }
            return 'status-active';
          case 1:
            if (isStatusIcon) {
              return 'active';
            }
            return 'status-accepted';
          case 2:
            return 'status-rejected';
          case 3:
            return 'status-deleted';
          default:
            return 'status-unknown';
        }
      }
    },
  }
</script>
  
<style scoped>
.offer-card {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.offer-price {
  color: var(--primary);
  font-size: 1.25rem;
}

.offer-status {
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 1.3rem;
  text-align: center;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.05);
  width: 90px;
  height: 35px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

}

.offer-details p {
  margin: 0.2rem 0;
  font-size: 0.95rem;
  color: #333;
}

.accept-button {
  background-color: var(--primary);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.red-button {
  background-color: var(--invalid);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.accept-button:hover {
  background-color: var(--secondary);
}
.red-button:hover {
  background-color: var(--secondary);
}

.active {
    background-color: var(--primary);
    color: white;
}

.status-active {
  background-color: var(--white);
}

.status-accepted {
    background-color: var(--accent)
}

.status-rejected {
  background-color: var(--invalid)
}

.status-deleted {
  background-color: var(--invalid);
}

.status-unknown {
  background-color: var(--white);
}

</style>
  