<script setup lang="ts">
import { watch } from 'vue'
import axios from 'axios'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { CreateTaskPayload, Task } from '@/shared/types/task/task'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Field, FieldDescription as UiFieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/shared/ui/field'
import { applyFieldError } from '@/shared/helpers/applyFieldError'

const props = defineProps<{
  todolistId: string
  open: boolean
  submitCreateTask: (payload: CreateTaskPayload) => Promise<Task>
}>()

const emits = defineEmits<{
  (e: 'cancel'): void
  (e: 'success'): void
}>()

const createTaskSchema = z.object({
  title: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().min(3, { message: 'Min 3 chars' }).max(50, { message: 'Max 50 chars' }),
  ),
  description: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z.string().min(3, { message: 'Min 3 chars' }).max(200, { message: 'Max 200 chars' }).optional(),
  ),
  imageUrl: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z.string().url({ message: 'Invalid URL' }).optional(),
  ),
  tags: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z
      .string()
      .max(200, { message: 'Max 200 chars' })
      .optional()
      .refine(
        (value) => {
          if (!value) return true
          return value.split(',').every((t) => t.trim().length > 0)
        },
        {
          message: 'Tags must be comma-separated without empty values',
        },
      ),
  ),
})

const schema = toTypedSchema(createTaskSchema)

type Values = z.infer<typeof createTaskSchema>

type FieldKey = keyof Values

const { handleSubmit, isSubmitting, setFieldError, resetForm } = useForm<Values>({
  validationSchema: schema,
  initialValues: {
    title: '',
    description: '',
    imageUrl: '',
    tags: '',
  },
})

watch(
  () => props.open,
  (open) => {
    if (!open) {
      resetForm()
      return
    }

    resetForm({
      values: {
        title: '',
        description: '',
        imageUrl: '',
        tags: '',
      },
    })
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  try {
    const tags = values.tags
      ? values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined

    const payload: CreateTaskPayload = {
      todolistId: props.todolistId,
      title: values.title,
      description: values.description?.trim() ? values.description.trim() : undefined,
      imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : undefined,
      tags: tags?.length ? tags : undefined,
    }

    await props.submitCreateTask(payload)

    resetForm()
    emits('success')
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const data: unknown = e.response?.data
      const messages: unknown =
        data && typeof data === 'object' && 'message' in data
          ? (data as { message?: unknown }).message
          : undefined

      if (Array.isArray(messages)) {
        for (const m of messages) {
          const msg = String(m)
          const lower = msg.toLowerCase()

          if (lower.includes('image') || lower.includes('url')) {
            setFieldError('imageUrl', msg)
            continue
          }
          if (lower.includes('tags')) {
            setFieldError('tags', msg)
            continue
          }
          if (lower.includes('description')) {
            setFieldError('description', msg)
            continue
          }
          if (lower.includes('title')) {
            setFieldError('title', msg)
            continue
          }

          setFieldError('title', msg)
        }
        return
      }
    }

    applyFieldError<FieldKey>(e, setFieldError, { fallbackFields: ['title'] })
  }
})

function onCancel() {
  resetForm()
  emits('cancel')
}
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
            <Input v-bind="field" id="tags" :aria-invalid="!!errors.length" type="text" placeholder="work, urgent, report" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </FieldGroup>
    </FieldSet>

    <div class="mt-6 flex items-center justify-end gap-2">
      <Button type="button" variant="outline" :disabled="isSubmitting" @click="onCancel">Cancel</Button>
      <Button type="submit" :disabled="isSubmitting">Create</Button>
    </div>
  </form>
</template>
