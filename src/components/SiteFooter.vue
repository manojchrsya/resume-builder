<template>
  <footer class="site-footer">
    Made for your next move. © {{ year }} Resumify
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
