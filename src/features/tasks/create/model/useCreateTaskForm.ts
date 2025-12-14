import type { Values } from '@/features/tasks/create/model/schema.ts'
import type { CreateTaskPayload, Task } from '@/shared/types/task/task.ts'
import { schema } from '@/features/tasks/create/model/schema.ts'
import { useForm } from 'vee-validate'
import { applyFieldError } from '@/shared/helpers/applyFieldError.ts'
import { toast } from 'vue-sonner'

type Props = {
  todolistId: string
  submitCreateTask: (payload: CreateTaskPayload) => Promise<Task>
  onClose: () => void
  onSuccess: () => void
}

export function useCreateTaskForm({ todolistId, onClose, submitCreateTask, onSuccess }: Props) {
  const { handleSubmit, isSubmitting, setFieldError, resetForm } = useForm<Values>({
    validationSchema: schema,
    initialValues: {
      title: '',
      description: '',
      imageUrl: '',
      tags: '',
    },
  })

  const onSubmit = handleSubmit(async (values: Values) => {
    try {
      const tags = values.tags
        ? values.tags
            .split(' ')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined

      const payload: CreateTaskPayload = {
        todolistId,
        title: values.title,
        description: values.description?.trim() ? values.description.trim() : undefined,
        imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : undefined,
        tags: tags?.length ? tags : undefined,
      }

      toast.promise<Task>(submitCreateTask(payload), {
        loading: 'Creating task...',
        success: 'Task create successful',
        error: 'Error creating task',
      })
      resetForm()
      onSuccess()
    } catch (e) {
      applyFieldError(e, setFieldError)
      toast.error('Failed to create task')
    }
  })

  function onCancel() {
    resetForm()
    onClose()
  }

  return {
    onSubmit,
    isSubmitting,
    onCancel,
  }
}
