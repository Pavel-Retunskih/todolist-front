<script setup lang="ts">
import SigninImage from '@/assets/images/SigninImage.png'
import PasswordIcon from '@/assets/icons/password-icon.vue'
import InputUi from '@/shared/input/input-ui.vue'
import EmailIcon from '@/assets/icons/email-icon.vue'
import { useSignIn } from '@/view/signin/model/useSignIn.ts'
import { useSignInForm } from '@/view/signin/model/useSignInForm.ts'
import CheckboxUi from '@/shared/checkbox/checkbox-ui.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/shared/ui/button'

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

// Pass { disableTransition: false } to enable transitions
const mode = useColorMode()
</script>

<template>
  <div>
    <div class="container">
      <div class="form-container">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                <Icon
                  icon="radix-icons:moon"
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Icon
                  icon="radix-icons:sun"
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="mode = 'light'"> Light</DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'dark'"> Dark</DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'auto'"> System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h1>Sign In</h1>

        <Button type="submit">Login</Button>
        <div class="links">
          <span>Don’t have an account? <router-link to="/signup">Create One</router-link></span>
          <span
            >Forgot Password? <router-link to="/forgot-password">Reset Password</router-link></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
