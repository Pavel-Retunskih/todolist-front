<script setup lang="ts">
import SignUpImage from '@/assets/images/SignUpImage.png'
import InputUi from '@/shared/input/input-ui.vue'
import EmailIcon from '@/assets/icons/email-icon.vue'
import PasswordIcon from '@/assets/icons/password-icon.vue'
import PasswordConfirmIcon from '@/assets/icons/password-confirm-icon.vue'
import CheckboxUi from '@/shared/checkbox/checkbox-ui.vue'
import { useSignUp } from '@/view/signup/model/useSignUp.ts'
import { useSignUpForm } from '@/view/signup/model/useSignUpForm.ts'

const { signup } = useSignUp()
const {
  isSubmitting,
  handleSubmit,
  errorMessage,
  email,
  password,
  passwordConfirm,
  isTermsChecked,
} = useSignUpForm()
const onSubmitForm = () => {
  handleSubmit(async ({ email, password }) => {
    try {
      await signup({ email, password })
    } catch (error) {
      console.error(error)
    }
  })
}
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

          <checkbox-ui v-model="isTermsChecked" type="checkbox">
            <template #label>I agree to all terms</template>
          </checkbox-ui>

          <button class="submit-button" :disabled="isSubmitting" @click="onSubmitForm">
            Register
          </button>
          <p>
            Already have an account?
            <router-link to="signin">Sign In</router-link>
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
