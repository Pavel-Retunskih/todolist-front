<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import type { CreateTaskPayload, Task } from '@/shared/types/task/task'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import {
  Field,
  FieldDescription as UiFieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/ui/field'
import { useCreateTaskForm } from '@/features/tasks/create/model/useCreateTaskForm.ts'

const props = defineProps<{
  todolistId: string
  open: boolean
  submitCreateTask: (payload: CreateTaskPayload) => Promise<Task>
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'success'): void
}>()
const { onSubmit, isSubmitting, onCancel } = useCreateTaskForm({
  todolistId: props.todolistId,
  submitCreateTask: props.submitCreateTask,
  onClose: () => emit('cancel'),
  onSuccess: () => emit('success'),
})
</script>

<template>
  <form id="create-task-form" class="mt-6" @submit="onSubmit">
    <FieldSet>
      <FieldGroup class="grid w-full items-center gap-4">
        <VeeField v-slot="{ errors, field }" name="title" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="title">Title</FieldLabel>
            <Input
              v-bind="field"
              id="title"
              :aria-invalid="!!errors.length"
              type="text"
              placeholder="Complete project report"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="description" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="description">Description</FieldLabel>
            <UiFieldDescription>Optional</UiFieldDescription>
            <Input
              v-bind="field"
              id="description"
              :aria-invalid="!!errors.length"
              type="text"
              placeholder="Finish the quarterly report by end of day"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="imageUrl" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="imageUrl">Image URL</FieldLabel>
            <UiFieldDescription>Optional</UiFieldDescription>
            <Input
              v-bind="field"
              id="imageUrl"
              :aria-invalid="!!errors.length"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="tags" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="tags">Tags</FieldLabel>
            <UiFieldDescription>Optional, comma-separated</UiFieldDescription>
            <Input
              v-bind="field"
              id="tags"
              :aria-invalid="!!errors.length"
              type="text"
              placeholder="work, urgent, report"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </FieldGroup>
    </FieldSet>

    <div class="mt-6 flex items-center justify-end gap-2">
      <Button type="button" variant="outline" :disabled="isSubmitting" @click="onCancel"
        >Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting">Create</Button>
    </div>
  </form>
</template>
