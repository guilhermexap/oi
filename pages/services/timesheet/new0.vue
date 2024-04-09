<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <!-- TABELA -->
  <UCard class="mt-3">
    <div
      class="w-full flex items-center justify-start border-b border-gray-200 dark:border-gray-700"
    >
      <h5 class="py-3.5">Adicionar horário</h5>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 px-3"
      @submit="onSubmitStructure"
    >
      <div class="p-4 w-[500px] mx-auto">
        <div class="flex flex-col gap-4">
          <UFormGroup label="Horário inicial" name="INITIAL_TIME">
            <UInput v-model="state.INITIAL_TIME" v-mask="'##:##'" />
          </UFormGroup>
          <UFormGroup label="Horário final" name="FINAL_TIME">
            <UInput v-model="state.FINAL_TIME" v-mask="'##:##'" />
          </UFormGroup>
          <UFormGroup label="Dias da Semana" name="SER_DAY_TIMESHEET_VALUES">
            <div>
              <label v-for="(day, index) in daysOfweek" :key="index">
                <input
                  v-model="state.SER_DAY_TIMESHEET_VALUES"
                  type="checkbox"
                  :value="index"
                />
                {{ day }}
              </label>
            </div>
          </UFormGroup>
          <UFormGroup label="Tipo de horário" name="TYPES" class="flex-grow">
            <USelect
              v-model="state.TYPES"
              placeholder="Selecione..."
              :options="options"
            />
          </UFormGroup>

          <UFormGroup name="STATUS" class="">
            <UCheckbox
              id="nuxt-checkbox"
              v-model="state.STATUS"
              label="Horário ativo"
            />
          </UFormGroup>
          <UButton
            type="submit"
            color="primary"
            size="xl"
            class="mr-2 flex justify-center"
            :disabled="isLoading"
            ><span v-if="isLoading" class="fa fa-spinner animate-spin" />
            <span v-else>Salvar</span>
          </UButton>
        </div>
      </div>
    </UForm>
  </UCard>

  <!-- MODAL TA TABELA -->
  <UModal v-model="isOpen"
    ><div class="p-4">
      <div class="flex flex-col justify-between w-full h-full">
        <p class="py-4">Deseja adicionar um novo horário?</p>
        <div class="flex justify-end gap-3">
          <UButton @click="redirectPage">Finalizar</UButton>
          <UButton color="gray" variant="solid" @click="clearState"
            >Adicionar</UButton
          >
        </div>
      </div>
    </div></UModal
  >
  <!-- MODAL DA TABELA -->
</template>

<script setup lang="ts" props="props">
import { array, number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
import timeTimesheetServices from "~/services/timeTimesheet.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const isOpen = ref(false);

const schema = object({
  STATUS: string(),
  INITIAL_TIME: string().required("Horário inicial obrigatório"),
  FINAL_TIME: string().required("Horário final obrigatório"),
  SER_DAY_TIMESHEET_VALUES: array()
    .min(1, "Selecione pelo menos uma opção")
    .required("Campo Obrigatório"),
  NRORG: number().default(NrOrg),
  TYPES: number().required("Selecione o tipo de horário"),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;
interface DayTimesheet {
  DAY_OF_WEEK: number;
}

const state = reactive({
  STATUS: true,
  INITIAL_TIME: undefined,
  FINAL_TIME: undefined,
  TYPES: undefined,
  SER_TIMESHEET_ID: undefined,
  SER_DAY_TIMESHEET_VALUES: [] as DayTimesheet[],
  NRORG: NrOrg,
  USER_ID: UserId,
});

const options = [
  {
    label: "Disponível",
    value: 0,
  },
  {
    label: "Manutenção",
    value: 1,
  },
];

const daysOfweek = ref([
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Feriado",
]);

const clearState = () => {
  // limpa os campos para criar novo horário
  isOpen.value = false;
  state.STATUS = true;
  state.INITIAL_TIME = undefined;
  state.FINAL_TIME = undefined;
  state.TYPES = undefined;
  state.SER_TIMESHEET_ID = undefined;
  state.SER_DAY_TIMESHEET_VALUES = [] as DayTimesheet[];
  state.NRORG = NrOrg;
  state.USER_ID = UserId;
};

const redirectPage = () => {
  router.push({ name: "timesheet" });
};

async function onSubmitStructure(event: FormSubmitEvent<Schema>) {
  isOpen.value = true;
  isLoading.value = true;
  if (route.query.ID !== undefined) {
    const serDayTimesheetString =
      event.data.SER_DAY_TIMESHEET_VALUES.toString();
    const data = {
      INITIAL_TIME: event.data.INITIAL_TIME,
      FINAL_TIME: event.data.FINAL_TIME,
      SER_DAY_TIMESHEET_VALUES: serDayTimesheetString,
      STATUS: services.convertToString(event.data.STATUS),
      SER_TIMESHEET_ID: route.query.ID?.toString() as string,
      TYPES: event.data.TYPES,
      NRORG: NrOrg,
      USER_ID: UserId,
    };

    const response = await timeTimesheetServices.postTimeTimesheet(data);
    if (response) {
      isLoading.value = false;
    }
  }
  isLoading.value = false;
}
</script>
