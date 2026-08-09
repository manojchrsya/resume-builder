<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="app">
    <AppHeader></AppHeader>
    <div class="wrapper">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
