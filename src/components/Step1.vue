<script setup>
import { onMounted, computed } from "vue";
import axios from "axios";
import { useUserFormStore } from "../stores/userFormStore";
import ButtonComp from "./ButtonComp.vue";
import DropZone from "./DropZone.vue";

const formStore = useUserFormStore();

const handleIdentityUpload = (files) => {
  for (let i = 0; i < files.length; i++) {
    formStore.setIdentity(files[i]);
  }
};

const formData = computed(() => ({
  company: formStore.company,
  email: formStore.email,
  phone: formStore.phone,
  identity: formStore.identity,
}));

const handleSubmit = async () => {
  await formStore.submitForm();
};

// Function to fetch initial data
const fetchData = async () => {
  try {
    const params = {
      slug: "carbon",
    };
    const response = await axios.get(
      "https://test-api.gettonote.com/api/v1/legal-docs/helpers/company",
      { params }
    );
    console.log(response.data.company);
    formStore.setCompany(response.data.company.id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="a4-size">
    <h2 class="text-primary font-bold text-lg">Customer Information</h2>
    <p>Fill the following questions to populate your biodata</p>

    <hr class="my-8" />

    <div class="-mx-3">
      <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          1. Email Address
        </label>
        <input
          class="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3"
          type="email"
          id="email"
          v-model="formStore.email"
          placeholder="Enter Email Address"
        />
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
          2. Phone Number
        </label>
        <input
          class="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3"
          type="tel"
          id="phone"
          v-model="formStore.phone"
          placeholder="Enter Phone Number"
        />
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
              class="bg-primary text-white px-3 py-2 my-2 block mx-auto mt-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Click to upload
            </button>
            <p>PDF, DOC, DOCX, PNG or JPG</p>
          </DropZone>
        </div>
      </div>

      <div class="text-center px-3 mt-8">
        <ButtonComp
          @click="handleSubmit"
          size="md"
          variant="primary"
          class="block my-4 text-sm md:text-base"
        >
          Save
        </ButtonComp>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a4-size {
  max-width: 210mm;
  margin: 20px auto;
}
</style>
