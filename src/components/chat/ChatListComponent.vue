<template>
    <div class="chat-list" :class="{ 'take-whole-width': isMobile }">
        <div class="chat-list-header">
            <h2 class="chat-list-title">Your chats</h2>
        </div>
        <ChatListItem
          v-for="chat in chats"
          :key="chat.id"
          :user="chat"
          :lastMessage="chat.lastMessage"
          :timestamp="chat.timestamp"
          @click="onChatClick(chat.id)"
        />
        <h2 class="chat-list-title" v-if="chats.length === 0">You have no active chats</h2>
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

