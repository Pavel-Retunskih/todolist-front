import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardView from '@/view/dashboard/ui/dashboard-view.vue'
import MainLayout from '@/view/main-layout/ui/main-layout.vue'

import SigninView from '@/view/signin/ui/signin-view.vue'
import SignupView from '@/view/signup/ui/signup-view.vue'
import { useAuthStore } from '@/features/auth/model/auth.store'
import VitalView from '@/view/vital-view/vital-view.vue'
import TasksView from '@/view/tasks-view/tasks-view.vue'
import TasksCategoryView from '@/view/tasks-category-view/tasks-category-view.vue'
import SettingsView from '@/view/settings-view/settings-view.vue'

const ROUTES = {
  DASHBOARD: '/dashboard',
  VITAL: '/vital',
  TASKS: '/tasks',
  TASKS_CATEGORY: '/tasks-category',
  SETTINGS: '/settings',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
}

const routes: readonly RouteRecordRaw[] = [
  { path: '/', redirect: '/signin' },
  { path: ROUTES.SIGNUP, component: SignupView, meta: { guestOnly: true } },
  { path: ROUTES.SIGNIN, component: SigninView, meta: { guestOnly: true } },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: ROUTES.DASHBOARD,
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.VITAL,
        name: 'Vital',
        component: VitalView,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.TASKS,
        name: 'Tasks',
        component: TasksView,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.TASKS_CATEGORY,
        name: 'Tasks Category',
        component: TasksCategoryView,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.SETTINGS,
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/signin', query: { redirect: to.fullPath } })
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next('/dashboard')
  }

  return next()
})
