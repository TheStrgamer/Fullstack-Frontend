<template>
  <div class="messages-list">
    <div class="message-list-header">
      <button v-if="isMobile" class="back-button" @click="$emit('return')"> < </button>
      <h2 class="message-list-title">{{ name }}</h2>
    </div>
    <div class="message-list-items">
      <ChatMessage
        v-for="message in allmessages"
        :key="message.id"
        :user="message"
        :message="message.message"
        :timestamp="message.timestamp"
        :avatar="message.sentByMe ? myAvatar : avatar"
        :name="message.sentByMe ? 'You' : name"
      />
    </div>
    <div class="message-list-footer" v-if ="chatId !== 0">
      <input 
        type="text" 
        placeholder="Type a message..." 
        class="message-input" 
        v-model="messageInput"
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';
import ChatMessage from '@/components/chat/Message.vue';
import { WebSocketService } from '@/services/websocketService';

interface Message {
  id: number;
  sentByMe: boolean;
  message: string;
  timestamp: string;
}

interface SendMessage {
  message: string;
  conversationId: number;
  token: string;
}

export default defineComponent({
  name: 'ChatMessagesComponent',
  components: {
    ChatMessage
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
    myAvatar: {
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
    }
  },

  setup(props) {
    const allmessages = ref<Message[]>([]);
    watch(() => props.messages, (newMessages) => {
      allmessages.value = newMessages;
    }, { immediate: true });

    const messageInput = ref('');
    const wsService = new WebSocketService(`ws://localhost:8080/ws/chat/${props.chatId}?token=${props.token}`);
    onMounted(() => {
      if (props.chatId !== 0){
        wsService.connect();
        wsService.onMessage((newMessage: Message) => {
          allmessages.value.push(newMessage);
        });
      } else {
        console.warn('No chatId provided, WebSocket connection not established.');
      }
    });

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
      }
    }

    onUnmounted(() => {
      wsService.close();
    });

    return {
      messageInput,
      sendMessage,
      allmessages
    };
  }
});
</script>

<style scoped>
@import '@/assets/chat.css';
</style>
