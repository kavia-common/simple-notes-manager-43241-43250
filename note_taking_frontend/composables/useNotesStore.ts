import { ref, computed, watch } from 'vue';
import { debounce, formatDateTime, uuid } from '../lib/utils';
import { createApiClient } from '../lib/apiClient';
import { storage } from '../lib/storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

type Backend = ReturnType<typeof createApiClient>;

const STORAGE_KEY = 'notes.v1';

// PUBLIC_INTERFACE
export function useNotesStore() {
  /** This composable exposes notes state and CRUD methods with debounced autosave. */

  const api: Backend = createApiClient();

  const notes = ref<Note[]>([]);
  const selectedId = ref<string | null>(null);
  const query = ref('');
  const isPreview = ref(true);
  const loading = ref(true);

  function loadFromLocal(): Note[] {
    return storage.get<Note[]>(STORAGE_KEY, []) || [];
  }

  async function syncFromBackend() {
    // For now, our api client falls back to localStorage;
    // keep function async and structured for easy backend switch.
    const data = await api.listNotes();
    notes.value = data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (!selectedId.value && notes.value.length) {
      selectedId.value = notes.value[0].id;
    }
  }

  function persist() {
    storage.set(STORAGE_KEY, notes.value);
  }

  const debouncedPersist = debounce(persist, 1000);

  function ensureSelectionAfterDelete(deletedId: string) {
    if (selectedId.value === deletedId) {
      const idx = notes.value.findIndex(n => n.id === deletedId);
      const next = notes.value[idx] || notes.value[idx - 1] || notes.value[0] || null;
      selectedId.value = next ? next.id : null;
    }
  }

  // Init load (deferred to client to avoid SSR localStorage access)
  async function init() {
    try {
      const local = loadFromLocal();
      if (local?.length) notes.value = local;
      await syncFromBackend();
    } finally {
      loading.value = false;
    }
  }
  if (typeof window !== 'undefined') {
    // run on next tick on client
    Promise.resolve().then(() => init());
  }

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return notes.value;
    return notes.value.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  });

  const selected = computed<Note | null>(() => notes.value.find(n => n.id === selectedId.value) || null);

  function select(id: string) {
    selectedId.value = id;
  }

  async function create() {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuid(),
      title: 'Untitled',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    notes.value = [newNote, ...notes.value];
    selectedId.value = newNote.id;
    persist();
    await api.createNote(newNote);
    return newNote;
  }

  async function update(patch: Partial<Note>) {
    const current = selected.value;
    if (!current) return;
    const updated: Note = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    notes.value = notes.value.map(n => (n.id === current.id ? updated : n));
    debouncedPersist();
    await api.updateNote(updated.id, updated);
  }

  async function remove(id: string) {
    const target = notes.value.find(n => n.id === id);
    if (!target) return;
    notes.value = notes.value.filter(n => n.id !== id);
    persist();
    ensureSelectionAfterDelete(id);
    await api.deleteNote(id);
  }

  function prettyTime(dateIso: string) {
    return formatDateTime(dateIso);
  }

  // Keyboard shortcuts
  function handleKeydown(e: KeyboardEvent) {
    const isMod = e.ctrlKey || e.metaKey;
    if (isMod && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      create();
    } else if (isMod && e.key.toLowerCase() === 's') {
      e.preventDefault();
      persist();
    } else if (e.key === 'Delete') {
      if (selected.value) {
        // allow UI to confirm; handler in sidebar will typically call remove
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
  }

  // Keep localStorage synced on each change (fallback if debounce misses)
  watch(
    () => notes.value,
    () => {
      // no-op; persist is managed by debouncedPersist/persist calls within methods
    },
    { deep: true }
  );

  return {
    notes,
    filtered,
    selected,
    selectedId,
    query,
    isPreview,
    loading,
    select,
    create,
    update,
    remove,
    persist,
    prettyTime,
  };
}
