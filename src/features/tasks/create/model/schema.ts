import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const createTaskSchema = z.object({
  title: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().min(3, { message: 'Min 3 chars' }).max(50, { message: 'Max 50 chars' }),
  ),
  description: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z.string().min(3, { message: 'Min 3 chars' }).max(200, { message: 'Max 200 chars' }).optional(),
  ),
  imageUrl: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z.string().url({ message: 'Invalid URL' }).optional(),
  ),
  tags: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
    z
      .string()
      .max(200, { message: 'Max 200 chars' })
      .optional()
      .refine(
        (value) => {
          if (!value) return true
          return value.split(',').every((t) => t.trim().length > 0)
        },
        {
          message: 'Tags must be comma-separated without empty values',
        },
      ),
  ),
})

export const schema = toTypedSchema(createTaskSchema)

export type Values = z.infer<typeof createTaskSchema>
