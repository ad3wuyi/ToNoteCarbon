<script setup>
import CardComp from '../components/CardComp.vue'
</script>

<template>
  <main class="container mx-auto my-14">
    <div class="w-full md:w-2/3 lg:w-2/5 mx-auto px-4">
      <CardComp>
        <div class="flex flex-col items-center p-4 md:p-10">
          <img src="../assets/logo.png" alt="success" width="100" class="w-1/3 md:w-1/3">

          <div class="my-12">
            <h1 class="text-xl md:text-3xl font-bold text-center mb-4">Document Submitted</h1>
            <p class="text-sm md:text-lg font-semibold text-center">
              Your document is being processed and an email will be sent to you once complete.
            </p>
          </div>
        </div>
      </CardComp>
    </div>
  </main>
</template>
