<template>
  <header class="header">
    <h1 @click="goHome">TV Show Dashboard</h1>
  </header>
</template>

<script setup lang="ts">
import './AppHeader.scss';
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push({ name: 'ShowDashboard' });
}
</script>
