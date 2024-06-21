<template>
  <div class="p-4">
    <div class="flex flex-col gap-4">
      <span class="text-center"
        >Para realizar cadastros através de planilha Excel
        <UButton
          variant="link"
          class="underline font-extrabold"
          @click="downloadFile"
          >baixe o modelo</UButton
        >, preencha e importe do campo abaixo.</span
      >
      <file-pond
        ref="pond"
        name="file"
        label-idle="Arraste e solte seu arquivo Excel ou <span class='filepond--label-action'>Importe</span>"
        allow-multiple="false"
        max-files="1"
        accepted-file-types="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx"
        @init="handleFilePondInit"
        @addfile="handleFileAdd"
      />

      <UButton
        color="primary"
        size="xl"
        class="mt-4 flex justify-center"
        :disabled="isLoading"
        @click="processFile"
      >
        <span v-if="isLoading" class="fa fa-spinner animate-spin" />
        <span v-else>Processar arquivo</span>
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import vueFilePond from "vue-filepond";
import * as XLSX from "xlsx";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// eslint-disable-next-line import/default
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import preRegister from "../services/pre-register.service";

const userId = localStorage.getItem("userId");
const NrOrg = localStorage.getItem("NRORG");

// Register the plugins
const FilePond = vueFilePond(FilePondPluginFileValidateType);

const emit = defineEmits(["file-uploaded", "submit-success-form"]); // Define o evento personalizado

const pond = ref(null);
//
const isLoading = ref(false);
const jsonData = ref([]);

const handleFilePondInit = () => {
  console.log("FilePond instance has initialized", pond.value);
};

const handleFileAdd = (error, file) => {
  if (error) {
    console.error("Error adding file", error);
    return;
  }
  console.log("File added", file);
};

const processFile = () => {
  if (pond.value.getFiles().length === 0) {
    console.error("No files to process");
    return;
  }
  isLoading.value = true;

  const file = pond.value.getFiles()[0].file;
  const reader = new FileReader();

  reader.onload = async (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const jsonResult = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );
    console.log("File converted to JSON", jsonResult);
    jsonData.value = jsonResult;
    await handleSubmitAll();
  };

  reader.readAsArrayBuffer(file);
};

async function onSubmit(usrData) {
  usrData.PHONE_NUMBER = formatPhoneNumber(String(usrData.PHONE_NUMBER));
  if (usrData.BIRTH) {
    usrData.BIRTH = excelDateToJSDateString(usrData.BIRTH);
  }
  usrData.CPF = String(usrData.CPF);
  usrData.STATUS = "A";
  usrData.USER_ID = userId;
  usrData.NRORG = NrOrg;
  const response = await preRegister.postPreRegister(usrData);
  console.log(response);
  if (response === "success") {
    isLoading.value = false;
    console.log("Data submitted successfully");
    return true;
  }
  isLoading.value = false;
  return false;
}

async function handleSubmitAll() {
  if (jsonData.value.length === 0) {
    return;
  }
  isLoading.value = true;
  // console.log(jsonData.value);

  if (Array.isArray(jsonData.value)) {
    const promises = jsonData.value.map((data) => onSubmit(data));
    const results = await Promise.all(promises);
    console.log("Results:", results);
    results.forEach((success, index) => {
      if (!success) {
        console.error(
          `Failed to submit data: ${JSON.stringify(jsonData.value[index])}`
        );
      }
    });
    emit("submit-success-form");
  }

  isLoading.value = false;
}

function excelDateToJSDateString(serial) {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400; // 86400 seconds in a day
  const dateInfo = new Date(utcValue * 1000);

  const year = dateInfo.getUTCFullYear();
  const month = String(dateInfo.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(dateInfo.getUTCDate()).padStart(2, "0");
  console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
}

function formatPhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== "string") {
    phoneNumber = String(phoneNumber);
  }
  if (phoneNumber.length !== 11) {
    console.error("Phone number must be 11 digits long");
    return phoneNumber;
  }
  const areaCode = phoneNumber.slice(0, 2);
  const firstPart = phoneNumber.slice(2, 7);
  const secondPart = phoneNumber.slice(7);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

function downloadFile() {
  const link = document.createElement("a");
  link.href = "/docs/model.xlsx";
  link.download = "modelo.xlsx";
  link.click();
}
</script>

<style scoped>
/* Custom styles for FilePond */
.filepond--item-panel {
  @apply bg-red-200;
}
</style>
