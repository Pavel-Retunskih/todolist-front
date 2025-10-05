<script setup lang="ts">
import InputUi from '@/shared/input/input-ui.vue'
import { ref } from 'vue'

const search = ref('')
</script>

<template>
  <header>
    <span>Dashboard</span>
    <div class="search">
      <input-ui v-model="search" placeholder="Search your task here..." class="searchInput" />
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

header {
  align-items: center;
  padding: 38px 75px 28px;
  display: flex;
  background: #f8f8f8;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.07);
  width: 100%;
  height: 100px;
  justify-content: space-between;
}
</style>
