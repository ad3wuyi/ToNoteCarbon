<script setup>
import { ref } from "vue";
import WizardComp from "../components/WizardComp.vue";
import CardComp from "../components/CardComp.vue";

import UserForm from "@/components/UserForm.vue";
import AffidavitForm from "@/components/AffidavitForm.vue";
import TermAndAgreement from "@/components/TermAndAgreement.vue";

const steps = [
  { title: "Step 1", component: UserForm },
  { title: "Step 2", component: AffidavitForm },
  { title: "Step 3", component: TermAndAgreement },
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
