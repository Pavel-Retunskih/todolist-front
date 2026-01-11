// Task utilities and helpers

export const taskUtils = {
  formatDate: (date: unknown): string => {
    if (!date) return ''
    const d = new Date(date as string)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  },

  getStatusVariant: (completed: boolean): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return completed ? 'default' : 'secondary'
  },

  getPriorityVariant: (priority: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (priority >= 4) return 'destructive'
    if (priority >= 3) return 'default'
    return 'secondary'
  },

  isOverdue: (dueDate: unknown): boolean => {
    if (!dueDate) return false
    return new Date(dueDate as string) < new Date()
  },

  sortByPriority: (a: { priority?: number }, b: { priority?: number }): number => {
    return (b.priority || 0) - (a.priority || 0)
  },

  sortByDate: (a: { updatedAt: string }, b: { updatedAt: string }): number => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  }
}

export type TaskUtils = typeof taskUtils
