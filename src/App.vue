<template>
  <div
    class="app-shell"
    :class="{
      'app-shell--landing': route.name === 'landing',
      'app-shell--builder': route.name === 'builder',
    }"
  >
    <SiteHeader />
    <div v-if="route.name === 'editor'" class="toolbar">
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
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import SiteHeader from '@/components/SiteHeader.vue'
  import SiteFooter from '@/components/SiteFooter.vue'
  import { useEditorStore } from '@/stores/editor';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const editor = useEditorStore();
  const { isEditing } = storeToRefs(editor);
</script>
