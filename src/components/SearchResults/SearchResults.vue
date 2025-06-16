<template>
  <div class="search-results">
    <h2 v-if="loading">Searching...</h2>
    <div v-else-if="results && results.length > 0">
      <h2>Search results:</h2>
      <div class="results">
        <ShowCard
          v-for="result in results"
          :key="result.show.id"
          :show="result.show"
          @click="onOpenDetails(result.show.id)"
        />
      </div>
    </div>
    <div v-else>
      <h2>No results found.</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TvShowSearchResult } from '@/types/tv-show';
import ShowCard from '@/components/ShowCard/ShowCard.vue';
import './SearchResults.scss';

defineProps<{
  results: TvShowSearchResult[] | null | undefined;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'open-details', id: number): void;
}>();

function onOpenDetails(id: number) {
  emit('open-details', id);
}
</script>
