<script setup></script>

<template>
  <div class="w-full border rounded-lg overflow-auto shadow-lg bg-white">
    <slot name="image">
      <!-- <img class="w-full" src="https://via.placeholder.com/150" alt="Default Image" /> -->
    </slot>
    <div class="px-3 md:px-6 py-4">
      <slot name="title">
        <!-- <div class="font-bold text-xl mb-2">Default Title</div> -->
      </slot>
      <slot>
        <p class="text-gray-700 text-base">Default description of the card.</p>
      </slot>
    </div>
    <!-- <div class="px-6 py-4">
      <slot name="tags">
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >
          
        </span>
      </slot>
    </div> -->
  </div>
</template>

<style scoped></style>
