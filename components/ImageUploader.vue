<template>
  <div class="w-full">
    <file-pond
      ref="pond"
      name="file"
      label-idle="Arraste e solte sua imagem ou <span class='filepond--label-action'>Importe</span>"
      allow-multiple="false"
      max-files="1"
      accepted-file-types="image/*"
      @init="handleFilePondInit"
      @processfile="handleProcessFile"
      @addfilestart="processFile"
    />
    <!-- <UButton @click="processFile">Upload</UButton> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Import FilePond plugins
// eslint-disable-next-line import/default
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
// eslint-disable-next-line import/default
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// eslint-disable-next-line import/default
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../helpers/firebase";

const uploadFileToFirebase = async (file) => {
  try {
    const storageReference = storageRef(storage, `images/${file.name}`);
    await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(storageReference);
    emit("image-uploaded", downloadURL);
    // console.log("File uploaded successfully. Download URL:", downloadURL);
  } catch (error) {
    console.error("Error uploading file to Firebase", error);
  }
};

const processFile = async () => {
  if (pond.value.getFiles().length === 0) {
    console.error("No files to process");
    return;
  }
  // Check if the file was loaded from URL, if so, don't upload it
  if (isLoadedFromUrl.value) {
    console.log("File loaded from URL, not uploading");
    isLoadedFromUrl.value = false; // Reset the flag
    return;
  }
  await uploadFileToFirebase(pond.value.getFiles()[0].file);
};

// Register the plugins
const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation
);

const props = defineProps({
  imageUrl: String,
});

const emit = defineEmits(["image-uploaded"]); // Define o evento personalizado

const pond = ref(null);
const isLoadedFromUrl = ref(false);

const handleFilePondInit = () => {
  console.log("FilePond instance has initialized", pond.value);
};

const handleProcessFile = (error, file) => {
  if (error) {
    console.error("Oh no", error);
    return;
  }
  console.log("File processed", file);
};

watchEffect(() => {
  // handleProcessFile();
});

watch(
  () => props.imageUrl,
  (newUrl) => {
    loadPreviewImage(newUrl);
  }
);
const loadPreviewImage = (url) => {
  // Cria um objeto de arquivo simulado para adicionar ao FilePond
  if (!url) return;
  const filename = url.substring(url.lastIndexOf("/") + 1);
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], filename, { type: blob.type });
      isLoadedFromUrl.value = true;
      pond.value.addFile(file);
    })
    .catch((err) => console.error("Error loading image preview:", err));
};

// Carrega uma imagem de preview ao montar o componente
onMounted(() => {
  if (!props.imageUrl) return;
  loadPreviewImage(props.imageUrl);
});
</script>

<style scoped>
/* Custom styles for FilePond */
.filepond--item-panel {
  @apply bg-red-200;
}
</style>
