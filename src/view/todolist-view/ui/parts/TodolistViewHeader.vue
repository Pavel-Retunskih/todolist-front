<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import { Badge, type BadgeVariants } from '@/shared/ui/badge'
import { Skeleton } from '@/shared/ui/skeleton'

const props = defineProps<{
  isTodolistLoading: boolean
  title?: string
  description?: string | null
  completionRate: number
  activeTasks: number
  completedTasks: number
  onBack: () => void
  onNewTask: () => void
  statusVariant: (completed: boolean) => BadgeVariants['variant']
}>()
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
    <div class="space-y-1">
      <Button variant="outline" class="w-fit" @click="props.onBack">Back</Button>

      <template v-if="props.isTodolistLoading">
        <Skeleton class="h-8 w-72" />
        <Skeleton class="h-4 w-96" />
      </template>

      <template v-else>
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          {{ props.title ?? 'Todolist' }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ props.description || 'No description yet' }}
        </p>
      </template>
    </div>

    <div class="flex items-center gap-2">
      <Button variant="outline" @click="props.onNewTask">New task</Button>
      <Badge variant="outline">{{ props.completionRate }}%</Badge>
      <Badge :variant="props.statusVariant(false)">Active: {{ props.activeTasks }}</Badge>
      <Badge :variant="props.statusVariant(true)">Done: {{ props.completedTasks }}</Badge>
    </div>
  </div>
</template>
