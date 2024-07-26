<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl", "2xl"].includes(value),
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["close"]);

const modalSizeClass = ref("");

watch(
  () => props.size,
  (newSize) => {
    modalSizeClass.value =
      {
        sm: "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5",
        md: "w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4",
        lg: "w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5",
        xl: "w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2",
        "2xl": "w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3",
      }[newSize] || "w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4";
  },
  { immediate: true }
);

const closeModal = () => {
  emits("close");
};
</script>

<template>
  <div
    v-if="visible"
    class="fixed modal inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-1"
  >
    <div
      :class="modalSizeClass"
      class="relative bg-white rounded-lg shadow-lg h-auto max-h-screen overflow-hidden flex flex-col"
    >
      <!-- Close Button -->
      <button
        v-if="showCloseButton"
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="px-6 py-4">
        <slot name="header">
          <h3 class="text-xl font-semibold">Default Header</h3>
        </slot>
      </div>
      <div class="px-6 py-4 overflow-y-auto grow max-h-[80vh]">
        <slot name="body">
          <p class="text-gray-700">Default body content</p>
        </slot>
      </div>
      <div v-if="showFooter" class="px-3 py-2 md:px-6 md:py-4 border-t-2">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
