<script setup lang="ts">
import './global.css'
</script>

<template>
  <main class="main-container">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<style scoped></style>
