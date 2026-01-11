import axios from 'axios'
import type { Task, CreateTaskPayload, UpdateTaskPayload, DeleteTaskPayload } from '@/shared/types/task/task'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export const tasksApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await axios.get(`${API_BASE_URL}/tasks`)
    return response.data
  },

  // Get tasks by todolist ID
  getTasksByTodolistId: async (todolistId: string): Promise<Task[]> => {
    const response = await axios.get(`${API_BASE_URL}/tasks/todolist/${todolistId}`)
    return response.data
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await axios.get(`${API_BASE_URL}/tasks/${id}`)
    return response.data
  },

  // Create new task
  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await axios.post(`${API_BASE_URL}/tasks`, payload)
    return response.data
  },

  // Update task
  updateTask: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${id}`, payload)
    return response.data
  },

  // Delete task
  deleteTask: async (payload: DeleteTaskPayload): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/tasks/${payload.id}`)
  },

  // Toggle task completion
  toggleTaskCompletion: async (id: string, completed: boolean): Promise<Task> => {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${id}`, { completed })
    return response.data
  },

  // Update task priority
  updateTaskPriority: async (id: string, priority: number): Promise<Task> => {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${id}`, { priority })
    return response.data
  }
}
