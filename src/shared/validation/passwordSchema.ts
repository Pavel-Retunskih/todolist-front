import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, { message: 'min 8' })
  .max(20, { message: 'max 20' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Must include uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Must include lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Must include number',
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Must include special character',
  })
