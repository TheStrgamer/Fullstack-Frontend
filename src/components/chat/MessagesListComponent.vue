<template>
  <div class="messages-list">
    <div class="message-list-header">
      <button v-if="isMobile" class="back-button" @click="$emit('return')"> < </button>
      <h2 class="message-list-title">{{ name }}</h2>
    </div>
    <div class="message-list-items" ref="messageList">
      <FadeInComponent
        v-for="(message, index) in allmessages"
        :key="message.id"
        :duration="200 + index * 50"
        :direction="message.sentByMe ? 'right' : 'left'"
        >
        <ChatMessage
          :key="message.id"
          :user="message"
          :message="message.message"
          :timestamp="message.timestamp"
          :avatar="message.sentByMe ? myAvatar : getUrlFromEndpoint(avatar.slice(1))"
          :name="message.sentByMe ? 'You' : name"
        />
      </FadeInComponent>
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
import { defineComponent, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import ChatMessage from '@/components/chat/Message.vue';
import { WebSocketService } from '@/services/websocketService';
import { getUrlFromEndpoint } from '@/services/httpService';
import FadeInComponent from '@/components/FadeInComponent.vue';

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
    ChatMessage,
    FadeInComponent
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
    const messageList = ref<HTMLElement | null>(null);
    const allmessages = ref<Message[]>([]);
    watch(() => props.messages, (newMessages) => {
      allmessages.value = newMessages;
    }, { immediate: true });

    const messageInput = ref('');
    const wsService = new WebSocketService(`ws://localhost:8080/ws/chat/${props.chatId}?token=${props.token}`);
    onMounted(() => {
      setTimeout(() => scrollToBottom(), 100);
      if (props.chatId !== 0){
        wsService.connect();
        wsService.onMessage((newMessage: Message) => {
          allmessages.value.push(newMessage);
          scrollToBottom();
        });
      } else {
        console.warn('No chatId provided, WebSocket connection not established.');
      }
    });

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

    onUnmounted(() => {
      wsService.close();
    });

    return {
      messageInput,
      sendMessage,
      allmessages,
      messageList,
      getUrlFromEndpoint
    };
  }
});
</script>

<style scoped>
@import '@/assets/chat.css';
</style>
