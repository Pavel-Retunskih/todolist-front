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
      <form>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div class="flex flex-col space-y-1.5">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <Input id="password" type="password" />
          </div>
          <div class="flex flex-col space-y-1.5">
            <div class="flex items-center">
              <Label for="password">Confirm Password</Label>
            </div>
            <Input id="password" type="password" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex flex-col gap-2">
      <Button variant="outline" class="w-full border-none cursor-pointer"> Register</Button>
    </CardFooter>
  </Card>
</template>
