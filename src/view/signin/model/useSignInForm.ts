import { computed, ref } from 'vue'

export const useSignInForm = () => {
  const email = ref<string>('')
  const password = ref<string>('')
  const passwordConfirm = ref<string>('')
  const isRememberMe = ref(false)
  const errorMessage = ref({ email: '', password: '', passwordConfirm: '', terms: '' })
  const isSubmitting = ref(false)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(password)
  }
  const formIsValid = computed(() => {
    return validateEmail(email.value) && validatePassword(password.value)
  })
  const validateForm = () => {
    errorMessage.value = { email: '', password: '', passwordConfirm: '', terms: '' }
    if (!validateEmail(email.value)) {
      errorMessage.value.email = 'Please enter a valid email address'
    }

    if (!validatePassword(password.value)) {
      errorMessage.value.password =
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  }
  const handleSubmit = async (
    callback: ({ email, password }: { email: string; password: string }) => void,
  ) => {
    validateForm()

    if (formIsValid.value) {
      callback({ email: email.value, password: password.value })
    }
  }
  return {
    email,
    password,
    passwordConfirm,
    isRememberMe,
    errorMessage,
    isSubmitting,
    handleSubmit,
  }
}
