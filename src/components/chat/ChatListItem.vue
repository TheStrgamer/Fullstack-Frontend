<template>
    <div class="chat-list-item">
        <div class="chat-list-item-content">
            <img :src="user.avatar" alt="User Avatar" class="avatar" v-if="user.avatar!=''" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieyaZb-hSOtWnc6wha3QQlMLL8_cfvr2WIQ&s" alt="Default Avatar" class="avatar" v-else />
            <div class="chat-list-item-text">
                <h3>{{ user.name }}</h3>
                <p>{{ lastMessage }}</p>
            </div>
        </div>
        <span class="timestamp">{{ timestamp }}</span>
    </div>
</template>

<script lang="ts">
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
  };

</script>