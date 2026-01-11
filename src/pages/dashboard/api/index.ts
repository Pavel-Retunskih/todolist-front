// Dashboard API layer - data fetching and aggregation

import { computed } from 'vue'
import { useQueries } from '@tanstack/vue-query'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery'
import { tasksApi } from '@/features/tasks/api/tasks-api'
import type { Task } from '@/shared/types/task/task'
import type { TodoList } from '@/shared/types/todolist/todolist'

export interface DashboardStats {
  totalTodolists: number
  totalTasks: number
  completedTasks: number
  completionRate: number
  recentTasks: Task[]
}

export const useDashboardApi = () => {
  // Get all todolists using existing hook
  const { todolistsQuery, createTodolistMutation, deleteTodolistMutation, updateTodolistMutation } = useTodolistQuery()

  // Reactive computed values
  const todolists = computed(() => todolistsQuery.data.value || [])
  
  const tasksQueries = computed(() => {
    return todolists.value.length
      ? todolists.value.map((todolist: TodoList) => ({
          queryKey: ['tasks', todolist.id],
          queryFn: () => tasksApi.getTasksByTodolistId(todolist.id),
          staleTime: 5 * 60 * 1000,
        }))
      : []
  })

  const tasksQueriesResults = useQueries({ queries: tasksQueries })

  // Aggregate all tasks from all todolists
  const allTasks = computed<Task[]>(() => {
    return tasksQueriesResults.value.flatMap((query) => (query.data as Task[]) || [])
  })

  // Aggregate loading and error states
  const isLoading = computed(() => 
    todolistsQuery.isLoading.value || 
    tasksQueriesResults.value.some((query) => query.isLoading)
  )
  
  const error = computed(() => 
    todolistsQuery.error.value ||
    tasksQueriesResults.value.find((query) => query.error)?.error
  )

  // Dashboard statistics
  const dashboardStats = computed((): DashboardStats => {
    const tasks = allTasks.value
    
    const completedTasks = tasks.filter((task) => task.completed).length
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    const recentTasks = [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    return {
      totalTodolists: todolists.value.length,
      totalTasks,
      completedTasks,
      completionRate,
      recentTasks
    }
  })

  // Utility functions
  const formatDate = (date: unknown): string => {
    if (!date) return ''
    const d = new Date(date as string)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  const getStatusVariant = (completed: boolean): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return completed ? 'default' : 'secondary'
  }

  const getPriorityVariant = (priority: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (priority >= 4) return 'destructive'
    if (priority >= 3) return 'default'
    return 'secondary'
  }

  // Refetch all data
  const refetchAll = () => {
    todolistsQuery.refetch()
    tasksQueriesResults.value.forEach((query) => query.refetch())
  }

  return {
    // Queries
    todolistsQuery,
    tasksQueriesResults,
    
    // Reactive data
    todolists,
    tasks: allTasks,
    isLoading,
    error,
    
    // Computed stats
    dashboardStats,
    
    // Mutations
    createTodolistMutation,
    deleteTodolistMutation,
    updateTodolistMutation,
    
    // Utility functions
    formatDate,
    getStatusVariant,
    getPriorityVariant,
    
    // Actions
    refetch: refetchAll,
  }
}
