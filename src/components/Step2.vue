<script setup>
import { ref, onMounted, watch } from "vue";
import { useAffidavitFormStore } from "@/stores/affidavitFormStore";
import ModalComp from "./ModalComp.vue";
// import SignPad from "./SignPad.vue";
import DropZone from "./DropZone.vue";
import CardComp from "./CardComp.vue";
import VerticalTabs from "./VerticalTabs.vue";
import TabGroupComp from "./TabGroupComp.vue";
import TabPanelComp from "./TabPanelComp.vue";
import ButtonComp from "./ButtonComp.vue";
import UserSVG from "../assets/user.svg";

const store = useAffidavitFormStore();

const tabs = ["Upload"];
const selectedIndex = ref(0);

const photographPreview = ref(null);
const signaturePreview = ref(null);

const handlePhotographUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    store.setPhotograph(file);
    photographPreview.value = URL.createObjectURL(file);
  }
};

const handleUploadedSignature = (files) => {
  if (files.length > 0) {
    store.setSignature(files[0]);
    signaturePreview.value = URL.createObjectURL(files[0]);
  }
};

// const handleDrawnSignature = async (drawnImg) => {
//   store.setSignature(drawnImg);
//   signaturePreview.value = drawnImg;
// };

const showSignatureModal = ref(false);

const updateVisible = (visible) => {
  showSignatureModal.value = visible;
};

const submitForm = () => {
  store.uploadFiles();
};

onMounted(async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  store.swear_date = `${year}-${month}-${day}`;

  await store.fetchGenders();
  await store.fetchNationalities();
  await store.fetchReligions();
  await store.fetchStates("NG");
});
</script>

<template>
  <div class="a4-size">
    <div class="flex flex-col md:flex-row items-center gap-10">
      <div
        class="w-[150px] h-[160px] bg-gray-100 rounded-lg border border-dashed border-gray-400 relative"
      >
        <UserSVG v-if="!photographPreview" alt="user" />
        <img
          v-else
          :src="photographPreview"
          alt="Uploaded Photograph"
          class="w-full h-full object-cover rounded-lg"
        />
        <div class="absolute bottom-0 w-full text-center">
          <label
            class="bg-white border border-gray-300 px-3 py-1 my-2 text-xs inline-block mx-auto rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Click to upload
            <input type="file" class="hidden" @change="handlePhotographUpload" />
          </label>
        </div>
      </div>

      <div class="text-center text-lg leading-[2rem] font-bold">
        <div class="form-field">
          <h2>IN THE CHAMBERS OF THE NOTARY PUBLIC OF NIGERIA</h2>
        </div>
        <div class="form-field">
          <h2>IN THE …………………… JUDICIAL DIVISION</h2>
        </div>
        <div class="form-field">
          <h2>HOLDEN AT ……………………</h2>
        </div>
      </div>
    </div>

    <div class="text-center font-semibold mt-10 mb-8">
      <h2 class="text-lg underline">Sworn Affidavit of Indemnity</h2>
    </div>
    <div class="form-field">
      <p class="mb-4">
        I,
        <input
          class="appearance-none w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          type="text"
          id="name"
          v-model="store.full_name"
          placeholder="Your Name"
        />
        &nbsp; Adult &nbsp;
        <select
          class="w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          v-model="store.gender"
          id="gender"
          required
        >
          <option value="" selected>Choose Gender</option>
          <option v-for="gender in store.genders" :key="gender.code" :value="gender.code">
            {{ gender.name }}
          </option>
        </select>
        &nbsp;
        <input
          type="text"
          class="appearance-none w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          v-model="store.occupation"
          id="occupation"
          required
          placeholder="Occupation"
        />
        &nbsp;
        <select
          class="w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          v-model="store.religion"
          id="religion"
          required
        >
          <option value="">Choose Religion</option>
          <option
            v-for="religion in store.religions"
            :key="religion.code"
            :value="religion.code"
          >
            {{ religion.name }}
          </option>
        </select>
        &nbsp;
        <select
          class="w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          v-model="store.nationality"
          id="nationality"
          required
        >
          <option value="">Nationality</option>
          <option
            v-for="(nationality, index) in store.nationalities"
            :key="index"
            :value="nationality"
          >
            {{ nationality }}
          </option>
        </select>
        &nbsp; residing at:
        <textarea
          type="text"
          rows="5"
          class="w-full inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          v-model="store.address"
          id="address"
          required
          placeholder="Your Address"
        />
        <select
          class="w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
          v-model="store.state"
          id="state"
          required
        >
          <option value="">Your State</option>
          <option v-for="state in store.states" :key="state.code" :value="state.code">
            {{ state.name }}
          </option>
        </select>
        &nbsp; do hereby depose on oath and solemnly declare as follows:
      </p>
    </div>
    <div class="form-field ml-4">
      <ol class="list-decimal">
        <li class="mb-4">
          I affirm that all documents submitted by me to Carbon are authentic and true.
        </li>
        <li class="mb-4">
          In the event of default on any loan or financial obligation owed to Carbon, I
          irrevocably authorize Carbon to pursue any necessary legal means to recover
          funds or address discrepancies arising from the submitted documents.
        </li>
        <li class="mb-4">
          I agree to indemnify and hold Carbon harmless from any claims, liabilities, or
          damages resulting from their actions based on the authenticity of the submitted
          documents.
        </li>
      </ol>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between my-20">
      <div class="form-field">
        <span class="font-bold">Sworn on the</span>&nbsp;
        <input
          type="date"
          class="appearance-none w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3"
          v-model="store.swear_date"
          id="date"
          required
          placeholder="date"
        />
      </div>
      <div class="form-field mt-10 md:mt-0">
        <img
          v-if="signaturePreview"
          :src="signaturePreview"
          alt="Signature"
          class="w-[120px] h-auto object-cover mb-2"
        />
        <h2
          class="cursor-pointer text-center font-bold"
          @click="showSignatureModal = true"
        >
          DEPONENT
        </h2>
      </div>
    </div>

    <div class="text-center">
      <h2 class="font-bold">BEFORE ME</h2>

      <div class="mx-auto my-12 border border-dashed w-[200px]" />

      <div class="mt-8">
        <div class="flex items-center">
          <input
            v-model="store.agree"
            id="agree-terms"
            type="checkbox"
            class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-700">
            I agree to the
            <a
              href="https://www.gettonote.com/terms"
              class="text-primary font-semibold"
              target="_blank"
            >
              Terms and Conditions
            </a>
            &amp;
            <a
              href="https://www.gettonote.com/privacy"
              class="text-primary font-semibold"
              target="_blank"
            >
              Privacy Policy
            </a>
          </label>
        </div>
        <ButtonComp
          @click="submitForm"
          size="md"
          variant="primary"
          class="block ml-auto my-4 text-sm md:text-base"
          :disabled="!store.agree"
        >
          Submit
        </ButtonComp>
      </div>
    </div>

    <ModalComp
      :visible="showSignatureModal"
      :showFooter="false"
      size="lg"
      @update:visible="updateVisible"
      @close="showSignatureModal = false"
    >
      <template #header>
        <h3 class="text-xl font-semibold">Create signature</h3>
      </template>
      <template #body>
        <TabGroupComp
          :tabs="tabs"
          activeTabClass="border-b-[3px] border-primary text-primary"
          inactiveTabClass="text-gray-600"
        >
          <template #tab="{ tab, index, isActive }">
            <div class="flex flex-nowrap whitespace-nowrap pb-1">
              <span
                class="px-4 py-2 rounded-lg text-xs md:text-base"
                :class="{ 'bg-[#edf3ff]': isActive === index }"
              >
                {{ tab }}
              </span>
            </div>
          </template>

          <template #content="{ selectedIndex }">
            <TabPanelComp :isActive="selectedIndex === 0">
              <DropZone @file-uploaded="handleUploadedSignature" size="2xl" class="mb-8">
                <p class="text-center">Drag and drop or</p>
                <button
                  class="bg-primary text-white px-3 py-2 my-2 block mx-auto mt-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Click to upload
                </button>
                <p>PDF, DOC, DOCX, PNG or JPG</p>
              </DropZone>

              <div class="mt-8">
                <ButtonComp
                  size="md"
                  variant="primary"
                  @click="showSignatureModal = false"
                  class="block ml-auto my-4 text-sm md:text-base"
                >
                  Save and Continue
                </ButtonComp>
              </div>
            </TabPanelComp>

            <!-- <TabPanelComp :isActive="selectedIndex === 0">
              <div>
                <SignPad @drawn-signature="handleDrawnSignature" />

                <div class="mt-8">
                  <ButtonComp
                    size="md"
                    variant="primary"
                    class="block ml-auto my-4 text-sm md:text-base"
                  >
                    Save and Continue
                  </ButtonComp>
                </div>
              </div>
            </TabPanelComp> -->
          </template>
        </TabGroupComp>
      </template>
      <template #footer>
        <p class="my-2 text-xs md:text-base">
          By clicking create, I agree that all signatures, marks, or initials created here
          are as valid as my handwritten signature to the extent allowed by law.
        </p>
      </template>
    </ModalComp>
  </div>
</template>
