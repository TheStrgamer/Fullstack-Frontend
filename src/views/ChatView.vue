<template>
  <Navbar />
  <div class="chat-page">
    <ChatListComponent v-if="renderChatList" :chats="chats" :isMobile="isMobile" @clicked="swapMessages" />
    <MessageListComponent v-if="renderMessages" :key="chatId" :messages="messages.messages" :name="messages.name" 
      :avatar="messages.picture" :chatId="chatId" :token="token" :isMobile="isMobile" @return="openChatList"   
      :amISeller="messages.amISeller" :listingName="messages.listingName"  @create-offer="handleCreateOffer" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import Navbar from '@/components/NavbarComponent.vue';
  import MessageListComponent from '@/components/chat/MessagesListComponent.vue';
  import ChatListComponent from '@/components/chat/ChatListComponent.vue';
  import { fetchActiveChats, fetchConversation, fetchOffers } from '@/services/chatService.ts';
  import { useRoute } from 'vue-router';
  import  router  from '@/router';

  interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
  }

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
  interface MessageList {
    id: number;
    name: string;
    amISeller: boolean;
    listingName: string;
    picture: string;
    messages: Message[];
  }
  const route = useRoute();
  let isOnMessageWindow = ref(false);

  let chatId = ref(0);
  let chats = ref<Chat[]>([]);
  const isMobile = ref(window.innerWidth <= 850);
  const token = sessionStorage.getItem('jwtToken') || '';

  async function updateChats() {
    try {
      const chatData = await fetchActiveChats();
      chats.value = chatData.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    } catch (error) {
      console.warn('Using mock data due to fetch error');
      console.error(error);
      chats.value = mockChats();
    }
  }

  function handleCreateOffer(payload: { chatId: number, listingId: number }) {
    router.push({ 
      name: 'addOffer', 
      params: { 
        id: payload.listingId, 
        chatId: payload.chatId 
      }
    });
  }

  onMounted(async () => {
    await updateChats();
    const initialChatId = route.params.chatId;
    if (initialChatId) {
      chatId.value = Number(initialChatId);
      isOnMessageWindow.value = true;
      messages.value = await getChatData(chatId.value);
    }
  });
  watch(
    () => route.params.chatId,
    async (newChatId) => {
      if (newChatId) {
        chatId.value = Number(newChatId);
        isOnMessageWindow.value = true;
        messages.value = await getChatData(chatId.value);
      } else {
        chatId.value = 0;
        isOnMessageWindow.value = false;
        messages.value = {
          amISeller: false,
          listingName: '',
          id: 0,
          name: 'Messages',
          picture: '',
          messages: []
        }
      }
    },
    { immediate: true }
  );


  const messages = ref<MessageList>({
    id: 0,
    amISeller: false,
    listingName: '',
    name: 'Messages',
    picture: '',
    messages: []
  });

  watch(chatId, async (newChatId) => {
    try {
      messages.value = await getChatData(newChatId);
    } catch (error) {
      console.warn('Using mock data due to fetch error');
      console.error(error);
    }
  });

  const renderChatList = computed(() => !isMobile.value || !isOnMessageWindow.value);
  const renderMessages = computed(() => !isMobile.value || isOnMessageWindow.value);

  function swapMessages(id: number) {
    chatId.value = id;
    isOnMessageWindow.value = true;
  }

  async function openChatList() {
    router.push({ name: 'chats' });
    chatId.value = 0;
    await updateChats();
    isOnMessageWindow.value = false;

  }

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 850;
  });

  function mockChats(): Chat[] {
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
    ];
  }

  async function getChatData(chatId: number): Promise<MessageList> {
    try {
      if (chatId === 0) {
        return {
          amISeller: false,
          listingName: '',
          id: 0,
          name: 'Meldinger',
          picture: '',
          messages: []
        };
      }
      const chatData = await fetchConversation(chatId);
      const offers = await fetchOffers(chatId);
      const mergedMessages = [
        ...chatData.messages.map(msg => ({
          ...msg,
          isOffer: false,
        })),
        ...offers.map(offer => ({
          ...offer,
          isOffer: true,
        }))
      ];
      mergedMessages.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
      });
      return {
          amISeller: chatData.amISeller,
          listingName: chatData.listingName,
          id: chatId,
          name: chatData.name,
          picture: chatData.picture,
          messages: mergedMessages
      };
    } catch (error) {
      console.warn('Using mock data due to fetch error');
      console.error(error);
      return mockMessages(chatId);
    }
  }

  function mockMessages(chatId: number): MessageList {
    return {
      listingName: 'Mock Listing',
      amISeller: false,
      id: chatId,
      name: 'Mock User',
      picture: '/images/default_user.png',
      messages: [
        { id: 1, message: 'Mock message', timestamp: '2023-10-01 12:00', sentByMe: false },
        { id: 2, message: 'Another mock message', timestamp: '2023-10-01 12:05', sentByMe: true }
      ]
    };
  }
</script>

<style>
    @import '@/assets/chat.css';
</style>
  