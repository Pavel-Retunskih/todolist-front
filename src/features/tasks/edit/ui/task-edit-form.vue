<script setup lang="ts">
import { watch } from 'vue'
import axios from 'axios'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { Task, UpdateTaskPayload } from '@/shared/types/task/task'
import { Input } from '@/shared/ui/input'
import { Checkbox } from '@/shared/ui/checkbox'
import { Button } from '@/shared/ui/button'
import { Field, FieldDescription as UiFieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/shared/ui/field'
import { applyFieldError } from '@/shared/helpers/applyFieldError'

const props = defineProps<{ task: Task; submitUpdateTask: (payload: UpdateTaskPayload) => Promise<Task> }>()
const emits = defineEmits<{ (e: 'cancel'): void; (e: 'success'): void }>()

const schema = toTypedSchema(
  z.object({
    title: z.preprocess(
      (v) => (typeof v === 'string' ? v.trim() : v),
      z.string().min(3, { message: 'Min 3 chars' }).max(50, { message: 'Max 50 chars' }),
    ),
    description: z.preprocess(
      (v) => {
        if (typeof v !== 'string') return v
        return v.trim()
      },
      z
        .string()
        .max(200, { message: 'Max 200 chars' })
        .refine((value) => value === '' || value.length >= 3, { message: 'Min 3 chars' }),
    ),
    imageUrl: z.preprocess(
      (v) => {
        if (typeof v !== 'string') return v
        return v.trim()
      },
      z.string().refine((value) => value === '' || z.string().url().safeParse(value).success, {
        message: 'Invalid URL',
      }),
    ),
    tags: z.preprocess(
      (v) => {
        if (typeof v !== 'string') return v
        return v.trim()
      },
      z
        .string()
        .max(200, { message: 'Max 200 chars' })
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
    priority: z.preprocess((v) => {
      const n = typeof v === 'string' ? Number(v) : v
      return Number.isFinite(n as number) ? Number(n) : 0
    }, z.number()),
    completed: z.preprocess((v) => Boolean(v), z.boolean()),
  }),
)

type Values = {
  title: string
  description: string
  imageUrl: string
  tags: string
  priority: number
  completed: boolean
}

type FieldKey = keyof Values

const { handleSubmit, isSubmitting, setFieldError, resetForm } = useForm<Values>({
  validationSchema: schema,
  initialValues: { title: '', description: '', imageUrl: '', tags: '', priority: 0, completed: false },
})

watch(
  () => props.task,
  (task) => {
    resetForm({
      values: {
        title: task.title ?? '',
        description: task.description ?? '',
        imageUrl: task.imageUrl ?? '',
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
        priority: Number(task.priority) || 0,
        completed: Boolean(task.completed),
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
      : []

    await props.submitUpdateTask({
      id: props.task.id,
      title: values.title,
      description: values.description.trim() ? values.description.trim() : null,
      imageUrl: values.imageUrl.trim() ? values.imageUrl.trim() : null,
      tags: tags.length ? tags : null,
      priority: Number(values.priority) || 0,
      completed: Boolean(values.completed),
    })

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
          if (lower.includes('priority') || lower.includes('number')) {
            setFieldError('priority', msg)
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
</script>

<template>
  <form id="update-task-form" class="space-y-4" @submit="onSubmit">
    <FieldSet>
      <FieldGroup class="grid w-full items-center gap-4">
        <VeeField v-slot="{ errors, field }" name="title" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="title">Title</FieldLabel>
            <Input v-bind="field" id="title" :placeholder="props.task.title" :aria-invalid="!!errors.length" type="text" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="description" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="description">Description</FieldLabel>
            <UiFieldDescription>Optional (clear to remove)</UiFieldDescription>
            <Input v-bind="field" id="description" :placeholder="String(props.task.description ?? '')" :aria-invalid="!!errors.length" type="text" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="imageUrl" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="imageUrl">Image URL</FieldLabel>
            <UiFieldDescription>Optional (clear to remove)</UiFieldDescription>
            <Input v-bind="field" id="imageUrl" :placeholder="String(props.task.imageUrl ?? '')" :aria-invalid="!!errors.length" type="url" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="tags" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="tags">Tags</FieldLabel>
            <UiFieldDescription>Optional, comma-separated (clear to remove)</UiFieldDescription>
            <Input v-bind="field" id="tags" :placeholder="Array.isArray(props.task.tags) ? props.task.tags.join(', ') : ''" :aria-invalid="!!errors.length" type="text" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ errors, field }" name="priority" :validate-on-model-update="false">
          <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
            <FieldLabel for="priority">Priority</FieldLabel>
            <Input v-bind="field" id="priority" :placeholder="String(props.task.priority ?? 0)" :aria-invalid="!!errors.length" type="number" min="0" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field }" name="completed" :validate-on-model-update="false">
          <Field class="flex items-center gap-2">
            <Checkbox :id="field.name" :name="field.name" :model-value="field.value" @update:model-value="field.onChange" />
            <FieldLabel :for="field.name">Completed</FieldLabel>
          </Field>
        </VeeField>
      </FieldGroup>
    </FieldSet>

    <div class="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" :disabled="isSubmitting" @click="emits('cancel')">Cancel</Button>
      <Button type="submit" :disabled="isSubmitting">Save</Button>
    </div>
  </form>
</template>
