<template>
  <div class="messages-list">
    <div class="message-list-header">
      <button v-if="isMobile" class="back-button" @click="$emit('return')"> < </button>
      <h2 class="message-list-title">{{ name }}:
        <span class="message-list-title" v-if="amISeller">For {{ listingName }}</span>
        <span class="message-list-title" v-else>Selger {{ listingName }}</span>
      </h2>
    </div>
    <div class="message-list-items" ref="messageList">
      <FadeInComponent
        v-for="(message, index) in allmessages"
        :key="message.id"
        :duration="200 + index * 50"
        :direction="message.sentByMe ? 'right' : 'left'"
        >
        <ChatMessage v-if="!message.isOffer"
          :user="message"
          :message="message.message"
          :timestamp="message.timestamp"
          :avatar="message.sentByMe ? myAvatar : (avatar.slice(1) === '' ? '' : getUrlFromEndpoint(avatar.slice(1)))"
          :name="message.sentByMe ? 'Deg' : name"
        /> 
        <OfferComponent v-else
          :senderName="message.senderName"
          :price="message.price"
          :offerStatus="message.status"
          :updatedAt="message.timestamp"
          :offeredByMe="message.sentByMe"
          :status="message.status"
          :offerId="message.offerId"
          :amISeller="amISeller"
          :chatClosed="isClosed"
        />
      </FadeInComponent>
    </div>
    <div class="message-list-footer" v-if ="chatId !== 0 && !isClosed">
      <button class="offer-button" @click="goToCreateOffer">Gi bud</button>
      <input
        type="text"
        placeholder="Type a message..."
        class="message-input"
        v-model="messageInput"
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage">Send</button>
    </div>
    <div v-else-if="isClosed" class="offer-button">
      <p>Chatten er stengt.</p>
      <p>Ingen nye meldinger kan sendes.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import ChatMessage from '@/components/chat/Message.vue';
import OfferComponent from './OfferComponent.vue';
import { WebSocketService } from '@/services/websocketService';
import { fetchDataWithAuth, getUrlFromEndpoint } from '@/services/httpService';
import FadeInComponent from '@/components/FadeInComponent.vue';

interface Message {
  id: number;
  sentByMe: boolean;
  message?: string;
  timestamp: string;

  isOffer?: boolean;
  offerId?: number;
  price?: number;
  status?: number;
  senderName?: string;

}

interface SendMessage {
  message: string;
  conversationId: number;
  token: string;
}

export default defineComponent({
  name: 'ChatMessagesComponent',
  components: {
    ChatMessage,
    FadeInComponent,
    OfferComponent,
  },
  props: {
    messages: {
      type: Array as () => Message[],
      required: true
    },
    name: {
      type: String,
      default: 'Chat'
    },
    avatar: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    chatId: {
      type: Number,
      required: true
    },
    token: {
      type: String,
      default: ''
    },
    amISeller: {
      type: Boolean,
      default: false
    },
    listingName: {
      type: String,
      default: ''
    },
  },

  emits: ['return', 'create-offer'],

  setup(props, { emit }) {
    const myAvatar = ref('');
    const messageList = ref<HTMLElement | null>(null);
    const allmessages = ref<Message[]>([]);
    const isClosed = ref(false);
    
    watch(() => props.messages, (newMessages) => {
      allmessages.value = newMessages;
    }, { immediate: true });

    const messageInput = ref('');
    const wsService = new WebSocketService(`ws://localhost:8080/ws/chat/${props.chatId}?token=${props.token}`);
    onMounted( async() => {
      setTimeout(() => scrollToBottom(), 100);
      await getMyAvatar();

      const response = await fetchDataWithAuth('negotiation/chat/isClosed/' + props.chatId);
      if (response.data) {
        isClosed.value = response.data;
        if (isClosed) {
          console.warn('Chat is closed, no WebSocket connection will be established.');
          return;
        }
      }

      if (props.chatId !== 0){
        wsService.connect();
        wsService.onMessage((updatedOffer: Message) => {
          const index = allmessages.value.findIndex(
            (message) => message.isOffer && message.offerId === updatedOffer.offerId
          );
          if (index !== -1) {
            allmessages.value[index] = {
              ...allmessages.value[index], 
              status: updatedOffer.status,
              timestamp: updatedOffer.timestamp || allmessages.value[index].timestamp,
            };
            allmessages.value = [...allmessages.value];
          } else {
            allmessages.value.push(updatedOffer);
          }
          scrollToBottom();
        });

      } else {
        console.warn('No chatId provided, WebSocket connection not established.');
      }
    });
    async function goToCreateOffer() {
      try {
        await fetchDataWithAuth(`negotiation/chat/getListingId/${props.chatId}`).then(response => {
        const listingId = response.data;
        emit('create-offer', { chatId: props.chatId, listingId });
      })
      } catch (error) {
        console.error('Error fetching listing ID:', error);
      }
    }

    function scrollToBottom() {
      nextTick(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight;
        }
      });
    }

    function sendMessage() {
      if (messageInput.value.trim() !== '') {
        const newMessage: SendMessage = {
          message: messageInput.value.trim(),
          conversationId: props.chatId,
          token: props.token
        };

        wsService.sendMessage(newMessage);

        const newMessageParsed = {
          id: allmessages.value.length + 1,
          sentByMe: true,
          message: newMessage.message,
          timestamp: new Date().toLocaleTimeString()
        };

        allmessages.value.push(newMessageParsed);
        messageInput.value = '';
        scrollToBottom();
      }
    }

    async function getMyAvatar() {
      try {
        const response = await fetchDataWithAuth('users/pfp');
        if (response.data && response.data) {
          myAvatar.value = getUrlFromEndpoint(response.data.slice(1));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        return '';
      }
    }

    onUnmounted(() => {
      wsService.close();
    });

    return {
      messageInput,
      sendMessage,
      allmessages,
      messageList,
      getUrlFromEndpoint,
      goToCreateOffer,
      myAvatar,
      isClosed,
    };
  }
});
</script>

<style scoped>
@import '@/assets/chat.css';
</style>
