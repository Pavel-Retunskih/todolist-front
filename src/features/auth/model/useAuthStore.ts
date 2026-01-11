import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { authApi } from '../api/auth-api'
import type { AuthState, LoginPayload, RegisterPayload, User } from '@/shared/types/auth/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  // Actions
  const login = async (payload: LoginPayload) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.login(payload)
      
      user.value = response.user
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.register(payload)
      
      user.value = response.user
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (accessToken.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      error.value = null
      
      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const refreshTokenAction = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }
      
      const response = await authApi.refreshToken(refreshToken.value)
      
      user.value = response.user
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      
      // Update localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (err: any) {
      // Refresh failed, logout user
      await logout()
      throw err
    }
  }

  const initializeAuth = () => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    
    if (storedAccessToken && storedRefreshToken) {
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      
      // TODO: Validate token and get user info
      // For now, just set authenticated state
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user: readonly(user),
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated: readonly(isAuthenticated),
    
    // Actions
    login,
    register,
    logout,
    refreshTokenAction,
    initializeAuth,
    clearError,
  }
})
