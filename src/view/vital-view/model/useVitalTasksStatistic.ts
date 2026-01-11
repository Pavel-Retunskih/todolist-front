import { computed, type Ref } from 'vue'
import type { Task } from '@/shared/types/task/task.ts'
import { toValidDate } from '@/shared/helpers/date.ts'

export function useVitalTasksStatistic({
  tasks,
  dueInDaysRaw,
}: {
  tasks: Ref<Task[]>
  dueInDaysRaw: Ref<string>
}) {
  return computed(() => {
    const dueInDays = Number(dueInDaysRaw.value)
    const total = tasks.value.length
    const completed = tasks.value.filter((t) => t.completed).length

    const nowTs = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const dueToday = tasks.value.filter((t) => {
      const d = toValidDate(t.dueDate)
      return d ? d.getTime() <= todayEnd.getTime() : false
    }).length

    const soon = tasks.value.filter((t) => {
      const d = toValidDate(t.dueDate)
      if (!d) return false
      if (!dueInDays && dueInDays !== 0) return false

      const ts = d.getTime()
      return ts > todayEnd.getTime() && ts <= nowTs + (dueInDays ?? 0) * dayMs
    }).length

    const overdue = tasks.value.filter((t) => {
      const d = toValidDate(t.dueDate)
      return d ? d.getTime() < nowTs && !t.completed : false
    }).length

    return { total, completed, dueToday, soon, overdue }
  })
}
