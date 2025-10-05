<script setup lang="ts">
import { ref, type VNode } from 'vue'
import { Eye } from 'lucide-vue-next'
import { EyeClosed } from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false,
})
defineProps<{
  placeholder: string
  error?: string
}>()
defineSlots<{
  icon: () => VNode
}>()
const modelValue = defineModel<string>({ required: true })
const isShowPassword = ref(false)

const handleTogglePassword = () => {
  isShowPassword.value = !isShowPassword.value
}
</script>

<template>
  <div class="input-field">
    <div class="input-container">
      <span v-if="$slots.icon" class="icon">
        <slot name="icon" />
      </span>
      <input
        v-if="isShowPassword"
        v-model="modelValue"
        type="text"
        :placeholder="placeholder"
        :class="{ 'with-icon': $slots.icon, default: true }"
      />
      <input
        v-else
        v-model="modelValue"
        v-bind="$attrs"
        :placeholder="placeholder"
        :class="{
          'with-icon': $slots.icon,
          default: true,
        }"
      />
      <div v-if="$attrs.type === 'password'" class="toggle-password-vision-icon">
        <EyeClosed
          v-if="!isShowPassword"
          class="password-toggle-icon"
          @click="handleTogglePassword"
        />
        <Eye v-else class="password-toggle-icon" @click="handleTogglePassword" />
      </div>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.input-field {
  position: relative;
  margin-bottom: 4px;
}

.input-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.toggle-password-vision-icon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

input {
  width: 100%;
  padding: 18px 12px;
  border-radius: 8px;
  border: 1px solid #565454;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: #212427;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border: 2px solid #212427;
    outline: none;
  }
}

input.with-icon {
  padding-left: 70px;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
