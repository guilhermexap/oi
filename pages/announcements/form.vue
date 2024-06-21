<template>
  <UContainer>
    <UCard>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 px-3"
        @submit="onSubmit"
      >
        <div class="flex justify-between items-center">
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">
              {{ titlePage }} comunicado
            </h5>
          </div>
          <div class="flex gap-3">
            <UButton
              type="button"
              color="gray"
              size="xl"
              class="mr-2"
              :disabled="isLoading"
              @click="backPage"
              >Voltar
            </UButton>
            <UButton
              type="submit"
              color="primary"
              size="xl"
              class="mr-2 w-48 flex justify-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Publicar comunicado</span>
            </UButton>
          </div>
        </div>
        <div class="mx-auto mt-4">
          <h5>Dados do comunicado</h5>
          <div class="grid grid-cols-2 gap-4">
            <div class="py-4 flex gap-4 flex-col">
              <UFormGroup label="Título" name="TITLE">
                <UInput v-model="state.TITLE" />
              </UFormGroup>

              <UFormGroup label="Tags" name="GEN_TAG">
                <USelectMenu
                  v-model="selected"
                  placeholder="Selecione..."
                  searchable
                  multiple
                  :options="options"
                  option-attribute="label"
                  value-attribute="value"
                  selected-icon="fa fa-check"
                />
              </UFormGroup>
              <div class="flex w-full gap-3">
                <UFormGroup
                  label="Início da publicação"
                  name="INITIAL_DATE"
                  class="flex-grow"
                >
                  <UInput
                    v-model="state.INITIAL_DATE"
                    type="date"
                    :value="state.INITIAL_DATE || undefined"
                  />
                </UFormGroup>

                <UFormGroup
                  label="Final da publicação"
                  name="FINAL_DATE"
                  class="flex-grow"
                >
                  <UInput
                    v-model="state.FINAL_DATE"
                    type="date"
                    :value="state.FINAL_DATE || undefined"
                  />
                </UFormGroup>
              </div>
              <UFormGroup name="active">
                <UCheckbox
                  id="nuxt-checkbox"
                  v-model="state.ACTIVE"
                  name="notifications"
                  label="Comunicado ativo"
                />
              </UFormGroup>
            </div>
            <div class="flex flex-col p-4">
              <!-- <div
                class="bg-gray-200 border h-72 mb-4 flex items-center justify-center rounded-md text-gray-500"
                :style="{
                  'background-image': `url(${state.IMAGE})`,
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                }"
              >
                <span v-if="!state.IMAGE" class="fa fa-image fa-3x"></span>
              </div> -->
              <UFormGroup label="Imagem" name="IMAGE">
                <div class="flex gap-2 items-center justify-center">
                  <ImageUploader
                    :image-url="state.IMAGE"
                    @image-uploaded="onLogoUploaded"
                  />
                  <!-- <UInput v-model="state.IMAGE" class="flex-grow relative" />
                  <div
                    v-if="state.IMAGE"
                    class="flex text-red-600 items-center bg-white p-1 h-full justify-center rounded-r-md cursor-pointer absolute top-0 right-0 hover:text-red-500 transition-opacity"
                    title="Remover imagem"
                    @click="state.IMAGE = undefined"
                  >
                    <i class="fa fa-close p-1"></i>
                  </div> -->
                </div>
              </UFormGroup>
            </div>
          </div>
        </div>

        <h5>Conteúdo</h5>
        <UFormGroup name="NEWS">
          <UTextarea v-model="state.NEWS" style="height: 26rem" />
        </UFormGroup>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { date, number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import newsServices from "~/services/news.service";
import { getSelectedData, setSelectedData } from "~/services/editService";

const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);

const options = ref<{ label: string; value: number }[]>([]);
const urlLogo = ref("");
// const route = useRoute();

let titlePage = "Adicionar";

const selectedData = ref<any>(getSelectedData());
const selected = ref<number[]>([]);

definePageMeta({
  middleware: ["auth"],
});

const onLogoUploaded = (url: any) => {
  state.IMAGE = url;
};

// if (selectedData.value?.ID !== undefined) {
//   titlePage = "Editar";
// }
if (selectedData.value?.ID) {
  titlePage = "Editar";
}
const router = useRouter();
const backPage = () => {
  router.push({ name: "announcements" });
};

const schema = object({
  TITLE: string().required("O título deve ser preenchido"),
  INITIAL_DATE: date().required("A data inicial deve ser preenchida"),
  FINAL_DATE: date().required("A data final deve ser preenchida"),
  NEWS: string().required("O conteúdo deve ser preenchido"),
  IMAGE: string().required("A url da imagem deve ser preenchida"),
  ACTIVE: string(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  TITLE: selectedData.value?.TITLE as string | undefined,
  GEN_TAG_ID: selectedData.value?.GEN_TAG_ID as string | undefined,
  INITIAL_DATE:
    newsServices.convertToDate(selectedData.value?.INITIAL_DATE?.toString()) ||
    undefined,
  FINAL_DATE:
    newsServices.convertToDate(selectedData.value?.FINAL_DATE?.toString()) ||
    undefined,
  NEWS: selectedData.value?.NEWS as string | undefined,
  IMAGE: selectedData.value?.IMAGE as string | undefined,
  ACTIVE:
    newsServices.convertToBoolean(selectedData.value?.ACTIVE?.toString()) ||
    true,
  NRORG: NrOrg,
  USER_ID: UserId,
});

onMounted(async () => {
  urlLogo.value = selectedData.value?.IMAGE;
  const response = await newsServices.getTags(NrOrg);

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
  if (selectedData.value && selectedData.value.evt_tag_news.length > 0) {
    for (let i = 0; i < selectedData.value.evt_tag_news.length; i++) {
      selected.value.push(selectedData.value.evt_tag_news[i].EVT_TAG_ID);
    }
  }
});

onBeforeUnmount(() => {
  setSelectedData(null);
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  event.data.ACTIVE = newsServices.convertToString(state.ACTIVE); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING
  isLoading.value = true;
  const dataEvtTags = {
    TAG_IDS: selected.value,
    GEN_NEWS_ID: selectedData.value?.ID,
    NRORG: NrOrg,
    CREATED_BY: UserId,
  };
  if (selectedData.value?.ID === undefined) {
    const response: any = await newsServices.postNews(event.data);
    if (response) {
      dataEvtTags.GEN_NEWS_ID = response.ID;
      await newsServices.postEtvTags(dataEvtTags);
      isLoading.value = false;

      router.push({ name: "announcements" });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await newsServices.updateNews(
      event.data,
      selectedData.value?.ID
    );
    if (response) {
      await newsServices.postEtvTags(dataEvtTags);
      isLoading.value = false;
      router.push({ name: "announcements" });
    } else {
      isLoading.value = false;
    }
  }
}
</script>
