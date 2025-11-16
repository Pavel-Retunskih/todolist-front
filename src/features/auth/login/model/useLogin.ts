import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useRouter } from 'vue-router'

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(5, 'Bug title must be at least 5 characters.')
      .max(32, 'Bug title must be at most 32 characters.'),
    password: z
      .string()
      .min(20, 'Description must be at least 20 characters.')
      .max(100, 'Description must be at most 100 characters.'),
  }),
)

export function useLogin() {
  const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/auth/login`, {
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
        console.log('Login failed. Please try again. 400 Bad Request')
      }
      const data = await response.json()
      console.log('Login data:', data)
      if (data.accessToken) {
        await router.push({ path: '/dashboard' })
        console.log('Registration successful. Access token:', data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
      }
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  })
  return {
    onSubmit,
  }
}
