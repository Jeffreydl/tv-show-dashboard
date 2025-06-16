<template>
  <SearchInput @search="onSearch" />
  <SearchResults
    v-if="searchResults && searchQuery"
    :results="searchResults"
    :loading="searchLoading"
    @open-details="onOpenDetails"
  >
  </SearchResults>
  <ShowCarousel
    v-else
    :shows-by-genre="genreGroups"
    :loading="listLoading"
    @open-details="onOpenDetails"
  />
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import SearchResults from '@/components/SearchResults/SearchResults.vue';
import ShowCarousel from '@/components/Carousels/ShowCarousel/ShowCarousel.vue';
import { useGetList, useSearchShows } from '@/composables/useTvShowApi';
import { useGroupedSortedShows } from '@/composables/useGroupedSortedShows';
import { useApiErrorHandler } from '@/composables/useApiErrorHandler';

const {
  data: listData,
  loading: listLoading,
  statusCode: listStatus,
  execute: getList,
} = useGetList();

getList();
useApiErrorHandler(listStatus);
const { genreGroups } = useGroupedSortedShows(listData);

const searchQuery = ref('');
const {
  data: searchResults,
  loading: searchLoading,
  statusCode: searchStatus,
  execute: executeSearch,
} = useSearchShows(searchQuery);

useApiErrorHandler(searchStatus);

function onSearch(query: string) {
  searchQuery.value = query;
  if (searchQuery.value) {
    executeSearch();
  }
}

function onOpenDetails(id: number) {
  router.push({ name: 'ShowDetails', params: { id } });
}
</script>
