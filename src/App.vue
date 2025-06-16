<template>
  <AppHeader class="app-header" />
  <main class="app-main">
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader/AppHeader.vue';
import './App.scss';
</script>
