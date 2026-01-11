import axios from 'axios'
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/shared/types/auth/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export const authApi = {
  // Login user
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, payload)
    return response.data
  },

  // Register user
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, payload)
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    })
    return response.data
  },

  // Logout
  logout: async (): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/logout`)
  },

  // Get current user
  getCurrentUser: async (): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`)
    return response.data
  },

  // Update user profile
  updateProfile: async (payload: any): Promise<any> => {
    const response = await axios.patch(`${API_BASE_URL}/auth/profile`, payload)
    return response.data
  },

  // Change password
  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/change-password`, payload)
  }
}
