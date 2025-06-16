<template>
  <form @submit.prevent="emitSearch" class="search-form">
    <label for="search-input" class="search-label"> Search TV shows </label>
    <div class="search-container">
      <div class="input-wrapper">
        <input
          id="search-input"
          v-model="query"
          type="text"
          placeholder="Breaking Bad"
          class="search-input"
          autocomplete="off"
        />
        <button
          v-if="query"
          type="button"
          class="clear-btn"
          aria-label="Clear search"
          @click="clearSearch"
        >
          &times;
        </button>
      </div>
      <button type="submit" class="search-btn">Search</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import './SearchInput.scss';

const emit = defineEmits<{
  (e: 'search', value: string): void;
}>();

const query = ref('');

function emitSearch() {
  emit('search', query.value);
}

function clearSearch() {
  query.value = '';
  emit('search', '');
}
</script>
