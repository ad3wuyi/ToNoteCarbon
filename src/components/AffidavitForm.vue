<script setup>
import { ref, onMounted, computed } from "vue";
import { useAffidavitFormStore } from "@/stores/affidavitFormStore";
import { useUserFormStore } from "../stores/userFormStore";
import ModalComp from "./ModalComp.vue";
import SignPad from "./SignPad.vue";
import DropZone from "./DropZone.vue";
import CardComp from "./CardComp.vue";
import VerticalTabs from "./VerticalTabs.vue";
import TabGroupComp from "./TabGroupComp.vue";
import TabPanelComp from "./TabPanelComp.vue";
import ButtonComp from "./ButtonComp.vue";
import UserSVG from "../assets/user.svg";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const formStore = useUserFormStore();
const store = useAffidavitFormStore();

const tabs = ["Draw", "Upload"];
const selectedIndex = ref(0);

const photographPreview = ref(null);
const signaturePreview = ref(null);

const handlePhotographUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    setFieldValue("photo", file);
    store.setPhotograph(file);
    validate();
    photographPreview.value = URL.createObjectURL(file);
  }
};

const handleUploadedSignature = (files) => {
  if (files.length > 0) {
    setFieldValue("signature", files[0]);
    store.setSignature("image", files[0]);
    validate();
    signaturePreview.value = URL.createObjectURL(files[0]);
  }
};

const handleDrawnSignature = (drawnImg) => {
  setFieldValue("signature", drawnImg);
  store.setSignature("base64", drawnImg);
  validate();
  signaturePreview.value = drawnImg;
};

const showSignatureModal = ref(false);

const updateVisible = (visible) => {
  showSignatureModal.value = visible;
};

const photoSchema = yup
  .mixed()
  .test("fileType", "Unsupported File Format", (value) => {
    return (
      value &&
      (value.type === "image/jpeg" ||
        value.type === "image/jpg" ||
        value.type === "image/png")
    );
  })
  .required("Photograph is required");

const getFileType = (base64String) => {
  const matches = base64String != "" ? base64String.match(/^data:(.*?);base64,/) : null;
  return matches ? matches[1] : null;
};

const signatureSchema = yup
  .mixed()
  .test("fileType", "Unsupported File Format", (value) => {
    let fileType = null;
    if (value && !value.type) {
      fileType = getFileType(value);
    }
    return (
      value &&
      (value.type === "image/jpeg" ||
        value.type === "image/png" ||
        fileType === "image/png")
    );
  })
  .required("Signature is required");

const schema = yup.object({
  name: yup.string().required("Full name is required"),
  gender: yup.string().required("Gender is a required field"),
  occupation: yup.string().required("Occupation is a required field"),
  religion: yup.string().required("Religion is a required field"),
  nationality: yup.string().required("Nationality is a required field"),
  address: yup.string().required("Address is a required field"),
  state: yup.string().required("State of residence is required"),
  // swear_date: yup.string().required(),
  photo: photoSchema,
  signature: signatureSchema,
});

const { handleSubmit, validate, meta, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    name: store.full_name,
    gender: store.gender,
    occupation: store.occupation,
    religion: store.religion,
    nationality: store.nationality,
    address: store.address,
    state: store.state,
    // swear_date: store.swear_date,
    photo: store.photo,
    signature: store.signature,
  },
});

const validateAndSubmit = handleSubmit(async () => {
  return true;
});

const isValid = computed(() => meta.value.valid);

defineExpose({
  validateAndSubmit,
  isValid,
});

onMounted(async () => {
  formStore.setIsSubmitted(false);
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
  <div class="a4-size p-0 lg:p-4">
    <div class="flex flex-col md:flex-row items-center gap-10">
      <div
        class="w-[150px] h-[160px] bg-gray-100 rounded-lg border border-dashed border-gray-400 relative"
      >
        <UserSVG v-if="!photographPreview" alt="user" />
        <img
          v-else
          :src="photographPreview"
          v-lazy="photographPreview"
          alt="Uploaded Photograph"
          class="w-full h-full object-cover rounded-lg"
        />
        <div class="absolute bottom-0 w-full text-center">
          <label
            class="bg-transparent text-primary hover:text-red-500 font-semibold cursor-pointer px-3 py-1 mt-2 text-xs inline-block mx-auto rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <small>Upload your passport photograph</small>
            <input type="file" class="hidden" @change="handlePhotographUpload" />
          </label>
        </div>
      </div>

      <div class="text-center text-lg leading-[2rem] font-bold">
        <div class="form-field text-sm md:text-lg leading-6">
          <h2>IN THE CHAMBERS OF THE NOTARY PUBLIC OF NIGERIA</h2>
        </div>
        <div class="form-field text-sm md:text-lg leading-6">
          <h2>IN THE …………………… JUDICIAL DIVISION</h2>
        </div>
        <div class="form-field text-sm md:text-lg leading-6">
          <h2>HOLDEN AT ……………………</h2>
        </div>
      </div>
    </div>

    <div class="text-center font-semibold mt-10 mb-8">
      <h2 class="text-lg underline">Affidavit of Indemnity</h2>
    </div>
    <div class="form-field">
      <p class="mb-4">
        I,
        <span class="relative block md:inline-block mb-0 md:mb-6">
          <Field
            class="appearance-none w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            type="text"
            name="name"
            id="name"
            v-model="store.full_name"
            placeholder="Your Name"
          />
          <ErrorMessage
            name="name"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>

        <span class="hidden md:inline">&nbsp;</span> Adult
        <span class="hidden md:inline">&nbsp;</span>
        <span class="relative block md:inline-block mb-0 md:mb-6">
          <Field
            as="select"
            class="w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            v-model="store.gender"
            name="gender"
            id="gender"
          >
            <option value="" selected>Choose Gender</option>
            <option
              v-for="gender in store.genders"
              :key="gender.code"
              :value="gender.code"
            >
              {{ gender.name }}
            </option>
          </Field>
          <ErrorMessage
            name="gender"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>
        <span class="hidden md:inline">&nbsp;</span>
        <span class="relative block md:inline-block mb-0 md:mb-6">
          <Field
            type="text"
            class="appearance-none w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            v-model="store.occupation"
            name="occupation"
            id="occupation"
            required
            placeholder="Occupation"
          />
          <ErrorMessage
            name="occupation"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>
        <span class="hidden md:inline">&nbsp;</span>
        <span class="relative block md:inline-block mb-0 md:mb-6">
          <Field
            as="select"
            class="w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            v-model="store.religion"
            name="religion"
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
          </Field>
          <ErrorMessage
            name="religion"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>

        <span class="hidden md:inline">&nbsp;</span>
        <span class="relative block md:inline-block mb-0 md:mb-6">
          <Field
            as="select"
            class="w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            v-model="store.nationality"
            name="nationality"
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
          </Field>
          <ErrorMessage
            name="nationality"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>

        <span class="hidden md:inline">&nbsp;</span> residing at:
        <span class="relative block mb-0 md:mb-6">
          <Field
            as="textarea"
            type="text"
            rows="5"
            class="w-full inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            v-model="store.address"
            name="address"
            id="address"
            required
            placeholder="Your Address"
          />
          <ErrorMessage
            name="address"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>

        <span class="relative block md:inline-block mb-0 md:mb-6">
          <Field
            as="select"
            class="w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3 mb-6"
            v-model="store.state"
            name="state"
            id="state"
            required
          >
            <option value="">State of Residence</option>
            <option v-for="state in store.states" :key="state.code" :value="state.code">
              {{ state.name }}
            </option>
          </Field>
          <ErrorMessage
            name="state"
            class="absolute bottom-0 block text-red-500 text-sm"
          />
        </span>
        <span class="hidden md:inline">&nbsp;</span> do hereby depose on oath and solemnly
        declare as follows:
      </p>
    </div>
    <div class="form-field ml-4">
      <ol class="list-decimal">
        <li class="mb-4">
          That all documents submitted and information provided by me to Carbon
          Microfinance Bank are authentic and true;
        </li>
        <li class="mb-4">
          In the event of default on any loan or financial obligation owed to Carbon
          Microfinance Bank, I irrevocably authorize Carbon Microfinance Bank to pursue
          any necessary legal means to recover the owed funds;
        </li>
        <li class="mb-4">
          I irrevocably authorize Carbon Microfinance Bank to pursue any necessary legal
          means to address discrepancies arising from the submitted documents or the
          information I have provided;
        </li>
        <li class="mb-4">
          I indemnify and hold Carbon Microfinance Bank harmless from any claims,
          liabilities, or damages resulting from their actions based on the authenticity
          of the documents submitted me, the information provided by me, or my
          indebtedness.
        </li>
      </ol>
    </div>

    <div class="flex flex-col md:flex-row items-start justify-between my-20">
      <div class="form-field">
        <span class="font-bold">Sworn on:</span
        ><span class="hidden md:inline">&nbsp;</span>
        <input
          type="date"
          class="appearance-none w-full md:w-auto inline-block bg-white text-gray-700 border border-gray-400 rounded py-2 px-3"
          v-model="store.swear_date"
          id="date"
          required
          placeholder="date"
        />
      </div>
      <div class="form-field w-full md:w-auto text-center mt-10 md:mt-0 relative">
        <div class="flex justify-center">
          <img
            v-if="signaturePreview"
            :src="signaturePreview"
            v-lazy="signaturePreview"
            @click="showSignatureModal = true"
            alt="Signature"
            class="w-[130px] h-[70px] object-contain cursor-pointer absolute bottom-[25px]"
          />
          <div
            v-else
            @click="showSignatureModal = true"
            class="shadow-lg border rounded-lg w-[200px] h-[30px] text-primary hover:text-red-500 font-semibold cursor-pointer absolute bottom-[25px]"
          >
            Click/Tap here to sign
          </div>
        </div>

        <h2 class="font-bold mt-10 md:mt-4">
          <div class="ml-auto border border-dashed border-gray-400 w-[200px] mx-auto" />
          DEPONENT
        </h2>
        <!-- <small
          >Click on <span class="font-semibold">"DEPONENT"</span> <br />
          to affix your signature</small
        > -->
      </div>
    </div>

    <div class="text-center">
      <h2 class="font-bold">BEFORE ME</h2>

      <div class="mx-auto my-12 border border-dashed border-gray-400 w-[200px]" />
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
              <SignPad @drawn-signature="handleDrawnSignature" size="2xl" class="mb-8" />
            </TabPanelComp>
            <TabPanelComp :isActive="selectedIndex === 1">
              <DropZone @file-uploaded="handleUploadedSignature" size="2xl" class="my-4">
                <p class="text-center">Drag and drop or</p>
                <button
                  class="bg-primary text-white px-3 py-2 my-2 block mx-auto mt-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Click to upload
                </button>
                <p>PDF, DOC, DOCX, PNG or JPG</p>
              </DropZone>
            </TabPanelComp>
          </template>
        </TabGroupComp>

        <div class="mt-4">
          <ButtonComp
            size="md"
            variant="primary"
            @click="showSignatureModal = false"
            class="block ml-auto my-4 text-sm md:text-base"
          >
            Save and Continue
          </ButtonComp>
        </div>
      </template>
    </ModalComp>
  </div>
</template>
