<template>
  <!-- <app-layout> -->
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
              {{ titlePage }}
              {{ $route.params.ID }}
            </h5>
          </div>
          <div class="flex gap-3">
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
          <div class="grid grid-cols-5 gap-4">
            <div class="flex flex-col gap-4 col-span-3">
              <UFormGroup label="Nome" name="NAME">
                <UInput v-model="state.NAME" />
              </UFormGroup>

              <UFormGroup label="Tipo" name="TYPE">
                <USelect
                  v-model="state.TYPE"
                  placeholder="Selecione..."
                  :options="optionsType"
                />
              </UFormGroup>

              <UFormGroup label="Botão superior" name="PARENT_ID">
                <USelect
                  v-model="state.PARENT_ID"
                  placeholder="Selecione..."
                  :options="options"
                />
              </UFormGroup>
              <UFormGroup label="Ordenação" name="ORDENATION">
                <UInput v-model="state.ORDENATION" v-mask="'###'" />
              </UFormGroup>
              <div class="flex gap-4">
                <UFormGroup name="STATUS">
                  <UCheckbox
                    id="nuxt-checkbox"
                    v-model="state.STATUS"
                    name="STATUS"
                    label="Serviço ativo"
                  />
                </UFormGroup>
                <UFormGroup name="STATUS_APP">
                  <UCheckbox
                    id="nuxt-checkbox"
                    v-model="state.STATUS_APP"
                    name="STATUS_APP"
                    label="App ativo"
                  />
                </UFormGroup>
              </div>
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

              <UDivider label="Ou" class="py-2" />
              <UFormGroup label="Ícone" name="ICON">
                <div class="flex gap-3 items-center justify-center">
                  <USelect
                    v-model="state.ICON"
                    class="flex-grow"
                    placeholder="Selecione..."
                    :options="icons"
                    option-attribute="name"
                    :disabled="!!state.IMAGE"
                    ><template #option="{ option }">
                      <i :class="option.value"></i> </template
                  ></USelect>
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
                    <i :class="state.ICON"></i>
                  </div>
                </div>
              </UFormGroup>
              <!-- <p
                v-if="showError"
                class="mt-2 text-red-500 dark:text-red-400 text-sm"
              >
                A url da Imagem ou Icone devem ser preenchidos
              </p> -->
            </div>
          </div>

          <UFormGroup label="Descrição ou link" name="DECRIPTION">
            <UInput v-model="state.DECRIPTION" />
          </UFormGroup>
        </div>
      </UForm>
    </UCard>
  </UContainer>
  <!-- </app-layout> -->
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
import appServices from "~/services/app.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const options = ref<{ label: string; value: number }[]>([]);
let titlePage = "Adicionar";

// definePageMeta({
//   layout: "app-layout",
// });

if (route.query.ID !== undefined) {
  titlePage = "Editar";
}

const schema = object({
  NAME: string().required("O nome deve ser preenchido"),
  IMAGE: string(),
  ICON: string(),
  DECRIPTION: string(),
  TYPE: string(),
  ORDENATION: string(),
  STATUS: string(),
  STATUS_APP: string(),
  PARENT_ID: string(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: (route.query.NAME as string) || undefined,
  IMAGE: (route.query.IMAGE as string) || undefined,
  ICON: route.query.ICON as string | undefined,
  DECRIPTION: (route.query.DECRIPTION as string) || undefined,
  TYPE: (route.query.TYPE as string) || undefined,
  ORDENATION: (route.query.ORDENATION as string) || undefined,
  PARENT_ID: (route.query.PARENT_ID as string) || undefined,
  STATUS: services.convertToBoolean(route.query.STATUS?.toString()) || true,
  STATUS_APP:
    services.convertToBoolean(route.query.STATUS_APP?.toString()) || false,
  NRORG: NrOrg,
  USER_ID: UserId,
});

const icons = [
  { name: "Telefone", value: "fa fa-phone" },
  { name: "Envelope", value: "fa fa-envelope" },
  { name: "Localização", value: "fa fa-map-marker" },
  { name: "Câmera", value: "fa fa-camera" },
  { name: "Café", value: "fa fa-coffee" },
  { name: "Cadeira", value: "fa fa-chair" },
  { name: "Lâmpada", value: "fa fa-lightbulb" },
  { name: "Livro", value: "fa fa-book" },
  { name: "Globo", value: "fa fa-globe" },
  { name: "Mala", value: "fa fa-suitcase" },
];

const optionsType = [
  {
    label: "Link",
    value: "LINK",
  },
  {
    label: "Button",
    value: "BUTTON",
  },
  {
    label: "HTML",
    value: "HTML",
  },
];

const backPage = () => {
  router.push({ name: "services-appmenu" });
};

onMounted(async () => {
  const response = await appServices.indexOptions(NrOrg);

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  event.data.STATUS = services.convertToString(state.STATUS); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING
  event.data.STATUS_APP = services.convertToString(state.STATUS_APP); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING

  // event.data.MAXPERSONS = state.MAXPERSONS?.toString();
  isLoading.value = true;
  if (route.query.ID === undefined) {
    const response: any = await appServices.postAppService(event.data);
    if (response) {
      router.push({
        name: "services-appmenu",
        query: {
          ID: response.ID,
        },
      });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await appServices.updateAppService(
      event.data,
      route.query.ID
    );
    if (response) {
      router.push({ name: "services-appmenu" });
    } else {
      isLoading.value = false;
    }
  }
}
</script>
