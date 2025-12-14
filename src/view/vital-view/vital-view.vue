<script setup lang="ts">
import { computed, watchEffect, ref, unref } from 'vue'
import { useMutation, useQuery, useQueryClient, useQueries } from '@tanstack/vue-query'
import { tasksApi } from '@/entities/tasks/api/tasks-api'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery'
import type { Task } from '@/shared/types/task/task'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

const queryClient = useQueryClient()
const { todolistsQuery } = useTodolistQuery()

const todolistsList = computed(() => todolistsQuery.data.value ?? [])
const selectedTodolistId = ref<string>('')

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
  tasksPresenceResults.value.some((q) => Boolean(unref(q?.isPending)) || Boolean(unref(q?.isFetching))),
)

const todolistsWithTasks = computed(() =>
  todolistsList.value.filter((list) => (tasksCountByTodolistId.value[String(list.id)] ?? 0) > 0),
)

watchEffect(() => {
  if (selectedTodolistId.value) return
  const first = todolistsWithTasks.value[0]
  if (first?.id) selectedTodolistId.value = String(first.id)
})

const minPriorityRaw = ref<string>('4')
const dueInDaysRaw = ref<string>('3')

const minPriority = computed<number | undefined>(() => {
  const v = Number(minPriorityRaw.value)
  return Number.isFinite(v) ? v : undefined
})

const dueInDays = computed<number | undefined>(() => {
  const v = Number(dueInDaysRaw.value)
  return Number.isFinite(v) ? v : undefined
})

const queryKey = computed(() => [
  'vital-tasks',
  selectedTodolistId.value,
  minPriorityRaw.value,
  dueInDaysRaw.value,
])

const tasksQuery = useQuery({
  queryKey,
  enabled: computed(() => Boolean(selectedTodolistId.value)),
  queryFn: async () => {
    return tasksApi.getTasksByTodolistId(selectedTodolistId.value, {
      minPriority: minPriority.value,
      dueInDays: dueInDays.value,
    })
  },
})

const tasks = computed<Task[]>(() => tasksQuery.data.value ?? [])

const refetch = async () => {
  await tasksQuery.refetch()
}

const invalidate = () => {
  queryClient.invalidateQueries({ queryKey: queryKey.value })
}

const toggleDoneMutation = useMutation({
  mutationFn: (task: Task) => tasksApi.updateTask({ id: task.id, completed: !task.completed }),
  onSuccess: invalidate,
})

const deleteTaskMutation = useMutation({
  mutationFn: (task: Task) => tasksApi.deleteTask({ id: task.id }),
  onSuccess: invalidate,
})

const snoozeMutation = useMutation({
  mutationFn: (payload: { task: Task; days: number }) => {
    const base = payload.task.dueDate ? new Date(payload.task.dueDate) : new Date()
    if (Number.isNaN(base.getTime())) {
      const now = new Date()
      now.setDate(now.getDate() + payload.days)
      return tasksApi.updateTask({ id: payload.task.id, dueDate: now.toISOString() })
    }
    base.setDate(base.getDate() + payload.days)
    return tasksApi.updateTask({ id: payload.task.id, dueDate: base.toISOString() })
  },
  onSuccess: invalidate,
})

const toValidDate = (value?: Date | string | null): Date | null => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

const formatDue = (due?: Date | string | null) => {
  const d = toValidDate(due)
  if (!d) return '—'
  return d.toLocaleDateString()
}

const stats = computed(() => {
  const total = tasks.value.length
  const completed = tasks.value.filter((t) => t.completed).length

  const nowTs = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const dueToday = tasks.value.filter((t) => {
    const d = toValidDate(t.dueDate)
    return d ? d.getTime() <= todayEnd.getTime() : false
  }).length

  const soon = tasks.value.filter((t) => {
    const d = toValidDate(t.dueDate)
    if (!d) return false
    if (!dueInDays.value && dueInDays.value !== 0) return false

    const ts = d.getTime()
    return ts > todayEnd.getTime() && ts <= nowTs + (dueInDays.value ?? 0) * dayMs
  }).length

  const overdue = tasks.value.filter((t) => {
    const d = toValidDate(t.dueDate)
    return d ? d.getTime() < nowTs && !t.completed : false
  }).length

  return { total, completed, dueToday, soon, overdue }
})

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

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            :disabled="!selectedTodolistId || tasksQuery.isFetching.value"
            @click="refetch"
          >
            {{ tasksQuery.isFetching.value ? 'Refreshing…' : 'Refresh' }}
          </Button>
        </div>
      </div>

      <Card class="shadow-md">
        <CardHeader class="pb-3">
          <CardTitle class="text-base font-semibold">Filters</CardTitle>
          <CardDescription>Select todolist and thresholds for vital view.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted-foreground">Todolist</p>
              <Select
                :model-value="selectedTodolistId"
                @update:model-value="(v) => (selectedTodolistId = String(v ?? ''))"
              >
                <SelectTrigger
                  class="w-full"
                  :disabled="todolistsQuery.isLoading.value || isTasksPresenceLoading"
                >
                  <SelectValue :placeholder="isTasksPresenceLoading ? 'Loading…' : 'Select todolist'" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="list in todolistsWithTasks" :key="list.id" :value="String(list.id)">
                    {{ list.title }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1">
              <p class="text-xs font-medium text-muted-foreground">minPriority</p>
              <Input v-model="minPriorityRaw" inputmode="numeric" placeholder="4" />
            </div>

            <div class="space-y-1">
              <p class="text-xs font-medium text-muted-foreground">dueInDays</p>
              <Input v-model="dueInDaysRaw" inputmode="numeric" placeholder="3" />
            </div>

            <div class="flex items-end">
              <Button
                class="w-full"
                variant="outline"
                :disabled="todolistsQuery.isLoading.value || isTasksPresenceLoading || !selectedTodolistId"
                @click="refetch"
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-5">
        <Card class="shadow-md">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Total</CardTitle>
            <CardDescription>In this view</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ tasksQuery.isPending.value ? '—' : stats.total }}</p>
          </CardContent>
        </Card>

        <Card class="shadow-md">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Done</CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ tasksQuery.isPending.value ? '—' : stats.completed }}</p>
          </CardContent>
        </Card>

        <Card class="shadow-md">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Due today</CardTitle>
            <CardDescription>Deadline today</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ tasksQuery.isPending.value ? '—' : stats.dueToday }}</p>
          </CardContent>
        </Card>

        <Card class="shadow-md">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Soon</CardTitle>
            <CardDescription>Inside window</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ tasksQuery.isPending.value ? '—' : stats.soon }}</p>
          </CardContent>
        </Card>

        <Card class="shadow-md">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Overdue</CardTitle>
            <CardDescription>Not completed</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ tasksQuery.isPending.value ? '—' : stats.overdue }}</p>
          </CardContent>
        </Card>
      </div>

      <div v-if="tasksQuery.isPending.value" class="text-sm text-muted-foreground">Loading tasks…</div>
      <div v-else-if="tasksQuery.isError.value" class="text-sm text-destructive">
        Failed to load tasks: {{ tasksErrorMessage }}
      </div>
      <div v-else-if="tasks.length === 0" class="text-sm text-muted-foreground">
        No tasks for current filters.
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card v-for="task in tasks" :key="task.id" class="shadow-md">
          <CardHeader class="pb-3">
            <CardTitle class="text-base font-semibold truncate">{{ task.title }}</CardTitle>
            <CardDescription class="flex flex-wrap gap-2">
              <Badge variant="outline">Priority: {{ task.priority }}</Badge>
              <Badge variant="outline">Due: {{ formatDue(task.dueDate) }}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Checkbox
                  :model-value="Boolean(task.completed)"
                  :disabled="toggleDoneMutation.isPending.value"
                  @update:model-value="() => toggleDoneMutation.mutate(task)"
                />
                <p class="text-sm">Done</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                :disabled="snoozeMutation.isPending.value"
                @click="snoozeMutation.mutate({ task, days: 1 })"
              >
                Snooze +1d
              </Button>
              <Button
                size="sm"
                variant="outline"
                :disabled="snoozeMutation.isPending.value"
                @click="snoozeMutation.mutate({ task, days: 3 })"
              >
                Snooze +3d
              </Button>
              <Button
                size="sm"
                variant="destructive"
                :disabled="deleteTaskMutation.isPending.value"
                @click="deleteTaskMutation.mutate(task)"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
