import axios from 'axios'
import { getErrorMessage } from '@/shared/helpers/getErrorMessage.ts'

type FieldErrorResponse<TField extends string> = {
  field?: TField
  message?: string
}

type ApplyFieldErrorOptions<TField extends string> = {
  fallbackFields?: TField[]
}

export const applyFieldError = <TField extends string>(
  error: unknown,
  setFieldError: (field: TField, message: string) => void,
  options?: ApplyFieldErrorOptions<TField>,
): void => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as FieldErrorResponse<TField> | undefined

    if (data?.field && data.message) {
      setFieldError(data.field, data.message)
      return
    }

    if (options?.fallbackFields?.length) {
      const message = data?.message ?? getErrorMessage(error)

      options.fallbackFields.forEach((field) => {
        setFieldError(field, message)
      })
    }

    return
  }

  if (options?.fallbackFields?.length) {
    const message = getErrorMessage(error)

    options.fallbackFields.forEach((field) => {
      setFieldError(field, message)
    })
  }
}
