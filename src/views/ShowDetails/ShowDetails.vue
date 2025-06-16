<template>
  <div class="show-details">
    <BackToShowsLink />
    <div v-if="loading">Loading show details...</div>
    <div v-else-if="show">
      <h2 class="title">{{ show.name }}</h2>
      <div class="meta">
        <span v-if="show.genres?.length" class="genre">{{ show.genres.join(', ') }}</span>
        <span v-if="show.rating?.average" class="rating">★ {{ show.rating.average }}</span>
        <span v-if="show.premiered" class="runtime-range">
          Aired: {{ formatDate(show.premiered) }} –
          {{ show.ended ? formatDate(show.ended) : 'Present' }}
        </span>
      </div>
      <div class="content`">
        <img v-if="show.image?.original" :src="show.image.original" alt="" class="poster" />
        <div v-html="show.summary" class="summary"></div>
      </div>
      <EpisodeCarousel :episodes="show._embedded?.episodes" />
      <CastCarousel :cast="show._embedded?.cast" />
    </div>
    <div v-else-if="statusCode && statusCode === 404" class="not-found">
      <h2>Show not found</h2>
      <p>We couldn't find a show with that ID.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGetShowById } from '@/composables/useTvShowApi';
import EpisodeCarousel from '@/components/Carousels/EpisodeCarousel/EpisodeCarousel.vue';
import CastCarousel from '@/components/Carousels/CastCarousel/CastCarousel.vue';
import './ShowDetails.scss';
import { useApiErrorHandler } from '@/composables/useApiErrorHandler';
import BackToShowsLink from '@/components/BackToShowsLink/BackToShowsLink.vue';
const route = useRoute();

const showId = computed(() => Number(route.params.id));
const { data: show, loading, statusCode, execute } = useGetShowById(showId.value);

execute();

useApiErrorHandler(statusCode, {
  ignore: [404],
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nl-NL');
}
</script>
