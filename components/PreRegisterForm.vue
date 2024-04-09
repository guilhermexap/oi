<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4 px-3"
    @submit="onSubmit"
  >
    <div class="p-4">
      <div class="flex flex-col gap-4">
        <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
          {{ titlePage }} Pré-registro
        </h5>
        <UFormGroup label="Matrícula" name="EXTERNAL_ID">
          <UInput v-model="state.EXTERNAL_ID" />
        </UFormGroup>
        <UFormGroup label="CPF" name="CPF">
          <UInput v-model="state.CPF" v-mask="'###.###.###-##'" />
        </UFormGroup>
        <UFormGroup label="E-mail" name="EMAIL">
          <UInput v-model="state.EMAIL" />
        </UFormGroup>
        <UFormGroup label="Telefone" name="PHONE_NUMBER">
          <UInput v-model="state.PHONE_NUMBER" v-mask="'(##) #####-####'" />
        </UFormGroup>
        <UFormGroup label="Data de nascimento" name="BIRTH">
          <UInput v-model="state.BIRTH" type="date" />
        </UFormGroup>
        <UButton
          type="submit"
          color="primary"
          size="xl"
          class="mt-4 flex justify-center"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="fa fa-spinner animate-spin" />
          <span v-else>Salvar</span>
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts" props="props">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import preRegister from "../services/pre-register.service";
const NumberOrg = localStorage.getItem("NRORG");
const NrOrg = parseInt(NumberOrg!);
const UsrId = localStorage.getItem("userId");
const UserId = parseInt(UsrId!);
const emit = defineEmits(["submit-success"]);

const isLoading = ref(false);

const titlePage = ref("Adicionar");

const props = defineProps<{
  rowEditData?: {
    ID: number;
    BIRTH: string;
    CPF: string;
    EMAIL: string;
    EXTERNAL_ID: number;
    NRORG: string;
    PHONE_NUMBER: string;
    STATUS: string;
  };
  isEditing: boolean;
}>();

const schema = object({
  EXTERNAL_ID: string().required("Matrícula obrigatória"),
  CPF: string().required("CPF obrigatório"),
  EMAIL: string().email().required("E-mail obrigatório"),
  PHONE_NUMBER: string().required("Telefone obrigatório"),
  BIRTH: string().required("Data de nascimento obrigatória"),
  NRORG: number().default(NrOrg),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  ID: props.rowEditData?.ID || undefined,
  EXTERNAL_ID: props.rowEditData?.EXTERNAL_ID || undefined,
  CPF: props.rowEditData?.CPF || undefined,
  EMAIL: props.rowEditData?.EMAIL || undefined,
  PHONE_NUMBER: props.rowEditData?.PHONE_NUMBER || undefined,
  BIRTH: props.rowEditData?.BIRTH || undefined,
  STATUS: props.rowEditData?.STATUS || undefined,
});

const clearState = () => {
  state.ID = undefined;
  state.EXTERNAL_ID = undefined;
  state.CPF = undefined;
  state.EMAIL = undefined;
  state.PHONE_NUMBER = undefined;
  state.BIRTH = undefined;
  state.STATUS = undefined;
};

onMounted(() => {
  if (!props.isEditing) {
    clearState();
  } else {
    titlePage.value = "Editar";
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const data = {
    EXTERNAL_ID: Number(event.data.EXTERNAL_ID),
    CPF: event.data.CPF.replace(/[^0-9]/g, ""),
    EMAIL: event.data.EMAIL,
    PHONE_NUMBER: event.data.PHONE_NUMBER,
    BIRTH: event.data.BIRTH,
    STATUS: "A",
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  if (!props.isEditing) {
    const response = await preRegister.postPreRegister(data);
    if (response === "success") {
      isLoading.value = false;
      emit("submit-success");
      return;
    }
  } else {
    const response = await preRegister.updatePreRegister(
      data,
      props.rowEditData?.ID
    );
    if (response === "success") {
      isLoading.value = false;
      emit("submit-success");
      return;
    }
  }
  isLoading.value = false;
}
</script>
