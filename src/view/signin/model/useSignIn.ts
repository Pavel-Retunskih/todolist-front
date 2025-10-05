import { useRouter } from 'vue-router'

type User = {
  email: string
  password: string
  isRememberMe: boolean
}

export const useSignIn = () => {
  const router = useRouter()
  const loginFetch = async ({ email, password, isRememberMe }: User) => {
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
  }

  return {
    loginFetch,
  }
}
