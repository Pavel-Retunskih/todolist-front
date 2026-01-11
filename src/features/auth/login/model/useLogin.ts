import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { apiClient } from '@/shared/lib/api'
import { applyFieldError } from '@/shared/helpers/applyFieldError.ts'
import { passwordSchema } from '@/shared/validation/passwordSchema'
import { useAuthStore } from '@/features/auth/model/auth.store'

const loginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
  isRememberMe: z.boolean(),
})

const formSchema = toTypedSchema(loginSchema)

type LoginValues = z.infer<typeof loginSchema>
type LoginField = keyof LoginValues

export function useLogin() {
  const { handleSubmit, setFieldError, isSubmitting } = useForm({
    validationSchema: formSchema,
    initialValues: {
      email: '',
      password: '',
      isRememberMe: false,
    },
  })
  const router = useRouter()
  const authStore = useAuthStore()

  const onSubmit = handleSubmit(async ({ email, password, isRememberMe }) => {
    try {
      const { data } = await apiClient.post('/auth/login', {
        email,
        password,
        rememberMe: isRememberMe,
      })
      if (data.accessToken) {
        authStore.setToken(data.accessToken)
        await router.push({ path: '/dashboard' })
      }
    } catch (error) {
      applyFieldError<LoginField>(error, setFieldError, {
        fallbackFields: ['email', 'password'],
      })
      console.error('Error', error)
    }
  })
  return {
    onSubmit,
    isSubmitting,
  }
}
