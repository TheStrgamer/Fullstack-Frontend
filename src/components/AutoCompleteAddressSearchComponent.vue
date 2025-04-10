<template>
  <div class="autocomplete">
    <input
      class="autocomplete-input"
      type="text"
      :value="address"
      @input="handleInput($event)"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      placeholder="Search address..."
    />
    <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.properties?.osm_id"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        {{ suggestion.properties?.name }},
        {{ suggestion.properties?.city || suggestion.properties?.state || '' }},
        {{ suggestion.properties?.country || '' }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import axios from 'axios';

  const props = defineProps<{ address: string }>();
  const emit = defineEmits<{
    (event: 'update:address', address: string): void;
  }>();
  interface Suggestion {
    properties: {
    osm_id: string;
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

  const suggestions = ref<Suggestion[]>([]);
  const showSuggestions = ref(false);

  watch(() => props.address, async (newVal) => {
    if (newVal.length < 3) return;

    let query = newVal;
    let response;

    try {
      response = await sendApiRequest(query);
      const validResults = response.data.features.filter((f: any) => f.properties?.name);

      if (validResults.length === 0 && /\d/.test(query)) {
        console.log('No valid name in suggestions, retrying without house number');
        let newquery = query.replace(/\d+/g, '').trim();
        const fallbackResponse = await sendApiRequest(newquery);

          // This adds the removed numbers back to the name
        const patchedResults = fallbackResponse.data.features.map((feature: any) => {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              name: query,
            },
          };
        });
        suggestions.value = patchedResults.filter((f: Suggestion) => f.properties?.name);
      } else {
        suggestions.value = validResults.length > 0 ? validResults : response.data.features;
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  });

  async function sendApiRequest(query: string) {
    const norwayLat = 64.5731537;
    const norwayLon = 11.5280364;

    return await axios.get('https://photon.komoot.io/api/', {
      params: { q: query, lang: 'en', limit: 3, lat: norwayLat, lon: norwayLon },
    });
  }

  function handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      emit('update:address', inputElement.value);
    }
  }
  function selectSuggestion(suggestion: Suggestion) {
    const label =
      suggestion.properties?.name +
      ', ' +
      (suggestion.properties?.city || suggestion.properties?.state || '') +
      ', ' +
      suggestion.properties?.country;
    emit('update:address', label);
    showSuggestions.value = false;
  }

  function handleBlur() {
    setTimeout(() => {
      showSuggestions.value = false;
    }, 200);
  }
</script>

<style scoped>
  @import '../assets/base.css';

  .autocomplete {
    position: relative;
    width: 100%;
  }

  .autocomplete-input {
    color: var(--text);
  }

  .autocomplete-input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .suggestions-list {
    position: absolute;
    left: 10px;
    top: 65%;
    background: var(--white);
    border : 1px solid var(--primary);
    border-radius: 0 0 5px 5px;
    border-top: none;
    z-index: 10;
    list-style: none;
    padding: 0;
    margin: 0;
    min-width: 400px;
    max-width: 475px;
    max-height: 200px;
    overflow-y: auto;
  }

  .suggestions-list li {
    padding: 10px 12px;
    cursor: pointer;
    color: var(--text);
    background-color: var(--white);
  }

  .suggestions-list li:hover {
    background-color: var(--accent);
  }
</style>
