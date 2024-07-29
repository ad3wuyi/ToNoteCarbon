<script setup>
import { ref, computed } from "vue";
import { useAffidavitFormStore } from "@/stores/affidavitFormStore";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const store = useAffidavitFormStore();

// Validation schema using yup
const schema = yup.object({
  initAgreement: yup.boolean().oneOf([true], "Kindly check the box").required(),
  agree: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required(),
});

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    agree: store.agree,
  },
});

const { value: initAgreement, errorMessage: initAgreementError } = useField(
  "initAgreement",
  yup.boolean().oneOf([true], "Kindly check the box").required()
);

const { value: agree, errorMessage: agreeError } = useField(
  "agree",
  yup.boolean().oneOf([true], "You must agree to the terms and conditions").required()
);

const validateAndSubmit = handleSubmit(async () => {
  store.setAgreement(agree);
  await store.uploadFiles();
  return true;
});

const isValid = computed(() => meta.value.valid);

defineExpose({
  validateAndSubmit,
  isValid,
});
</script>

<template>
  <div v-if="store.loading" class="overlay">
    <div class="glass-morphism">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
  <div v-else class="a4-size">
    <h2 class="text-primary font-bold text-lg mb-8">Agreement &amp; Confirmation</h2>

    <div class="border bg-gray-100 p-4 rounded">
      <div class="relative mb-6">
        <div class="flex items-center mb-6">
          <input
            v-model="initAgreement"
            id="init-agree-terms"
            type="checkbox"
            class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label
            for="init-agree-terms"
            class="ml-2 block font-bold text-lg text-gray-700"
          >
            By clicking this checkbox, you agree that:
          </label>
        </div>
        <span class="absolute bottom-[-20px] text-red-500">{{ initAgreementError }}</span>
      </div>

      <ul class="list-disc ml-6">
        <li>
          You understand the content of the document filled out on the previous page.
        </li>
        <li>You are completing this document of your own free will.</li>
        <li>You agree to use your electronic signature on this document</li>
        <li>
          You understand and agree that by signing the document, you legally bind yourself
          to its terms.
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <div class="flex items-center">
        <input
          v-model="agree"
          id="agree-terms"
          type="checkbox"
          class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label for="agree-terms" class="ml-2 block text-sm text-gray-700">
          I agree to Carbon's
          <a
            href="https://www.gettonote.com/terms"
            class="text-primary font-semibold"
            target="_blank"
          >
            Terms &amp; Conditions
          </a>
          as well as its
          <a
            href="https://www.gettonote.com/privacy"
            class="text-primary font-semibold"
            target="_blank"
          >
            Privacy Policy
          </a>
        </label>
      </div>
      <span class="text-red-500">{{ agreeError }}</span>
    </div>
  </div>
</template>

<style scoped>
.a4-size {
  max-width: 210mm;
  margin: 20px auto;
}
</style>
