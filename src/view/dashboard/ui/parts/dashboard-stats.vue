<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

interface Props {
  totalTodolists: number
  totalTasks: number
  completionRate: number
  completedTasks: number
  isLoading: boolean
}

defineProps<Props>()
</script>

<template>
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
          {{ isLoading ? '—' : totalTasks }}
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
          {{ isLoading ? '—' : `${completionRate}%` }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ isLoading ? '—' : completedTasks }} completed tasks
        </p>
      </CardContent>
    </Card>
  </div>
</template>
