<script setup lang="ts">
import SignUpImage from '@/assets/images/SignUpImage.png'
import InputUi from '@/shared/input/input-ui.vue'
import EmailIcon from '@/assets/icons/email-icon.vue'
import PasswordIcon from '@/assets/icons/password-icon.vue'
import PasswordConfirmIcon from '@/assets/icons/password-confirm-icon.vue'
import { computed, ref } from 'vue'

const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const isTermsChecked = ref(false)
const errorMessage = ref({ email: '', password: '', passwordConfirm: '', terms: '' })
const isSubmitting = ref(false)

const validateForm = () => {
  errorMessage.value = { email: '', password: '', passwordConfirm: '', terms: '' }
  if (!validateEmail(email.value)) {
    errorMessage.value.email = 'Please enter a valid email address'
    return
  }

  if (!validatePassword(password.value)) {
    errorMessage.value.password =
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    return
  }

  if (!validatePasswordConfirm(password.value, passwordConfirm.value)) {
    errorMessage.value.passwordConfirm = 'Passwords do not match'
    return
  }

  if (!isTermsChecked.value) {
    errorMessage.value.terms = 'Please agree to the terms and conditions'
    return
  }
}
const handleSubmit = async () => {
  validateForm()

  if (formIsValid.value) {
    try {
      console.log('Submitting form...')
      isSubmitting.value = true
      const response = await fetch(`${import.meta.env.BASE_URL}`, {
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      if (response.ok) {
        console.log('Registration successful')
      }
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      isSubmitting.value = false
    }
  }
}

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

const validatePasswordConfirm = (password: string, passwordConfirm: string) => {
  return password === passwordConfirm
}

const formIsValid = computed(() => {
  return (
    validateEmail(email.value) &&
    validatePassword(password.value) &&
    validatePasswordConfirm(password.value, passwordConfirm.value) &&
    isTermsChecked.value
  )
})
</script>

<template>
  <div class="page">
    <div class="sign-up-container">
      <div class="image-container">
        <img :src="SignUpImage" alt="Signup image" />
      </div>
      <div class="sign-up-form-container">
        <h1>Sign Up</h1>
        <div class="form">
          <input-ui
            v-model="email"
            type="text"
            placeholder="Enter Email"
            :error="errorMessage.email"
            >\
            <template #icon>
              <EmailIcon />
            </template>
          </input-ui>
          <input-ui
            v-model="password"
            type="password"
            placeholder="Enter Password"
            :error="errorMessage.password"
          >
            <template #icon>
              <PasswordIcon />
            </template>
          </input-ui>
          <input-ui
            v-model="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            :error="errorMessage.passwordConfirm"
          >
            <template #icon>
              <PasswordConfirmIcon />
            </template>
          </input-ui>
          <div class="terms">
            <input id="terms" v-model="isTermsChecked" type="checkbox" />
            <label for="terms">I agree to all terms</label>
          </div>

          <button class="submit-button" :disabled="isSubmitting" @click="handleSubmit">
            Register
          </button>
          <p>
            Already have an account?
            <router-link to="auth/sign-in">Sign In</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fa7171;
}

.sign-up-container {
  display: flex;
  background: #fff;
  max-width: 1236px;
  width: 100%;
  padding-right: 40px;
  border-radius: 10px;
}

.image-container {
  width: 50%;
  padding-bottom: 10px;

  & img {
    margin-top: 105px;
    width: 433px;
    height: 652px;
  }
}

.sign-up-form-container {
  width: 50%;
  padding-top: 38px;
  padding-bottom: 28px;
}

.form {
  margin-top: 21px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

#terms {
  width: 18px;
  height: 18px;
}

.terms {
  display: flex;
  align-items: center;
  gap: 28px;

  & label,
  input {
    cursor: pointer;
  }
}

.submit-button {
  background: #ff9090;
  color: #fff;
  padding: 20px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background: #ff6a6a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
</style>
