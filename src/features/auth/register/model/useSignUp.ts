import { useRouter } from 'vue-router'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const formSchema = toTypedSchema(
  z
    .object({
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
      confirmPassword: z.string().min(8, { message: 'min 8' }).max(20, { message: 'max 20' }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: 'Confirm Password must match',
      path: ['confirmPassword'],
    }),
)

export const useSignUp = () => {
  const router = useRouter()
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
      const response = await fetch(`http://localhost:4000/api/v1/auth/register`, {
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      if (!response.ok) {
        const data = await response.json()
        setFieldError(data.field, data.message)
      }
      const data = await response.json()
      console.log('Registration data:', data)
      if (data.accessToken) {
        await router.push({ path: '/dashboard' })
        console.log('Registration successful. Access token:', data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
      }
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
    }
  })

  return {
    onSubmit,
    isSubmitting,
  }
}
