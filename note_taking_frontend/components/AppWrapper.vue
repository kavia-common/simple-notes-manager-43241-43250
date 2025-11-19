<script setup lang="ts">
import NotesApp from './NotesApp.vue'
</script>

<template>
  <div class="app-wrapper">
    <NotesApp />
  </div>
</template>

<style scoped>
.app-wrapper {
  /* container to ensure predictable sizing in Slidev layout */
  display: block;
  width: 100%;
  min-height: 60vh;
}
</style>
