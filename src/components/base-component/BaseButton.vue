<script lang="ts" setup>

const props = defineProps({
  customClass: {
    type: String,
    default:
      "mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 cursor-pointer",
  },
  type: {
    type: String,
    default: "button",
    validator: (value: string) => ["button", "submit"].includes(value),
  },
  name: {
    type: String,
    default: "Button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <button 
    :class="props.customClass" 
    :type="props.type" 
    :disabled="props.disabled"
    >
    <span>{{ props.name }}</span>
  </button>
</template>
