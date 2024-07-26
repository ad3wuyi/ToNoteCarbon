<template>
  <div class="flex flex-col lg:flex-row w-full">
    <div
      class="w-full mr-8 lg:w-1/4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible flex-nowrap whitespace-nowrap"
    >
      <div
        v-for="(tab, index) in tabTitles"
        :key="index"
        @click="activateTab(index)"
        class="flex items-center justify-center w-full md:justify-start py-2 px-2 md:px-4 cursor-pointer text-xs md:text-base"
        :class="[activeTab === index ? 'text-primary' : 'rounded-lg hover:text-primary']"
        role="tab"
        :aria-selected="activeTab === index"
        tabindex="0"
        @keydown.enter="activateTab(index)"
      >
        <span
          class="flex items-center justify-center mr-2 md:mr-4 border p-2 md:p-4 w-[20px] h-[20px] rounded-full"
          :class="[
            activeTab === index
              ? 'border-primary'
              : 'hover:border-primary hover:text-primary',
          ]"
        >
          {{ index + 1 }}
        </span>
        <span class="text-xs md:text-sm">{{ tab }}</span>
      </div>
    </div>

    <div class="w-full lg:w-3/4">
      <div
        v-for="(tab, index) in tabTitles"
        :key="index"
        v-show="activeTab === index"
        :id="`tab-${index}`"
        role="tabpanel"
        :aria-labelledby="`tab-${index}`"
        class=""
      >
        <slot :name="`tab-${index}`">
          <div>
            <h2>{{ tab }}</h2>
            <p>Default content for {{ tab }}</p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Props definition
const props = defineProps({
  tabTitles: {
    type: Array,
    required: true,
  },
});

// Reactive state
const activeTab = ref(0);

// Method to activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};
</script>

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
