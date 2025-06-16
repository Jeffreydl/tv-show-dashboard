<template>
  <div class="error-view">
    <div class="error-code">{{ code }}</div>
    <div class="error-message">{{ message }}</div>
    <BackToShowsLink />
  </div>
</template>

<script setup lang="ts">
import BackToShowsLink from '@/components/BackToShowsLink/BackToShowsLink.vue';
import './ErrorPage.scss';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const code = computed(() => route.params.code || 'Unknown');

const message = computed(() => {
  switch (code.value) {
    case '400':
      return 'Bad Request – something went wrong with your request.';
    case '401':
      return 'Unauthorized – please log in to continue.';
    case '403':
      return 'Forbidden – you do not have permission to access this page.';
    case '404':
      return 'Page not found – the page you’re looking for doesn’t exist.';
    case '500':
      return 'Internal Server Error – something went wrong on our side.';
    case '502':
      return 'Bad Gateway – received an invalid response from the upstream server.';
    case '503':
      return 'Service Unavailable – the server is currently overloaded or under maintenance.';
    case '504':
      return 'Gateway Timeout – the server took too long to respond.';
    default:
      return 'An unexpected error occurred.';
  }
});
</script>
