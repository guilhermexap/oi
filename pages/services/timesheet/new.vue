<template>
  <UContainer>
    <UCard>
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <div
          class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">Adicionar horários</h5>
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
        <div
          v-for="(item, index) in timesheets"
          :key="index"
          class="flex mt-4 pb-4 gap-4 w-full items-start border-b border-gray-200 dark:border-gray-700"
        >
          <UFormGroup label="Horário inicial" name="INITIAL_TIME">
            <UInput v-model="item.INITIAL_TIME" v-mask="'##:##'" />
          </UFormGroup>
          <UFormGroup label="Horário final" name="FINAL_TIME">
            <UInput v-model="item.FINAL_TIME" v-mask="'##:##'" />
          </UFormGroup>
          <!-- <UFormGroup label="Dias da Semana" name="SER_DAY_TIMESHEET_VALUES">
            <div class="w-96">
              <label v-for="(day, idx) in daysOfweek" :key="idx">
                <input
                  v-model="item.SER_DAY_TIMESHEET_VALUES"
                  type="checkbox"
                  :value="idx"
                />
                {{ day }}
              </label>
            </div>
          </UFormGroup> -->
          <UFormGroup label="Dias da Semana" name="SER_DAY_TIMESHEET_VALUES">
            <div class="flex w-full justify-between items-center">
              <label
                v-for="(day, idx) in daysOfweek"
                :key="idx"
                class="w-11 h-11 rounded-full bg-gray-100 shadow-sm text-gray-700 flex items-center justify-center cursor-pointer"
              >
                <input
                  id="check"
                  v-model="item.SER_DAY_TIMESHEET_VALUES"
                  type="checkbox"
                  :value="idx"
                  class="sr-only peer"
                />
                <div
                  class="peer-checked:text-white w-11 h-11 rounded-full peer-checked:bg-primary-500 flex items-center justify-center overflow-auto"
                >
                  {{ day.slice(0, 3).toUpperCase() }}
                </div>
              </label>
            </div>
            <UCheckbox
              id="nuxt-checkbox"
              v-model="item.ALL_DAYS"
              label="Todos os dias"
              @change="toggleAllDays(item)"
            />
          </UFormGroup>
          <UFormGroup label="Tipo de horário" name="TYPES" class="flex-grow">
            <SelectMenu
              v-model="item.TYPES"
              placeholder="Selecione..."
              :options="options"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>

          <!-- <UFormGroup name="STATUS" class="">
            <UCheckbox
              id="nuxt-checkbox"
              v-model="state.STATUS"
              label="Horário ativo"
            />
          </UFormGroup> -->
          <UButton
            type="button"
            color="gray"
            size="xl"
            class="flex justify-center mt-4"
            :disabled="isLoading"
            @click="removeSpace(index)"
          >
            Remover
          </UButton>
        </div>
        <div class="flex mt-5 items-center justify-end">
          <UButton
            type="button"
            color="primary"
            size="xl"
            class="flex justify-center"
            :disabled="isLoading"
            @click="addTimesheet"
          >
            Adicionar
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { array, number, object, string } from "yup";
import timeTimesheetServices from "~/services/timeTimesheet.service";

const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();
interface DayTimesheet {
  DAY_OF_WEEK: number;
}

definePageMeta({
  middleware: ["auth"],
});

const toggleAllDays = (item: any) => {
  if (item.ALL_DAYS === true) {
    item.SER_DAY_TIMESHEET_VALUES = [];
    for (let i: any = 0; i < 7; i++) {
      item.SER_DAY_TIMESHEET_VALUES.push(i);
    }
  } else {
    item.SER_DAY_TIMESHEET_VALUES = [];
  }
};

const backPage = () => {
  router.push({ name: "services-timesheet" });
};

const createSchema = () => {
  return object({
    STATUS: string(),
    INITIAL_TIME: string().required("Horário inicial obrigatório"),
    FINAL_TIME: string().required("Horário final obrigatório"),
    SER_DAY_TIMESHEET_VALUES: array()
      .min(1, "Selecione pelo menos um dia")
      .required("Campo Obrigatório"),
    NRORG: number().default(NrOrg),
    TYPES: number().required("Selecione o tipo de horário"),
    USER_ID: number().default(UserId),
  });
};

const state = reactive({
  STATUS: "A",
  INITIAL_TIME: undefined,
  FINAL_TIME: undefined,
  TYPES: undefined,
  SER_TIMESHEET_ID: route.query.ID?.toString() as string,
  SER_DAY_TIMESHEET_VALUES: [] as DayTimesheet[],
  NRORG: NrOrg,
  USER_ID: UserId,
  ALL_DAYS: undefined,
});

const timesheets = ref([
  {
    STATUS: "A",
    INITIAL_TIME: undefined,
    FINAL_TIME: undefined,
    TYPES: undefined,
    SER_TIMESHEET_ID: route.query.ID?.toString() as string,
    SER_DAY_TIMESHEET_VALUES: [] as DayTimesheet[],
    NRORG: NrOrg,
    USER_ID: UserId,
    ALL_DAYS: undefined,
    schema: createSchema(),
  },
]);

const addTimesheet = () => {
  timesheets.value.push({
    STATUS: "A",
    INITIAL_TIME: undefined,
    FINAL_TIME: undefined,
    TYPES: undefined,
    SER_TIMESHEET_ID: route.query.ID?.toString() as string,
    SER_DAY_TIMESHEET_VALUES: [] as DayTimesheet[],
    NRORG: NrOrg,
    USER_ID: UserId,
    ALL_DAYS: undefined,
    schema: createSchema(),
  });
};

const removeSpace = (index: number) => {
  timesheets.value.splice(index, 1);
};

const options = [
  {
    label: "Disponível",
    value: "1",
  },
  {
    label: "Bloqueado",
    value: "0",
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

async function onSubmit() {
  if (route.query.ID === undefined) {
    return backPage();
  } else {
    isLoading.value = true;
    try {
      for (const item of timesheets.value) {
        await item.schema.validate(item, { abortEarly: false });
      }

      for (const item of timesheets.value) {
        const serDayTimesheetString = item.SER_DAY_TIMESHEET_VALUES.toString();
        const data = {
          INITIAL_TIME: item.INITIAL_TIME,
          FINAL_TIME: item.FINAL_TIME,
          SER_DAY_TIMESHEET_VALUES: serDayTimesheetString,
          STATUS: item.STATUS,
          SER_TIMESHEET_ID: route.query.ID?.toString() as string,
          TYPES: item.TYPES,
          NRORG: NrOrg,
          USER_ID: UserId,
        };
        const response = await timeTimesheetServices.postTimeTimesheet(data);
        if (response) {
          backPage();
        } else {
          isLoading.value = false;
        }
      }
    } catch (error) {
      isLoading.value = false;
      toast.add({
        color: "red",
        title: "Erro",
        description: "Todas as opções devem ser selecionadas",
      });
    }
  }
}
</script>
