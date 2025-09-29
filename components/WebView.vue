<template>
  <div class="web-root">
    <slot />
  </div>
</template>

<script setup lang="ts">
// no-op
</script>

<style scoped>
.web-root {
  width: 100vw;
  height: 100vh;
  background-image: url('/assets/bg-image-for-web.png');
  background-color: #0a0a0a;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>


