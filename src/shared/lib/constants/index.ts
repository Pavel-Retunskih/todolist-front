// Shared application constants

export const APP_CONSTANTS = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  APP_NAME: 'TodoList App',
  APP_VERSION: '1.0.0',
  
  TASK_PRIORITIES: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4
  } as const,
  
  TASK_STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed'
  } as const,
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  } as const,
  
  LOCAL_STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_PREFERENCES: 'user_preferences'
  } as const,
  
  ANIMATION_DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  } as const,
  
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  } as const
} as const

export type TaskPriority = typeof APP_CONSTANTS.TASK_PRIORITIES[keyof typeof APP_CONSTANTS.TASK_PRIORITIES]
export type TaskStatus = typeof APP_CONSTANTS.TASK_STATUS[keyof typeof APP_CONSTANTS.TASK_STATUS]
