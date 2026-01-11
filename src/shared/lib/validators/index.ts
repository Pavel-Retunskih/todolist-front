// Shared validation utilities

export const validators = {
  email: (email: string): { isValid: boolean; error?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' }
    }
    return { isValid: true }
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  url: (url: string): { isValid: boolean; error?: string } => {
    try {
      new URL(url)
      return { isValid: true }
    } catch {
      return { isValid: false, error: 'Please enter a valid URL' }
    }
  },

  required: (value: unknown, fieldName: string): { isValid: boolean; error?: string } => {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: `${fieldName} is required` }
    }
    return { isValid: true }
  },

  minLength: (value: string, min: number, fieldName: string): { isValid: boolean; error?: string } => {
    if (value.length < min) {
      return { isValid: false, error: `${fieldName} must be at least ${min} characters` }
    }
    return { isValid: true }
  },

  maxLength: (value: string, max: number, fieldName: string): { isValid: boolean; error?: string } => {
    if (value.length > max) {
      return { isValid: false, error: `${fieldName} must not exceed ${max} characters` }
    }
    return { isValid: true }
  }
}

export type Validators = typeof validators
