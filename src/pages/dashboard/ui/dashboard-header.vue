<script setup lang="ts">
import HandIcon from '@/assets/icons/hand-icon.vue'
import { Button } from '@/shared/ui/button'

interface Props {
  onCreateTodolist: () => void
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-2xl font-semibold tracking-tight sm:text-3xl">
        Welcome back, Sundar
      </span>
      <HandIcon />
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" @click="onCreateTodolist">New todolist</Button>
      <Button variant="outline">New task</Button>
    </div>
  </div>
</template>
