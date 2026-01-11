<script setup lang="ts">
import { ref } from 'vue'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery'
import DashboardHeader from './parts/dashboard-header.vue'
import DashboardStats from './parts/dashboard-stats.vue'
import RecentTasks from './parts/recent-tasks.vue'
import TodolistsGrid from './parts/todolists-grid.vue'
import CreateTodolistDialog from './parts/create-todolist-dialog.vue'
import { useDashboardData } from '../model/dashboard-composables'


type CreateTodolistValues = {
  title: string
  description?: string
  imageUrl?: string
}

const {
  todolists,
  isLoading,
  error,
  tasksByTodolistId,
  isTasksLoadingByTodolistId,
  isTasksSummaryLoading,
  totalTasks,
  completedTasks,
  completionRate,
  recentTasks,
  totalTodolists,
} = useDashboardData()

const { createTodolistMutation } = useTodolistQuery()

const isCreateTodolistOpen = ref(false)
const createTodolistDialogRef = ref<InstanceType<typeof CreateTodolistDialog>>()

async function onCreateTodolistSubmit(values: CreateTodolistValues) {
  try {
    const payload = {
      title: values.title,
      description: values.description?.trim() ? values.description.trim() : undefined,
      imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : undefined,
    }

    await createTodolistMutation.mutateAsync(payload)
    isCreateTodolistOpen.value = false
  } catch (e) {
    createTodolistDialogRef.value?.handleFieldError(e)
  }
}

function openCreateTodolist() {
  isCreateTodolistOpen.value = true
}
</script>

<template>
  <div class="grow flex justify-center items-start px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex w-full max-w-6xl flex-col gap-6">
      <DashboardHeader @create-todolist="openCreateTodolist" />

      <DashboardStats
        :total-todolists="totalTodolists"
        :total-tasks="totalTasks"
        :completion-rate="completionRate"
        :completed-tasks="completedTasks"
        :is-loading="isTasksSummaryLoading"
      />

      <div class="grid gap-4 md:grid-cols-3 items-start">
        <div class="space-y-4 col-span-2">
          <TodolistsGrid
            :todolists="todolists"
            :tasks-by-todolist-id="tasksByTodolistId"
            :is-tasks-loading-by-todolist-id="isTasksLoadingByTodolistId"
            :is-loading="isLoading"
            :error="error"
            @create-todolist="openCreateTodolist"
          />
        </div>

        <div class="w-full space-y-4 md:ml-auto">
          <RecentTasks :recent-tasks="recentTasks" :is-loading="isTasksSummaryLoading" />
        </div>
      </div>
    </div>

    <CreateTodolistDialog
      ref="createTodolistDialogRef"
      :is-open="isCreateTodolistOpen"
      :is-submitting="createTodolistMutation.isPending.value"
      @update:open="isCreateTodolistOpen = $event"
      @submit="onCreateTodolistSubmit"
    />
  </div>
</template>
