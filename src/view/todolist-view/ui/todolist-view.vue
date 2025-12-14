<script setup lang="ts">
import { ref } from 'vue'
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '@/shared/types/task/task'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import TaskEditForm from '@/features/tasks/edit/ui/task-edit-form.vue'
import TaskCreateForm from '@/features/tasks/create/ui/task-create-form.vue'
import { useTodolistView } from '@/view/todolist-view/model/useTodolistView'
import TodolistViewHeader from '@/view/todolist-view/ui/parts/TodolistViewHeader.vue'
import TodolistTasksOverview from '@/view/todolist-view/ui/parts/TodolistTasksOverview.vue'
import TodolistTasksList from '@/view/todolist-view/ui/parts/TodolistTasksList.vue'
import TodolistPriorityDistribution from '@/view/todolist-view/ui/parts/TodolistPriorityDistribution.vue'
import { Badge } from '@/shared/ui/badge'

const {
  router,
  todolistId,
  todolistQuery,
  tasksQuery,
  createTaskMutation,
  updateTaskMutation,
  deleteTaskMutation,
  selectedTask,
  isTaskSheetOpen,
  setTaskSheetOpen,
  openTask,
  isCreateTaskOpen,
  setCreateTaskOpen,
  openCreateTask,
  toggleTaskCompleted,
  search,
  statusFilter,
  sortBy,
  filteredTasks,
  totalTasks,
  completedTasks,
  activeTasks,
  completionRate,
  topTags,
  prioritiesSummary,
  formatDate,
  statusVariant,
  priorityVariant,
} = useTodolistView()

const isEditTaskMode = ref(false)
const isDeleteConfirmOpen = ref(false)
const isDeleteTaskSubmitting = ref(false)

function openCreateTaskUi() {
  setTaskSheetOpenUi(false)
  isEditTaskMode.value = false
  isDeleteConfirmOpen.value = false
  openCreateTask()
}

function openTaskUi(task: Task) {
  setCreateTaskOpen(false)
  isEditTaskMode.value = false
  isDeleteConfirmOpen.value = false
  openTask(task)
}

function setTaskSheetOpenUi(next: boolean) {
  setTaskSheetOpen(next)
  if (!next) {
    isEditTaskMode.value = false
    isDeleteConfirmOpen.value = false
  }
}

function enterEditTaskMode() {
  if (!selectedTask.value) return
  isDeleteConfirmOpen.value = false
  isEditTaskMode.value = true
}

function exitEditTaskMode() {
  isEditTaskMode.value = false
  isDeleteConfirmOpen.value = false
}

function requestDeleteTask() {
  isEditTaskMode.value = false
  isDeleteConfirmOpen.value = true
}

function cancelDeleteTask() {
  isDeleteConfirmOpen.value = false
}

async function submitCreateTask(payload: CreateTaskPayload): Promise<Task> {
  return await createTaskMutation.mutateAsync(payload)
}

async function submitUpdateTask(payload: UpdateTaskPayload): Promise<Task> {
  return await updateTaskMutation.mutateAsync(payload)
}

async function confirmDeleteTask() {
  if (!selectedTask.value) return

  try {
    isDeleteTaskSubmitting.value = true
    await deleteTaskMutation.mutateAsync({ id: selectedTask.value.id })
    isDeleteConfirmOpen.value = false
    setTaskSheetOpenUi(false)
  } finally {
    isDeleteTaskSubmitting.value = false
  }
}
</script>

<template>
  <div class="grow flex justify-center items-start px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex w-full max-w-6xl flex-col gap-6">
      <TodolistViewHeader
        :is-todolist-loading="todolistQuery.isLoading.value"
        :title="todolistQuery.data.value?.title"
        :description="todolistQuery.data.value?.description"
        :completion-rate="completionRate"
        :active-tasks="activeTasks"
        :completed-tasks="completedTasks"
        :on-back="() => router.push('/dashboard')"
        :on-new-task="openCreateTaskUi"
        :status-variant="statusVariant"
      />

      <TodolistTasksOverview
        :is-tasks-loading="tasksQuery.isLoading.value"
        :total-tasks="totalTasks"
        :completion-rate="completionRate"
        :top-tags="topTags"
      />

      <TodolistTasksList
        :search="search"
        :status-filter="statusFilter"
        :sort-by="sortBy"
        :is-tasks-loading="tasksQuery.isLoading.value"
        :has-error="Boolean(tasksQuery.error.value)"
        :filtered-tasks="filteredTasks"
        :open-task="openTaskUi"
        :toggle-task-completed="toggleTaskCompleted"
        :format-date="formatDate"
        :status-variant="statusVariant"
        :priority-variant="priorityVariant"
        @update:search="(v) => (search = v)"
        @update:status-filter="(v) => (statusFilter = v)"
        @update:sort-by="(v) => (sortBy = v)"
      />

      <TodolistPriorityDistribution
        :is-tasks-loading="tasksQuery.isLoading.value"
        :priorities-summary="prioritiesSummary"
        :total-tasks="totalTasks"
        :priority-variant="priorityVariant"
      />

      <Sheet :open="isTaskSheetOpen" @update:open="setTaskSheetOpenUi($event)">
        <SheetContent class="w-[420px] sm:w-[520px]">
          <template v-if="selectedTask">
            <SheetHeader>
              <SheetTitle class="break-words">
                {{ isEditTaskMode ? 'Edit task' : selectedTask.title }}
              </SheetTitle>
              <SheetDescription>
                <template v-if="isEditTaskMode"> Update the task fields and save changes </template>
                <template v-else>
                  {{ selectedTask.description || 'No description' }}
                </template>
              </SheetDescription>
            </SheetHeader>

            <div class="space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <Badge :variant="statusVariant(Boolean(selectedTask.completed))">
                    {{ selectedTask.completed ? 'Done' : 'Active' }}
                  </Badge>
                  <Badge :variant="priorityVariant(Number(selectedTask.priority) || 0)">
                    Priority: {{ selectedTask.priority }}
                  </Badge>
                  <Badge variant="outline">ID: {{ selectedTask.id }}</Badge>
                </div>

                <div class="flex items-center gap-2">
                  <Button
                    v-if="!isEditTaskMode && !isDeleteConfirmOpen"
                    type="button"
                    variant="outline"
                    @click="enterEditTaskMode"
                  >
                    Edit
                  </Button>
                  <Button
                    v-if="!isDeleteConfirmOpen"
                    type="button"
                    variant="destructive"
                    @click="requestDeleteTask"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <template v-if="isDeleteConfirmOpen">
                <div class="rounded-md border border-border bg-card p-4 space-y-3">
                  <p class="text-sm font-medium">Delete this task?</p>
                  <p class="text-sm text-muted-foreground">This action cannot be undone.</p>
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      :disabled="isDeleteTaskSubmitting"
                      @click="cancelDeleteTask"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      :disabled="isDeleteTaskSubmitting"
                      @click="confirmDeleteTask"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </template>

              <template v-else-if="isEditTaskMode">
                <TaskEditForm
                  :task="selectedTask"
                  :submit-update-task="submitUpdateTask"
                  @cancel="exitEditTaskMode"
                  @success="exitEditTaskMode"
                />
              </template>

              <template v-else>
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      :model-value="Boolean(selectedTask.completed)"
                      @update:model-value="(v) => toggleTaskCompleted(selectedTask, Boolean(v))"
                    />
                    <p class="text-sm">Mark as completed</p>
                  </div>
                </div>

                <div v-if="selectedTask.tags?.length" class="space-y-2">
                  <p class="text-sm font-medium">Tags</p>
                  <div class="flex flex-wrap gap-2">
                    <Badge v-for="tag in selectedTask.tags" :key="tag" variant="outline">{{
                      tag
                    }}</Badge>
                  </div>
                </div>

                <div class="space-y-1 text-sm">
                  <p class="text-muted-foreground">
                    Created: {{ formatDate(selectedTask.createdAt) }}
                  </p>
                  <p class="text-muted-foreground">
                    Updated: {{ formatDate(selectedTask.updatedAt) }}
                  </p>
                </div>

                <div v-if="selectedTask.imageUrl" class="space-y-2">
                  <p class="text-sm font-medium">Image</p>
                  <img
                    :src="selectedTask.imageUrl"
                    alt="Task image"
                    class="max-h-64 w-full rounded-md border border-border object-cover"
                  />
                </div>
              </template>
            </div>
          </template>

          <template v-else>
            <SheetHeader>
              <SheetTitle>Task</SheetTitle>
              <SheetDescription>No task selected</SheetDescription>
            </SheetHeader>
          </template>
        </SheetContent>
      </Sheet>

      <Dialog :open="isCreateTaskOpen" @update:open="setCreateTaskOpen($event)">
        <DialogContent class="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
            <DialogDescription>Add a new task to this todolist</DialogDescription>
          </DialogHeader>

          <TaskCreateForm
            :todolist-id="todolistId"
            :open="isCreateTaskOpen"
            :submit-create-task="submitCreateTask"
            @cancel="setCreateTaskOpen(false)"
            @success="setCreateTaskOpen(false)"
          />
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
