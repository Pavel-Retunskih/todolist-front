import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AuthView from '@/view/auth/ui/AuthView.vue'

const routes: readonly RouteRecordRaw[] = [{ path: '/auth/', component: AuthView }]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})
