<script setup lang="ts">
import { computed } from 'vue'
import HandIcon from '@/assets/icons/hand-icon.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery.ts'

interface TaskEntity {
  id: string
  todolistId: string
  title: string
  createdAt: Date
  updatedAt: Date
  completed: boolean
  order: number
  priority: number
  tags?: string[]
  description?: string
  imageUrl?: string
}

const tasks: TaskEntity[] = [
  {
    id: 't1',
    todolistId: '1',
    title: 'Plan weekend',
    createdAt: new Date('2025-12-05T09:00:00Z'),
    updatedAt: new Date('2025-12-05T09:00:00Z'),
    completed: false,
    order: 1,
    priority: 2,
    tags: ['personal'],
  },
  {
    id: 't2',
    todolistId: '1',
    title: 'Buy groceries',
    createdAt: new Date('2025-12-05T11:00:00Z'),
    updatedAt: new Date('2025-12-05T11:00:00Z'),
    completed: true,
    order: 2,
    priority: 1,
    tags: ['home'],
  },
  {
    id: 't3',
    todolistId: '2',
    title: 'Prepare sprint planning',
    createdAt: new Date('2025-12-04T14:00:00Z'),
    updatedAt: new Date('2025-12-04T14:00:00Z'),
    completed: false,
    order: 1,
    priority: 3,
    tags: ['work'],
  },
  {
    id: 't4',
    todolistId: '2',
    title: 'Review pull requests',
    createdAt: new Date('2025-12-03T16:30:00Z'),
    updatedAt: new Date('2025-12-03T16:30:00Z'),
    completed: true,
    order: 2,
    priority: 2,
    tags: ['work'],
  },
  {
    id: 't5',
    todolistId: '3',
    title: 'Read article about clean architecture',
    createdAt: new Date('2025-12-02T18:00:00Z'),
    updatedAt: new Date('2025-12-02T18:00:00Z'),
    completed: false,
    order: 1,
    priority: 2,
    tags: ['learning'],
  },
  {
    id: 't6',
    todolistId: '3',
    title: 'Watch talk about Vue patterns',
    createdAt: new Date('2025-12-01T20:00:00Z'),
    updatedAt: new Date('2025-12-01T20:00:00Z'),
    completed: true,
    order: 2,
    priority: 1,
    tags: ['learning'],
  },
]
const { todolistsQuery } = useTodolistQuery()

const { data: todolists, isLoading, error } = todolistsQuery

const totalTodolists = computed(() => todolists.value?.length)

const totalTasks = computed(() => tasks.length)

const completedTasks = computed(() => tasks.filter((task) => task.completed).length)

const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0

  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const recentTasks = computed(() =>
  [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
)
</script>

<template>
  <div class="grow flex justify-center items-start px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex w-full max-w-6xl flex-col gap-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, Sundar
          </span>
          <HandIcon />
        </div>
        <Button variant="outline">New task</Button>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <Card class="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Todolists</CardTitle>
            <CardDescription>Total lists you manage</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ totalTodolists }}</p>
          </CardContent>
        </Card>

        <Card class="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Tasks</CardTitle>
            <CardDescription>All tasks across your lists</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ totalTasks }}</p>
          </CardContent>
        </Card>

        <Card class="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Completion rate</CardTitle>
            <CardDescription>Done vs total tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">{{ completionRate }}%</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ completedTasks }} completed tasks</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        <div class="space-y-4">
          <div v-if="totalTodolists > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card
              v-for="list in todolists"
              :key="list.id"
              class="h-full shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader class="pb-3">
                <CardTitle class="truncate text-base font-semibold">
                  {{ list.title }}
                </CardTitle>
                <CardDescription>
                  {{ list.description || 'No description yet' }}
                </CardDescription>
              </CardHeader>
              <CardContent class="flex items-end justify-between pt-0 text-sm">
                <div class="space-y-1 text-muted-foreground">
                  <p>{{ (tasksByTodolistId[list.id] || []).length }} tasks</p>
                  <p>
                    {{ (tasksByTodolistId[list.id] || []).filter((task) => task.completed).length }}
                    completed
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-muted-foreground">Progress</p>
                  <p class="text-lg font-semibold">
                    {{
                      (tasksByTodolistId[list.id] || []).length === 0
                        ? '0%'
                        : `${Math.round(
                            ((tasksByTodolistId[list.id] || []).filter((task) => task.completed)
                              .length /
                              (tasksByTodolistId[list.id] || []).length) *
                              100,
                          )}%`
                    }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div v-else class="flex flex-col items-center justify-center gap-4">
            <p>No todolists yet. Start by creating your first one.</p>
            <Button variant="outline">New todolist</Button>
          </div>
        </div>

        <div class="w-full space-y-4 md:max-w-xs md:ml-auto">
          <Card class="shadow-md">
            <CardHeader class="pb-3">
              <CardTitle class="text-base font-semibold">Recent tasks</CardTitle>
              <CardDescription>Latest activity across your lists</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div v-if="recentTasks.length === 0" class="text-sm text-muted-foreground">
                No tasks yet. Start by creating your first one.
              </div>
              <ul v-else class="space-y-2">
                <li
                  v-for="task in recentTasks"
                  :key="task.id"
                  class="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2.5 text-sm shadow-sm hover:shadow transition-shadow"
                >
                  <div class="mr-3 flex-1">
                    <p class="truncate font-medium">
                      {{ task.title }}
                    </p>
                  </div>
                  <span
                    class="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    :class="
                      task.completed
                        ? 'bg-emerald-400/20 text-emerald-200'
                        : 'bg-amber-400/20 text-amber-200'
                    "
                  >
                    {{ task.completed ? 'Done' : 'Open' }}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
