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
              {{ titlePage }} unidade
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
          <h5>Dados</h5>
          <div class="flex flex-col gap-4">
            <div class="py-4 flex gap-4 flex-col">
              <div class="flex gap-4">
                <UFormGroup label="Nome" name="NAME" class="w-1/2">
                  <UInput v-model="state.NAME" />
                </UFormGroup>
                <UFormGroup label="E-mail" name="EMAIL" class="w-1/2">
                  <UInput v-model="state.EMAIL" />
                </UFormGroup>
              </div>

              <UFormGroup label="Descrição" name="DESCRIPTION">
                <UTextarea v-model="state.DESCRIPTION" />
              </UFormGroup>

              <div class="flex gap-4 flex-col">
                <h5
                  class="py-3.5 border-b border-gray-200 dark:border-gray-700"
                >
                  Endereço
                </h5>
                <div class="flex gap-4">
                  <UFormGroup label="Rua" name="STREET" class="w-3/4">
                    <UInput v-model="state.STREET" />
                  </UFormGroup>
                  <UFormGroup label="Número" name="STREET_NUMBER" class="w-1/4">
                    <UInput v-model="state.STREET_NUMBER" type="number" />
                  </UFormGroup>
                </div>
                <div class="flex gap-4">
                  <UFormGroup label="Bairro" name="NEIGHBORHOOD" class="w-3/4">
                    <UInput v-model="state.NEIGHBORHOOD" />
                  </UFormGroup>
                  <UFormGroup label="Cidade" name="CITY" class="w-3/4">
                    <UInput v-model="state.CITY" />
                  </UFormGroup>
                  <UFormGroup label="UF" name="PROVINCY" class="w-1/4">
                    <UInput v-model="state.PROVINCY" />
                  </UFormGroup>
                  <UFormGroup label="Cep" name="CEP" class="w-2/4">
                    <UInput v-model="state.CEP" v-mask="'#####-###'" />
                  </UFormGroup>
                </div>
              </div>
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
import structureService from "~/services/strucures.service";
import { getSelectedData, setSelectedData } from "~/services/editService";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const selectedData = ref<any>(getSelectedData());

let titlePage = "Adicionar";

definePageMeta({
  middleware: ["auth"],
});

if (selectedData.value?.ID) {
  titlePage = "Editar";
}

const router = useRouter();
const backPage = () => {
  router.push({ name: "structures" });
};

const schema = object({
  NAME: string().required("O nome deve ser preenchido"),
  DESCRIPTION: string(),
  EMAIL: string().email().required("O e-mail deve ser preenchido"),
  STREET: string().required("A rua deve ser preenchida"),
  STREET_NUMBER: string().required("O número deve ser preenchido"),
  NEIGHBORHOOD: string().required("O bairro deve ser preenchido"),
  CITY: string().required("A classificação deve ser preenchida"),
  PROVINCY: string().required("O estado deve ser preenchido"),
  CEP: string().required("O cep deve ser preenchido"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: (selectedData.value?.NAME as string) || undefined,
  DESCRIPTION: (selectedData.value?.DESCRIPTION as string) || undefined,
  EMAIL: selectedData.value?.EMAIL as string | undefined,
  STREET: (selectedData.value?.gen_address?.STREET as string) || undefined,
  STREET_NUMBER:
    (selectedData.value?.gen_address?.STREET_NUMBER as string) || undefined,
  NEIGHBORHOOD:
    (selectedData.value?.gen_address?.NEIGHBORHOOD as string) || undefined,
  CITY: (selectedData.value?.gen_address?.CITY as string) || undefined,
  PROVINCY: (selectedData.value?.gen_address?.PROVINCY as string) || undefined,
  CEP: (selectedData.value?.gen_address?.CEP as string) || undefined,
  STATUS:
    structureService.convertStatusToBoolean(selectedData.value?.STATUS) || true,
  NRORG: NrOrg,
  USER_ID: UserId,
});

onBeforeUnmount(() => {
  setSelectedData(null);
});

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const data = {
    NAME: state.NAME,
    DESCRIPTION: state.DESCRIPTION !== "" ? state.DESCRIPTION : undefined,
    EMAIL: state.EMAIL,
    TYPE: "U",
    STATUS: "A",
    STRUCTURE_LEVEL: 0,
    GEN_ADDRESS_ID: undefined,
    NRORG: NrOrg,
    USER_ID: UserId,
  };

  const dataAddress = {
    STREET: state.STREET,
    STREET_NUMBER: state.STREET_NUMBER?.toString(),
    NEIGHBORHOOD: state.NEIGHBORHOOD,
    CITY: state.CITY,
    PROVINCY: state.PROVINCY,
    CEP: state.CEP,
    STATUS: "A",
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  if (selectedData.value?.ID === undefined) {
    const response: any = await structureService.postAddress(dataAddress);
    if (response) {
      isLoading.value = false;
      data.GEN_ADDRESS_ID = response.ID;
      await structureService.postStructureUnit(data);
      return router.push({ name: "structures" });
    } else {
      isLoading.value = false;
    }
  } else {
    dataAddress.STATUS = structureService.convertStatusToString(state.STATUS);
    data.STATUS = structureService.convertStatusToString(state.STATUS);
    await structureService.updateAddress(
      dataAddress,
      selectedData.value?.gen_address?.ID
    );
    const response = await structureService.updateStructureUnit(
      data,
      selectedData.value?.ID
    );
    isLoading.value = false;
    if (response) {
      return router.push({ name: "structures" });
    } else {
      isLoading.value = false;
    }
  }
}

onMounted(() => {
  // fetchData();
  // const str = "12";
  // selected.value = str.split(",").map(Number);
});
</script>
