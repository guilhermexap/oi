<template>
  <UContainer>
    <UModal v-model="isOpen" :transition="false" prevent-close>
      <div class="p-4">
        <div class="flex flex-col justify-between w-full h-full">
          <p class="py-4">
            Seja bem vindo(a), finalize as configurações da comunidade para
            continuar
          </p>
          <div class="flex justify-end gap-3">
            <UButton @click="closeModal">Fechar</UButton>
          </div>
        </div>
      </div>
    </UModal>
    <UCard class="relative">
      <div
        v-if="loading"
        class="absolute top-0 left-0 bg-white/80 h-full z-10 w-full flex flex-col items-center overflow-hidden"
      >
        <i class="fa fa-sync animate-spin mb-2 mt-96"></i>
        <span>Carregando...</span>
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="flex justify-between items-center">
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">
              Configurações da Comunidade
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
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
        <div class="mx-auto mt-4">
          <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
            Geral
          </h5>
          <div class="grid grid-cols-5 gap-4">
            <div class="py-4 flex gap-4 flex-col col-span-3">
              <UFormGroup label="Nome" name="NAME">
                <UInput v-model="state.NAME" />
              </UFormGroup>

              <UFormGroup
                v-mask="'##.###.###/####-##'"
                label="CNPJ"
                name="CNPJ"
              >
                <UInput v-model="state.CNPJ" />
              </UFormGroup>

              <UFormGroup label="Tipo" name="TYPE">
                <SelectMenu
                  v-model="state.TYPE"
                  placeholder="Selecione..."
                  searchable
                  :options="options"
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormGroup>
              <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
                Estilo
              </h5>
              <UFormGroup label="Cor principal" name="PRIMARY_COLOR">
                <div class="flex flex-col gap-2 w-1/2">
                  <div
                    class="h-8 w-100% rounded-md overflow-hidden shadow-sm"
                    :style="{
                      'background-color': `${state.PRIMARY_COLOR}`,
                    }"
                  >
                    <ColorPicker
                      v-model:pure-color="state.PRIMARY_COLOR"
                      picker-type="chrome"
                      format="hex"
                      style="width: 100% !important"
                    />
                  </div>
                  <!-- <UInput v-model="state.PRIMARY_COLOR" /> -->
                </div>
              </UFormGroup>
            </div>
            <div class="flex flex-col gap-3 p-4 col-span-2">
              <!-- <div
                class="bg-gray-200 border h-64 flex items-center justify-center rounded-md text-gray-500"
                :style="{
                  'background-image': `url(${state.LOGO_IMAGE})`,
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                }"
              >
                <span v-if="!state.LOGO_IMAGE" class="fa fa-image fa-3x"></span>
              </div> -->
              <UFormGroup label="Logotipo">
                <ImageUploader
                  :image-url="urlLogo"
                  @image-uploaded="onLogoUploaded"
                />
              </UFormGroup>
              <!-- <UFormGroup label="Logotipo (Url da imagem)" name="LOGO_IMAGE">
                <div class="flex gap-2 items-center justify-center">
                  <UInput
                    v-model="state.LOGO_IMAGE"
                    class="flex-grow relative"
                  />
                  <div
                    v-if="state.LOGO_IMAGE"
                    class="flex text-red-600 items-center bg-white p-1 h-full justify-center rounded-r-md cursor-pointer absolute top-0 right-0 hover:text-red-500 transition-opacity"
                    title="Remover imagem"
                    @click="state.LOGO_IMAGE = undefined"
                  >
                    <i class="fa fa-close p-1"></i>
                  </div>
                </div>
              </UFormGroup> -->
            </div>
          </div>

          <!-- <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
            Estilo
          </h5> -->

          <!-- <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700 mt-3">
            SMTP (Configurações de envio de e-mail)
          </h5>
          <div class="py-4 flex gap-4 flex-col col-span-3">
            <UFormGroup label="HOST" name="PRIMARY_COLOR">
              <UInput v-model="state.HOST" class="flex-grow" />
            </UFormGroup>
            <UFormGroup label="HOST_PASSWORD" name="PRIMARY_COLOR">
              <UInput v-model="state.HOST_PASSWORD" class="flex-grow" />
            </UFormGroup>
            <UFormGroup label="HOST_FROM" name="PRIMARY_COLOR">
              <UInput v-model="state.HOST_FROM" class="flex-grow" />
            </UFormGroup>
            <UFormGroup label="HOST_FROM_NAME" name="PRIMARY_COLOR">
              <UInput v-model="state.HOST_FROM_NAME" class="flex-grow" />
            </UFormGroup>
          </div> -->
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { ColorPicker } from "vue3-colorpicker";
import config from "~/services/config.service";
import "vue3-colorpicker/style.css";

const showError = ref();
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const loading = ref(false);
const isOpen = ref(false);
const router = useRouter();
const urlLogo = ref("");

const options = ref<{ label: string; value: number }[]>([]);

definePageMeta({
  middleware: ["auth"],
});

const backPage = () => {
  router.push({ name: "dashboards-default" });
};

const closeModal = () => {
  isOpen.value = false;
  localStorage.removeItem("FIRST_TIME");
};

const onLogoUploaded = (url: any) => {
  state.LOGO_IMAGE = url;
};

const schema = object({
  TYPE: number().required("Selecione um tipo").typeError("Valor inválido"),
  NAME: string().required("O nome deve ser preenchido"),
  CNPJ: string().test("test-invalid-cnpj", "CNPJ inválido", (cnpj) => {
    if (cnpj) {
      return config.validateCNPJ(cnpj);
    }
    return true;
  }),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: undefined,
  CNPJ: undefined,
  TYPE: undefined,

  LOGO_IMAGE: undefined,
  PRIMARY_COLOR: undefined,
  // HOST: undefined,
  // HOST_PASSWORD: undefined,
  // HOST_FROM: undefined,
  // HOST_FROM_NAME: undefined,

  NRORG: NrOrg,
  MODIFIED_BY: UserId,
});

onMounted(async () => {
  const firstTime = localStorage.getItem("FIRST_TIME");
  if (firstTime !== null && firstTime === "true") {
    isOpen.value = true;
  }
  try {
    loading.value = true;
    const response: any = await config.indexGenOrganization(NrOrg);
    if (response) {
      loading.value = false;
      state.NAME = response.NAME;
      state.CNPJ = response.CNPJ === null ? "" : response.CNPJ;
      state.TYPE = response.TYPE;

      state.LOGO_IMAGE = response.gen_configuration.LOGO_IMAGE;
      urlLogo.value = response.gen_configuration.LOGO_IMAGE;
      state.PRIMARY_COLOR = response.gen_configuration.PRIMARY_COLOR;
      // state.HOST = response.gen_configuration.HOST;
      // state.HOST_PASSWORD = response.gen_configuration.HOST_PASSWORD;
      // state.HOST_FROM = response.gen_configuration.HOST_FROM;
      // state.HOST_FROM_NAME = response.gen_configuration.HOST_FROM_NAME;
    }
  } catch (error) {
    loading.value = false;

    console.error("error getting organization data:", error);
  }
});

options.value = [
  {
    value: 1,
    label: "Clubes",
  },
  {
    value: 2,
    label: "Universidades",
  },
  {
    value: 3,
    label: "Escolas",
  },
  {
    value: 4,
    label: "Empresa",
  },
  {
    value: 5,
    label: "Associações",
  },
  {
    value: 6,
    label: "Sindicatos",
  },
  {
    value: 7,
    label: "Igrejas",
  },
  {
    value: 8,
    label: "Grupos",
  },
  {
    value: 9,
    label: "Condomínios",
  },
  {
    value: 10,
    label: "Família",
  },
  {
    value: 11,
    label: "Partido político",
  },
  {
    value: 12,
    label: "Resorts",
  },
  {
    value: 13,
    label: "Colégios",
  },
  {
    value: 14,
    label: "Times",
  },
];

watchEffect(() => {
  console.log("state.LOGO-IMAGE", state.LOGO_IMAGE);
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  showError.value = false;
  const data = {
    NAME: state.NAME,
    CNPJ: state.CNPJ !== "" ? config.cleanCNPJ(state.CNPJ) : null,
    TYPE: Number(event.data.TYPE),
    LOGO_IMAGE: state.LOGO_IMAGE,
    LOGO_IMAGE_SMALL: state.LOGO_IMAGE,
    PRIMARY_COLOR: state.PRIMARY_COLOR,
    // HOST: state.HOST,
    // HOST_PASSWORD: state.HOST_PASSWORD,
    // HOST_FROM: state.HOST_FROM,
    // HOST_FROM_NAME: state.HOST_FROM_NAME,
  };
  isLoading.value = true;

  const response: any = await config.update(data, NrOrg);
  if (response) {
    isLoading.value = false;
  } else {
    isLoading.value = false;
  }
}
</script>
<style>
.vc-color-wrap {
  width: 100% !important;
  height: 100% !important;
}
</style>
