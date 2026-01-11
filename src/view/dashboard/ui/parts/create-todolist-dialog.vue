<script setup lang="ts">
import { ref } from 'vue'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/ui/field'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { applyFieldError } from '@/shared/helpers/applyFieldError'

interface Props {
  isOpen: boolean
  isSubmitting: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', values: CreateTodolistValues): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const createTodolistSchema = z.object({
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
    z.string().min(5, { message: 'Min 5 chars' }).max(500, { message: 'Max 500 chars' }).optional(),
  ),
  imageUrl: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z.string().url({ message: 'Invalid URL' }).optional(),
  ),
})

const formSchema = toTypedSchema(createTodolistSchema)

type CreateTodolistValues = z.infer<typeof createTodolistSchema>
type CreateTodolistField = keyof CreateTodolistValues

const { handleSubmit, setFieldError, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    description: '',
    imageUrl: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values)
})

function setOpen(value: boolean) {
  emit('update:open', value)
  if (!value) resetForm()
}

function handleFieldError(error: unknown) {
  applyFieldError<CreateTodolistField>(error, setFieldError, {
    fallbackFields: ['title'],
  })
}

defineExpose({
  handleFieldError,
})
</script>

<template>
  <Dialog :open="isOpen" @update:open="setOpen">
    <DialogContent class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Create todolist</DialogTitle>
        <DialogDescription>Fill the fields below to create a new todolist</DialogDescription>
      </DialogHeader>

      <form id="create-todolist-form" class="mt-6" @submit="onSubmit">
        <FieldSet>
          <FieldGroup class="grid w-full items-center gap-4">
            <VeeField v-slot="{ errors, field }" name="title" :validate-on-model-update="false">
              <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
                <FieldLabel for="todolist-title">Title</FieldLabel>
                <Input
                  v-bind="field"
                  id="todolist-title"
                  :aria-invalid="!!errors.length"
                  type="text"
                  placeholder="Groceries"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField
              v-slot="{ errors, field }"
              name="description"
              :validate-on-model-update="false"
            >
              <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
                <FieldLabel for="todolist-description">Description</FieldLabel>
                <FieldDescription>Optional</FieldDescription>
                <Input
                  v-bind="field"
                  id="todolist-description"
                  :aria-invalid="!!errors.length"
                  type="text"
                  placeholder="Buy milk and bread"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField
              v-slot="{ errors, field }"
              name="imageUrl"
              :validate-on-model-update="false"
            >
              <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
                <FieldLabel for="todolist-image">Image URL</FieldLabel>
                <FieldDescription>Optional</FieldDescription>
                <Input
                  v-bind="field"
                  id="todolist-image"
                  :aria-invalid="!!errors.length"
                  type="url"
                  placeholder="https://example.com/image.png"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>
        </FieldSet>

        <div class="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" @click="setOpen(false)">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">Create</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
