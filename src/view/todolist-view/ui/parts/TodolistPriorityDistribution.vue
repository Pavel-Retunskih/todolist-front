<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Badge } from '@/shared/ui/badge'

const props = defineProps<{
  isTasksLoading: boolean
  prioritiesSummary: { priority: number; count: number }[]
  totalTasks: number
  priorityVariant: (priority: number) => string
}>()
</script>

<template>
  <Card class="shadow-md">
    <CardHeader>
      <CardTitle>Priority distribution</CardTitle>
      <CardDescription>Top priorities in this list</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="props.isTasksLoading" class="space-y-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-4/5" />
        <Skeleton class="h-4 w-3/5" />
      </div>
      <div v-else class="space-y-2">
        <div v-if="props.prioritiesSummary.length === 0" class="text-sm text-muted-foreground">No tasks yet</div>
        <div v-for="p in props.prioritiesSummary" :key="p.priority" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Badge :variant="props.priorityVariant(p.priority)">P{{ p.priority }}</Badge>
            <span class="text-sm text-muted-foreground">{{ p.count }} tasks</span>
          </div>
          <span class="text-sm font-medium">{{ Math.round((p.count / Math.max(props.totalTasks, 1)) * 100) }}%</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
