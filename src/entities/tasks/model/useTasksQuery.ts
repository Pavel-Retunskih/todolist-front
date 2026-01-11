import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { tasksApi } from '@/entities/tasks/api/tasks-api.ts'
import type {
  CreateTaskPayload,
  DeleteTaskPayload,
  Task,
  UpdateTaskPayload,
} from '@/shared/types/task/task.ts'

export function useTasksQuery(todolistId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  const resolvedTodolistId = computed(() => String(toValue(todolistId) ?? ''))
  const tasksQueryKey = computed(() => ['tasks', resolvedTodolistId.value])

  const tasksQuery = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => tasksApi.getTasksByTodolistId(resolvedTodolistId.value),
    enabled: computed(() => Boolean(resolvedTodolistId.value)),
  })

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKey.value })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (payload: DeleteTaskPayload) => tasksApi.deleteTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKey.value })
    },
  })

  type UpdateTaskMutationContext = {
    previousTasks?: Task[]
  }

  const updateTaskMutation = useMutation<
    Task,
    unknown,
    UpdateTaskPayload,
    UpdateTaskMutationContext
  >({
    mutationFn: (payload: UpdateTaskPayload) => tasksApi.updateTask(payload),
    onMutate: async (payload): Promise<UpdateTaskMutationContext> => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey.value })

      const previousTasks = queryClient.getQueryData<Task[]>(tasksQueryKey.value)

      queryClient.setQueryData<Task[]>(tasksQueryKey.value, (old) => {
        const prev = (old ?? []) as Task[]
        return prev.map((t) => {
          if (t.id !== payload.id) return t

          const next: Task = { ...t }
          if (payload.title !== undefined) next.title = payload.title
          if (payload.description !== undefined) next.description = payload.description
          if (payload.imageUrl !== undefined) next.imageUrl = payload.imageUrl
          if (payload.tags !== undefined) next.tags = payload.tags
          if (payload.completed !== undefined) next.completed = payload.completed
          if (payload.order !== undefined) next.order = payload.order
          if (payload.priority !== undefined) next.priority = payload.priority
          if (payload.dueDate !== undefined) next.dueDate = payload.dueDate

          return next
        })
      })

      return { previousTasks }
    },
    onSuccess: (data, variables) => {
      const targetId = String(variables.id)

      queryClient.setQueryData<Task[]>(tasksQueryKey.value, (old) => {
        const prev = (old ?? []) as Task[]
        return prev.map((t) => {
          if (t.id !== targetId) return t
          return { ...t, ...data, id: t.id }
        })
      })
    },
    onError: async (_err, _payload, ctx) => {
      if (ctx?.previousTasks) {
        queryClient.setQueryData(tasksQueryKey.value, ctx.previousTasks)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKey.value })
    },
  })

  return {
    tasksQuery,
    createTaskMutation,
    deleteTaskMutation,
    updateTaskMutation,
  }
}
