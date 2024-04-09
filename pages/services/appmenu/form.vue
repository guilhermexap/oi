<template>
  <UContainer>
    <UCard>
      <UModal v-model="isOpen" :transition="false">
        <div class="p-4">
          <div class="flex flex-col justify-between w-full h-full">
            <p class="py-4">
              Deseja excluir este registro? Esta ação não pode ser desfeita.
            </p>
            <div class="flex justify-end gap-3">
              <UButton @click="isOpen = false">Cancelar</UButton>
              <UButton color="gray" variant="solid" @click="removeItem"
                >Remover</UButton
              >
            </div>
          </div>
        </div>
      </UModal>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 px-3"
        @submit="onSubmit"
      >
        <div class="flex justify-between items-center">
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">{{ titlePage }} botão</h5>
          </div>
          <div class="flex gap-3">
            <UButton
              v-if="(getSelectedData() ?? { ID: undefined }).ID"
              type="button"
              color="red"
              size="xl"
              :disabled="isLoading"
              @click="isOpen = true"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Remover</span>
            </UButton>
            <UButton
              type="button"
              color="gray"
              size="xl"
              :disabled="isLoading"
              @click="backPage"
              >Voltar
            </UButton>
            <UButton
              type="submit"
              color="primary"
              size="xl"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
        <div class="mx-auto mt-4">
          <h5>Dados</h5>
          <div class="grid grid-cols-5 gap-4 items-start">
            <div class="flex flex-col gap-4 col-span-3">
              <div class="flex gap-4 items-start">
                <UFormGroup label="Ordenação" name="ORDENATION" class="w-16">
                  <UInput v-model="state.ORDENATION" v-mask="'###'" />
                </UFormGroup>

                <UFormGroup label="Nome" name="NAME" class="flex-grow">
                  <UInput v-model="state.NAME" />
                </UFormGroup>
                <UFormGroup name="STATUS_APP" class="pt-[2rem]">
                  <UCheckbox
                    id="nuxt-checkbox"
                    v-model="state.STATUS_APP"
                    name="STATUS_APP"
                    label="App ativo"
                  />
                </UFormGroup>
              </div>

              <div class="flex gap-4 items-start">
                <UFormGroup label="Tipo" name="TYPE" class="">
                  <USelect
                    v-model="state.TYPE"
                    placeholder="Selecione..."
                    :options="optionsType"
                  />
                </UFormGroup>

                <UFormGroup
                  label="Botão superior"
                  name="PARENT_ID"
                  class="flex-grow"
                >
                  <USelect
                    v-model="state.PARENT_ID"
                    placeholder="Selecione..."
                    :options="options"
                    :disabled="
                      state.TYPE !== 'LINK' &&
                      state.TYPE !== 'BUTTON' &&
                      state.TYPE !== 'HTML'
                    "
                  />
                  <p
                    v-if="showError2"
                    class="mt-2 text-red-500 dark:text-red-400 text-sm"
                  >
                    Apenas menus do tipo 'botão' são permitidos. Se esta for a
                    opção desejada, por favor, altere o tipo do menu
                    selecionado.
                  </p>
                </UFormGroup>
              </div>

              <div class="flex gap-4 items-end justify-between"></div>
              <UFormGroup label="Descrição ou link" name="DECRIPTION">
                <UTextarea v-model="state.DECRIPTION" style="height: 13rem" />
              </UFormGroup>
            </div>

            <div class="flex flex-col justify-end mb-4 col-span-2">
              <div
                class="bg-gray-200 border h-60 mb-4 mt-2 flex items-center justify-center rounded-md text-gray-500"
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
                <div class="flex gap-2 items-center justify-center">
                  <UInput
                    v-model="state.IMAGE"
                    :disabled="!!state.ICON"
                    class="flex-grow"
                  />
                  <div
                    v-if="state.IMAGE"
                    class="flex text-red-600 items-center justify-center rounded-sm cursor-pointer hover:text-red-500 transition-opacity"
                    title="Remover imagem"
                    @click="state.IMAGE = undefined"
                  >
                    <i class="fa fa-close p-1"></i>
                  </div>
                </div>
              </UFormGroup>
              <UDivider label="Ou" class="py-2" />
              <UFormGroup label="Ícone" name="ICON">
                <div class="flex gap-3 items-center justify-center">
                  <AwesomeIconsSelect
                    v-model="state.ICON"
                    class="flex-grow"
                    placeholder="Selecione..."
                    :disabled="!!state.IMAGE"
                  ></AwesomeIconsSelect>
                  <div
                    v-if="state.ICON"
                    class="-m-3 text-red-600 flex items-center justify-center rounded-sm cursor-pointer hover:text-red-500 transition-opacity"
                    title="Remover ícone"
                    @click="state.ICON = undefined"
                  >
                    <i class="fa fa-close p-1"></i>
                  </div>
                  <div
                    class="w-9 h-10 bg-gray-200 border flex items-center justify-center rounded-sm"
                  >
                    <i :class="`fa fa-${state.ICON}`"></i>
                  </div>
                </div>
              </UFormGroup>
              <p
                v-if="showError"
                class="mt-2 text-red-500 dark:text-red-400 text-sm"
              >
                A url da Imagem ou Icone devem ser preenchidos
              </p>
            </div>
          </div>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
import appServices from "~/services/app.service";
import { getSelectedData, setSelectedData } from "~/services/editService";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const isOpen = ref(false);
const showError = ref();
const showError2 = ref();
const route = useRoute();
const router = useRouter();
const options = ref<
  { label: string; value: number; disabled: boolean; type: string }[]
>([]);
const selectedData = ref<any>(getSelectedData());
let titlePage = "Adicionar novo";

definePageMeta({
  middleware: ["auth"],
});

if (selectedData.value?.ID) {
  titlePage = "Editar";
}

const schema = object({
  NAME: string().required("O nome deve ser preenchido"),
  IMAGE: string().nullable(),
  ICON: string().typeError("Valor inválido"),
  DECRIPTION: string().nullable(),
  TYPE: string().required("O tipo deve ser selecionado"),
  ORDENATION: string().nullable(),
  STATUS: string(),
  STATUS_APP: string(),
  PARENT_ID: string().nullable(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
}).test(
  "one-of-fields",
  "Preencha pelo menos um dos campos IMAGE ou ICON",
  function (value) {
    const { IMAGE, ICON } = value;
    const atLeastOneFieldFilled = !!IMAGE || !!ICON;
    showError.value = !(!!IMAGE || !!ICON);
    return atLeastOneFieldFilled;
  }
);

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: (selectedData.value?.NAME as string) || undefined,
  IMAGE: (selectedData.value?.IMAGE as string) || undefined,
  ICON: selectedData.value?.ICON as string | undefined,
  DECRIPTION: (selectedData.value?.DECRIPTION as string) || undefined,
  TYPE: (selectedData.value?.TYPE as string) || undefined,
  ORDENATION: (selectedData.value?.ORDENATION as string) || undefined,
  PARENT_ID: (selectedData.value?.PARENT_ID as string) || undefined,
  STATUS: "A",
  STATUS_APP:
    services.convertToBoolean(selectedData.value?.STATUS?.toString()) || true,
  NRORG: NrOrg,
  USER_ID: UserId,
});

// watchEffect(() => {
//   console.log(
//     (getSelectedData() ?? { ID: undefined }).ID,
//     route.query.new === "true",
//     selectedData.value?.ID
//   );
// });
watch(
  () => getSelectedData(),
  (newQuery: any) => {
    if (newQuery) {
      state.NAME = newQuery.NAME;
      state.IMAGE = newQuery.IMAGE;
      state.ICON = newQuery.ICON;
      state.DECRIPTION = newQuery.DECRIPTION;
      state.TYPE = newQuery.TYPE;
      state.ORDENATION = newQuery.ORDENATION;
      state.PARENT_ID = newQuery.PARENT_ID;
      state.STATUS_APP = services.convertToBoolean(newQuery.STATUS?.toString());
      newQuery.ID ? (titlePage = "Editar") : (titlePage = "Adicionar novo");
    }

    showError2.value = false;
    isLoading.value = false;

    if (Array.isArray(options.value)) {
      options.value.forEach((item) => {
        item.disabled =
          selectedData.value?.ID !== null &&
          item.value === parseInt(selectedData.value?.ID as string);
      });
    }
  },
  { immediate: true }
);

const optionsType = [
  {
    label: "Link",
    value: "LINK",
  },
  {
    label: "Botão",
    value: "BUTTON",
  },
  {
    label: "Texto",
    value: "HTML",
  },
];

const backPage = () => {
  router.push({ name: "services-appmenu" });
};

const removeItem = async () => {
  const userId = localStorage.getItem("userId");
  const response: any = await services.updateStatus(
    selectedData.value?.ID,
    "I",
    userId
  );
  if (response) {
    emitEvent();
    fetchOptions();
    router.push({ name: "services-appmenu" });
  } else {
    isLoading.value = false;
  }
};

const fetchOptions = async () => {
  const response = await appServices.indexOptions(NrOrg);

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID, TYPE }) => ({
      label: NAME,
      value: ID,
      disabled: ID === parseInt(selectedData.value?.ID as string),
      type: TYPE,
    }));
  }
};

onMounted(() => {
  fetchOptions();
});

onBeforeUnmount(() => {
  setSelectedData(null);
});

const { $bus }: any = useNuxtApp();
const emitEvent = () => {
  $bus.$emit("create");
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const item = options.value.find(
    (option) => option.value === parseInt(event.data.PARENT_ID as string)
  );
  if (item && item.type !== "BUTTON") {
    return (showError2.value = true);
  } else {
    const data = {
      NAME: state.NAME,
      IMAGE: state.IMAGE,
      ICON: state.ICON,
      DECRIPTION: state.DECRIPTION,
      TYPE: state.TYPE,
      ORDENATION: state.ORDENATION?.toString(),
      PARENT_ID: state.PARENT_ID?.toString(),
      STATUS: state.STATUS,
      STATUS_APP: services.convertToString(event.data.STATUS),
      NRORG: NrOrg,
      USER_ID: UserId,
    };
    isLoading.value = true;
    if (
      (getSelectedData() ?? { ID: undefined }).ID === undefined &&
      route.query.new === "true"
    ) {
      const response: any = await appServices.postAppService(data);
      if (response) {
        emitEvent();
        fetchOptions();
        router.push({ name: "services-appmenu" });
      } else {
        isLoading.value = false;
      }
    } else {
      const response = await appServices.updateAppService(
        data,
        (getSelectedData() ?? { ID: undefined }).ID
      );
      if (response) {
        emitEvent();
        router.push({ name: "services-appmenu" });
      } else {
        isLoading.value = false;
      }
    }
  }
}
</script>
