<script setup lang="ts">
import { computed, type ComputedRef, unref, watchEffect } from 'vue'
import { useQueries } from '@tanstack/vue-query'
import { tasksApi } from '@/entities/tasks/api/tasks-api.ts'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery.ts'
import type { Task } from '@/shared/types/task/task.ts'
import type { TodoList } from '@/shared/types/todolist/todolist.ts'
import { useVitalTasksStatistic } from '../model/useVitalTasksStatistic.ts'
import VitalTaskCard from './vital-task-card.vue'
import { useTasksQuery } from '@/entities/tasks/model/useTasksQuery.ts'
import { useStorage } from '@vueuse/core'

import VitalFilters from './vital-filters.vue'
import VitalStatistic from './vital-statistic.vue'

const minPriority = useStorage<string>('vital.minPriority', '4')
const dueInDays = useStorage<string>('vital.dueInDays', '3')
const selectedTodolistId = useStorage<string>('vital.selectedTodolistId', '')
const hideCompleted = useStorage<boolean>('vital.hideCompleted', false)

const { todolistsQuery } = useTodolistQuery()

const { tasksQuery, deleteTaskMutation, updateTaskMutation } = useTasksQuery(selectedTodolistId)

const tasks = computed<Task[]>(() => {
  const data = tasksQuery.data.value
  if (!data) return []

  const minValRaw = minPriority.value
  const minVal = Number(minValRaw)
  const applyMin = minValRaw !== '' && Number.isFinite(minVal)

  const dueRaw = dueInDays.value
  const dueVal = Number(dueRaw)
  const applyDue = dueRaw !== '' && Number.isFinite(dueVal)

  return data.filter((task) => {
    if (hideCompleted.value && task.completed) return false
    if (applyMin && task.priority < minVal) return false

    if (!applyDue) return true

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate as unknown as string)
      const today = new Date()
      const diffTime = Math.abs(dueDate.getTime() - today.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= dueVal
    }
    return true
  })
})
const stats = useVitalTasksStatistic({ tasks, dueInDaysRaw: dueInDays })

const todolistsList: ComputedRef<TodoList[]> = computed(() => todolistsQuery.data.value ?? [])

const tasksPresenceQueriesOptions = computed(() =>
  todolistsList.value.map((list) => ({
    queryKey: ['tasks', String(list.id)],
    queryFn: () => tasksApi.getTasksByTodolistId(String(list.id)) as Promise<Task[]>,
    enabled: computed(() => Boolean(list.id)),
  })),
)

const tasksPresenceQueries = useQueries({
  queries: tasksPresenceQueriesOptions,
})

const tasksPresenceResults = computed(() => {
  const results = unref(tasksPresenceQueries)
  return Array.isArray(results) ? results : []
})

const tasksCountByTodolistId = computed<Record<string, number>>(() => {
  return Object.fromEntries(
    todolistsList.value.map((list, index) => {
      const query = tasksPresenceResults.value[index]
      const data = unref(query?.data)
      return [String(list.id), Array.isArray(data) ? data.length : 0]
    }),
  )
})

const isTasksPresenceLoading = computed(() =>
  tasksPresenceResults.value.some(
    (q) => Boolean(unref(q?.isPending)) || Boolean(unref(q?.isFetching)),
  ),
)

const todolistsWithTasks = computed(() =>
  todolistsList.value.filter((list) => (tasksCountByTodolistId.value[String(list.id)] ?? 0) > 0),
)

const todolistsOptions = computed(() =>
  todolistsWithTasks.value.map((list) => ({
    value: String(list.id),
    label: list.title,
  })),
)

watchEffect(() => {
  if (selectedTodolistId.value) return
  const first = todolistsWithTasks.value[0]
  if (first?.id) selectedTodolistId.value = String(first.id)
})

const refetch = async () => {
  await tasksQuery.refetch()
}

const tasksErrorMessage = computed(() => {
  const err = tasksQuery.error.value
  if (!err) return ''
  if (typeof err === 'object' && err && 'message' in err) {
    return String((err as { message?: unknown }).message ?? 'Unknown error')
  }
  return String(err)
})
</script>

<template>
  <div class="grow flex justify-center items-start px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex w-full max-w-6xl flex-col gap-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Vital tasks</h1>
          <p class="text-sm text-muted-foreground">
            Tasks selected by priority and near-due window.
          </p>
        </div>
      </div>

      <VitalFilters
        :selected-todolist-id="selectedTodolistId"
        :todolists-options="todolistsOptions"
        :min-priority="minPriority"
        :due-in-days="dueInDays"
        :hide-completed="hideCompleted"
        :combo-disabled="todolistsQuery.isLoading.value || isTasksPresenceLoading"
        :refresh-disabled="tasksQuery.isPending.value"
        @update:selected-todolist-id="(v) => (selectedTodolistId = v)"
        @update:min-priority="(v) => (minPriority = v)"
        @update:due-in-days="(v) => (dueInDays = v)"
        @update:hide-completed="(v) => (hideCompleted = v)"
        @refresh="refetch"
        @reset="
          () => {
            minPriority = '4'
            dueInDays = '3'
            hideCompleted = false
          }
        "
      />
      <VitalStatistic :stats="stats" :is-loading="tasksQuery.isPending.value" />

      <div v-if="tasksQuery.isPending.value" class="text-sm text-muted-foreground">
        Loading tasks…
      </div>
      <div v-else-if="tasksQuery.isError.value" class="text-sm text-destructive">
        Failed to load tasks: {{ tasksErrorMessage }}
      </div>
      <div v-else-if="tasks.length === 0" class="text-sm text-muted-foreground">
        No tasks for current filters.
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <VitalTaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @snooze="(newTask) => updateTaskMutation.mutate(newTask)"
          @delete="(newTask) => deleteTaskMutation.mutate(newTask)"
          @update="(newTask) => updateTaskMutation.mutate(newTask)"
        />
      </div>
    </div>
  </div>
</template>
