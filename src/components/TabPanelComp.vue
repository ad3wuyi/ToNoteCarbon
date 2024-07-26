<script setup>
const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div v-if="isActive">
    <slot></slot>
  </div>
</template>
