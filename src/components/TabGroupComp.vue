<script setup>
import { ref } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTabClass: {
    type: String,
    default: "bg-white text-blue-500",
  },
  inactiveTabClass: {
    type: String,
    default: "text-gray-500 hover:text-blue-500",
  },
});

const selectedIndex = ref(0);

function selectTab(index) {
  selectedIndex.value = index;
}
</script>

<template>
  <div>
    <ul class="flex bg-white py-2 overflow-x-auto">
      <li
        v-for="(tab, index) in tabs"
        :key="index"
        :class="[
          'p-1 md:p-2 cursor-pointer',
          selectedIndex === index ? activeTabClass : inactiveTabClass,
        ]"
        @click="selectTab(index)"
      >
        <slot name="tab" :tab="tab" :index="index" :isActive="selectedIndex">{{
          tab
        }}</slot>
      </li>
    </ul>

    <div class="py-4">
      <slot name="content" :selectedIndex="selectedIndex"></slot>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
