<template>
    <Navbar />
    <div class="chat-page">
      <ChatListComponent :chats="createMockData()" />
      <ChatComponent :messages="messages" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import Navbar from '@/components/NavbarComponent.vue';
  import ChatComponent from '@/components/chat/MessagesListComponent.vue';
  import ChatListComponent from '@/components/chat/ChatListComponent.vue';
    import { computed } from 'vue';
  
  let chatId = ref(1);

  const messages = computed(() => getChatData(chatId.value));

  
  function createMockData() {
    return [
      {
        id: 1,
        name: 'Urek Mazino',
        avatar: '',
        lastMessage: 'Hva skjer bruttern?',
        timestamp: '2023-10-01 12:00'
      },
      {
        id: 2,
        name: 'Lo Po Bia Traumeri',
        avatar: '',
        lastMessage: 'I want to buy your son?',
        timestamp: '2023-10-01 12:05'
      },
      {
        id: 3,
        name: 'Poe Bidau Gustang',
        avatar: '',
        lastMessage: 'Can you send me the report?',
        timestamp: '2023-10-01 12:10'
      }
    ]
  }
  function getChatData(chatId: number) {
    switch (chatId) {
      case 1:
        return [
        { id:1, senderName: 'Urek Mazino', message: 'Hva skjer bruttern?', timestamp: '2023-10-01 12:00', avatar: '', sentByMe: true },
        { id:2, senderName: 'Me', message: 'Ikke mye, bare slapper av.', timestamp: '2023-10-01 12:01', avatar: '', sentByMe: false }
      ];
      case 2:
        return [
        { id:3, senderName: 'Lo Po Bia Traumeri', message: 'I want to buy your son?', timestamp: '2023-10-01 12:05', avatar: '', sentByMe: false },
        { id:4, senderName: 'Me', message: 'What are you talking about?', timestamp: '2023-10-01 12:06', avatar: '', sentByMe: true }
      ];
      case 3:
        return [
        { id:5, senderName: 'Poe Bidau Gustang', message: 'Can you send me the report?', timestamp: '2023-10-01 12:10', avatar: '', sentByMe: false },
        { id:6, senderName: 'Me', message: 'Sure, I’ll send it over soon.', timestamp: '2023-10-01 12:11', avatar: '', sentByMe: true }
      ];
        default:
            return [];

    };
  
  }
  </script>
  
  <style>
    @import '@/assets/chat.css';
  </style>
  