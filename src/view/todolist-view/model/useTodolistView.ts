import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { todolistsApi } from '@/entities/todolist/api/todolists-api'
import { useTasksQuery } from '@/entities/tasks/model/useTasksQuery'
import type { TodoList } from '@/shared/types/todolist/todolist'
import type { Task } from '@/shared/types/task/task'

export function useTodolistView() {
  const route = useRoute()
  const router = useRouter()

  const todolistId = computed(() => String(route.params.id ?? ''))

  const todolistQuery = useQuery<TodoList>({
    queryKey: computed(() => ['todolist', todolistId.value]),
    queryFn: () => todolistsApi.getTodolistById(todolistId.value),
    enabled: computed(() => Boolean(todolistId.value)),
  })

  const { tasksQuery, createTaskMutation, updateTaskMutation, deleteTaskMutation } =
    useTasksQuery(todolistId)

  const selectedTaskId = ref<string | null>(null)
  const isTaskSheetOpen = ref(false)
  const isCreateTaskOpen = ref(false)

  const tasks = computed<Task[]>(() => tasksQuery.data.value ?? [])

  const selectedTask = computed<Task | null>(() => {
    if (!selectedTaskId.value) return null
    return tasks.value.find((t) => t.id === selectedTaskId.value) ?? null
  })

  function openTask(task: Task) {
    selectedTaskId.value = task.id
    isTaskSheetOpen.value = true
  }

  function setTaskSheetOpen(next: boolean) {
    isTaskSheetOpen.value = next
    if (!next) {
      selectedTaskId.value = null
    }
  }

  function setCreateTaskOpen(next: boolean) {
    isCreateTaskOpen.value = next
  }

  function openCreateTask() {
    setCreateTaskOpen(true)
  }

  function toggleTaskCompleted(task: Task | null, next: boolean) {
    if (!task) return
    updateTaskMutation.mutate({
      id: task.id,
      completed: next,
    })
  }

  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'completed'>('all')
  const sortBy = ref<'updated_desc' | 'created_desc' | 'priority_desc'>('updated_desc')

  const filteredTasks = computed(() => {
    const q = search.value.trim().toLowerCase()

    const byStatus = tasks.value.filter((t) => {
      if (statusFilter.value === 'all') return true
      if (statusFilter.value === 'completed') return Boolean(t.completed)
      return !t.completed
    })

    const byQuery = q
      ? byStatus.filter((t) => {
          const title = String(t.title ?? '').toLowerCase()
          const description = String(t.description ?? '').toLowerCase()
          const tags = Array.isArray(t.tags) ? t.tags.join(' ').toLowerCase() : ''
          return title.includes(q) || description.includes(q) || tags.includes(q)
        })
      : byStatus

    const sorted = [...byQuery]
    sorted.sort((a, b) => {
      if (sortBy.value === 'priority_desc')
        return (Number(b.priority) || 0) - (Number(a.priority) || 0)

      const aDt = toDate(sortBy.value === 'created_desc' ? a.createdAt : a.updatedAt)
      const bDt = toDate(sortBy.value === 'created_desc' ? b.createdAt : b.updatedAt)
      return (bDt?.getTime() ?? 0) - (aDt?.getTime() ?? 0)
    })

    return sorted
  })

  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter((t) => t.completed).length)
  const activeTasks = computed(() => totalTasks.value - completedTasks.value)

  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const topTags = computed(() => {
    const counts = new Map<string, number>()
    for (const task of tasks.value) {
      for (const tag of task.tags ?? []) {
        const key = String(tag).trim()
        if (!key) continue
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }))
  })

  const prioritiesSummary = computed(() => {
    const counts = new Map<number, number>()
    for (const task of tasks.value) {
      const p = Number(task.priority) || 0
      counts.set(p, (counts.get(p) ?? 0) + 1)
    }

    return [...counts.entries()]
      .sort((a, b) => b[0] - a[0])
      .slice(0, 5)
      .map(([priority, count]) => ({ priority, count }))
  })

  function toDate(value: unknown): Date | null {
    if (!value) return null
    if (value instanceof Date) return value
    if (typeof value === 'string' || typeof value === 'number') {
      const d = new Date(value)
      return Number.isNaN(d.getTime()) ? null : d
    }
    return null
  }

  function formatDate(value: unknown) {
    const d = toDate(value)
    if (!d) return '—'
    return d.toLocaleString()
  }

  const statusVariant = (completed: boolean) => (completed ? 'secondary' : 'outline')

  function priorityVariant(priority: number) {
    if (priority >= 4) return 'destructive'
    if (priority >= 2) return 'secondary'
    return 'outline'
  }

  return {
    router,
    todolistId,
    todolistQuery,
    tasksQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    tasks,
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
  }
}
