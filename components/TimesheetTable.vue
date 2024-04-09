<template>
  <!-- TABELA -->
  <UCard class="mt-3">
    <div
      class="w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
    >
      <h5 class="py-3.5">Horários</h5>
      <div class="flex items-center gap-4">
        <UDropdown
          v-if="selectedRows.length > 0"
          :items="actions"
          :ui="{ width: 'w-36' }"
        >
          <UButton
            icon="fa fa-chevron-down pt-1"
            trailing
            color="gray"
            size="xs"
          >
            Marcar como
          </UButton>
        </UDropdown>

        <USelectMenu
          v-model="selectedDays"
          :options="optionsDays"
          selected-icon="fa fa-check"
          multiple
          placeholder="Filtrar dias"
        />

        <USelectMenu
          v-model="selectedStatus"
          :options="optionsStatus"
          selected-icon="fa fa-check"
          multiple
          placeholder="Status"
        />
        <UButton
          type="button"
          color="primary"
          size="xl"
          class="mr-2 w-48 flex justify-center"
          :disabled="isLoading"
          @click="openNewTimesheet"
        >
          Adicionar horário
        </UButton>
      </div>
    </div>

    <UTable
      v-model="selectedRows"
      :rows="filteredRows"
      :columns="columns"
      :per-page="pageCount"
      :loading="pending"
      class="w-full"
    >
      <template #SER_DAY_TIMESHEET_VALUES-data="{ row }">
        {{ timeTimesheetServices.convertDays(row.SER_DAY_TIMESHEET_VALUES) }}
      </template>
      <template #TYPES-data="{ row }">
        <UBadge
          size="xs"
          :label="row.TYPES === '1' ? 'Disponível' : 'Bloqueado'"
          :color="row.TYPES === '1' ? 'emerald' : 'orange'"
          variant="subtle"
        />
      </template>
      <template #status-data="{ row }">
        <UBadge
          size="xs"
          :label="row.STATUS === 'A' ? 'Ativo' : 'Inativo'"
          :color="row.STATUS === 'A' ? 'emerald' : 'orange'"
          variant="subtle"
        />
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="itemsActions(row)" :ui="{ width: 'w-64' }">
          <UButton color="gray" variant="ghost" icon="fa fa-ellipsis-h" />
        </UDropdown>
      </template>
    </UTable>
    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Mostrando
            <span class="font-medium">{{ pageFrom }}</span>
            a
            <span class="font-medium">{{ pageTo }}</span>
            de
            <span class="font-medium">{{ pageTotal }}</span>
            resultados
          </span>
        </div>

        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
        />
      </div>
    </template>

    <!-- MODAL TA TABELA -->
    <UModal v-model="isOpen">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 px-3"
        @submit="onSubmitStructure"
      >
        <div class="p-4">
          <div class="flex flex-col gap-4">
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              {{ timeTimesheetId ? "Editar" : "Adicionar" }} horário
            </h5>
            <UFormGroup label="Horário inicial" name="INITIAL_TIME">
              <UInput v-model="state.INITIAL_TIME" v-mask="'##:##'" />
            </UFormGroup>
            <UFormGroup label="Horário final" name="FINAL_TIME">
              <UInput v-model="state.FINAL_TIME" v-mask="'##:##'" />
            </UFormGroup>
            <UFormGroup label="Dias da Semana" name="SER_DAY_TIMESHEET_VALUES">
              <UCheckbox
                id="nuxt-checkbox"
                v-model="state.ALL_DAYS"
                label="Todos os dias"
                @change="toggleAllDays"
              />
              <div class="flex w-full justify-between items-center">
                <label
                  v-for="(day, index) in daysOfweek"
                  :key="index"
                  class="w-11 h-11 rounded-full bg-gray-100 shadow-sm text-gray-700 flex items-center justify-center cursor-pointer"
                >
                  <input
                    id="check"
                    v-model="state.SER_DAY_TIMESHEET_VALUES"
                    type="checkbox"
                    :value="index"
                    class="sr-only peer"
                  />
                  <div
                    class="peer-checked:text-white w-11 h-11 rounded-full peer-checked:bg-primary-500 flex items-center justify-center overflow-auto"
                  >
                    {{ day.slice(0, 3).toUpperCase() }}
                  </div>
                </label>
              </div>
            </UFormGroup>

            <UFormGroup label="Tipo de horário" name="TYPES" class="flex-grow">
              <SelectMenu
                v-model="state.TYPES"
                placeholder="Selecione..."
                :options="options"
                option-attribute="label"
                value-attribute="value"
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
    </UModal>
    <!-- MODAL INFO -->
    <UModal v-model="isOpenInfo">
      <div v-if="rowData" class="p-4 border">
        <button></button>
        <h5 class="pb-2">Informações</h5>
        <p>Criado por: {{ rowData.CREATED_BY }}</p>
        <p>Modificado por: {{ rowData.MODIFIED_BY }}</p>
        <p>Criado em: {{ formatDate(rowData.CREATED_AT) }}</p>
        <p>Modifcado em: {{ formatDate(rowData.MODIFIED_AT) }}</p>

        <p v-if="rowData.INITIAL_TIME_OLD">
          Horário inicial anterior: {{ rowData.INITIAL_TIME_OLD }}
        </p>
        <p v-if="rowData.FINAL_TIME_OLD">
          Horário final anterior: {{ rowData.FINAL_TIME_OLD }}
        </p>
        <p v-if="rowData.SER_DAY_TIMESHEET_VALUES_OLD">
          Dias anteriores
          {{
            rowData.SER_DAY_TIMESHEET_VALUES_OLD !== null
              ? timeTimesheetServices.convertDays(
                  rowData.SER_DAY_TIMESHEET_VALUES_OLD
                )
              : ""
          }}
        </p>
      </div>
    </UModal>
  </UCard>
</template>

<script setup lang="ts" props="props">
import { array, number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
import timeTimesheetServices from "~/services/timeTimesheet.service";
import { formatDate } from "~/services/date-formatter.service";
const isOpen = ref(false);
const isOpenInfo = ref(false);
const rowData: any = ref(null);

const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const timeTimesheetId = ref();

const listen: Ref<number> = ref(0);
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const accessToken = localStorage.getItem("authToken");
const selectedRows = ref<Array<any>>([]);

interface Todo {
  ID: string;
  STATUS: string;
  TIMESHEET_NAME: string;
}

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

type Selected = { value: string }[];
const selectedStatus = ref<Selected>([]);
const selectedDays = ref<Array<any>>([]);

const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return "status=A";
  }
  if (selectedStatus.value?.length === 2) {
    return "";
  }
  return `status=${selectedStatus.value[0].value}`;
});

const searchDays = computed(() => {
  const selectIds = selectedDays.value.slice().map((item) => item.value);
  if (selectedDays.value?.length === 0) {
    return "";
  }
  if (selectedDays.value?.length > 2) {
    return `&days=${selectIds}`;
  }
  return `&days=${selectIds}`;
});

const schema = object({
  STATUS: string(),
  INITIAL_TIME: string().required("Horário inicial obrigatório"),
  FINAL_TIME: string().required("Horário final obrigatório"),
  SER_DAY_TIMESHEET_VALUES: array()
    .min(1, "Selecione pelo menos um dia")
    .required("Campo Obrigatório"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
  TYPES: number().required("Selecione o tipo"),
});

type Schema = InferType<typeof schema>;

// NUMERO DO SERVIÇO
const props = defineProps<{
  serviceId: string;
}>();

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

const columns = [
  {
    key: "INITIAL_TIME",
    label: "Horáro inicial",
    sortable: true,
  },
  {
    key: "FINAL_TIME",
    label: "Horáro final",
    sortable: true,
  },
  {
    key: "SER_DAY_TIMESHEET_VALUES",
    label: "Dias",
    sortable: true,
  },
  {
    key: "TYPES",
    label: "Tipo",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
    label: "Opções",
  },
];

// Pagination
const q = ref("");
const page = ref(1);
const pageCount = 30;
const pageTotal = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount, pageTotal.value)
);

const filteredRows = computed(() => {
  pageTotal.value = todos.value.length;
  if (!q.value) {
    return todos.value.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  }

  return todos.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

async function onSubmitStructure(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const serDayTimesheetString = event.data.SER_DAY_TIMESHEET_VALUES.toString();

  const data = {
    INITIAL_TIME: event.data.INITIAL_TIME,
    INITIAL_TIME_OLD: state.INITIAL_TIME_OLD,
    FINAL_TIME: event.data.FINAL_TIME,
    FINAL_TIME_OLD: state.FINAL_TIME_OLD,
    SER_DAY_TIMESHEET_VALUES: serDayTimesheetString,
    SER_DAY_TIMESHEET_VALUES_OLD: state.SER_DAY_TIMESHEET_VALUES_OLD,
    STATUS: services.convertToString(event.data.STATUS),
    SER_TIMESHEET_ID: props.serviceId,
    TYPES: event.data.TYPES,
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  if (state.SER_TIMESHEET_ID === undefined) {
    const response = await timeTimesheetServices.postTimeTimesheet(data);
    // console.log(response);
    if (response === "success") {
      isLoading.value = false;
      isOpen.value = false;
      listen.value++;
    } else {
      isLoading.value = false;
      return;
    }
  } else if (timeTimesheetId.value !== "") {
    const response = await timeTimesheetServices.updateTimeTimesheet(
      data,
      timeTimesheetId.value
    );
    if (response === "success") {
      isLoading.value = false;
      isOpen.value = false;
      listen.value++;
    } else {
      isLoading.value = false;
      return;
    }
  }

  isLoading.value = false;
  // isOpen.value = false;
}

interface DayTimesheet {
  DAY_OF_WEEK: number;
}

// ESTADO DO MODAL
const state = reactive({
  STATUS: true,
  INITIAL_TIME: undefined,
  INITIAL_TIME_OLD: undefined,
  FINAL_TIME: undefined,
  FINAL_TIME_OLD: undefined,
  TYPES: undefined,
  SER_TIMESHEET_ID: undefined,
  SER_DAY_TIMESHEET_VALUES: [] as DayTimesheet[],
  SER_DAY_TIMESHEET_VALUES_OLD: undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
  ALL_DAYS: false,
});

const toggleAllDays = () => {
  if (state.ALL_DAYS === true) {
    state.SER_DAY_TIMESHEET_VALUES = [];
    for (let i: any = 0; i < 7; i++) {
      state.SER_DAY_TIMESHEET_VALUES.push(i);
    }
  } else {
    state.SER_DAY_TIMESHEET_VALUES = [];
  }
};

// Filters
const optionsStatus = [
  {
    key: "uncompleted",
    label: "Inativo",
    value: "I",
  },
  {
    key: "completed",
    label: "Ativo",
    value: "A",
  },
];
const optionsDays = [
  {
    label: "Domingo",
    value: "8",
  },
  {
    label: "Segunda",
    value: "1",
  },
  {
    label: "Terça",
    value: "2",
  },
  {
    label: "Quarta",
    value: "3",
  },
  {
    label: "Quinta",
    value: "4",
  },
  {
    label: "Sexta",
    value: "5",
  },
  {
    label: "Sábado",
    value: "6",
  },
  {
    label: "Feriado",
    value: "7",
  },
];

// OPTIONS DA TABELA
const itemsActions = (row: any) => [
  [
    {
      label: "Marcar como inativo",
      click: async () => {
        listen.value++;
        const userId = localStorage.getItem("userId");
        await timeTimesheetServices.updateStatus(row.ID, "I", userId);
      },
    },
  ],
  [
    {
      label: "Editar",
      click: () => {
        openEditTimesheet(row);
      },
    },
  ],
  [
    {
      label: "Info",
      click: () => openInfoModal(row),
    },
  ],
];

const openInfoModal = (row: any) => {
  isOpenInfo.value = true;
  rowData.value = row;
};

const openNewTimesheet = () => {
  // limpa os campos para criar novo horário
  timeTimesheetId.value = null;
  isOpen.value = true;
  state.STATUS = true;
  state.INITIAL_TIME = undefined;
  state.FINAL_TIME = undefined;
  state.TYPES = undefined;
  state.SER_TIMESHEET_ID = undefined;
  state.SER_DAY_TIMESHEET_VALUES = [] as DayTimesheet[];
  state.NRORG = NrOrg;
  state.USER_ID = UserId;
  state.ALL_DAYS = false;
};

const openEditTimesheet = (row: any) => {
  isOpen.value = true;
  timeTimesheetId.value = row.ID;
  const arrayFromDatabase = row.SER_DAY_TIMESHEET_VALUES.split(",") // Divide a string em um array usando vírgulas como delimitadores
    .map(Number); // Converte cada string para um número
  state.STATUS = services.convertToBoolean(row.STATUS);
  state.INITIAL_TIME = row.INITIAL_TIME;
  state.INITIAL_TIME_OLD = row.INITIAL_TIME;
  state.FINAL_TIME = row.FINAL_TIME;
  state.FINAL_TIME_OLD = row.FINAL_TIME;
  state.TYPES = row.TYPES;
  state.SER_TIMESHEET_ID = row.SER_TIMESHEET_ID;
  state.SER_DAY_TIMESHEET_VALUES = arrayFromDatabase.map((value: any) => value);
  state.SER_DAY_TIMESHEET_VALUES_OLD = row.SER_DAY_TIMESHEET_VALUES;
  state.ALL_DAYS = false;

  state.NRORG = NrOrg;
  state.USER_ID = UserId;
};

// ACTIONS DO UPDATE STATUS
const actions = [
  [
    {
      key: "uncompleted",
      label: "Ativo",
      icon: "fa fa-check pr-4",
      click: () => {
        updateStatus("A");
      },
    },
  ],
  [
    {
      key: "completed",
      label: "Inativo",
      icon: "fa fa-check pr-4",
      click: () => {
        updateStatus("I");
      },
    },
  ],
];

// UPDATE STATUS
const updateStatus = async (status: any) => {
  listen.value++;
  const userId = localStorage.getItem("userId");
  const selectIds = selectedRows.value.slice().map((item) => item.ID);
  isOpen.value = false;
  if (selectIds.length === 0) {
    return;
  }

  const response = await timeTimesheetServices.updateStatus(
    selectIds,
    status,
    userId
  );
  selectedRows.value = [];
  listen.value++;
  return response || [];
};

// Data
const { data: todos, pending } = useLazyAsyncData<Todo[]>(
  "todos",
  async () => {
    if (props.serviceId !== "") {
      const response = await $fetch(
        `${apiBaseUrl}/time-timesheet?timesheetId=${props.serviceId}&${searchStatus.value}${searchDays.value}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
      return response as Todo[];
    }
    return [];
  },
  {
    default: () => [] as Todo[],
    watch: [searchStatus, searchDays, pageTotal, listen],
  }
);
</script>
