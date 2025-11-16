<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { useLogin } from '@/features/auth/login/model/useLogin.ts'
import { Separator } from '@/shared/ui/separator'
import { FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/shared/ui/field'
import { Field as VeeField } from 'vee-validate'
import { Checkbox } from '@/shared/ui/checkbox'

const { onSubmit, isSubmitting } = useLogin()
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription> Enter your email below to login to your account</CardDescription>
      <CardAction>
        <Button variant="link" class="underline" as-child>
          <router-link to="signup">Sign Up</router-link>
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form id="login-form" @submit="onSubmit">
        <FieldSet>
          <FieldGroup class="grid w-full items-center gap-4">
            <VeeField v-slot="{ errors, field }" name="email" :validate-on-model-update="false">
              <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
                <FieldLabel for="email">Email</FieldLabel>
                <Input
                  v-bind="field"
                  id="email"
                  :aria-invalid="!!errors.length"
                  type="email"
                  placeholder="m@example.com"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
            <VeeField v-slot="{ errors, field }" name="password" :validate-on-model-update="false">
              <Field class="flex flex-col space-y-1.5" :data-invalid="!!errors.length">
                <FieldLabel for="password">Password</FieldLabel>

                <FieldDescription
                  >Password must contain uppercase letter, lowercase letter, number, special
                  character.</FieldDescription
                >
                <Input
                  id="password"
                  type="password"
                  v-bind="field"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
            <VeeField v-slot="{ field }" name="isRememberMe">
              <Field class="flex gap-2 items-center">
                <Checkbox
                  :id="field.name"
                  :name="field.name"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                />
                <FieldLabel :for="field.name">Remember me?</FieldLabel>
              </Field>
            </VeeField>
          </FieldGroup>
        </FieldSet>
      </form>
    </CardContent>
    <CardFooter class="flex flex-col gap-2 items-center">
      <Separator class="mb-12" />
      <Button
        variant="outline"
        class="w-full border-none cursor-pointer"
        type="submit"
        form="login-form"
        :disabled="isSubmitting"
      >
        Login</Button
      >
      <Button variant="outline" class="w-full border-none cursor-pointer">
        Login with Google
      </Button>
      <a href="#" class="block text-sm underline"> Forgot your password? </a>
    </CardFooter>
  </Card>
</template>
