<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/shared/ui/input'
import moment from 'moment'
import { Bell } from 'lucide-vue-next'

const search = ref('')
const now = ref(moment().format('DD.MM.YYYY'))
</script>

<template>
  <header
    class="flex items-center text-muted-foreground justify-between w-full px-3 py-3 bg-card border-b border-border shadow-sm"
  >
    <span class="font-semibold">Dashboard</span>
    <div class="search">
      <Input v-model="search" placeholder="Search your task here..." class="searchInput" />
    </div>

    <div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-muted transition-colors"
          aria-label="Уведомления"
        >
          <Bell class="w-5 h-5" />
        </button>
        <span>{{ now }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.search {
  max-width: 695px;
  flex-grow: 1;
  max-height: 41px;
}

:deep(.searchInput) {
  padding: 10px;
}
</style>
