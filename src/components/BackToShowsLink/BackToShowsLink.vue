<template>
  <router-link to="/" class="back-btn" aria-label="Go back to shows">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back to shows
  </router-link>
</template>

<script setup lang="ts">
import './BackToShowsLink.scss';
</script>
