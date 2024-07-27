<script setup>
import { ref, computed } from "vue";
import ArrowLeftSVG from "../assets/arrow-left.svg";

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
});

const currentStep = ref(0);
const componentRef = ref(null);

// Function to move to the next step
const nextStep = async () => {
  if (componentRef.value) {
    const isValid = await componentRef.value.validateAndSubmit();
    if (isValid) {
      currentStep.value++;
      window.scrollTo(0, 0);
    }
  }
};

// Function to go to the previous step
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo(0, 0); // Scroll to the top
  }
};

// Computed property to determine if the proceed button should be disabled
const isProceedDisabled = computed(() => {
  return !componentRef.value || !componentRef.value.isValid;
});
</script>

<template>
  <div class="m-auto">
    <!-- Dynamic component loading based on the current step -->
    <component :is="steps[currentStep]?.component" ref="componentRef" />

    <hr class="my-8" />

    <div class="flex justify-between my-4">
      <button @click="prevStep" :disabled="currentStep === 0" class="btn-prev flex items-center">
        <ArrowLeftSVG alt="Previous" /> &nbsp; Previous
      </button>
      <button @click="nextStep" :disabled="isProceedDisabled" class="btn-next">
        {{ currentStep == 2 ? "Submit" : "Proceed" }}
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
