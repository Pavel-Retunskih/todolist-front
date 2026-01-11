<script setup lang="ts">
import { AppHeader } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
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
