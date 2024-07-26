<script setup>
import { ref } from "vue";
import ArrowLeftSVG from "../assets/arrow-left.svg";

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
});

const currentStep = ref(0);

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++;
    window.scrollTo(0, 0); // Scroll to the top
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo(0, 0); // Scroll to the top
  }
};
</script>

<template>
  <div class="m-auto">
    <div>
      <component :is="steps[currentStep].component" />
    </div>

    <hr class="my-8" />

    <div class="flex justify-between my-4">
      <button @click="prevStep" :disabled="currentStep === 0" class="btn-prev flex items-center">
        <ArrowLeftSVG alt="Previous" /> &nbsp; Previous
      </button>
      <button
        @click="nextStep"
        :disabled="currentStep === steps.length - 1"
        class="btn-next"
      >
        Proceed
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-prev,
.btn-next {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-prev {
  background-color: #ccc;
}

.btn-next {
  background-color: #003bb3;
  color: #fff;
}

.btn-prev:disabled,
.btn-next:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
