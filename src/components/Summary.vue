<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- SUMMARY -->
  <div class="section summary">
    <div class="section-title-row"><div class="section-title">Professional Summary</div></div>
    <p :contenteditable="isEditing" data-field="summary" @blur="handleEditorInput">{{ summary }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const { isEditing } = storeToRefs(editor);

const emit = defineEmits(['update:summary']);

defineProps({
  summary: {
    type: String,
    required: true,
  },
});

function handleEditorInput(e: Event) {
  const target = e.target as HTMLElement;
  const field = target.dataset.field;
  if (!field) return true;
  emit('update:summary', target.innerText);
  return true;
}
</script>
