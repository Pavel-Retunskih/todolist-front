<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { Badge, type BadgeVariants } from '@/shared/ui/badge'
import TaskCard from './task-card.vue'
import { Plus, Search, Filter } from 'lucide-vue-next'
import type { Task } from '@/shared/types/task/task'
import type { AcceptableValue } from 'reka-ui'

interface Props {
  tasks: Task[]
  isLoading: boolean
  error?: string
  statusVariant: (completed: boolean) => BadgeVariants['variant']
  priorityVariant: (priority: number) => BadgeVariants['variant']
  formatDate: (value: unknown) => string
}

interface Emits {
  (e: 'toggle-completed', task: Task, completed: boolean): void
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
  (e: 'duplicate', task: Task): void
  (e: 'click', task: Task): void
  (e: 'create-task'): void
  (e: 'retry'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'completed'>('all')
const sortBy = ref<'updated_desc' | 'created_desc' | 'priority_desc'>('updated_desc')

const filteredTasks = computed(() => {
  let filtered = props.tasks

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filter by status
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(task => !task.completed)
  } else if (statusFilter.value === 'completed') {
    filtered = filtered.filter(task => task.completed)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
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

function handleCreateTask() {
  emit('create-task')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Tasks</h2>
        <p class="text-sm text-muted-foreground">
          {{ filteredTasks.length }} of {{ tasks.length }} tasks
        </p>
      </div>
      <Button @click="handleCreateTask">
        <Plus class="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search tasks..."
          class="pl-10"
        />
      </div>

      <Select v-model="statusFilter">
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

      <Select v-model="sortBy">
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

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <Skeleton v-for="i in 5" :key="i" class="h-24 w-full" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-8 text-center">
      <p class="text-muted-foreground">{{ error }}</p>
      <Button variant="outline" class="mt-2" @click="$emit('retry')">
        Retry
      </Button>
    </div>

    <!-- Empty State -->
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

    <!-- Tasks List -->
    <div v-else class="space-y-3">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :status-variant="statusVariant"
        :priority-variant="priorityVariant"
        :format-date="formatDate"
        @toggle-completed="(task, completed) => emit('toggle-completed', task, completed)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @duplicate="emit('duplicate', $event)"
        @click="emit('click', $event)"
      />
    </div>
  </div>
</template>
