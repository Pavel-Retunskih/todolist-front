import { defineStore } from 'pinia'

interface AuthState {
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    setToken(token: string | null) {
      this.accessToken = token

      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    },
    logout() {
      this.setToken(null)
    },
  },
})
