import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardView from '@/view/dashboard/ui/dashboard-view.vue'
import MainLayout from '@/view/main-layout/ui/main-layout.vue'

import SigninView from '@/view/signin/ui/signin-view.vue'
import SignupView from '@/view/signup/ui/signup-view.vue'

const routes: readonly RouteRecordRaw[] = [
  { path: '/', redirect: '/signin' },
  { path: '/signup', component: SignupView },
  { path: '/signin', component: SigninView },
  {
    path: '/',
    component: MainLayout,
    children: [{ path: '/dashboard', name: 'Dashboard', component: DashboardView }],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})
