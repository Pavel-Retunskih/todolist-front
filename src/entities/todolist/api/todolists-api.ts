import { apiClient } from '@/lib/apiClient.ts'
import type { TodoList } from '@/shared/types/todolist/todolist.ts'

export const todolistsApi = {
  getTodolists: async () => {
    const { data } = await apiClient.get('todolists/get-all')
    return data
  },
  getTodolistById: async (id: string): Promise<TodoList> => {
    const { data } = await apiClient.get(`todolists/get-todolist/${id}`)
    return data
  },
  createTodolist: async (payload: {
    title: string
    description?: string
    imageUrl?: string
  }): Promise<TodoList> => {
    const { data } = await apiClient.post('todolists/create-todolist', payload)
    return data
  },
  deleteTodolist: async (id: string): Promise<void> => {
    await apiClient.delete(`todolists/delete-todolist/${id}`)
  },
  updateTodolist: async ({
    id,
    payload,
  }: {
    id: string
    payload: Partial<Pick<TodoList, 'title' | 'description' | 'imageUrl'>>
  }): Promise<TodoList> => {
    const { data } = await apiClient.put(`todolists/update-todolist/${id}`, payload)
    return data
  },
}
