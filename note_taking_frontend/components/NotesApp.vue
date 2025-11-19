<script setup lang="ts">
import NotesSidebar from './NotesSidebar.vue';
import NoteEditor from './NoteEditor.vue';
import { useNotesStore } from '../composables/useNotesStore';

const store = useNotesStore();

async function handleCreate() {
  await store.create();
}

async function handleDelete(id: string) {
  const ok = confirm('Delete this note? This cannot be undone.');
  if (!ok) return;
  await store.remove(id);
}
</script>

<template>
  <div class="notes-app-shell">
    <NotesSidebar @create-request="handleCreate" @delete-request="handleDelete" />
    <NoteEditor />
  </div>
</template>
