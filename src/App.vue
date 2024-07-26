<script setup>
import { RouterLink, RouterView } from "vue-router";
import TheNavbar from "./components/TheNavbar.vue";
import LogoSVG from "./assets/logo.svg?component";
</script>

<template>
  <TheNavbar />

  <RouterView />
</template>

<style scoped></style>
