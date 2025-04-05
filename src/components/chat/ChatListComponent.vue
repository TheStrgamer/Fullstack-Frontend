<template>
    <div class="chat-list">
        <h2 class="chat-list-title">Chat</h2>
        <div class="chat-list-items">
          <ChatListItem
            v-for="chat in chats"
            :key="chat.id"
            :user="chat"
            :lastMessage="chat.lastMessage"
            :timestamp="chat.timestamp"
          />
        </div>
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
      }
    }
  }
  </script>
  
<style scoped>
    @import '@/assets/chat.css';
</style>

