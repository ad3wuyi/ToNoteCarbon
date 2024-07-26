<script setup>
import { ref, watch } from "vue";
import UploadSVG from "../assets/upload.svg";

const fileInput = ref(null);
const previews = ref([]);
const emit = defineEmits(["file-uploaded"]);

const props = defineProps({
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl", "2xl"].includes(value),
  },
});

const modalSizeClass = ref("");

watch(
  () => props.size,
  (newSize) => {
    modalSizeClass.value =
      {
        sm: "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5",
        md: "w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4",
        lg: "w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5",
        xl: "w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/3",
        "2xl": "w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3",
      }[newSize] || "w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4";
  },
  { immediate: true }
);

const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (event) => {
  const files = event.dataTransfer.files;
  handleFiles(files);
};

const openFileDialog = () => {
  fileInput.value.click();
};

const onFileSelected = (event) => {
  const files = event.target.files;
  handleFiles(files);
};

const handleFiles = (files) => {
  // Emit the files to the parent component
  emit("file-uploaded", files);

  // Handle the preview
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previews.value.push({
        name: file.name,
        url: e.target.result,
        isImage: file.type.startsWith("image/"),
      });
    };
    reader.readAsDataURL(file);
  }
};

const removeFile = (index) => {
  previews.value.splice(index, 1);
};
</script>

<template>
  <div class="flex flex-col md:flex-row gap-5">
    <div
      :class="modalSizeClass"
      class="h-[220px] flex items-center gap-4 border-2 border-dashed border-primary rounded-lg"
    >
      <div
        class="flex flex-col items-center justify-center w-full h-44 cursor-pointer relative"
        @dragover.prevent="onDragOver"
        @drop.prevent="onDrop"
        @click="openFileDialog"
      >
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          @change="onFileSelected"
          multiple
        />
        <div class="flex flex-col items-center justify-center p-5 pointer-events-none">
          <div
            class="flex items-center justify-center p-1 bg-gray-200 rounded-full w-[40px] h-[40px]"
          >
            <UploadSVG alt="uplaod" />
          </div>

          <p class="mt-2 text-sm text-gray-500">
            <slot>
              Drag and drop files here,
              <span class="hidden"> or click to select files </span>
            </slot>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 place-items-center gap-2 w-72">
      <div
        v-for="(file, index) in previews"
        :key="file.name"
        class="relative w-full h-auto border-2 border-gray-300 rounded-lg overflow-hidden flex flex-row items-center justify-center cursor-pointer"
        @click="removeFile(index)"
      >
        <img
          v-if="file.isImage"
          :src="file.url"
          alt="File Preview"
          class="object-cover w-full h-full"
        />
        <svg
          v-else
          class="w-12 h-12 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16v-6a4 4 0 118 0v6m2 4H5m14 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0V8a4 4 0 10-8 0v8"
          ></path>
        </svg>
        <div
          class="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-75 text-white text-xs text-center p-1 truncate"
        >
          {{ file.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
