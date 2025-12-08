import { apiClient } from '@/lib/apiClient.ts'
import type {
  CreateTaskPayload,
  DeleteTaskPayload,
  UpdateTaskPayload,
} from '@/shared/types/task/task.ts'

export const tasksApi = {
  getTasksByTodolistId: async (todolistId: string) => {
    const { data } = await apiClient.get(`tasks/${todolistId}`)
    return data
  },
  createTask: async (payload: CreateTaskPayload) => {
    const { data } = await apiClient.post(`tasks/`, payload)
    return data
  },
  deleteTask: async (payload: DeleteTaskPayload) => {
    const { data } = await apiClient.delete(`tasks/${payload.id}`)
    return data
  },
  updateTask: async (payload: UpdateTaskPayload) => {
    const { data } = await apiClient.patch(`tasks/${payload.id}`, payload)
    return data
  },
}
