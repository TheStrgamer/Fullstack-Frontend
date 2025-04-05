<template>
  <Navbar />
  <div class="chat-page">
    <ChatListComponent v-if="renderChatList" :chats="createMockData()" :isMobile="isMobile" @clicked="swapMessages" />
    <MessageListComponent v-if="renderMessages" :messages="messages" :name="name" :avatar="avatar" :myAvatar="''" :isMobile="isMobile" @return="openChatList" />
  </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import Navbar from '@/components/NavbarComponent.vue';
  import MessageListComponent from '@/components/chat/MessagesListComponent.vue';
  import ChatListComponent from '@/components/chat/ChatListComponent.vue';
  import { computed } from 'vue';
  
  let chatId = ref(1);

  const messages = computed(() => getChatData(chatId.value));
  const name = computed(() => {
    const chat = createMockData().find(chat => chat.id === chatId.value);
    return chat ? chat.name : 'Chat';
  });
    const avatar = computed(() => {
        const chat = createMockData().find(chat => chat.id === chatId.value);
        return chat ? chat.avatar : '';
    });
  
  let renderChatList = computed(() => {
    return !isMobile.value || !isOnMessageWindow.value;
  });
  let renderMessages = computed(() => {
    return !isMobile.value || isOnMessageWindow.value;
  });

  function swapMessages(id: number) {
    chatId.value = id;
    isOnMessageWindow.value = true;
  }
    function openChatList() {
        isOnMessageWindow.value = false;
    }
  const isMobile = ref(window.innerWidth <= 850);
  let isOnMessageWindow = ref(false);
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 850;
  });

  
  function createMockData() {
    return [
      {
        id: 1,
        name: 'Urek Mazino',
        avatar: 'https://staticg.sportskeeda.com/editor/2024/08/1144e-17236662629150-1920.jpg',
        lastMessage: 'Hva skjer bruttern?',
        timestamp: '2023-10-01 12:00'
      },
      {
        id: 2,
        name: 'Lo Po Bia Traumeri',
        avatar: 'https://s3.amazonaws.com/comicgeeks/characters/avatars/85996.jpg?t=1713813611',
        lastMessage: 'Give him to me, and I will make use of him in my army',
        timestamp: '2023-10-01 12:09'
      },
      {
        id: 3,
        name: 'Poe Bidau Gustang',
        avatar: '',
        lastMessage: 'Can you send me the report?',
        timestamp: '2023-10-01 12:10'
      },
        {
            id: 4,
            name: 'Walter White',
            avatar: 'https://media.posterlounge.com/img/products/740000/735290/735290_poster.jpg',
            lastMessage: 'Say my name.',
            timestamp: '2023-10-01 08:10'
        }
    ]
  }
  function getChatData(chatId: number) {
    switch (chatId) {
      case 1:
        return [
        { id:1, message: 'Hva skjer bruttern?', timestamp: '2023-10-01 12:00', sentByMe: false },
        { id:2, message: 'Ikke mye, bare slapper av.', timestamp: '2023-10-01 12:01', sentByMe: true }
      ];
      case 2:
        return [
        { id:3, message: 'I want to buy your son?', timestamp: '2023-10-01 12:05', sentByMe: false },
        { id:4, message: 'What are you talking about?', timestamp: '2023-10-01 12:06', sentByMe: true },
        { id:7, message: 'Give him to me, and i will make use of him in my army', timestamp: '2023-10-01 12:09', sentByMe: false },
        { id:8, message: 'I will think about it.', timestamp: '2023-10-01 12:10', sentByMe: true }

      ];
      case 3:
        return [
        { id:5, message: 'Can you send me the report?', timestamp: '2023-10-01 12:10', sentByMe: false },
        { id:6, message: 'Sure, I’ll send it over soon.', timestamp: '2023-10-01 12:11', sentByMe: true }
      ];
      case 4:
        return [
            { id: 7, message: 'We need to talk.', timestamp: '2023-10-01 08:00', sentByMe: false },
            { id: 8, message: 'About what?', timestamp: '2023-10-01 08:01', sentByMe: true },
            { id: 9, message: 'The product. The quality has to remain consistent.', timestamp: '2023-10-01 08:02', sentByMe: false },
            { id: 10, message: 'I haven’t changed anything. It’s the same formula.', timestamp: '2023-10-01 08:03', sentByMe: true },
            { id: 11, message: 'I am the one who knocks. I don’t accept excuses.', timestamp: '2023-10-01 08:04', sentByMe: false },
            { id: 12, message: 'Whoa, calm down. No one’s challenging you.', timestamp: '2023-10-01 08:05', sentByMe: true },
            { id: 13, message: 'Calm is not a luxury I can afford.', timestamp: '2023-10-01 08:06', sentByMe: false },
            { id: 14, message: 'This is not just business. This is legacy.', timestamp: '2023-10-01 08:07', sentByMe: false },
            { id: 15, message: 'You sound like you’re in too deep, man.', timestamp: '2023-10-01 08:08', sentByMe: true },
            { id: 16, message: 'I didn’t come this far to only come this far.', timestamp: '2023-10-01 08:09', sentByMe: false },
            { id: 17, message: 'Say my name.', timestamp: '2023-10-01 08:10', sentByMe: false },
            { id: 18, message: '...Waltah.', timestamp: '2023-10-01 08:11', sentByMe: true }
        ];

        default:
            return [];

    };
  
  }
</script>
  
<style>
  @import '@/assets/chat.css';
</style>
  