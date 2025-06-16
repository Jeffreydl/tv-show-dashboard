<template>
  <div
    class="show-card"
    @click="onClick"
    tabindex="0"
    role="button"
    :aria-label="`Open details for ${show.name}`"
  >
    <img
      v-if="show.image?.medium"
      :src="show.image.medium"
      alt=""
      class="show-image"
      draggable="false"
    />
    <img v-else src="@/assets/placeholder.svg" alt="" class="show-image" draggable="false" />
    <p class="show-title">{{ show.name }}</p>
  </div>
</template>

<script setup lang="ts">
import './ShowCard.scss';
import type { TvShow } from '@/types/tv-show';

const props = defineProps<{
  show: TvShow;
}>();

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

function onClick() {
  emit('click', props.show.id);
}
</script>
