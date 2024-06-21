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
            <h5 class="font-weight-bolder mb-0 py-4">{{ titlePage }} espaço</h5>
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
          <h5>Dados</h5>
          <div class="grid grid-cols-5 gap-4">
            <div class="flex flex-col gap-4 col-span-3">
              <UFormGroup label="Nome" name="NAME">
                <UInput v-model="state.NAME" />
              </UFormGroup>

              <UFormGroup label="Descrição" name="DESCRIPTION">
                <!-- <UInput v-model="state.DESCRIPTION" /> -->
                <UTextarea v-model="state.DESCRIPTION" style="height: 5rem" />
              </UFormGroup>
              <div class="flex gap-4 flex-col">
                <UFormGroup label="Regras" name="RULES">
                  <!-- <UInput v-model="state.RULES" /> -->
                  <UTextarea v-model="state.RULES" style="height: 5rem" />
                </UFormGroup>
                <div class="flex w-full gap-3 mb-4 items-start justify-center">
                  <UFormGroup
                    label="Unidade"
                    name="PARENT_ID"
                    class="flex-grow"
                  >
                    <USelect
                      v-model="state.PARENT_ID"
                      placeholder="Selecione..."
                      :options="options"
                    />
                  </UFormGroup>
                  <UFormGroup
                    label="Capacidade máxima de pessoas"
                    name="MAXPERSONS"
                    class="flex-grow pt-1"
                  >
                    <UInput v-model="state.MAXPERSONS" type="number" />
                  </UFormGroup>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-between mb-4 col-span-2">
              <!-- <div
                class="bg-gray-200 border h-60 mb-4 mt-2 flex items-center justify-center rounded-md text-gray-500"
                :style="{
                  'background-image': `url(${state.IMAGE})`,
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                }"
              >
                <span v-if="!state.IMAGE" class="fa fa-image fa-3x"></span>
              </div> -->
              <UFormGroup label="Url da imagem" name="IMAGE">
                <ImageUploader
                  :image-url="urlLogo"
                  @image-uploaded="onLogoUploaded"
                />
                <!-- <UInput v-model="state.IMAGE" /> -->
              </UFormGroup>

              <UFormGroup label="Código QR" name="EXTERNAL_QRCODE" class="mt-4">
                <UInput v-model="state.EXTERNAL_QRCODE" />
              </UFormGroup>
            </div>
          </div>

          <UFormGroup name="STATUS">
            <UCheckbox
              id="nuxt-checkbox"
              v-model="state.STATUS"
              name="STATUS"
              label="Espaço ativo"
            />
          </UFormGroup>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
import spacesServices from "~/services/spaces.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const urlLogo = ref("");
const options = ref<{ label: string; value: number }[]>([]);
let titlePage = "Adicionar";

definePageMeta({
  middleware: ["auth"],
});

if (route.query.ID !== undefined) {
  titlePage = "Editar";
}

const onLogoUploaded = (url: string) => {
  state.IMAGE = url;
};

const schema = object({
  NAME: string().required("O nome deve ser preenchido"),
  DESCRIPTION: string(),
  RULES: string(),
  MAXPERSONS: string().required("O número máximo deve ser preenchido"),
  IMAGE: string(),
  EXTERNAL_QRCODE: string(),
  STATUS: string(),
  TYPE: string().default("L"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: (route.query.NAME as string) || undefined,
  DESCRIPTION: (route.query.DESCRIPTION as string) || undefined,
  RULES: (route.query.RULES as string) || undefined,
  PARENT_ID: (route.query.PARENT_ID as string) || undefined,
  MAXPERSONS: (route.query.MAXPERSONS as string) || "",
  IMAGE: (route.query.IMAGE as string) || undefined,
  EXTERNAL_QRCODE: (route.query.EXTERNAL_QRCODE as string) || undefined,
  STATUS: services.convertToBoolean(route.query.STATUS?.toString()) || true,
  NRORG: NrOrg,
  TYPE: "L",
  USER_ID: UserId,
});

const backPage = () => {
  router.push({ name: "services-spaces" });
};

onMounted(async () => {
  urlLogo.value = route.query.IMAGE as string;
  const response = await spacesServices.indexOptions(NrOrg);

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  event.data.STATUS = services.convertToString(state.STATUS); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING
  event.data.MAXPERSONS = state.MAXPERSONS?.toString();
  isLoading.value = true;
  if (route.query.ID === undefined) {
    const response: any = await spacesServices.postStructure(event.data);
    if (response) {
      router.push({
        name: "services-spaces",
        query: {
          ID: response.ID,
        },
      });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await spacesServices.updateStructure(
      event.data,
      route.query.ID
    );
    if (response) {
      router.push({ name: "services-spaces" });
    } else {
      isLoading.value = false;
    }
  }
}
</script>
