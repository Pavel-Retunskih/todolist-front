<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { Badge, type BadgeVariants } from '@/shared/ui/badge'
import TaskCard from '@/entities/tasks/ui/task-card.vue'
import { Plus, Search, Filter } from 'lucide-vue-next'
import type { Task } from '@/shared/types/task/task'
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
  (e: 'create-task'): void
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
  (e: 'duplicate-task', task: Task): void
  (e: 'retry'): void
}>()

const searchQuery = ref(props.search)
const statusFilterValue = ref(props.statusFilter)
const sortByValue = ref(props.sortBy)

watch(() => props.search, (newValue) => {
  searchQuery.value = newValue
})

watch(() => props.statusFilter, (newValue) => {
  statusFilterValue.value = newValue
})

watch(() => props.sortBy, (newValue) => {
  sortByValue.value = newValue
})

const filteredTasks = computed(() => {
  let filtered = props.filteredTasks || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (statusFilterValue.value === 'active') {
    filtered = filtered.filter(task => !task.completed)
  } else if (statusFilterValue.value === 'completed') {
    filtered = filtered.filter(task => task.completed)
  }

  filtered.sort((a, b) => {
    switch (sortByValue.value) {
      case 'created_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'priority_desc':
        return (b.priority || 0) - (a.priority || 0)
      case 'updated_desc':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  return filtered
})

function coerceStatusFilter(value: AcceptableValue): 'all' | 'active' | 'completed' {
  if (value === 'active' || value === 'completed') return value
  return 'all'
}

function coerceSortBy(value: AcceptableValue): 'updated_desc' | 'created_desc' | 'priority_desc' {
  if (value === 'created_desc' || value === 'priority_desc') return value
  return 'updated_desc'
}

function handleSearchUpdate(value: string | number) {
  emit('update:search', String(value))
}

function handleStatusFilterUpdate(value: AcceptableValue) {
  emit('update:statusFilter', coerceStatusFilter(value))
}

function handleSortByUpdate(value: AcceptableValue) {
  emit('update:sortBy', coerceSortBy(value))
}

function handleToggleCompleted(task: Task, completed: boolean) {
  props.toggleTaskCompleted(task, completed)
}

function handleEdit(task: Task) {
  emit('edit-task', task)
}

function handleDelete(task: Task) {
  emit('delete-task', task)
}

function handleDuplicate(task: Task) {
  emit('duplicate-task', task)
}

function handleToggleStarred() {
}

function handleClick(task: Task) {
  props.openTask(task)
}

function handleCreateTask() {
  emit('create-task')
}
</script>

<template>
  <Card class="shadow-md">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            {{ filteredTasks.length }} of {{ filteredTasks.length }} tasks
          </CardDescription>
        </div>
        <Button @click="handleCreateTask">
          <Plus class="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            :model-value="searchQuery"
            placeholder="Search tasks..."
            class="pl-10"
            @update:model-value="handleSearchUpdate"
          />
        </div>

        <Select :model-value="statusFilterValue" @update:model-value="handleStatusFilterUpdate">
          <SelectTrigger class="w-full sm:w-40">
            <Filter class="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select :model-value="sortByValue" @update:model-value="handleSortByUpdate">
          <SelectTrigger class="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_desc">Last Updated</SelectItem>
            <SelectItem value="created_desc">Date Created</SelectItem>
            <SelectItem value="priority_desc">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div v-if="isTasksLoading" class="space-y-3">
        <Skeleton v-for="i in 5" :key="i" class="h-24 w-full" />
      </div>

      <div v-else-if="hasError" class="flex flex-col items-center justify-center py-8 text-center">
        <p class="text-muted-foreground">Failed to load tasks</p>
        <Button variant="outline" class="mt-2" @click="$emit('retry')">
          Retry
        </Button>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
        <div class="text-muted-foreground">
          <p v-if="searchQuery || statusFilter !== 'all'">
            No tasks match your filters
          </p>
          <p v-else>
            No tasks yet. Create your first task to get started.
          </p>
        </div>
        <Button v-if="!searchQuery && statusFilter === 'all'" class="mt-4" @click="handleCreateTask">
          <Plus class="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div v-else class="space-y-3">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          :status-variant="statusVariant"
          :priority-variant="priorityVariant"
          :format-date="formatDate"
          @toggle-completed="handleToggleCompleted"
          @edit="handleEdit"
          @delete="handleDelete"
          @duplicate="handleDuplicate"
          @click="handleClick"
        />
      </div>
    </CardContent>
  </Card>
</template>
