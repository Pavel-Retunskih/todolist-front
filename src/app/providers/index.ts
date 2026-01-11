// Global providers for the application

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Create and export instances
export const pinia = createPinia()

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Plugin for Vue app
export const appProviders = [
  pinia,
  VueQueryPlugin,
]

// Provider setup function
export const setupProviders = (app: ReturnType<typeof createApp>) => {
  appProviders.forEach(provider => app.use(provider))
  return app
}
