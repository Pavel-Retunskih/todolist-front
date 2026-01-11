<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Badge } from '@/shared/ui/badge'
import { Checkbox } from '@/shared/ui/checkbox'
import TaskEditForm from './task-edit-form.vue'
import type { Task, UpdateTaskPayload } from '@/shared/types/task/task'

interface Props {
  isOpen: boolean
  task: Task | null
  isSubmitting: boolean
  statusVariant: (completed: boolean) => 'default' | 'secondary' | 'destructive' | 'outline'
  priorityVariant: (priority: number) => 'default' | 'secondary' | 'destructive' | 'outline'
  formatDate: (value: unknown) => string
  onUpdateTask: (payload: UpdateTaskPayload) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
  onToggleCompleted: (task: Task, completed: boolean) => Promise<void>
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditMode = ref(false)
const isDeleteConfirmOpen = ref(false)

function setOpen(value: boolean) {
  emit('update:isOpen', value)
  if (!value) {
    isEditMode.value = false
    isDeleteConfirmOpen.value = false
  }
}

function enterEditMode() {
  isEditMode.value = true
  isDeleteConfirmOpen.value = false
}

function exitEditMode() {
  isEditMode.value = false
  isDeleteConfirmOpen.value = false
}

function requestDelete() {
  isEditMode.value = false
  isDeleteConfirmOpen.value = true
}

function cancelDelete() {
  isDeleteConfirmOpen.value = false
}

async function confirmDelete() {
  if (!props.task) return
  
  try {
    await props.onDeleteTask(props.task.id)
    setOpen(false)
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}

async function handleSubmit(payload: UpdateTaskPayload) {
  try {
    await props.onUpdateTask(payload)
    exitEditMode()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

function handleCancel() {
  emit('cancel')
}

async function handleToggleCompleted(value: boolean | 'indeterminate') {
  if (!props.task) return
  
  try {
    await props.onToggleCompleted(props.task, Boolean(value))
  } catch (error) {
    console.error('Failed to toggle task completion:', error)
  }
}

// Reset edit mode when task changes
watch(() => props.task, () => {
  isEditMode.value = false
  isDeleteConfirmOpen.value = false
})
</script>

<template>
  <Dialog :open="isOpen" @update:open="setOpen">
    <DialogContent class="sm:max-w-[520px]">
      <DialogHeader v-if="task">
        <DialogTitle class="break-words">
          {{ isEditMode ? 'Edit task' : task.title }}
        </DialogTitle>
        <DialogDescription>
          <template v-if="isEditMode">
            Update the task fields and save changes
          </template>
          <template v-else>
            {{ task.description || 'No description' }}
          </template>
        </DialogDescription>
      </DialogHeader>

      <div v-if="task" class="space-y-4">
        <!-- Task Actions and Info -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <Badge :variant="statusVariant(Boolean(task.completed))">
              {{ task.completed ? 'Done' : 'Active' }}
            </Badge>
            <Badge :variant="priorityVariant(Number(task.priority) || 0)">
              Priority: {{ task.priority }}
            </Badge>
            <Badge variant="outline">ID: {{ task.id }}</Badge>
          </div>

          <div class="flex items-center gap-2">
            <Button
              v-if="!isEditMode && !isDeleteConfirmOpen"
              type="button"
              variant="outline"
              @click="enterEditMode"
            >
              Edit
            </Button>
            <Button
              v-if="!isDeleteConfirmOpen"
              type="button"
              variant="destructive"
              @click="requestDelete"
            >
              Delete
            </Button>
          </div>
        </div>

        <!-- Delete Confirmation -->
        <template v-if="isDeleteConfirmOpen">
          <div class="rounded-md border border-border bg-card p-4 space-y-3">
            <p class="text-sm font-medium">Delete this task?</p>
            <p class="text-sm text-muted-foreground">This action cannot be undone.</p>
            <div class="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                :disabled="isSubmitting"
                @click="cancelDelete"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                :disabled="isSubmitting"
                @click="confirmDelete"
              >
                Delete
              </Button>
            </div>
          </div>
        </template>

        <!-- Edit Form -->
        <template v-else-if="isEditMode">
          <TaskEditForm
            :task="task"
            :submit-update-task="handleSubmit"
            @cancel="exitEditMode"
            @success="exitEditMode"
          />
        </template>

        <!-- Task Details -->
        <template v-else>
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <Checkbox
                :model-value="Boolean(task.completed)"
                @update:model-value="handleToggleCompleted"
              />
              <p class="text-sm">Mark as completed</p>
            </div>
          </div>

          <div v-if="task.tags?.length" class="space-y-2">
            <p class="text-sm font-medium">Tags</p>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tag in task.tags" :key="tag" variant="outline">
                {{ tag }}
              </Badge>
            </div>
          </div>

          <div class="space-y-1 text-sm">
            <p class="text-muted-foreground">
              Created: {{ formatDate(task.createdAt) }}
            </p>
            <p class="text-muted-foreground">
              Updated: {{ formatDate(task.updatedAt) }}
            </p>
          </div>

          <div v-if="task.imageUrl" class="space-y-2">
            <p class="text-sm font-medium">Image</p>
            <img
              :src="task.imageUrl"
              alt="Task image"
              class="max-h-64 w-full rounded-md border border-border object-cover"
            />
          </div>
        </template>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-muted-foreground">No task selected</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
