<template>
  <div class="message-container" :class="{ 'sent-by-me': user.sentByMe }">
    <span class="timestamp">{{ timestamp }}</span>
    <div class="message">
        <div class="message-list-item-content">
            <img v-if="user.avatar!=''" :src="user.avatar" alt="User Avatar" class="avatar" />
            <img  v-else src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieyaZb-hSOtWnc6wha3QQlMLL8_cfvr2WIQ&s" alt="Default Avatar" class="avatar"/>
            <div class="message-list-item-text">
                <h3>{{ user.senderName }}</h3>
                <p>{{ message }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ChatMessage',
    props: {
      user: {
        type: Object,
        required: true,
      },
      message: {
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