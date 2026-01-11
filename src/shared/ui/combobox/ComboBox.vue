<script setup lang="ts">
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

const props = defineProps<{
  options: Array<{
    value: string
    label: string
  }>
  modelValue?: string
  disabled?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const open = ref(false)

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
)

function selectOption(selectedValue: string) {
  const nextValue = selectedValue === props.modelValue ? '' : selectedValue
  emit('update:modelValue', nextValue)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
        :disabled="props.disabled"
      >
        {{ selectedOption?.label || props.placeholder || 'Select option...' }}
        <ChevronsUpDownIcon class="opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="
                (ev) => {
                  selectOption(ev.detail.value as string)
                }
              "
            >
              <CheckIcon
                :class="
                  cn(
                    'mr-2 h-4 w-4',
                    props.modelValue === option.value ? 'opacity-100' : 'opacity-0',
                  )
                "
              />
              {{ option.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
