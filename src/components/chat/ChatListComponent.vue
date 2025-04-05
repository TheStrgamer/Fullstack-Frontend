<template>
    <div class="chat-list" :class="{ 'take-whole-width': isMobile }">
        <h2 class="chat-list-title">Chat</h2>
          <ChatListItem
            v-for="chat in chats"
            :key="chat.id"
            :user="chat"
            :lastMessage="chat.lastMessage"
            :timestamp="chat.timestamp"
            @click="onChatClick(chat.id)"
          />
    </div>
</template>
  
<script lang="ts">
  import ChatListItem from '@/components/chat/ChatListItem.vue';
  
  interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
  }
  
  export default {
    name: 'ChatListComponent',
    components: {
      ChatListItem
    },
    props: {
      chats: {
        type: Array as () => Chat[],
        required: true
      },
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    emits: ['clicked'],
    methods: {
      onChatClick(id: number) {
        this.$emit('clicked', id);
      }
    }
  }
</script>
  
<style scoped>
    @import '@/assets/chat.css';
</style>

