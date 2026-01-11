<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'
import TodolistCard from '@/entities/todolist/ui/todolist-card.vue'
import type { TodoList } from '@/shared/types/todolist/todolist'
import type { Task } from '@/shared/types/task/task'

interface Props {
  todolists: TodoList[]
  tasksByTodolistId: Record<string, Task[]>
  isTasksLoadingByTodolistId: Record<string, boolean>
  isLoading: boolean
  error: unknown
  onCreateTodolist: () => void
}

defineProps<Props>()
</script>

<template>
  <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <Card v-for="i in 6" :key="i" class="h-full shadow-md">
      <CardHeader class="pb-3">
        <Skeleton class="h-5 w-3/4" />
        <Skeleton class="h-4 w-full" />
      </CardHeader>
      <CardContent class="flex items-end justify-between pt-0 text-sm">
        <div class="space-y-1">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-4 w-24" />
        </div>
        <div class="text-right">
          <Skeleton class="h-4 w-12" />
          <Skeleton class="mt-1 h-6 w-14" />
        </div>
      </CardContent>
    </Card>
  </div>
  <div v-else-if="error" class="flex flex-col items-center justify-center gap-4">
    <p class="text-sm text-muted-foreground">
      Failed to load todolists: {{ error }}
    </p>
  </div>
  <div v-else>
    <div v-if="todolists.length > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="list in todolists"
        :key="list.id"
        type="button"
        class="text-left rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @click="$router.push(`/todolists/${list.id}`)"
      >
        <TodolistCard
          :todolist="list"
          :tasks="tasksByTodolistId[list.id] ?? []"
          :is-tasks-loading="isTasksLoadingByTodolistId[list.id] ?? false"
        />
      </button>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-4">
      <p>No todolists yet. Start by creating your first one.</p>
      <Button variant="outline" @click="onCreateTodolist">New todolist</Button>
    </div>
  </div>
</template>
