<script setup lang="ts">
import { computed } from 'vue'
import TasksList from '@/entities/tasks/ui/tasks-list.vue'
import { tasksApi } from '@/entities/tasks/api/tasks-api'
import { useTasksQuery } from '@/entities/tasks/model/useTasksQuery'
import type { Task } from '@/shared/types/task/task'
import type { BadgeVariants } from '@/shared/ui/badge'

interface Props {
  todolistId: string
}

const props = defineProps<Props>()

const { tasksQuery, updateTaskMutation, deleteTaskMutation, createTaskMutation } = useTasksQuery(props.todolistId)

const { data: tasks, isLoading, error, refetch } = tasksQuery

function statusVariant(completed: boolean): BadgeVariants['variant'] {
  return completed ? 'default' : 'secondary'
}

function priorityVariant(priority: number): BadgeVariants['variant'] {
  if (priority >= 4) return 'destructive'
  if (priority >= 3) return 'default'
  return 'secondary'
}

function formatDate(value: unknown): string {
  if (!value) return ''
  const date = new Date(value as string)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

async function handleToggleCompleted(task: Task, completed: boolean) {
  await updateTaskMutation.mutateAsync({
    id: task.id,
    completed
  })
}

function handleEdit(task: Task) {
  // Navigate to edit task page or open modal
  console.log('Edit task:', task)
}

function handleDelete(task: Task) {
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    deleteTaskMutation.mutate({ id: task.id })
  }
}

function handleDuplicate(task: Task) {
  const { id, createdAt, updatedAt, ...taskData } = task
  const newTask = {
    ...taskData,
    title: `${task.title} (copy)`,
    completed: false,
    todolistId: props.todolistId
  }
  console.log('duplicate task:', newTask)
  createTaskMutation.mutateAsync(newTask)
}

function handleToggleStarred() {
  // Star functionality removed
}

function handleClick(task: Task) {
  // Navigate to task details or open modal
  console.log('Click task:', task)
}

function handleCreateTask() {
  // Navigate to create task page or open modal
  console.log('Create new task')
}
</script>

<template>
  <TasksList
    :tasks="tasks || []"
    :is-loading="isLoading"
    :error="error?.message"
    :status-variant="statusVariant"
    :priority-variant="priorityVariant"
    :format-date="formatDate"
    @toggle-completed="handleToggleCompleted"
    @edit="handleEdit"
    @delete="handleDelete"
    @duplicate="handleDuplicate"
    @click="handleClick"
    @create-task="handleCreateTask"
    @retry="refetch"
  />
</template>
