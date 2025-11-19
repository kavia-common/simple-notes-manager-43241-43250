---
theme: default
title: Notes Manager
info: |
  Slidev single-page notes manager. Shortcuts: Ctrl/Cmd+N new, Ctrl/Cmd+S save, Delete to remove.
class: text-left
mdc: true
transition: slide-left
fonts:
  sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial
  mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
---

<!-- Make local components available to slides -->
<script setup>
import AppWrapper from './components/AppWrapper.vue'
</script>

# Notes Manager
A minimal single-page notes app with Ocean Professional theme.

<AppWrapper />

---

# Shortcuts & Tips

- Create new note: Ctrl/Cmd+N
- Save: Ctrl/Cmd+S (also auto-saves on blur and every 1s while typing)
- Delete: Select in sidebar and press Delete
- Toggle Markdown preview: button in the editor toolbar (feature flag markdownPreview)

Feature Flags:
- Set VITE_FEATURE_FLAGS to a JSON object or a comma list.
- Example JSON: {"markdownPreview": true}
- Example list: markdownPreview
