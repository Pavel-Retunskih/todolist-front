<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Badge } from '@/shared/ui/badge'

const props = defineProps<{
  isTasksLoading: boolean
  totalTasks: number
  completionRate: number
  topTags: { tag: string; count: number }[]
}>()
</script>

<template>
  <div class="grid gap-4 md:grid-cols-3">
    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Tasks</CardTitle>
        <CardDescription>Total tasks in this list</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold tracking-tight">
          {{ props.isTasksLoading ? '—' : props.totalTasks }}
        </p>
      </CardContent>
    </Card>

    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Completion</CardTitle>
        <CardDescription>Completed vs total</CardDescription>
      </CardHeader>
      <CardContent class="space-y-2">
        <p class="text-3xl font-semibold tracking-tight">
          {{ props.isTasksLoading ? '—' : props.completionRate }}%
        </p>
        <div class="h-2 w-full rounded-full bg-muted">
          <div class="h-2 rounded-full bg-primary" :style="{ width: `${props.completionRate}%` }" />
        </div>
      </CardContent>
    </Card>

    <Card class="shadow-md">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Tags</CardTitle>
        <CardDescription>Most used</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="props.isTasksLoading" class="space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-4/5" />
          <Skeleton class="h-4 w-3/5" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <template v-if="props.topTags.length === 0">
            <p class="text-sm text-muted-foreground">No tags yet</p>
          </template>
          <template v-else>
            <Badge v-for="t in props.topTags" :key="t.tag" variant="outline">{{ t.tag }} · {{ t.count }}</Badge>
          </template>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
