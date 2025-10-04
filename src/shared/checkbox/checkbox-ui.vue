<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div>
    <input type="checkbox" />
    <label>{{ label }}</label>
  </div>
</template>

<style scoped></style>
