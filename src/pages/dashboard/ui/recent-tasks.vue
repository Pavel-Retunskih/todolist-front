<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Task } from '@/shared/types/task/task'

interface Props {
  recentTasks: Task[]
  isLoading: boolean
}

defineProps<Props>()
</script>

<template>
  <Card class="shadow-md">
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-semibold">Recent tasks</CardTitle>
      <CardDescription>Latest activity across your lists</CardDescription>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="isLoading" class="space-y-2">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>
      <div v-else-if="recentTasks.length === 0" class="text-sm text-muted-foreground">
        No tasks yet. Start by creating your first one.
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="task in recentTasks"
          :key="task.id"
          class="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2.5 text-sm shadow-sm hover:shadow transition-shadow"
        >
          <div class="mr-3 flex-1">
            <p class="truncate font-medium">
              {{ task.title }}
            </p>
          </div>
          <span
            class="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
            :class="
              task.completed
                ? 'bg-emerald-400/20 text-emerald-200'
                : 'bg-amber-400/20 text-amber-200'
            "
          >
            {{ task.completed ? 'Done' : 'Open' }}
          </span>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
