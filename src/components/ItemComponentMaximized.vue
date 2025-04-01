<template>
  <div class="item">
    <img id="image" src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQJqJlLjFmX9LQbwObLzhriH8LuZqKf7OUImrMQeLBtf_AEhMMZ_6kg3hXkyslLh2ry85IImd8AtOzpdQOB26klBWIwON_5It-WrAevHA4" />
    <h1 id="title">Samsung S23 Ultra 256 GB</h1>
    <p id="category">Telefon</p>
    <p id="price">5 199 kr</p>
    <p id="condition">good</p>
    <p id="description">Veldig pent brukt Samsung S23 Ultra 256 GB i fargen svart selges. Følger med deksel. Kan hentes på Sagene eller sendes dersom kjøper dekker frakt.</p>
    <p id="size">50cm * 20cm</p>
    <p id="location">10103r28, 23478930</p>
    <div>
      <p id="created">2021-10-10</p>
      <p id="updated">2021-10-12</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useItemStore } from '../stores/ItemStore.ts'

const route = useRoute()
const itemId = route.query.id as string
const itemStore = useItemStore()

onMounted(() => {
  itemStore.fetchItem(itemId);
})
</script>