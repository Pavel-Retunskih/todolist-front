<script setup lang="ts">
import type { VNode } from 'vue'

defineProps<{
  placeholder: string
  error: string
}>()
defineSlots<{
  icon: () => VNode
}>()
const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div class="input-root">
    <span v-if="$slots['icon']" class="icon"><slot name="icon" /></span>
    <input
      v-model="modelValue"
      :placeholder="placeholder"
      :class="{
        withIcon: $slots['icon'],
        default: true,
      }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.icon {
  position: absolute;
  top: 25%;
  left: 18px;
}

.default {
  width: 100%;
  padding-bottom: 20px;
  padding-top: 20px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #565454;
  outline: none;
}

.withIcon {
  padding-left: 70px;
}

.input-root {
  width: 100%;
  position: relative;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}
</style>
