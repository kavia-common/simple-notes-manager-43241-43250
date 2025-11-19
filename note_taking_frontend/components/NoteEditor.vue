<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useNotesStore } from '../composables/useNotesStore';
import { renderMarkdown } from '../lib/utils';
import { useFeatureFlags } from '../composables/useFeatureFlags';

const store = useNotesStore();
const flags = useFeatureFlags();

const localTitle = ref('');
const localContent = ref('');
const titleEl = ref<HTMLInputElement | null>(null);

const selected = computed(() => store.selected.value);

watch(
  () => selected.value?.id,
  async () => {
    localTitle.value = selected.value?.title || '';
    localContent.value = selected.value?.content || '';
    await nextTick();
    if (titleEl.value) titleEl.value.focus();
  },
  { immediate: true }
);

async function onTitleInput() {
  await store.update({ title: localTitle.value });
}
async function onTitleBlur() {
  await store.update({ title: localTitle.value });
  store.persist();
}
async function onContentInput() {
  await store.update({ content: localContent.value });
}
async function onContentBlur() {
  await store.update({ content: localContent.value });
  store.persist();
}

function togglePreview() {
  store.isPreview.value = !store.isPreview.value;
}

onMounted(() => {
  // Focus title on create case is already handled by watch + nextTick focus
});
</script>

<template>
  <section class="main" aria-label="Editor">
    <div class="editor-toolbar">
      <div style="display:flex; align-items:center; gap:10px;">
        <input
          ref="titleEl"
          v-model="localTitle"
          class="title-input"
          placeholder="Title"
          aria-label="Note title"
          @input="onTitleInput"
          @blur="onTitleBlur"
        />
      </div>
      <div class="helper-row">
        <span><span class="kbd">Ctrl/Cmd+N</span> New</span>
        <span><span class="kbd">Ctrl/Cmd+S</span> Save</span>
        <button class="btn" v-if="flags.markdownPreview" @click="togglePreview">
          {{ store.isPreview ? 'Hide' : 'Show' }} Preview
        </button>
      </div>
    </div>

    <div class="editor-area" v-if="selected">
      <textarea
        v-model="localContent"
        class="textarea"
        aria-label="Note content"
        placeholder="Write your note in Markdown..."
        @input="onContentInput"
        @blur="onContentBlur"
      />
      <div v-if="flags.markdownPreview && store.isPreview" class="preview" v-html="renderMarkdown(localContent)"></div>
    </div>

    <div v-else style="padding:16px; color:#6b7280;">Select or create a note to start editing.</div>
  </section>
</template>
