<script setup lang="ts">
import type { Task } from '@/shared/types/task/task'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { Checkbox } from '@/shared/ui/checkbox'
import { Badge, type BadgeVariants } from '@/shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import type { AcceptableValue } from 'reka-ui'

const props = defineProps<{
  search: string
  statusFilter: 'all' | 'active' | 'completed'
  sortBy: 'updated_desc' | 'created_desc' | 'priority_desc'
  isTasksLoading: boolean
  hasError: boolean
  filteredTasks: Task[]
  openTask: (task: Task) => void
  toggleTaskCompleted: (task: Task, next: boolean) => void
  formatDate: (value: unknown) => string
  statusVariant: (completed: boolean) => BadgeVariants['variant']
  priorityVariant: (priority: number) => BadgeVariants['variant']
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:statusFilter', value: 'all' | 'active' | 'completed'): void
  (e: 'update:sortBy', value: 'updated_desc' | 'created_desc' | 'priority_desc'): void
}>()

function coerceStatusFilter(value: AcceptableValue): 'all' | 'active' | 'completed' {
  if (value === 'active' || value === 'completed') return value
  return 'all'
}

function coerceSortBy(value: AcceptableValue): 'updated_desc' | 'created_desc' | 'priority_desc' {
  if (value === 'created_desc' || value === 'priority_desc') return value
  return 'updated_desc'
}
</script>

<template>
  <Card class="shadow-md">
    <CardHeader>
      <CardTitle>Tasks</CardTitle>
      <CardDescription>Search, filter and open a task to see full details</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid gap-3 md:grid-cols-3">
        <Input
          :model-value="props.search"
          placeholder="Search by title, description or tag"
          @update:model-value="(v) => emit('update:search', String(v ?? ''))"
        />

        <Select
          :model-value="props.statusFilter"
          @update:model-value="(v) => emit('update:statusFilter', coerceStatusFilter(v))"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          :model-value="props.sortBy"
          @update:model-value="(v) => emit('update:sortBy', coerceSortBy(v))"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_desc">Sort: updated</SelectItem>
            <SelectItem value="created_desc">Sort: created</SelectItem>
            <SelectItem value="priority_desc">Sort: priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div v-if="props.isTasksLoading" class="space-y-2">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>

      <div v-else-if="props.hasError" class="text-sm text-muted-foreground">
        Failed to load tasks
      </div>

      <div v-else class="space-y-2">
        <div v-if="props.filteredTasks.length === 0" class="text-sm text-muted-foreground">
          No tasks found
        </div>

        <div
          v-for="task in props.filteredTasks"
          :key="task.id"
          class="flex w-full items-start justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition hover:bg-accent/50"
          role="button"
          tabindex="0"
          @click="props.openTask(task)"
          @keydown.enter.prevent="props.openTask(task)"
          @keydown.space.prevent="props.openTask(task)"
        >
          <div class="flex min-w-0 items-start gap-3">
            <Checkbox
              :model-value="Boolean(task.completed)"
              @click.stop
              @keydown.stop
              @update:model-value="(v) => props.toggleTaskCompleted(task, Boolean(v))"
            />

            <img
              v-if="task.imageUrl"
              :src="task.imageUrl"
              alt="Task image"
              loading="lazy"
              class="mt-0.5 h-10 w-10 rounded-md border border-border object-cover"
            />

            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2">
                <Badge :variant="props.statusVariant(Boolean(task.completed))">
                  {{ task.completed ? 'Done' : 'Active' }}
                </Badge>
                <p class="truncate font-medium">{{ task.title }}</p>
              </div>

              <p v-if="task.description" class="line-clamp-2 text-xs text-muted-foreground">
                {{ task.description }}
              </p>

              <div v-if="task.tags?.length" class="flex flex-wrap gap-1">
                <Badge v-for="tag in task.tags" :key="tag" variant="outline">{{ tag }}</Badge>
              </div>
            </div>
          </div>

          <div class="shrink-0 text-right">
            <Badge :variant="props.priorityVariant(Number(task.priority) || 0)"
              >P{{ task.priority }}</Badge
            >
            <p class="mt-1 text-xs text-muted-foreground">{{ props.formatDate(task.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
