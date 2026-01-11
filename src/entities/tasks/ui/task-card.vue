<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { Badge, type BadgeVariants } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-vue-next'
import type { Task } from '@/shared/types/task/task'

interface Props {
  task: Task
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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleToggleCompleted(value: boolean | 'indeterminate') {
  emit('toggle-completed', props.task, Boolean(value))
}

function handleEdit() {
  emit('edit', props.task)
}

function handleDelete() {
  emit('delete', props.task)
}

function handleDuplicate() {
  emit('duplicate', props.task)
}

function handleCardClick() {
  emit('click', props.task)
}
</script>

<template>
  <Card class="group hover:shadow-md transition-all duration-200 hover:border-primary/20 cursor-pointer" @click="handleCardClick">
    <CardContent class="p-4">
      <div class="flex items-start gap-3">
        <!-- Checkbox -->
        <div class="pt-1" @click.stop>
          <Checkbox
            :model-value="Boolean(task.completed)"
            @update:model-value="handleToggleCompleted"
          />
        </div>

        <!-- Task Image -->
        <img
          v-if="task.imageUrl"
          :src="task.imageUrl"
          :alt="task.title"
          loading="lazy"
          class="h-12 w-12 rounded-lg object-cover border border-border"
        />

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Title and Status -->
          <div class="flex items-center gap-2 mb-2">
            <Badge :variant="statusVariant(Boolean(task.completed))" class="text-xs">
              {{ task.completed ? 'Done' : 'Active' }}
            </Badge>
            <h3 
              class="font-medium truncate hover:text-primary transition-colors"
              :class="{ 'line-through text-muted-foreground': task.completed }"
            >
              {{ task.title }}
            </h3>
          </div>

          <!-- Description -->
          <p 
            v-if="task.description" 
            class="text-sm text-muted-foreground line-clamp-2 mb-2"
          >
            {{ task.description }}
          </p>

          <!-- Tags -->
          <div v-if="task.tags?.length" class="flex flex-wrap gap-1 mb-2">
            <Badge 
              v-for="tag in task.tags" 
              :key="tag" 
              variant="outline" 
              class="text-xs"
            >
              {{ tag }}
            </Badge>
          </div>

          <!-- Meta Info -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Badge :variant="priorityVariant(Number(task.priority) || 0)" class="text-xs">
                P{{ task.priority }}
              </Badge>
              <span v-if="task.dueDate" class="text-xs text-muted-foreground">
                Due: {{ formatDate(task.dueDate) }}
              </span>
            </div>
            
            <span class="text-xs text-muted-foreground">
              {{ formatDate(task.updatedAt) }}
            </span>
          </div>
        </div>

        <!-- Actions Menu -->
        <div class="opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0"
              >
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem @click="handleEdit">
                <Edit class="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem @click="handleDuplicate">
                <Copy class="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                @click="handleDelete"
                class="text-destructive focus:text-destructive"
              >
                <Trash2 class="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
