import { computed } from 'vue'
import { useDashboardApi } from '../api'
import { todolistsApi } from '@/entities/todolist/api'

export const useDashBoard = () => {
  const { todolistsQuery, isLoading, error } = useDashboardApi()
  
  // Computed values
  const todolists = computed(() => todolistsQuery.data.value || [])
  
  // Mutations
  const createTodolistMutation = todolistsApi.createTodolist
  
  // Actions
  const createTodolist = async (payload: { title: string; description?: string; imageUrl?: string }) => {
    return await createTodolistMutation(payload)
  }
  
  const deleteTodolist = async (id: string) => {
    return await todolistsApi.deleteTodolist(id)
  }
  
  const updateTodolist = async ({ id, payload }: { id: string; payload: any }) => {
    return await todolistsApi.updateTodolist({ id, payload })
  }
  
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
  
  return {
    // Data
    todolists,
    
    // Loading states
    isLoading,
    error,
    
    // Mutations
    createTodolistMutation: todolistsQuery,
    
    // Actions
    createTodolist,
    deleteTodolist,
    updateTodolist,
    
    // Utilities
    formatDate,
    getStatusVariant,
    getPriorityVariant,
  }
}
