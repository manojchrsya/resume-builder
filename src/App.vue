<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-hint">
      Click any text to edit it. Use the + buttons to add new entries. Changes save automatically.
    </div>
    <div class="toolbar-actions">
      <button class="btn secondary" id="resetBtn">Reset Data</button>
      <button class="btn" id="downloadCsvBtn">Download as CSV</button>
    </div>
  </div>

  <RouterView />
</template>

<style scoped />
