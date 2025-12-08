<script setup lang="ts">
import { computed, ref, useAttrs, type HTMLAttributes } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  type?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const attrs = useAttrs()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const isPasswordType = computed(() => props.type === 'password')
const isPasswordVisible = ref(false)

const inputType = computed(() => {
  if (isPasswordType.value) {
    return isPasswordVisible.value ? 'text' : 'password'
  }

  return props.type
})
</script>

<template>
  <div class="relative w-full">
    <input
      v-bind="attrs"
      v-model="modelValue"
      :type="inputType"
      data-slot="input"
      :class="
        cn(
          'shadow-sm shadow-white inset-shadow-black/10 dark:shadow-white/10 inset-shadow-sm dark:inset-shadow-black/20 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md  bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          isPasswordType && 'pr-9',
          props.class,
        )
      "
    />
    <button
      v-if="isPasswordType"
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground hover:text-foreground"
      @click="isPasswordVisible = !isPasswordVisible"
    >
      <Eye v-if="!isPasswordVisible" class="h-4 w-4" />
      <EyeOff v-else class="h-4 w-4" />
    </button>
  </div>
</template>
