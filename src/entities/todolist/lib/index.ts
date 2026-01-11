// Todolist utilities and helpers

export const todolistUtils = {
  formatDate: (date: unknown): string => {
    if (!date) return ''
    const d = new Date(date as string)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  },

  getCompletionRate: (tasks: { completed: boolean }[]): number => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter(task => task.completed).length
    return Math.round((completed / tasks.length) * 100)
  },

  getTaskStats: (tasks: { completed: boolean }[]) => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
      : 0
  }),

  sortByTitle: (a: { title: string }, b: { title: string }): number => {
    return a.title.localeCompare(b.title)
  },

  sortByDate: (a: { updatedAt: string }, b: { updatedAt: string }): number => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  }
}

export type TodolistUtils = typeof todolistUtils
