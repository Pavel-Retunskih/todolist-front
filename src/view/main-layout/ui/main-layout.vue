<script setup lang="ts">
import AppHeader from '@/widget/header/app-header.vue'
import Sidebar from '@/widget/sidebar/ui/sidebar-menu.vue'
</script>

<template>
  <div class="layout-root min-h-screen flex flex-col bg-background">
    <AppHeader />
    <div class="content flex flex-1">
      <Sidebar />
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped></style>
