<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { TodoList } from '@/shared/types/todolist/todolist'
import type { Task } from '@/shared/types/task/task'

interface TodolistCardProps {
  todolist: TodoList
  tasks: Task[]
  isTasksLoading: boolean
}

const props = defineProps<TodolistCardProps>()

const totalTasks = computed(() => props.tasks.length)
const completedTasks = computed(() => props.tasks.filter((task) => task.completed).length)
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})
</script>

<template>
  <Card class="h-full shadow-md hover:shadow-lg transition-shadow">
    <CardHeader class="pb-3">
      <CardTitle class="truncate text-base font-semibold">
        {{ props.todolist.title }}
      </CardTitle>
      <CardDescription>
        {{ props.todolist.description || 'No description yet' }}
      </CardDescription>
    </CardHeader>
    <CardContent class="flex items-end justify-between pt-0 text-sm">
      <div class="space-y-1 text-muted-foreground">
        <template v-if="props.isTasksLoading">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-4 w-24" />
        </template>
        <template v-else>
          <p>{{ totalTasks }} tasks</p>
          <p>{{ completedTasks }} completed</p>
        </template>
      </div>
      <div class="text-right">
        <p class="text-xs text-muted-foreground">Progress</p>
        <template v-if="props.isTasksLoading">
          <Skeleton class="h-6 w-14" />
        </template>
        <template v-else>
          <p class="text-lg font-semibold">{{ completionRate }}%</p>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
