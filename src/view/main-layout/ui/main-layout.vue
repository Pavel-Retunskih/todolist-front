<script setup lang="ts">
import AppHeader from '@/widget/header/app-header.vue'
import Sidebar from '@/widget/sidebar/ui/sidebar-menu.vue'
</script>

<template>
  <AppHeader />
  <div class="content">
    <Sidebar />
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
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

.content {
  display: flex;
  background: #f5f8ff;
}
</style>
