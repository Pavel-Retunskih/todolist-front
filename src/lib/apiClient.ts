import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1'

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

let refreshPromise: Promise<string> | null = null

function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken')

  const isOnAuthRoute = window.location.pathname.startsWith('/signin')
  if (isOnAuthRoute) return

  const redirect = encodeURIComponent(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  )
  window.location.assign(`/signin?redirect=${redirect}`)
}

async function refreshAccessToken(): Promise<string> {
  const { data } = await refreshClient.post('/auth/refresh')
  const nextAccessToken = data?.accessToken
  if (!nextAccessToken || typeof nextAccessToken !== 'string') {
    throw new Error('Refresh endpoint did not return accessToken')
  }
  localStorage.setItem('accessToken', nextAccessToken)
  return nextAccessToken
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers = AxiosHeaders.from(config.headers)
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest = error.config

    type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

    if (!originalRequest || status !== 401) {
      return Promise.reject(error)
    }

    const retryableRequest = originalRequest as RetryableRequestConfig

    const url = originalRequest.url ?? ''
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register')
    const isRefreshRoute = url.includes('/auth/refresh')
    if (isAuthRoute || isRefreshRoute) {
      clearAuthAndRedirect()
      return Promise.reject(error)
    }

    if (retryableRequest._retry) {
      clearAuthAndRedirect()
      return Promise.reject(error)
    }
    retryableRequest._retry = true

    try {
      refreshPromise ??= refreshAccessToken()
      const nextToken = await refreshPromise

      retryableRequest.headers = AxiosHeaders.from(retryableRequest.headers)
      retryableRequest.headers.set('Authorization', `Bearer ${nextToken}`)

      return await apiClient.request(retryableRequest)
    } catch (refreshError) {
      clearAuthAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      refreshPromise = null
    }
  },
)
