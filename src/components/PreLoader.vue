<template>
  <div>
    <div v-if="userFormStore.loading" class="pre-loader">
      <!-- Pre-loader content -->
      <div class="spinner"></div>
    </div>
    <div v-else>
      <!-- Your form content -->
      <form @submit.prevent="submitForm">
        <!-- Form fields -->
        <input type="text" v-model="userFormStore.company" placeholder="Company" />
        <input type="email" v-model="userFormStore.email" placeholder="Email" />
        <input type="tel" v-model="userFormStore.phone" placeholder="Phone" />
        <input type="file" @change="handleFileUpload" />

        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useUserFormStore } from '@/stores/userFormStore';

const userFormStore = useUserFormStore();

const submitForm = () => {
  userFormStore.submitForm();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  userFormStore.setIdentity(file);
};
</script>

<style>
.pre-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
