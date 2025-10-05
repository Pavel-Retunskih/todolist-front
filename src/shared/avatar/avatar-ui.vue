<script setup lang="ts">
import { Avatar } from '@ark-ui/vue/avatar'
</script>

<template>
  <Avatar.Root>
    <Avatar.Fallback>PA</Avatar.Fallback>
    <Avatar.Image alt="avatar" />
  </Avatar.Root>
</template>
<style scoped>
[data-scope='avatar'][data-part='fallback'] {
  font-size: 32px;
  line-height: 32px;
  color: #ff6767;
  position: relative;
  top: 30%;
  left: 25%;
}
</style>
