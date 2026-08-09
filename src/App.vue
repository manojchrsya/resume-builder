<template>
  <div class="toolbar">
    <div class="toolbar-hint">
      Click any text to edit it. Use the + buttons to add new entries. Changes save automatically.
    </div>
    <div class="toolbar-actions">
      <button class="btn secondary" @click="editor.resetEdit()" id="resetBtn">Reset Data</button>
      <!-- <button class="btn" id="downloadCsvBtn">Download as CSV</button> -->
      <button v-if="!isEditing"  @click="editor.enableEdit()" class="btn-edit btn secondary">✏️ Edit</button>
      <button v-else @click="editor.disableEdit()" class="btn-save btn">💾 Save</button>
    </div>
  </div>
  <RouterView />
</template>

<style scoped />
<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { useEditorStore } from '@/stores/editor';
  import { storeToRefs } from 'pinia';

  const editor = useEditorStore();
  const { isEditing } = storeToRefs(editor);
</script>
