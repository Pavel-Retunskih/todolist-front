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
import { Label } from '@/shared/ui/label'
import { Field, FieldError, FieldGroup, FieldSet } from '@/shared/ui/field'
import { Field as VeeField } from 'vee-validate'
import { useSignUp } from '@/features/auth/register/model/useSignUp.ts'

const { onSubmit, isSubmitting } = useSignUp()
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Register new account</CardTitle>
      <CardDescription>
        Enter your email and password below to register new account
      </CardDescription>
      <CardAction>
        <Button variant="link" as-child>
          <router-link to="signin">Sign In</router-link>
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form id="signup-form" @submit="onSubmit">
        <FieldSet>
          <FieldGroup class="grid w-full items-center gap-4">
            <VeeField v-slot="{ errors, field }" :validate-on-model-update="false" name="email">
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
            <VeeField v-slot="{ errors, field }" :validate-on-model-update="false" name="password">
              <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
                <FieldLabel for="password">Password</FieldLabel>

                <Input
                  v-bind="field"
                  id="password"
                  :aria-invalid="!!errors.length"
                  type="password"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
            <VeeField
              v-slot="{ errors, field }"
              :validate-on-model-update="false"
              name="confirmPassword"
            >
              <Field :data-invalid="!!errors.length" class="flex flex-col space-y-1.5">
                <Label for="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  v-bind="field"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>
        </FieldSet>
      </form>
    </CardContent>
    <CardFooter class="flex flex-col gap-2">
      <Button
        variant="outline"
        class="w-full border-none cursor-pointer"
        type="submit"
        form="signup-form"
        :disabled="isSubmitting"
      >
        Register</Button
      >
    </CardFooter>
  </Card>
</template>
