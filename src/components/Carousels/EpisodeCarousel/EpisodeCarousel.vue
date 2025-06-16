<template>
  <BaseCarousel v-if="episodes?.length" title="Episodes" :items="episodes" class="episode-carousel">
    <template #default="{ item: episode }">
      <div class="episode-slide">
        <img
          v-if="asEpisode(episode).image?.medium"
          :src="asEpisode(episode).image?.medium"
          alt=""
        />
        <img v-else src="@/assets/placeholder.svg" alt="" draggable="false" class="placeholder" />
        <div class="overlay">
          <div class="episode-title">{{ asEpisode(episode).name }}</div>
          <div class="episode-meta">
            <span>{{ formatEpisodeNumber(asEpisode(episode)) }}</span>
            <span v-if="asEpisode(episode).rating?.average" class="star">
              ★ {{ asEpisode(episode).rating.average }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </BaseCarousel>
</template>

<script setup lang="ts">
import './EpisodeCarousel.scss';
import BaseCarousel from '@/components/Carousels/BaseCarousel/BaseCarousel.vue';
import type { Episode } from '@/types/episode';

defineProps<{
  episodes?: Episode[];
}>();

function formatEpisodeNumber(episode: Episode): string {
  return `S${episode.season} E${episode.number}`;
}

function asEpisode(val: unknown): Episode {
  return val as Episode;
}
</script>
