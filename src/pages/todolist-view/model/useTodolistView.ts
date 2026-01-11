import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksQuery } from '@/features/tasks/model/useTasksQuery'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery'
import type { Task } from '@/shared/types/task/task'
import type { TodoList } from '@/shared/types/todolist/todolist'

export const useTodolistView = () => {
  const route = useRoute()
  const router = useRouter()
  
  // Get todolist ID from route params
  const todolistId = computed(() => route.params.id as string)
  
  // Queries
  const todolistQuery = useTodolistQuery()
  const tasksQuery = useTasksQuery(todolistId.value)
  
  // Reactive state
  const selectedTask = ref<Task | null>(null)
  const isTaskSheetOpen = ref(false)
  const isCreateTaskOpen = ref(false)
  
  // Computed values
  const tasks = computed(() => tasksQuery.tasks.value || [])
  const isLoading = computed(() => todolistQuery.todolistsQuery.isLoading.value || tasksQuery.isLoading.value)
  const error = computed(() => todolistQuery.todolistsQuery.error.value || tasksQuery.error.value)
  
  // Search and filter state
  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'completed'>('all')
  const sortBy = ref<'updated_desc' | 'created_desc' | 'priority_desc'>('updated_desc')
  
  // Filtered tasks
  const filteredTasks = computed(() => {
    let filtered = tasks.value
    
    // Search filter
    if (search.value) {
      const query = search.value.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Status filter
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(task => !task.completed)
    } else if (statusFilter.value === 'completed') {
      filtered = filtered.filter(task => task.completed)
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'created_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'priority_desc':
          return (b.priority || 0) - (a.priority || 0)
        case 'updated_desc':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
    
    return filtered
  })
  
  // Statistics
  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)
  const activeTasks = computed(() => tasks.value.filter(task => !task.completed).length)
  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })
  
  // Top tags
  const topTags = computed(() => {
    const tagCounts: Record<string, number> = {}
    tasks.value.forEach(task => {
      task.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)
  })
  
  // Priority summary
  const prioritiesSummary = computed(() => {
    const summary = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    }
    
    tasks.value.forEach(task => {
      const priority = task.priority || 1
      if (priority >= 4) summary.urgent++
      else if (priority >= 3) summary.high++
      else if (priority >= 2) summary.medium++
      else summary.low++
    })
    
    return summary
  })
  
  // Utility functions
  const formatDate = (value: unknown): string => {
    if (!value) return ''
    const date = new Date(value as string)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }
  
  const statusVariant = (completed: boolean): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return completed ? 'default' : 'secondary'
  }
  
  const priorityVariant = (priority: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (priority >= 4) return 'destructive'
    if (priority >= 3) return 'default'
    return 'secondary'
  }
  
  // Actions
  const openTask = (task: Task) => {
    selectedTask.value = task
    isTaskSheetOpen.value = true
  }
  
  const setTaskSheetOpen = (open: boolean) => {
    isTaskSheetOpen.value = open
    if (!open) {
      selectedTask.value = null
    }
  }
  
  const setCreateTaskOpen = (open: boolean) => {
    isCreateTaskOpen.value = open
  }
  
  const openCreateTask = () => {
    setCreateTaskOpen(true)
  }
  
  const toggleTaskCompleted = async (task: Task, completed: boolean) => {
    await tasksQuery.toggleCompletion(task.id, completed)
  }
  
  const navigateBack = () => {
    router.push('/dashboard')
  }
  
  return {
    // Router
    router,
    todolistId,
    
    // Queries
    todolistQuery,
    tasksQuery,
    
    // Data
    selectedTask,
    tasks,
    filteredTasks,
    
    // Loading states
    isLoading,
    error,
    
    // UI state
    isTaskSheetOpen,
    isCreateTaskOpen,
    search,
    statusFilter,
    sortBy,
    
    // Statistics
    totalTasks,
    completedTasks,
    activeTasks,
    completionRate,
    topTags,
    prioritiesSummary,
    
    // Utilities
    formatDate,
    statusVariant,
    priorityVariant,
    
    // Actions
    setTaskSheetOpen,
    setCreateTaskOpen,
    openTask,
    openCreateTask,
    toggleTaskCompleted,
    navigateBack,
    
    // Mutations
    createTaskMutation: tasksQuery.createTaskMutation,
    updateTaskMutation: tasksQuery.updateTaskMutation,
    deleteTaskMutation: tasksQuery.deleteTaskMutation,
  }
}
