<script setup>
import { ref } from "vue";
import WizardComp from "../components/WizardComp.vue";
import CardComp from "../components/CardComp.vue";

import Step1 from "@/components/Step1.vue";
import Step2 from "@/components/Step2.vue";

const steps = [
  { title: "Step 1", component: Step1 },
  { title: "Step 2", component: Step2 },
];
</script>

<template>
  <main class="container mx-auto my-14">
    <div class="w-full lg:w-2/3 mx-auto px-4">
      <CardComp>
        <WizardComp :steps="steps" />
      </CardComp>
    </div>
  </main>
</template>
