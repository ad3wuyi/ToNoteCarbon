<template>
  <div class="flex flex-col md:flex-row items-center justify-between my-4">
    <div class="w-full text-sm text-left mb-4 md:mb-0">
      Draw your signature in the tool box
    </div>
    <div class="flex items-center justify-between space-x-0 md:space-x-4">
      <div class="flex mr-4 space-x-2">
        <button
          @click="setPenColor('black')"
          :class="penColorClass('black')"
          aria-label="Black Pen"
        ></button>
        <button
          @click="setPenColor('blue')"
          :class="penColorClass('blue')"
          aria-label="Blue Pen"
        ></button>
        <button
          @click="setPenColor('red')"
          :class="penColorClass('red')"
          aria-label="Red Pen"
        ></button>
        <button
          @click="setPenColor('green')"
          :class="penColorClass('green')"
          aria-label="Green Pen"
        ></button>
      </div>
      <button class="px-2 py-1 rounded-md border" @click="clear">Clear</button>
    </div>
  </div>

  <div class="flex flex-col justify-between items-center gap-2 relative">
    <div class="w-full lg:w-auto border shadow-sm">
      <canvas
        :id="uid"
        :width="canvasWidth"
        :height="canvasHeight"
        :data-uid="uid"
        :disabled="disabled"
      ></canvas>
    </div>

    <div
      class="w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-auto mx-auto items-center rounded-3 border border-t-0 border-r-0 p-2 md:p-4"
      :class="[imgBase64 ? 'flex absolute top-0 right-0 lg:right-10' : 'hidden']"
    >
      <img
        :src="signaturePreview"
        class="mx-auto"
        :class="[!imgBase64 ? 'h-full' : 'w-full']"
        :style="{ height: imgBase64 ? '-webkit-fill-available' : '' }"
        alt="preview"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import SignaturePad from "signature_pad";
import { v4 as uuidv4 } from "uuid";
import emptyImage from "../assets/empty.png";

const props = defineProps({
  sigOption: {
    type: Object,
    default: () => ({
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
    }),
  },
  clearOnResize: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultUrl: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "drawn-signature"]);

const uid = ref("");
const imgBase64 = ref("");
const signaturePad = ref(null);
const penColor = ref("black");

const canvasWidth = ref(0);
const canvasHeight = ref(0);

const signaturePreview = computed(() => imgBase64.value || emptyImage);

const state = reactive({
  sig: null,
  option: {
    minWidth: 1.5,
    maxWidth: 1.5,
    ...props.sigOption,
  },
});

const initializeSignaturePad = () => {
  const canvas = document.getElementById(uid.value);
  state.sig = new SignaturePad(canvas, state.option);

  state.sig.addEventListener("endStroke", saveSignature);

  if (props.defaultUrl) {
    state.sig.fromDataURL(props.defaultUrl);
  }

  if (!props.disabled) {
    state.sig.on();
  }
};

SignaturePad.prototype.removeBlanks = function () {
  let tempCanvas = document.createElement("canvas").getContext("2d");
  const imgWidth = this._ctx.canvas.width;
  const imgHeight = this._ctx.canvas.height;
  const imageData = this._ctx.getImageData(0, 0, imgWidth, imgHeight);
  const data = imageData.data,
    getAlpha = function (x, y) {
      return {
        red: data[(imgWidth * y + x) * 4],
        green: data[(imgWidth * y + x) * 4 + 1],
        blue: data[(imgWidth * y + x) * 4 + 2],
      };
    },
    isWhite = function (rgb) {
      return rgb.red == 255 && rgb.green == 255 && rgb.blue == 255;
    },
    scanY = function (fromTop) {
      const offset = fromTop ? 1 : -1;

      for (
        let y = fromTop ? 0 : imgHeight - 1;
        fromTop ? y < imgHeight : y > -1;
        y += offset
      ) {
        for (let x = 0; x < imgWidth; x++) {
          if (!isWhite(getAlpha(x, y))) return y;
        }
      }
      return null;
    },
    scanX = function (fromLeft) {
      const offset = fromLeft ? 1 : -1;

      for (
        let x = fromLeft ? 0 : imgWidth - 1;
        fromLeft ? x < imgWidth : x > -1;
        x += offset
      ) {
        for (let y = 0; y < imgHeight; y++) {
          if (!isWhite(getAlpha(x, y))) return x;
        }
      }
      return null;
    };

  const cropTop = scanY(true),
    cropBottom = scanY(false),
    cropLeft = scanX(true),
    cropRight = scanX(false);

  const relevantData = this._ctx.getImageData(
    cropLeft,
    cropTop,
    cropRight - cropLeft,
    cropBottom - cropTop
  );

  tempCanvas.canvas.width = cropRight - cropLeft;
  tempCanvas.canvas.height = cropBottom - cropTop;
  tempCanvas.putImageData(relevantData, 0, 0);

  const dataURL = tempCanvas.canvas.toDataURL();
  imgBase64.value = dataURL;
  emit("drawn-signature", dataURL);
};

const saveSignature = () => {
  state.sig.removeBlanks();
};

const clearSignature = () => {
  state.sig.clear();
  imgBase64.value = "";
  emit("close", true);
};

const setPenColor = (color) => {
  penColor.value = color;
  state.sig.penColor = color;
};

const penColorClass = (color) => {
  const baseClass = "w-6 h-6 rounded-full cursor-pointer border-2";
  const activeClass = "ring ring-offset-2";
  const colorClass = {
    black: "bg-black",
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
  }[color];

  return `${baseClass} ${colorClass} ${penColor.value === color ? activeClass : ""}`;
};

watch(
  () => props.disabled,
  (val) => {
    if (val) {
      state.sig.off();
    } else {
      state.sig.on();
    }
  }
);

onMounted(() => {
  uid.value = uuidv4();
  setTimeout(initializeSignaturePad, 1000);

  // Resize the canvas based on screen size
  const updateCanvasSize = () => {
    const modal = document.querySelector(".modal"); // Assuming you have a class 'modal' on your modal element
    const width = modal ? modal.clientWidth : window.innerWidth;

    if (width < 640) {
      canvasWidth.value = width - 60; // Adjusted for small screens and modal
      canvasHeight.value = canvasWidth.value / 2;
    } else if (width < 1024) {
      canvasWidth.value = 455; // Medium screens
      canvasHeight.value = 200;
    } else {
      canvasWidth.value = 500; // Large screens
      canvasHeight.value = 250;
    }
  };

  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);
});

const clear = () => {
  clearSignature();
};
</script>

<style scoped>
canvas {
  background-color: #f5f5f5;
}

button[aria-label] {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

button[aria-label].ring {
  box-shadow: 0 0 0 2px white, 0 0 0 4px black;
}
</style>
