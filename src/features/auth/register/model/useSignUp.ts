import { useRouter } from 'vue-router'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { apiClient } from '@/lib/apiClient'
import { applyFieldError } from '@/shared/helpers/applyFieldError.ts'
import { passwordSchema } from '@/shared/validation/passwordSchema'
import { useAuthStore } from '@/features/auth/model/auth.store'

const signUpSchema = z
  .object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string().min(8, { message: 'min 8' }).max(20, { message: 'max 20' }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'Confirm Password must match',
    path: ['confirmPassword'],
  })

const formSchema = toTypedSchema(signUpSchema)

type SignUpValues = z.infer<typeof signUpSchema>
type SignUpField = keyof SignUpValues

export const useSignUp = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const { handleSubmit, isSubmitting, setFieldError } = useForm({
    validationSchema: formSchema,
    initialValues: {
      password: '',
      email: '',
      confirmPassword: '',
    },
  })
  const onSubmit = handleSubmit(async ({ password, email }) => {
    try {
      const { data } = await apiClient.post('/auth/register', {
        email,
        password,
      })

      console.log('Registration data:', data)
      if (data.accessToken) {
        await router.push({ path: '/dashboard' })
        console.log('Registration successful. Access token:', data.accessToken)
        authStore.setToken(data.accessToken)
      }
    } catch (error) {
      applyFieldError<SignUpField>(error, setFieldError)
    }
  })

  return {
    onSubmit,
    isSubmitting,
  }
}
