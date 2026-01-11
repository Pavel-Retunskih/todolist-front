<script setup lang="ts">
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

type StatsSnapshot = {
  total: number
  completed: number
  dueToday: number
  soon: number
  overdue: number
}

const props = defineProps<{
  stats: MaybeRefOrGetter<StatsSnapshot | { value: StatsSnapshot }>
  isLoading: boolean
}>()

const statsValue = computed<StatsSnapshot>(() => {
  return toValue(props.stats) as StatsSnapshot
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-5">
    <Card class="shadow-sm">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Total</CardTitle>
        <CardDescription>In this view</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold tracking-tight">
          {{ isLoading ? '—' : statsValue.total }}
        </p>
      </CardContent>
    </Card>

    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Done</CardTitle>
        <CardDescription>Completed</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold tracking-tight">
          {{ isLoading ? '—' : statsValue.completed }}
        </p>
      </CardContent>
    </Card>

    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Due today</CardTitle>
        <CardDescription>Deadline today</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold tracking-tight">
          {{ isLoading ? '—' : statsValue.dueToday }}
        </p>
      </CardContent>
    </Card>

    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Soon</CardTitle>
        <CardDescription>Inside window</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold tracking-tight">
          {{ isLoading ? '—' : statsValue.soon }}
        </p>
      </CardContent>
    </Card>

    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Overdue</CardTitle>
        <CardDescription>Not completed</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold tracking-tight">
          {{ isLoading ? '—' : statsValue.overdue }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
