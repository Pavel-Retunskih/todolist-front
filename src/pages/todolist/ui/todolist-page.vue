<script setup lang="ts">
import { ref } from 'vue'
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '@/shared/types/task/task'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import TaskCreateForm from '@/features/tasks/create/ui/task-create-form.vue'
import TaskEditDialog from '@/features/tasks/edit/ui/task-edit-dialog.vue'
import { useTodolist } from '../model/useTodolist'
import TodolistHeader from './todolist-header.vue'
import TodolistOverview from './todolist-overview.vue'
import TodolistTasksList from './todolist-tasks-list.vue'
import TodolistPriorityDistribution from './todolist-priority-distribution.vue'
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
} = useTodolist()

const isEditTaskSubmitting = ref(false)

function openCreateTaskUi() {
  openCreateTask()
}

function openTaskUi(task: Task) {
  openTask(task)
}

async function submitCreateTask(payload: CreateTaskPayload): Promise<Task> {
  return await createTaskMutation.mutateAsync(payload)
}

async function submitUpdateTask(payload: UpdateTaskPayload): Promise<void> {
  await updateTaskMutation.mutateAsync(payload)
}

async function handleDeleteTaskInline(task: Task) {
  if (confirm(`Delete '${task.title}'?`)) {
    deleteTaskMutation.mutate({ id: task.id })
  }
}

async function handleDuplicateTaskInline(task: Task) {
  const { id, createdAt, updatedAt, ...taskData } = task
  createTaskMutation.mutateAsync({
    ...taskData,
    title: `${task.title} (copy)`,
    todolistId: todolistId.value
  })
}

async function handleDeleteTask(taskId: string): Promise<void> {
  deleteTaskMutation.mutate({ id: taskId })
}

async function handleToggleCompleted(task: Task, completed: boolean): Promise<void> {
  await toggleTaskCompleted(task, completed)
}
</script>

<template>
  <div class="grow flex justify-center items-start px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex w-full max-w-6xl flex-col gap-6">
      <TodolistHeader
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

      <TodolistOverview
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
        @create-task="openCreateTaskUi"
        @edit-task="openTaskUi"
        @delete-task="handleDeleteTaskInline"
        @duplicate-task="handleDuplicateTaskInline"
        @retry="tasksQuery.refetch"
      />

      <TodolistPriorityDistribution
        :is-tasks-loading="tasksQuery.isLoading.value"
        :priorities-summary="prioritiesSummary"
        :total-tasks="totalTasks"
        :priority-variant="priorityVariant"
      />

      <TaskEditDialog
        :is-open="isTaskSheetOpen"
        :task="selectedTask"
        :is-submitting="isEditTaskSubmitting"
        :status-variant="statusVariant"
        :priority-variant="priorityVariant"
        :format-date="formatDate"
        :on-update-task="submitUpdateTask"
        :on-delete-task="handleDeleteTask"
        :on-toggle-completed="handleToggleCompleted"
        @update:isOpen="setTaskSheetOpen($event)"
        @cancel="setTaskSheetOpen(false)"
      />

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
