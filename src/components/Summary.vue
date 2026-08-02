<template>
  <!-- SUMMARY -->
  <div class="section summary">
    <div class="section-title-row"><div class="section-title">Professional Summary</div></div>
    <p contenteditable="true" :summary>{{ summary }}</p>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    summary: {
      type: String,
      required: true
    },
  });
</script>