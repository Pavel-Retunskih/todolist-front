import { todolistsApi } from '@/entities/todolist/api/todolists-api.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export function useTodolistQuery() {
  const queryClient = useQueryClient()

  const todolistsQuery = useQuery({
    queryKey: ['todolists'],
    queryFn: () => todolistsApi.getTodolists(),
  })

  const createTodolistMutation = useMutation({
    mutationFn: todolistsApi.createTodolist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolists'] })
    },
  })
  const deleteTodolistMutation = useMutation({
    mutationFn: todolistsApi.deleteTodolist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolists'] })
    },
  })

  const updateTodolistMutation = useMutation({
    mutationFn: todolistsApi.updateTodolist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolists'] })
    },
  })

  return {
    todolistsQuery,
    createTodolistMutation,
    deleteTodolistMutation,
    updateTodolistMutation,
  }
}
