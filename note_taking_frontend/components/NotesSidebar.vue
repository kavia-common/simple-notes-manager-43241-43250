<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useNotesStore } from '../composables/useNotesStore';

const emit = defineEmits(['create-request', 'delete-request']);

const store = useNotesStore();
const listEl = ref<HTMLElement | null>(null);

function onCreate() {
  emit('create-request');
}

function onDelete(id: string) {
  emit('delete-request', id);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Delete' && store.selected.value) {
    e.preventDefault();
    emit('delete-request', store.selected.value.id);
  }
}

onMounted(() => {
  listEl.value?.addEventListener('keydown', onKeydown);
});
</script>

<template>
  <aside class="sidebar" aria-label="Notes sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <span class="dot" />
        Notes
      </div>
      <button class="btn btn-primary collapsible" @click="onCreate">New</button>
    </div>
    <div class="search-row">
      <input
        v-model="store.query"
        type="search"
        class="input"
        placeholder="Search notes..."
        aria-label="Search notes"
      />
      <button class="btn btn-primary" @click="onCreate" aria-label="Create a new note">
        + New
      </button>
    </div>
    <div class="notes-list" tabindex="0" ref="listEl" aria-label="Notes list">
      <div
        v-for="n in store.filtered"
        :key="n.id"
        class="note-item"
        :class="{ active: store.selectedId === n.id }"
        @click="store.select(n.id)"
        :aria-selected="store.selectedId === n.id"
      >
        <div class="note-title">{{ n.title || 'Untitled' }}</div>
        <div class="note-time">{{ store.prettyTime(n.updatedAt) }}</div>
        <div style="display:flex; gap:6px; margin-top:6px;">
          <button class="btn" @click.stop="store.select(n.id)">Open</button>
          <button class="btn btn-danger" @click.stop="onDelete(n.id)">Delete</button>
        </div>
      </div>
      <div v-if="!store.filtered.length" class="note-item" style="opacity:.7; cursor:default;">
        No notes found
      </div>
    </div>
  </aside>
</template>
