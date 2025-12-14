export type Task = {
  id: string
  todolistId: string
  title: string
  createdAt: Date
  updatedAt: Date
  completed: boolean
  order: number
  priority: number
  dueDate?: Date | string | null
  tags?: string[] | null
  description?: string | null
  imageUrl?: string | null
}

export type CreateTaskPayload = Pick<Task, 'title' | 'todolistId'> &
  Partial<Pick<Task, 'description' | 'imageUrl' | 'tags' | 'dueDate' | 'priority'>>

export type UpdateTaskPayload = Pick<Task, 'id'> &
  Partial<Omit<Task, 'id' | 'todolistId' | 'createdAt' | 'updatedAt'>>

export type DeleteTaskPayload = Pick<Task, 'id'>
