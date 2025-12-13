export type Task = {
  id: string
  todolistId: string
  title: string
  createdAt: Date
  updatedAt: Date
  completed: boolean
  order: number
  priority: number
  tags?: string[] | null
  description?: string | null
  imageUrl?: string | null
}

export type CreateTaskPayload = Pick<Task, 'title' | 'todolistId'> &
  Partial<Pick<Task, 'description' | 'imageUrl' | 'tags'>>

export type UpdateTaskPayload = Pick<Task, 'id'> &
  Partial<Omit<Task, 'id' | 'todolistId' | 'createdAt' | 'updatedAt'>>

export type DeleteTaskPayload = Pick<Task, 'id'>
