<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, ListTodo, Star, FolderKanban, Settings2 } from 'lucide-vue-next'
import { Avatar } from '@/shared/ui/avatar'

const router = useRouter()
const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Vital Task', to: '/vital', icon: Star },
  { label: 'My Tasks', to: '/tasks', icon: ListTodo },
  { label: 'Task Categories', to: '/tasks-category', icon: FolderKanban },
  { label: 'Settings', to: '/settings', icon: Settings2 },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="flex w-full max-w-xs flex-col border-r border-border bg-card px-5 py-6 shadow-md">
    <div class="flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-4 shadow-sm">
      <Avatar class="h-16 w-16 rounded-full ring-2 ring-border shadow-md" />
      <div class="text-center">
        <p class="text-sm font-semibold">FirstName LastName</p>
        <p class="text-xs text-muted-foreground">email@email.com</p>
      </div>
    </div>

    <nav class="mt-6 flex-1 space-y-1.5">
      <button
        v-for="item in navItems"
        :key="item.to"
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
        :class="
          isActive(item.to)
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
        "
        @click="router.push(item.to)"
      >
        <component :is="item.icon" class="h-5 w-5" />
        <span class="truncate">{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>
