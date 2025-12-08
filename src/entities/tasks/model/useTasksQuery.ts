import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { tasksApi } from '@/entities/tasks/api/tasks-api.ts'
import type {
  CreateTaskPayload,
  DeleteTaskPayload,
  UpdateTaskPayload,
} from '@/shared/types/task/task.ts'

export function useTasksQuery(todolistId: string) {
  const queryClient = useQueryClient()

  const tasksQuery = useQuery({
    queryKey: ['tasks', todolistId],
    queryFn: () => tasksApi.getTasksByTodolistId(todolistId),
    enabled: !!todolistId,
  })
  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (payload: DeleteTaskPayload) => tasksApi.deleteTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
  const updateTaskMutation = useMutation({
    mutationFn: (payload: UpdateTaskPayload) => tasksApi.updateTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasksQuery,
    createTaskMutation,
    deleteTaskMutation,
    updateTaskMutation,
  }
}
