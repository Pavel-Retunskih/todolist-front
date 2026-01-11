import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { DashboardPage } from '@/pages/dashboard'
import { MainLayout } from '@/widgets/layout'
import { SigninPage } from '@/pages/signin'
import { SignupPage } from '@/pages/signup'
import { useAuthStore } from '@/features/auth/model/auth.store'
import { VitalPage } from '@/pages/vital'
import { TasksPage } from '@/pages/tasks'
import { TasksCategoryPage } from '@/pages/tasks-category'
import { SettingsPage } from '@/pages/settings'
import { TodolistPage } from '@/pages/todolist'

const ROUTES = {
  DASHBOARD: '/dashboard',
  VITAL: '/vital',
  TASKS: '/tasks',
  TASKS_CATEGORY: '/tasks-category',
  SETTINGS: '/settings',
  TODOLIST: '/todolists/:id',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
}

const routes: readonly RouteRecordRaw[] = [
  { path: '/', redirect: '/signin' },
  { path: ROUTES.SIGNUP, component: SignupPage, meta: { guestOnly: true } },
  { path: ROUTES.SIGNIN, component: SigninPage, meta: { guestOnly: true } },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: ROUTES.DASHBOARD,
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.VITAL,
        name: 'Vital',
        component: VitalPage,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.TASKS,
        name: 'Tasks',
        component: TasksPage,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.TASKS_CATEGORY,
        name: 'Tasks Category',
        component: TasksCategoryPage,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.SETTINGS,
        name: 'Settings',
        component: SettingsPage,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.TODOLIST,
        name: 'Todolist',
        component: TodolistPage,
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
