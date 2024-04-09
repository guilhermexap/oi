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
              {{ titlePage }} marketing
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
              <span v-else>Publicar marketing</span>
            </UButton>
          </div>
        </div>
        <div class="mx-auto mt-4">
          <h5>Dados do marketing</h5>
          <div class="grid grid-cols-2 gap-4">
            <div class="py-4 flex gap-4 flex-col">
              <UFormGroup label="Título" name="TITLE">
                <UInput v-model="state.TITLE" />
              </UFormGroup>

              <UFormGroup label="tags" name="GEN_TAG_ID">
                <USelect
                  v-model="state.GEN_TAG_ID"
                  placeholder="Selecione..."
                  :options="options"
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
              <UFormGroup
                label="Prioridade (quanto menor o número, maior a prioridade)"
                name="PRIORITY"
              >
                <UInput v-model="state.PRIORITY" type="number" />
              </UFormGroup>
              <UFormGroup label="Link" name="LINK">
                <UInput v-model="state.LINK" />
              </UFormGroup>
              <UFormGroup name="active">
                <UCheckbox
                  id="nuxt-checkbox"
                  v-model="state.ACTIVE"
                  name="notifications"
                  label="Marketing ativo"
                />
              </UFormGroup>
            </div>
            <div class="flex flex-col p-4">
              <div
                class="bg-gray-200 border h-80 mb-4 mt-2 flex items-center justify-center rounded-md text-gray-500"
                :style="{
                  'background-image': `url(${state.IMAGE})`,
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                }"
              >
                <span v-if="!state.IMAGE" class="fa fa-image fa-3x"></span>
              </div>
              <UFormGroup label="Url da imagem" name="IMAGE">
                <UInput v-model="state.IMAGE" />
              </UFormGroup>
            </div>
          </div>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { date, number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import newsServices from "~/services/news.service";
import marketingServices from "~/services/marketing.service";
import { getSelectedData, setSelectedData } from "~/services/editService";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const selectedData = ref<any>(getSelectedData());
const options = ref<{ label: string; value: number }[]>([]);
// const route = useRoute();

let titlePage = "Adicionar";

definePageMeta({
  middleware: ["auth"],
});

// if (selectedData.value?.ID !== undefined) {
//   titlePage = "Editar";
// }

if (selectedData.value?.ID) {
  titlePage = "Editar";
}

const router = useRouter();
const backPage = () => {
  router.push({ name: "marketing" });
};

const schema = object({
  TITLE: string().required("O título deve ser preenchido"),
  INITIAL_DATE: date().required("A data inicial deve ser preenchida"),
  FINAL_DATE: date().required("A data final deve ser preenchida"),
  IMAGE: string().required("A url da imagem deve ser preenchida"),
  ACTIVE: string(),
  PRIORITY: string().required("A prioridade deve ser preenchida"),
  LINK: string().required("O link deve ser preenchido"),
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
  IMAGE: selectedData.value?.IMAGE as string | undefined,
  ACTIVE:
    newsServices.convertToBoolean(selectedData.value?.ACTIVE?.toString()) ||
    true,
  PRIORITY: selectedData.value?.PRIORITY as string | undefined,
  LINK: selectedData.value?.LINK as string | undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
});

onMounted(async () => {
  const response = await newsServices.getTags(NrOrg); // MUDAR SERVICE

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
});

onBeforeUnmount(() => {
  setSelectedData(null);
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  event.data.ACTIVE = newsServices.convertToString(state.ACTIVE); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING
  isLoading.value = true;
  if (selectedData.value?.ID === undefined) {
    const response = await marketingServices.postMarketing(event.data);
    if (response) {
      router.push({ name: "marketing" });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await marketingServices.updateMarketing(
      event.data,
      selectedData.value?.ID
    );
    if (response) {
      router.push({ name: "marketing" });
    } else {
      isLoading.value = false;
    }
  }
}
</script>
