export type Task = {
  id: string
  todolistId: string
  title: string
  createdAt: Date
  updatedAt: Date
  completed: boolean
  order: number
  priority: number
  tags?: string[]
  description?: string
  imageUrl?: string
}

export type CreateTaskPayload = Pick<Task, 'title' | 'todolistId'>

export type UpdateTaskPayload = Pick<Task, 'id' | 'todolistId'> &
  Partial<Omit<Task, 'id' | 'todolistId' | 'createdAt' | 'updatedAt'>>

export type DeleteTaskPayload = Pick<Task, 'id' | 'todolistId'>
