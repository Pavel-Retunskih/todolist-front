<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/ui/number-field'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import ComboBox from '@/shared/ui/combobox/ComboBox.vue'

const props = defineProps<{
  selectedTodolistId: string
  todolistsOptions: { value: string; label: string }[]
  minPriority: string
  dueInDays: string
  hideCompleted: boolean
  comboDisabled?: boolean
  refreshDisabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedTodolistId', value: string): void
  (e: 'update:minPriority', value: string): void
  (e: 'update:dueInDays', value: string): void
  (e: 'update:hideCompleted', value: boolean): void
  (e: 'refresh'): void
  (e: 'reset'): void
}>()

const minPriorityFieldValue = computed<number | null>({
  get: () => {
    if (props.minPriority === '') return null
    const parsed = Number(props.minPriority)
    return Number.isNaN(parsed) ? null : parsed
  },
  set: (val) => {
    if (val === null || Number.isNaN(val)) {
      emit('update:minPriority', '')
      return
    }
    emit('update:minPriority', String(val))
  },
})

const dueInDaysFieldValue = computed<number | null>({
  get: () => {
    if (props.dueInDays === '') return null
    const parsed = Number(props.dueInDays)
    return Number.isNaN(parsed) ? null : parsed
  },
  set: (val) => {
    if (val === null || Number.isNaN(val)) {
      emit('update:dueInDays', '')
      return
    }
    emit('update:dueInDays', String(val))
  },
})

const handleSelectTodolist = (value: string | null) => {
  emit('update:selectedTodolistId', String(value ?? ''))
}

const applyMinPriorityPreset = (value: string) => {
  emit('update:minPriority', value)
}

const applyDueInDaysPreset = (value: string) => {
  emit('update:dueInDays', value)
}

const handleHideCompletedChange = (value: unknown) => {
  emit('update:hideCompleted', Boolean(value))
}

const handleRefresh = () => emit('refresh')
const handleReset = () => emit('reset')
</script>

<template>
  <Card class="shadow-md">
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-semibold">Filters</CardTitle>
      <CardDescription>Select todolist and thresholds for vital view.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Todolist</p>
          <ComboBox
            class="w-full"
            :options="todolistsOptions"
            :model-value="selectedTodolistId"
            :disabled="comboDisabled"
            @update:model-value="handleSelectTodolist"
          />
        </div>

        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Minimum Priority</p>
          <NumberField v-model="minPriorityFieldValue" :min="0" :step="1" clamp-value-on-blur>
            <NumberFieldContent>
              <NumberFieldInput inputmode="numeric" placeholder="4" />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" @click="applyMinPriorityPreset('0')">Any</Button>
            <Button size="sm" variant="outline" @click="applyMinPriorityPreset('3')">P3+</Button>
            <Button size="sm" variant="outline" @click="applyMinPriorityPreset('4')">P4+</Button>
            <Button size="sm" variant="outline" @click="applyMinPriorityPreset('5')">P5</Button>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Due in Days</p>
          <NumberField v-model="dueInDaysFieldValue" :min="0" :step="1" clamp-value-on-blur>
            <NumberFieldContent>
              <NumberFieldInput inputmode="numeric" placeholder="3" />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" @click="applyDueInDaysPreset('1')">1d</Button>
            <Button size="sm" variant="outline" @click="applyDueInDaysPreset('3')">3d</Button>
            <Button size="sm" variant="outline" @click="applyDueInDaysPreset('7')">7d</Button>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Options</p>
          <div class="flex items-center gap-2">
            <Checkbox
              :model-value="hideCompleted"
              @update:model-value="handleHideCompletedChange"
            />
            <span class="text-sm">Hide completed</span>
          </div>
        </div>

        <div class="flex items-end flex-col md:flex-row gap-2">
          <Button
            class="w-full"
            variant="outline"
            :disabled="refreshDisabled"
            @click="handleRefresh"
          >
            Refresh
          </Button>
          <Button class="w-full" variant="outline" @click="handleReset">Reset</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
