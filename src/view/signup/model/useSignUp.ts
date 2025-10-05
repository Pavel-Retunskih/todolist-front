import { useRouter } from 'vue-router'

type User = {
  email: string
  password: string
}

export const useSignUp = () => {
  const router = useRouter()
  const signup = async ({ email, password }: User) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/auth/register`, {
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
        console.log('Registration failed. Please try again. 400 Bad Request')
      }
      const data = await response.json()
      console.log('Registration data:', data)
      if (data.accessToken) {
        await router.push({ path: '/dashboard' })
        console.log('Registration successful. Access token:', data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
      }
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    signup,
  }
}
