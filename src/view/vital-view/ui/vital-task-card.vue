<script setup lang="ts">
import { computed } from 'vue'
import { formatDue } from '@/shared/helpers/date.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Checkbox } from '@/shared/ui/checkbox'
import { Button } from '@/shared/ui/button'
import type { Task } from '@/shared/types/task/task.ts'
import { useMutationState } from '@tanstack/vue-query'

const props = defineProps<{
  task: Task
}>()
const emit = defineEmits<{
  (event: 'update', task: Task): void
  (event: 'delete', task: Task): void
  (event: 'snooze', task: Task): void
}>()
const toggleDoneMutationState = useMutationState({
  filters: {
    mutationKey: ['toggleDoneTask', props.task.todolistId],
    status: 'pending',
  },
  select: (mutation) => {
    const variables = mutation.state.variables as Partial<Task> | undefined
    return variables?.id === props.task.id
  },
})

const deleteTaskMutationState = useMutationState({
  filters: {
    mutationKey: ['deleteTask', props.task.todolistId],
    status: 'pending',
  },
  select: (mutation) => {
    const variables = mutation.state.variables as Partial<Task> | undefined
    return variables?.id === props.task.id
  },
})

const snoozeMutationState = useMutationState({
  filters: {
    mutationKey: ['snoozeTask', props.task.todolistId],
    status: 'pending',
  },
  select: (mutation) => {
    const variables = mutation.state.variables as Partial<Task> | undefined
    return variables?.id === props.task.id
  },
})

const isToggleDonePending = computed(() => toggleDoneMutationState.value.some(Boolean))
const isDeletePending = computed(() => deleteTaskMutationState.value.some(Boolean))
const isSnoozePending = computed(() => snoozeMutationState.value.some(Boolean))

const updateSnoozeTask = (task: Task, days: number): Task => {
  const next: Task = { ...task }
  next.dueDate = task.dueDate ? new Date(task.dueDate) : new Date()
  next.dueDate.setDate(next.dueDate.getDate() + days)
  return next
}
</script>

<template>
  <Card class="shadow-md">
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-semibold truncate">{{ props.task.title }}</CardTitle>
      <CardDescription class="flex flex-wrap gap-2">
        <Badge variant="outline">Priority: {{ props.task.priority }}</Badge>
        <Badge variant="outline">Due: {{ formatDue(props.task.dueDate) }}</Badge>
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Checkbox
            :model-value="Boolean(props.task.completed)"
            :disabled="isToggleDonePending"
            @update:model-value="
              () => emit('update', { ...props.task, completed: !props.task.completed })
            "
          />
          <p class="text-sm">Done</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          :disabled="isSnoozePending"
          @click="emit('snooze', updateSnoozeTask(props.task, 1))"
        >
          Snooze +1d
        </Button>
        <Button
          size="sm"
          variant="outline"
          :disabled="isSnoozePending"
          @click="emit('snooze', updateSnoozeTask(props.task, 3))"
        >
          Snooze +3d
        </Button>
        <Button
          size="sm"
          variant="destructive"
          :disabled="isDeletePending"
          @click="emit('delete', props.task)"
        >
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
