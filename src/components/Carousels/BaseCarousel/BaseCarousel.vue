<template>
  <div class="carousel-section">
    <h2 class="carousel-title">{{ title }}</h2>
    <div class="carousel-container">
      <button
        class="carousel-arrow left"
        @click="scrollPrev"
        :disabled="!canScrollPrev"
        aria-label="Scroll left"
      >
        &lt;
      </button>
      <div class="embla" ref="emblaRef">
        <div class="embla__container">
          <slot
            v-for="(item, i) in items"
            :item="item"
            :index="i"
            :onClick="() => emit('item-click', item, i)"
            :key="(item as any).id ?? i"
          ></slot>
        </div>
      </div>
      <button
        class="carousel-arrow right"
        @click="scrollNext"
        :disabled="!canScrollNext"
        aria-label="Scroll right"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue';
import { ref, watchEffect } from 'vue';
import './BaseCarousel.scss';

defineProps<{
  title: string;
  items: unknown[];
}>();

const emit = defineEmits<{
  (e: 'item-click', item: unknown, index: number): void;
}>();

const [emblaRef, emblaApi] = emblaCarouselVue({
  dragFree: true,
  align: 'start',
  duration: 20,
});

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

function updateScrollButtons() {
  canScrollPrev.value = emblaApi.value?.canScrollPrev() ?? false;
  canScrollNext.value = emblaApi.value?.canScrollNext() ?? false;
}

function scrollPrev() {
  emblaApi.value?.scrollPrev();
  updateScrollButtons();
}
function scrollNext() {
  emblaApi.value?.scrollNext();
  updateScrollButtons();
}

watchEffect(() => {
  if (emblaApi.value) {
    updateScrollButtons();
    emblaApi.value.on('select', updateScrollButtons);
    emblaApi.value.on('reInit', updateScrollButtons);
  }
});
</script>
