<script setup lang="ts">
import InputUi from '@/shared/input/input-ui.vue'
import { ref } from 'vue'
import { Input } from '@/shared/ui/input'

const search = ref('')
</script>

<template>
  <header
    class="flex items-center justify-between w-full h-[100px] px-[75px] py-[38px] bg-card border-b border-border shadow-sm"
  >
    <span class="font-semibold">Dashboard</span>
    <div class="search">
      <Input v-model="search" placeholder="Search your task here..." class="searchInput" />
    </div>

    <div>
      <div>
        <button>колокольчик</button>
        <button>календарь</button>
      </div>

      <span>Дата</span>
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
