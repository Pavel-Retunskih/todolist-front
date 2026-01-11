// Shared API utilities

export const apiUtils = {
  createHeaders: (token?: string): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  },

  handleApiError: (error: unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message)
    }
    return 'An unexpected error occurred'
  },

  createQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    
    return searchParams.toString()
  }
}

export type ApiUtils = typeof apiUtils
