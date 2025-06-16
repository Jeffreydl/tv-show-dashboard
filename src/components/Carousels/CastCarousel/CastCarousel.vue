<template>
  <BaseCarousel v-if="cast?.length" title="Cast" :items="cast" class="cast-carousel">
    <template #default="{ item: castMember }">
      <div class="cast-slide">
        <div class="cast-thumb-wrapper">
          <img
            v-if="asCastMember(castMember).person?.image?.medium"
            :src="asCastMember(castMember).person?.image?.medium"
            alt=""
            class="cast-thumbnail"
          />
          <img v-else src="@/assets/placeholder.svg" alt="" draggable="false" class="placeholder" />
        </div>
        <div class="cast-info">
          <strong class="cast-person">{{ asCastMember(castMember).person.name }}</strong>
          <span class="cast-character">{{ asCastMember(castMember).character.name }}</span>
        </div>
      </div>
    </template>
  </BaseCarousel>
</template>

<script setup lang="ts">
import './CastCarousel.scss';
import BaseCarousel from '@/components/Carousels/BaseCarousel/BaseCarousel.vue';
import type { CastMember } from '@/types/cast-member';

defineProps<{
  cast?: CastMember[];
}>();

function asCastMember(val: unknown): CastMember {
  return val as CastMember;
}
</script>
