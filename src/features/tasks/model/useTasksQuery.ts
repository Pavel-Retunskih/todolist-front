import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { tasksApi } from '../api/tasks-api'
import type { Task, CreateTaskPayload, UpdateTaskPayload, DeleteTaskPayload } from '@/shared/types/task/task'

export interface UseTasksQueryOptions {
  todolistId?: string
  enabled?: boolean
}

export const useTasksQuery = (todolistId?: string, options: UseTasksQueryOptions = {}) => {
  const queryClient = useQueryClient()

  // Get tasks query
  const tasksQuery = useQuery({
    queryKey: ['tasks', todolistId],
    queryFn: () => todolistId ? tasksApi.getTasksByTodolistId(todolistId) : tasksApi.getTasks(),
    enabled: options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (todolistId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', todolistId] })
      }
    }
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => 
      tasksApi.updateTask({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (todolistId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', todolistId] })
      }
    }
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (payload: DeleteTaskPayload) => tasksApi.deleteTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (todolistId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', todolistId] })
      }
    }
  })

  // Toggle completion mutation
  const toggleCompletionMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      tasksApi.toggleTaskCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (todolistId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', todolistId] })
      }
    }
  })

  // Update priority mutation
  const updatePriorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: number }) => 
      tasksApi.updateTaskPriority(id, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (todolistId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', todolistId] })
      }
    }
  })

  // Computed values
  const tasks = computed(() => tasksQuery.data.value || [])
  const isLoading = computed(() => tasksQuery.isLoading.value)
  const error = computed(() => tasksQuery.error.value)
  const isCreating = computed(() => createTaskMutation.isPending.value)
  const isUpdating = computed(() => updateTaskMutation.isPending.value)
  const isDeleting = computed(() => deleteTaskMutation.isPending.value)

  // Actions
  const refetch = () => tasksQuery.refetch()
  const createTask = (payload: CreateTaskPayload) => createTaskMutation.mutateAsync(payload)
  const updateTask = (id: string, payload: UpdateTaskPayload) => 
    updateTaskMutation.mutateAsync({ id, payload })
  const deleteTask = (id: string) => deleteTaskMutation.mutateAsync({ id })
  const toggleCompletion = (id: string, completed: boolean) => 
    toggleCompletionMutation.mutateAsync({ id, completed })
  const updatePriority = (id: string, priority: number) => 
    updatePriorityMutation.mutateAsync({ id, priority })

  return {
    // Query data
    tasksQuery,
    tasks,
    isLoading,
    error,
    
    // Mutation states
    isCreating,
    isUpdating,
    isDeleting,
    
    // Mutations
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    toggleCompletionMutation,
    updatePriorityMutation,
    
    // Actions
    refetch,
    createTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    updatePriority,
  }
}
