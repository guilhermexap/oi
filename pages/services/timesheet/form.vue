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
              {{ titlePage }} quadro de horários
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
            <UFormGroup label="Nome" name="NAME">
              <UInput v-model="state.NAME" />
            </UFormGroup>
            <div class="flex w-full gap-3">
              <UFormGroup
                v-mask="'##:##'"
                label="Horário inicial"
                name="INITIAL_TIME"
                class="flex-grow"
              >
                <UInput v-model="state.INITIAL_TIME" />
              </UFormGroup>
              <UFormGroup
                v-mask="'##:##'"
                label="Horário final"
                name="FINAL_TIME"
                class="flex-grow"
              >
                <UInput v-model="state.FINAL_TIME" />
              </UFormGroup>
            </div>

            <UFormGroup name="STATUS">
              <UCheckbox
                id="nuxt-checkbox"
                v-model="state.STATUS"
                name="STATUS"
                label="Quadro ativo"
              />
            </UFormGroup>
          </div>
        </div>
      </UForm>
    </UCard>
    <!-- TABELA -->
    <TimesheetTable v-if="route.query.ID" :service-id="serviceId || ''" />
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
import timesheetServices from "~/services/timesheet.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const route = useRoute();

// NUMERO DO SERVIÇO
const serviceId = ref(route.query.ID?.toString());

let titlePage = "Adicionar";

definePageMeta({
  middleware: ["auth"],
});

if (route.query.ID !== undefined) {
  titlePage = "Editar";
}

const router = useRouter();
const backPage = () => {
  router.push({ name: "services-timesheet" });
};

const schema = object({
  NAME: string().required("O nome deve ser preenchido"),
  INITIAL_TIME: string().required("A data inicial deve ser preenchida"),
  FINAL_TIME: string().required("A data final deve ser preenchida"),
  STATUS: string(),
  TIME: number().nullable(),
  SEASONAL_DATE: number().nullable(),

  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  NAME: route.query.NAME as string | undefined,
  INITIAL_TIME: (route.query.INITIAL_TIME as string) || undefined,
  FINAL_TIME: (route.query.FINAL_TIME as string) || undefined,
  STATUS: services.convertToBoolean(route.query.STATUS?.toString()) || true,
  TIME: route.query.TIME as string | undefined,
  SEASONAL_DATE: route.query.SEASONAL_DATE as string | undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  event.data.STATUS = services.convertToString(state.STATUS); // CONVERTE O ACTIVE PARA 1 OU 2 EM STRING
  isLoading.value = true;
  if (route.query.ID === undefined) {
    const response: any = await timesheetServices.postTimesheet(event.data);
    if (response) {
      // router.push({ name: "timesheet" });
      router.push({
        name: "services-timesheet-new",
        query: {
          ID: response.ID,
        },
      });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await timesheetServices.updateTimesheet(
      event.data,
      route.query.ID
    );
    if (response) {
      router.push({ name: "services-timesheet" });
    } else {
      isLoading.value = false;
    }
  }
}
</script>
