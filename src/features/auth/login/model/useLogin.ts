import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useRouter } from 'vue-router'

const formSchema = toTypedSchema(
  z.object({
    email: z.email(),
    password: z
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
      }),
    isRememberMe: z.boolean(),
  }),
)

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

  const onSubmit = handleSubmit(async ({ email, password, isRememberMe }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/auth/login`, {
        body: JSON.stringify({
          email: email,
          password: password,
          rememberMe: isRememberMe,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
      const data = await response.json()
      console.log('Login data:', data)
      if (data.accessToken) {
        await router.push({ path: '/dashboard' })
        console.log('Registration successful. Access token:', data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
      }
    } catch (error) {
      if (error instanceof Error) {
        setFieldError('email', error.message)
        setFieldError('password', error.message)
        console.error('Error', error)
      }
    }
  })
  return {
    onSubmit,
    isSubmitting,
  }
}
