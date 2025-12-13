import { apiClient } from '@/lib/apiClient.ts'
import type {
  CreateTaskPayload,
  DeleteTaskPayload,
  Task,
  UpdateTaskPayload,
} from '@/shared/types/task/task.ts'

export const tasksApi = {
  getTasksByTodolistId: async (todolistId: string): Promise<Task[]> => {
    const { data } = await apiClient.get<Task[]>(`tasks/${todolistId}`)
    return data
  },
  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<Task>(`tasks/`, payload)
    return data
  },
  deleteTask: async (payload: DeleteTaskPayload): Promise<void> => {
    if (!payload.id) {
      throw new Error('Task id is required')
    }
    await apiClient.delete(`tasks/${payload.id}`)
  },
  updateTask: async (payload: UpdateTaskPayload): Promise<Task> => {
    const { id, ...patch } = payload
    if (!id) {
      throw new Error('Task id is required')
    }
    const { data } = await apiClient.patch<Task>(`tasks/${id}`, patch)
    return data
  },
}
