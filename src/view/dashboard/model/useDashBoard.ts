import { computed, type ComputedRef, unref } from 'vue'
import { useQueries } from '@tanstack/vue-query'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery'
import { tasksApi } from '@/entities/tasks/api/tasks-api'
import type { Task } from '@/shared/types/task/task'
import type { TodoList } from '@/shared/types/todolist/todolist'

export function useDashboardData() {
  const { todolistsQuery } = useTodolistQuery()

  const { data: todolists, isLoading, error } = todolistsQuery
  const todolistsList: ComputedRef<TodoList[]> = computed(() => todolists.value ?? [])

  const tasksQueriesOptions = computed(() =>
    todolistsList.value.map((list) => ({
      queryKey: ['tasks', list.id],
      queryFn: () => tasksApi.getTasksByTodolistId(list.id) as Promise<Task[]>,
    })),
  )

  const tasksQueries = useQueries({
    queries: tasksQueriesOptions,
  })

  const tasksQueryResults = computed(() => {
    const results = unref(tasksQueries)
    return Array.isArray(results) ? results : []
  })

  const tasksByTodolistId = computed<Record<string, Task[]>>(() => {
    return Object.fromEntries(
      todolistsList.value.map((list, index) => {
        const query = tasksQueryResults.value[index]
        const data = unref(query?.data)
        return [list.id, (data ?? []) as Task[]]
      }),
    )
  })

  const isTasksLoadingByTodolistId = computed<Record<string, boolean>>(() => {
    return Object.fromEntries(
      todolistsList.value.map((list, index) => {
        const query = tasksQueryResults.value[index]
        return [list.id, Boolean(unref(query?.isLoading))]
      }),
    )
  })

  const allTasks = computed(() => Object.values(tasksByTodolistId.value).flat())

  const isAnyTasksLoading = computed(() =>
    tasksQueryResults.value.some((query) => Boolean(unref(query?.isLoading))),
  )

  const isTasksSummaryLoading = computed(() => Boolean(unref(isLoading)) || isAnyTasksLoading.value)

  const totalTasks = computed(() => allTasks.value.length)

  const completedTasks = computed(() => allTasks.value.filter((task) => task.completed).length)

  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const recentTasks = computed(() =>
    [...allTasks.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  )

  const errorMessage = computed(() => {
    const err = error.value
    if (!err) return ''
    if (!(typeof err !== 'object') && 'message' in err) {
      return String((err as { message?: unknown }).message ?? 'Unknown error')
    }
    return String(err)
  })

  return {
    todolists: todolistsList,
    isLoading,
    error: errorMessage,
    tasksByTodolistId,
    isTasksLoadingByTodolistId,
    isTasksSummaryLoading,
    totalTasks,
    completedTasks,
    completionRate,
    recentTasks,
    totalTodolists: computed(() => todolistsList.value.length),
  }
}
