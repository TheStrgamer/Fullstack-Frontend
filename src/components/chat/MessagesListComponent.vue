<template>
    <div class="messages-list">
        <h2 class="message-list-title">{{ name }}</h2>
        <div class="message-list-items">
          <ChatMessage
            v-for="message in messages"
            :key="message.id"
            :user="message"
            :message="message.message"
            :timestamp="message.timestamp"
          />
        </div>
        <div class="message-list-footer">
          <input type="text" placeholder="Type a message..." class="message-input" />
          <button class="send-button">Send</button>
        </div>
    </div>    
</template>
  
<script lang="ts">  
  import ChatMessage from '@/components/chat/Message.vue';
  interface Message {
    id: number;
    sentByMe: boolean;
    senderName: string;
    avatar: string;
    message: string;
    timestamp: string;
  }
  
  export default {
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
      }
    },
  }
</script>
  
<style scoped>
    @import '@/assets/chat.css';
    
</style>

