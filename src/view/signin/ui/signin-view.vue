<script setup lang="ts">
import SigninImage from '@/assets/images/SigninImage.png'
import PasswordIcon from '@/assets/icons/password-icon.vue'
import InputUi from '@/shared/input/input-ui.vue'
import EmailIcon from '@/assets/icons/email-icon.vue'
import { useSignIn } from '@/view/signin/model/useSignIn.ts'
import { useSignInForm } from '@/view/signin/model/useSignInForm.ts'
import CheckboxUi from '@/shared/checkbox/checkbox-ui.vue'

const { loginFetch } = useSignIn()
const { errorMessage, email, password, isRememberMe, handleSubmit } = useSignInForm()
const onSubmit = () => {
  handleSubmit(() =>
    loginFetch({
      email: email.value,
      password: password.value,
      isRememberMe: isRememberMe.value,
    }),
  )
}
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="form-container">
        <h1>Sign In</h1>
        <form @submit.prevent="onSubmit">
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
          <checkbox-ui>
            <template #label> Remember Me</template>
          </checkbox-ui>
          <button class="submit-button" type="submit">Login</button>
        </form>
        <div class="links">
          <span>Don’t have an account? <router-link to="/signup">Create One</router-link></span>
          <span
            >Forgot Password? <router-link to="/forgot-password">Reset Password</router-link></span
          >
        </div>
      </div>
      <div class="image-container">
        <img :src="SigninImage" alt="Sign in image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fc7272;
}

.container {
  padding-top: 145px;
  padding-left: 50px;
  display: flex;
  max-width: 1236px;
  width: 100%;
  height: 767px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  box-shadow:
    124px 100px 45px 0 rgba(0, 0, 0, 0),
    80px 64px 41px 0 rgba(0, 0, 0, 0.01),
    45px 36px 34px 0 rgba(0, 0, 0, 0.02),
    20px 16px 26px 0 rgba(0, 0, 0, 0.03),
    5px 4px 14px 0 rgba(0, 0, 0, 0.04);
}

h1 {
  color: #212427;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

.form-container {
  width: 50%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-container {
  width: 50%;
  flex: 1;
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

.links {
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
