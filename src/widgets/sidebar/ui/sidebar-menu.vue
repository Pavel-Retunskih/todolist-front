<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, ListTodo, Star, FolderKanban, Settings2 } from 'lucide-vue-next'
import { Avatar } from '@/shared/ui/avatar'

const router = useRouter()
const route = useRoute()

const navItems = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Vital Task', to: '/vital', icon: Star },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'My Tasks', to: '/tasks', icon: ListTodo },
      { label: 'Task Categories', to: '/tasks-category', icon: FolderKanban },
      { label: 'Settings', to: '/settings', icon: Settings2 },
    ],
  },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside
    class="md:flex hidden w-full max-w-xs flex-col border-r border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80"
  >
    <div class="px-6 py-6">
      <div class="flex items-center gap-3">
        <Avatar class="h-11 w-11 bg-muted">
          <span class="text-sm font-semibold">SL</span>
        </Avatar>
        <div>
          <p class="text-sm font-semibold leading-tight">Sundar L.</p>
          <p class="text-xs text-muted-foreground">sundar@todolist.com</p>
        </div>
      </div>
      <p class="mt-4 text-xs text-muted-foreground">Team velocity +18% this week ⚡</p>
    </div>

    <div class="flex-1 space-y-6 px-4">
      <div v-for="section in navItems" :key="section.label" class="space-y-2">
        <p class="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ section.label }}
        </p>
        <nav class="space-y-1">
          <button
            v-for="item in section.items"
            :key="item.to"
            type="button"
            class="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="
              isActive(item.to)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground'
            "
            @click="router.push(item.to)"
          >
            <component
              :is="item.icon"
              class="h-4 w-4"
              :class="
                isActive(item.to)
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-accent-foreground'
              "
            />
            <span class="truncate">{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </div>

    <div class="border-t border-border px-6 py-4">
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>Workspace</span>
        <span class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">12 members</span>
      </div>
      <button
        type="button"
        class="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Invite teammate
      </button>
    </div>
  </aside>
</template>
