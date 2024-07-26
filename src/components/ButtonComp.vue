<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "danger", "success"].includes(value),
  },
  outline: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["click"]);

const sizeClasses = computed(() => {
  return {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  }[props.size];
});

const variantClasses = computed(() => {
  if (props.outline) {
    return {
      primary:
        "border border-primary text-primary bg-blue-50 hover:bg-primary hover:text-white focus:ring-primary",
      secondary:
        "border border-gray-500 text-gray-500 bg-gray-50 hover:bg-gray-500 hover:text-white focus:ring-gray-500",
      danger:
        "border border-red-500 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white focus:ring-red-500",
      success:
        "border border-green-500 text-green-500 bg-green-50 hover:bg-green-500 hover:text-white focus:ring-green-500",
    }[props.variant];
  } else {
    return {
      primary: "bg-primary text-white hover:bg-blue-600 focus:ring-primary",
      secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
      success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    }[props.variant];
  }
});

const onClick = (event) => {
  if (!props.disabled) {
    emits("click", event);
  }
};
</script>

<template>
  <button
    :class="[
      'rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150',
      sizeClasses,
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
    @click.stop="onClick"
  >
    <slot>Button</slot>
  </button>
</template>

<style scoped>
.button-outline {
  background-color: var(--color-background);
}
</style>
