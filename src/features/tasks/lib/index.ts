// Tasks feature utilities

export const taskFeatureUtils = {
  validateTaskTitle: (title: string): { isValid: boolean; error?: string } => {
    if (!title.trim()) {
      return { isValid: false, error: 'Task title is required' }
    }
    if (title.length < 3) {
      return { isValid: false, error: 'Task title must be at least 3 characters' }
    }
    if (title.length > 100) {
      return { isValid: false, error: 'Task title must not exceed 100 characters' }
    }
    return { isValid: true }
  },

  validateTaskDescription: (description: string): { isValid: boolean; error?: string } => {
    if (description.length > 500) {
      return { isValid: false, error: 'Task description must not exceed 500 characters' }
    }
    return { isValid: true }
  },

  createTaskPayload: (data: {
    title: string
    description?: string
    todolistId: string
    priority?: number
    tags?: string[]
    dueDate?: string
    imageUrl?: string
  }) => ({
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    todolistId: data.todolistId,
    priority: data.priority || 1,
    tags: data.tags?.filter(tag => tag.trim()) || [],
    dueDate: data.dueDate || undefined,
    imageUrl: data.imageUrl?.trim() || undefined,
    completed: false
  }),

  updateTaskPayload: (data: {
    title?: string
    description?: string
    priority?: number
    tags?: string[]
    dueDate?: string
    imageUrl?: string
    completed?: boolean
  }) => {
    const payload: any = {}
    
    if (data.title !== undefined) payload.title = data.title.trim()
    if (data.description !== undefined) payload.description = data.description?.trim() || undefined
    if (data.priority !== undefined) payload.priority = data.priority
    if (data.tags !== undefined) payload.tags = data.tags?.filter(tag => tag.trim()) || []
    if (data.dueDate !== undefined) payload.dueDate = data.dueDate || undefined
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl?.trim() || undefined
    if (data.completed !== undefined) payload.completed = data.completed
    
    return payload
  }
}

export type TaskFeatureUtils = typeof taskFeatureUtils
