<template>
    <div class="chat-list-item-content" @click="$emit('click')">
        <img :src="getUrlFromEndpoint(user.avatar.slice(1))" alt="User Avatar" class="avatar" v-if="user.avatar!=''" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieyaZb-hSOtWnc6wha3QQlMLL8_cfvr2WIQ&s" alt="Default Avatar" class="avatar" v-else />
        <div class="chat-list-item-text">
            <h3>{{ user.name }}
                <span class="timestamp">{{ timestamp }}</span>
            </h3>
            <p>{{ lastMessage }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { getUrlFromEndpoint } from '@/services/httpService';
  export default {
    name: 'ChatListItem',
    props: {
      user: {
        type: Object,
        required: true,
      },
      lastMessage: {
        type: String,
        default: '',
      },
      timestamp: {
        type: String,
        default: '',
      },
    },
    emits: ['click'],
    methods: {
      onClick() {
        this.$emit('click', this.user.id);
      },
    },
    setup() {
      return {
        getUrlFromEndpoint
      };
    },
  };

</script>