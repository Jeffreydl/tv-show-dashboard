<template>
  <h2 v-if="loading">Loading...</h2>
  <BaseCarousel
    v-else
    v-for="group in showsByGenre"
    :key="group.genre"
    :title="group.genre"
    :items="group.shows"
    @item-click="(show) => openDetails((show as TvShow).id)"
  >
    <template #default="{ item: show, onClick }">
      <ShowCard :show="asTvShow(show)" @click="onClick" />
    </template>
  </BaseCarousel>
</template>

<script setup lang="ts">
import BaseCarousel from '@/components/Carousels/BaseCarousel/BaseCarousel.vue';
import ShowCard from '@/components/ShowCard/ShowCard.vue';
import type { TvShow } from '@/types/tv-show';

defineProps<{
  showsByGenre: { genre: string; shows: TvShow[] }[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (event: 'open-details', id: number): void;
}>();

function openDetails(id: number) {
  emit('open-details', id);
}

function asTvShow(val: unknown): TvShow {
  return val as TvShow;
}
</script>
