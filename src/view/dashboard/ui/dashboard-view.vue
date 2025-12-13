<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useQueries } from '@tanstack/vue-query'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import HandIcon from '@/assets/icons/hand-icon.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { useTodolistQuery } from '@/entities/todolist/model/useTodolistQuery'
import { Skeleton } from '@/shared/ui/skeleton'
import { tasksApi } from '@/entities/tasks/api/tasks-api'
import type { Task } from '@/shared/types/task/task'
import TodolistCard from '@/entities/todolist/ui/todolist-card.vue'
import { Input } from '@/shared/ui/input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/ui/field'
import { applyFieldError } from '@/shared/helpers/applyFieldError'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet'

const router = useRouter()

const { todolistsQuery, createTodolistMutation } = useTodolistQuery()

const { data: todolists, isLoading, error } = todolistsQuery
console.log(todolists.value)
const todolistsList = computed(() => todolists.value ?? [])

const totalTodolists = computed(() => todolistsList.value.length)

const tasksQueriesOptions = computed(() =>
  todolistsList.value.map((list) => ({
    queryKey: ['tasks', list.id],
    queryFn: () => tasksApi.getTasksByTodolistId(list.id) as Promise<Task[]>,
  })),
)

const tasksQueries = useQueries({
  queries: tasksQueriesOptions,
})

const tasksQueryResults = computed(() => {
  const results = unref(tasksQueries)
  return Array.isArray(results) ? results : []
})

const tasksByTodolistId = computed<Record<string, Task[]>>(() => {
  return Object.fromEntries(
    todolistsList.value.map((list, index) => {
      const query = tasksQueryResults.value[index]
      const data = unref(query?.data)
      return [list.id, (data ?? []) as Task[]]
    }),
  )
})

const isTasksLoadingByTodolistId = computed<Record<string, boolean>>(() => {
  return Object.fromEntries(
    todolistsList.value.map((list, index) => {
      const query = tasksQueryResults.value[index]
      return [list.id, Boolean(unref(query?.isLoading))]
    }),
  )
})

const allTasks = computed(() => Object.values(tasksByTodolistId.value).flat())

const isAnyTasksLoading = computed(() =>
  tasksQueryResults.value.some((query) => Boolean(unref(query?.isLoading))),
)

const isTasksSummaryLoading = computed(() => Boolean(unref(isLoading)) || isAnyTasksLoading.value)

const totalTasks = computed(() => allTasks.value.length)

const completedTasks = computed(() => allTasks.value.filter((task) => task.completed).length)

const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0

  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const recentTasks = computed(() =>
  [...allTasks.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5),
)

const errorMessage = computed(() => {
  const err = error.value
  if (!err) return ''
  if (!(typeof err !== 'object') && 'message' in err) {
    return String((err as { message?: unknown }).message ?? 'Unknown error')
  }
  return String(err)
})

const isCreateTodolistOpen = ref(false)

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

const { handleSubmit, isSubmitting, setFieldError, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    description: '',
    imageUrl: '',
  },
})

const onCreateTodolistSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      title: values.title,
      description: values.description?.trim() ? values.description.trim() : undefined,
      imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : undefined,
    }

    await createTodolistMutation.mutateAsync(payload)
    resetForm()
    isCreateTodolistOpen.value = false
  } catch (e) {
    applyFieldError<CreateTodolistField>(e, setFieldError, {
      fallbackFields: ['title'],
    })
  }
})

function setCreateTodolistOpen(next: boolean) {
  isCreateTodolistOpen.value = next
  if (!next) resetForm()
}

function openCreateTodolist() {
  resetForm()
  setCreateTodolistOpen(true)
}
</script>

<template>
  <div class="grow flex justify-center items-start px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex w-full max-w-6xl flex-col gap-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, Sundar
          </span>
          <HandIcon />
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" @click="openCreateTodolist">New todolist</Button>
          <Button variant="outline">New task</Button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <Card class="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Todolists</CardTitle>
            <CardDescription>Total lists you manage</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">
              {{ isLoading ? '—' : totalTodolists }}
            </p>
          </CardContent>
        </Card>

        <Card class="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Tasks</CardTitle>
            <CardDescription>All tasks across your lists</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">
              {{ isTasksSummaryLoading ? '—' : totalTasks }}
            </p>
          </CardContent>
        </Card>

        <Card class="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Completion rate</CardTitle>
            <CardDescription>Done vs total tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-semibold tracking-tight">
              {{ isTasksSummaryLoading ? '—' : `${completionRate}%` }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ isTasksSummaryLoading ? '—' : completedTasks }} completed tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        <div class="space-y-4">
          <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card v-for="i in 6" :key="i" class="h-full shadow-md">
              <CardHeader class="pb-3">
                <Skeleton class="h-5 w-3/4" />
                <Skeleton class="h-4 w-full" />
              </CardHeader>
              <CardContent class="flex items-end justify-between pt-0 text-sm">
                <div class="space-y-1">
                  <Skeleton class="h-4 w-20" />
                  <Skeleton class="h-4 w-24" />
                </div>
                <div class="text-right">
                  <Skeleton class="h-4 w-12" />
                  <Skeleton class="mt-1 h-6 w-14" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div v-else-if="error" class="flex flex-col items-center justify-center gap-4">
            <p class="text-sm text-muted-foreground">
              Failed to load todolists: {{ errorMessage }}
            </p>
          </div>
          <div v-else>
            <div v-if="totalTodolists > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <button
                v-for="list in todolistsList"
                :key="list.id"
                type="button"
                class="text-left rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                @click="router.push(`/todolists/${list.id}`)"
              >
                <TodolistCard
                  :todolist="list"
                  :tasks="tasksByTodolistId[list.id] ?? []"
                  :is-tasks-loading="isTasksLoadingByTodolistId[list.id] ?? false"
                />
              </button>
            </div>
            <div v-else class="flex flex-col items-center justify-center gap-4">
              <p>No todolists yet. Start by creating your first one.</p>
              <Button variant="outline" @click="openCreateTodolist">New todolist</Button>
            </div>
          </div>
        </div>

        <div class="w-full space-y-4 md:max-w-xs md:ml-auto">
          <Card class="shadow-md">
            <CardHeader class="pb-3">
              <CardTitle class="text-base font-semibold">Recent tasks</CardTitle>
              <CardDescription>Latest activity across your lists</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div v-if="isTasksSummaryLoading" class="space-y-2">
                <Skeleton class="h-10 w-full" />
                <Skeleton class="h-10 w-full" />
                <Skeleton class="h-10 w-full" />
              </div>
              <div v-else-if="recentTasks.length === 0" class="text-sm text-muted-foreground">
                No tasks yet. Start by creating your first one.
              </div>
              <ul v-else class="space-y-2">
                <li
                  v-for="task in recentTasks"
                  :key="task.id"
                  class="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2.5 text-sm shadow-sm hover:shadow transition-shadow"
                >
                  <div class="mr-3 flex-1">
                    <p class="truncate font-medium">
                      {{ task.title }}
                    </p>
                  </div>
                  <span
                    class="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    :class="
                      task.completed
                        ? 'bg-emerald-400/20 text-emerald-200'
                        : 'bg-amber-400/20 text-amber-200'
                    "
                  >
                    {{ task.completed ? 'Done' : 'Open' }}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <Sheet :open="isCreateTodolistOpen" @update:open="setCreateTodolistOpen($event)">
      <SheetContent class="w-[420px] sm:w-[520px]">
        <SheetHeader>
          <SheetTitle>Create todolist</SheetTitle>
          <SheetDescription>Fill the fields below to create a new todolist</SheetDescription>
        </SheetHeader>

        <form id="create-todolist-form" class="mt-6" @submit="onCreateTodolistSubmit">
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
            <Button type="button" variant="outline" @click="setCreateTodolistOpen(false)"
              >Cancel</Button
            >
            <Button type="submit" :disabled="isSubmitting">Create</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  </div>
</template>
