<script setup lang="ts">

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['text', 'password', 'email'].includes(value)
  },
  customClass: {
    type: String,
    default: 'border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out w-full'
  },
  placeholder: {
    type: String,
    default: 'Enter text here'
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label v-show="props.label" class="block px-5 py-2 text-sm font-bold text-gray-700 mb-1">
    {{props.label}}
    </label>
  <input
    :value="props.modelValue"
    :class="props.customClass"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    @input="handleInput"
  />
</template>