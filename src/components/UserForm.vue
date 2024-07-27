<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useUserFormStore } from "../stores/userFormStore";
import DropZone from "./DropZone.vue";
import { useForm, Field, ErrorMessage, defineRule } from "vee-validate";
import * as yup from "yup";

const formStore = useUserFormStore();

// Custom validation for file upload
const fileSchema = yup
  .mixed()
  .test("fileType", "Unsupported File Format", (value) => {
    return (
      value &&
      (value.type === "application/pdf" ||
        value.type === "image/jpeg" ||
        value.type === "image/png")
    );
  })
  .required("Identity document is required");

// Main form validation schema
const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  identity: fileSchema,
});

const { handleSubmit, validate, meta, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    email: formStore.email,
    phone: formStore.phone,
    identity: formStore.identity,
  },
});

const validateAndSubmit = handleSubmit(async () => {
  await formStore.submitForm();
  return true;
});

// Handling file upload
const handleIdentityUpload = (files) => {
  const file = files[0];
  setFieldValue("identity", file); // Set the field value manually
  formStore.setIdentity(file);
  validate(); // Trigger validation
};

// Fetch initial data
const fetchData = async () => {
  try {
    const params = { slug: "carbon" };
    const response = await axios.get(
      "https://test-api.gettonote.com/api/v1/legal-docs/helpers/company",
      { params }
    );
    formStore.setCompany(response.data.company.id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});

// Expose reactive validation state
const isValid = computed(() => meta.value.valid);


defineExpose({
  validateAndSubmit,
  isValid,
});
</script>

<template>
  <Form>
    <div class="a4-size">
      <h2 class="text-primary font-bold text-lg">Customer Information</h2>
      <p>Fill the following questions to populate your biodata</p>

      <hr class="my-8" />

      <div class="-mx-3">
        <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            1. Email Address
          </label>
          <Field
            class="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3"
            type="email" id="email" name="email" v-model="formStore.email" placeholder="Enter Email Address" />
          <ErrorMessage name="email" />
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
            2. Phone Number
          </label>
          <Field
            class="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3"
            type="tel" id="phone" name="phone" v-model="formStore.phone" placeholder="Enter Phone Number" />
          <ErrorMessage name="phone" />
        </div>
        <div class="px-3 mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            3. Upload your means of Identification
          </label>
          <p>
            Make sure that the document uploaded is clear and legible (We accept only
            Passport or license)
          </p>

          <div class="my-4">
            <DropZone @file-uploaded="handleIdentityUpload" size="xl" class="mb-8">
              <p class="text-center">Drag and drop or</p>
              <button
                class="bg-primary text-white px-3 py-2 my-2 block mx-auto mt-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Click to upload
              </button>
              <p>PDF, DOC, DOCX, PNG or JPG</p>
            </DropZone>
            <ErrorMessage name="identity" />
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>

<style scoped>
.a4-size {
  max-width: 210mm;
  margin: 20px auto;
}
</style>
