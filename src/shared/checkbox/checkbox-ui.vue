<script setup lang="ts">
import { Checkbox } from '@ark-ui/vue/checkbox'
import { CheckIcon } from 'lucide-vue-next'
import type { VNode } from 'vue'

defineSlots<{
  label(): VNode
}>()
</script>

<template>
  <Checkbox.Root>
    <Checkbox.Control>
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Label>
      <slot name="label" style="color: black"></slot>
    </Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
<style scoped>
[data-scope='checkbox'][data-part='root'] {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &[data-disabled] {
    opacity: 0.5;
  }
}

[data-scope='checkbox'][data-part='group'] {
  display: flex;
  gap: 24px;
}

[data-scope='checkbox'][data-part='control'] {
  border: 2px solid;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  &[data-invalid] {
    border-color: red;
  }

  &[data-disabled] {
    background-color: #b7b7b7;
  }
}

[data-scope='checkbox'][data-part='indicator']:not([hidden]) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
