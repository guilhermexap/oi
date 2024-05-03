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
            <h5 class="font-weight-bolder mb-0 py-4">{{ titlePage }} evento</h5>
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
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
        <div class="mx-auto mt-4">
          <h5>Dados do evento</h5>
          <div class="grid grid-cols-2 gap-4">
            <div class="py-4 flex gap-4 flex-col">
              <UFormGroup label="Nome" name="NAME">
                <UInput v-model="state.NAME" />
              </UFormGroup>
              <UFormGroup label="Evento pai" name="PARENT_EVENT_ID">
                <USelectMenu
                  v-model="state.PARENT_EVENT_ID"
                  :loading="loading"
                  :searchable="searchParent"
                  placeholder="Buscar um evento..."
                  option-attribute="NAME"
                  trailing
                  by="ID"
                />
              </UFormGroup>

              <div class="flex w-full gap-3">
                <UFormGroup
                  label="Início da publicação"
                  name="INITIAL_DATE"
                  class="w-1/2"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="format(state.INITIAL_DATE, 'd MMM, yyy  HH:mm')"
                      class="w-full bg-white text-black"
                    />

                    <template #panel="{ close }">
                      <DatePicker
                        v-model="state.INITIAL_DATE"
                        mode="dateTime"
                        is24hr
                        hide-time-header
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>

                <UFormGroup
                  label="Final da publicação"
                  name="FINAL_DATE"
                  class="w-1/2"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="format(state.FINAL_DATE, 'd MMM, yyy  HH:mm')"
                      class="w-full bg-white text-black"
                    />

                    <template #panel="{ close }">
                      <DatePicker
                        v-model="state.FINAL_DATE"
                        mode="dateTime"
                        is24hr
                        hide-time-header
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>

              <div class="flex w-full gap-3">
                <UFormGroup label="Tags" name="GEN_TAG_ID" class="w-1/2">
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
                <UFormGroup
                  label="Categoria"
                  name="GEN_CATEGORY_ID"
                  class="w-1/2"
                >
                  <SelectMenu
                    v-model="state.GEN_CATEGORY_ID"
                    placeholder="Selecione..."
                    :options="optionsCategory"
                    option-attribute="label"
                    value-attribute="value"
                  />
                </UFormGroup>
              </div>

              <UFormGroup label="Unidade" name="STRUCTURE_ID">
                <SelectMenu
                  v-model="state.STRUCTURE_ID"
                  placeholder="Selecione..."
                  searchable
                  :options="optionsStructure"
                  option-attribute="label"
                  value-attribute="value"
                  selected-icon="fa fa-check"
                />
              </UFormGroup>
            </div>
            <div class="flex flex-col p-4">
              <div
                class="bg-gray-200 border h-80 mb-4 mt-2 flex items-center justify-center rounded-md text-gray-500"
                :style="{
                  'background-image': `url(${state.IMAGE_COVER})`,
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                }"
              >
                <span
                  v-if="!state.IMAGE_COVER"
                  class="fa fa-image fa-3x"
                ></span>
              </div>
              <UFormGroup label="Url da imagem" name="IMAGE_COVER">
                <UInput v-model="state.IMAGE_COVER" />
              </UFormGroup>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex w-full gap-4">
              <UFormGroup
                label="Venda de produtos"
                name="SALES_METHOD"
                class="w-1/2"
              >
                <SelectMenu
                  v-model="state.SALES_METHOD"
                  placeholder="Selecione..."
                  :options="optionsSales"
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormGroup>

              <UFormGroup
                label="Classificação"
                name="CLASSIFICATION"
                class="w-1/2"
              >
                <UInput v-model="state.CLASSIFICATION" />
              </UFormGroup>
            </div>
            <UFormGroup label="Endereço" name="LOCATION">
              <UInput v-model="state.LOCATION" />
            </UFormGroup>
            <UFormGroup
              label="Link para compra de ingressos"
              name="URL_API_EXTERNAL"
            >
              <UInput v-model="state.URL_API_EXTERNAL" />
            </UFormGroup>
            <UFormGroup name="active">
              <UCheckbox
                id="nuxt-checkbox"
                v-model="state.STATUS"
                name="notifications"
                label="Evento ativo"
              />
            </UFormGroup>
          </div>
        </div>
      </UForm>
    </UCard>
    <TicketsTable v-if="selectedData?.ID" :service-id="eventId" />
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import { format } from "date-fns";
import type { FormSubmitEvent } from "#ui/types";
import newsServices from "~/services/news.service";
import services from "~/services/services.service";
import eventService from "~/services/event.service";
import { getSelectedData, setSelectedData } from "~/services/editService";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const loading = ref(false);
const selectedData = ref<any>(getSelectedData());
const options = ref<{ label: string; value: number }[]>([]);
const optionsCategory = ref<{ label: string; value: number }[]>([]);
const optionsStructure = ref<{ label: string; value: number }[]>([]);
const selected = ref<number[]>([]);
const eventId = selectedData.value?.ID.toString() || "";

let titlePage = "Adicionar";

interface parentEvent {
  data: [
    {
      ID: number;
      NAME: string;
    }
  ];
}

definePageMeta({
  middleware: ["auth"],
});

if (selectedData.value?.ID) {
  titlePage = "Editar";
}

const router = useRouter();
const backPage = () => {
  router.push({ name: "events" });
};

const schema = object({
  NAME: string().required("O nome deve ser preenchido"),
  IMAGE_COVER: string().required("A url da imagem deve ser preenchida"),
  STRUCTURE_ID: string().required("A unidade deve ser selecionada"),
  GEN_CATEGORY_ID: string().required("A categoria deve ser selecionada"),
  SALES_METHOD: string().required("A venda de produtos deve ser selecionada"),
  CLASSIFICATION: string().required("A classificação deve ser preenchida"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: selectedData.value?.NAME as string | undefined,
  INITIAL_DATE: selectedData.value?.INITIAL_DATE
    ? new Date(selectedData.value?.INITIAL_DATE)
    : new Date(),
  FINAL_DATE: selectedData.value?.FINAL_DATE
    ? new Date(selectedData.value?.FINAL_DATE)
    : new Date(),
  IMAGE_COVER: selectedData.value?.IMAGE_COVER as string | undefined,
  STATUS:
    eventService.convertStatusToBoolean(selectedData.value?.STATUS) || true,
  STRUCTURE_ID: selectedData.value?.STRUCTURE_ID as string | undefined,
  PARENT_EVENT_ID: selectedData.value?.PARENT_EVENT_ID || undefined,
  LOCATION: (selectedData.value?.LOCATION as string) || undefined,
  CLASSIFICATION: (selectedData.value?.CLASSIFICATION as string) || undefined,
  SALES_METHOD: (selectedData.value?.SALES_METHOD as string) || undefined,
  GEN_CATEGORY_ID:
    Number(selectedData.value?.GEN_CATEGORY_ID as string) || undefined,
  URL_API_EXTERNAL: selectedData.value?.URL_API_EXTERNAL as string | undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
});

const optionsSales = [
  {
    label: "Evento sem produtos",
    value: "I",
  },
  {
    label: "Vendedor escolhe produto",
    value: "S",
  },
  {
    label: "Usuário escolhe produto",
    value: "U",
  },
];

async function fetchData() {
  const response = await newsServices.getTags(NrOrg); // MUDAR SERVICE
  const responseCategories = await eventService.indexCategories(NrOrg);
  const responseStructure = await services.indexStructure(NrOrg);

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
  if (Array.isArray(responseCategories)) {
    optionsCategory.value = responseCategories.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
  if (Array.isArray(responseStructure)) {
    optionsStructure.value = responseStructure.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
  if (selectedData.value && selectedData.value.evt_tag_event.length > 0) {
    for (let i = 0; i < selectedData.value.evt_tag_event.length; i++) {
      selected.value.push(selectedData.value.evt_tag_event[i].EVT_TAG_ID);
    }
  }
}

async function searchParent(q: string) {
  const runtimeConfig = useRuntimeConfig();
  const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
  loading.value = true;

  const event = await $fetch<parentEvent>(
    `${apiBaseUrl}/events?nrorg=${NumberOrg}&status=A`,
    { params: { q } }
  );

  loading.value = false;
  return event.data;
}

onBeforeUnmount(() => {
  setSelectedData(null);
});

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  // event.data.STATUS = newsServices.convertToString(state.ACTIVE); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING
  isLoading.value = true;
  const data = {
    NAME: state.NAME,
    _INITIAL_DATE: state.INITIAL_DATE.toLocaleString(),
    _FINAL_DATE: state.FINAL_DATE.toLocaleString(),
    IMAGE_COVER: state.IMAGE_COVER,
    STATUS: eventService.convertStatusToString(state.STATUS),
    STRUCTURE_ID: Number(state.STRUCTURE_ID),
    PARENT_EVENT_ID: state.PARENT_EVENT_ID?.ID,
    LOCATION: state.LOCATION,
    CLASSIFICATION: state.CLASSIFICATION,
    SALES_METHOD: state.SALES_METHOD,
    GEN_CATEGORY_ID: Number(state.GEN_CATEGORY_ID),
    NRORG: NrOrg,
    USER_ID: UserId,
  };

  const dataEvtTags = {
    TAG_IDS: selected.value,
    EVT_EVENT_ID: selectedData.value?.ID,
    NRORG: NrOrg,
    CREATED_BY: UserId,
  };

  if (selectedData.value?.ID === undefined) {
    const response: any = await eventService.postEvtE(data);
    if (response) {
      dataEvtTags.EVT_EVENT_ID = response.ID;
      await eventService.postEtvTags(dataEvtTags);
      isLoading.value = false;
      router.push({
        name: "events-ticket",
        query: {
          ID: response.ID,
        },
      });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await eventService.updateEvtE(
      data,
      selectedData.value?.ID
    );
    if (response) {
      await eventService.postEtvTags(dataEvtTags);
      router.push({ name: "events" });
    } else {
      isLoading.value = false;
    }
  }
}

onMounted(() => {
  fetchData();
  // const str = "12";
  // selected.value = str.split(",").map(Number);
});
</script>
