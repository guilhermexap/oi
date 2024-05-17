<template>
  <UContainer>
    <UCard>
      <UModal v-model="isOpen">
        <div v-if="rowData" class="p-4 border">
          <h5 class="pb-2">Informações</h5>
          <p>Criado por {{ rowData.CREATED_BY }}</p>
          <p>Modificado por {{ rowData.MODIFIED_BY }}</p>
          <p>Criado em {{ dateServices.formatDate(rowData.CREATED_AT) }}</p>
          <p>
            Modificado em {{ dateServices.formatDate(rowData.MODIFIED_AT) }}
          </p>
        </div>
      </UModal>

      <!-- MODAL TA TABELA -->
      <UModal v-model="isOpenEdit">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4 px-3"
          @submit="onSubmit"
        >
          <div class="p-4">
            <div class="flex flex-col gap-4">
              <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
                Editar Informações
              </h5>
              <h6>Profissional: {{ state.FULL_NAME }}</h6>
              <UFormGroup label="Horário inicial" name="INITIAL_TIME">
                <UInput v-model="state.INITIAL_TIME" v-mask="'##:##'" />
              </UFormGroup>
              <UFormGroup label="Horário final" name="FINAL_TIME">
                <UInput v-model="state.FINAL_TIME" v-mask="'##:##'" />
              </UFormGroup>
              <UFormGroup label="Dia de folga" name="TYPES" class="flex-grow">
                <USelect
                  v-model="state.DAY_OFF"
                  placeholder="Selecione..."
                  :options="options"
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

      <div class="flex justify-between items-center">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Editar profissionais
          </h5>
        </div>

        <UButton
          type="submit"
          color="gray"
          size="xl"
          class="mr-2"
          @click="backPage"
          >Voltar
        </UButton>
      </div>

      <!-- Filters -->
      <div
        class="flex items-center justify-between px-3 mt-4 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filtrar profissional..." />
        <div class="flex gap-4">
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
              Marcar status como
            </UButton>
          </UDropdown>

          <USelectMenu
            v-model="selectedStatus"
            :options="todoStatus"
            multiple
            placeholder="Status"
          />
        </div>
      </div>
      <!-- Table -->
      <UTable
        v-model="selectedRows"
        :rows="filteredRows"
        :columns="columns"
        :loading="pending"
        class="w-full"
      >
        <template #_IMAGE-data="{ row }">
          <div class="!w-14 !h-14">
            <div
              class="w-14 h-14 rounded-full border bg-gray-200 flex justify-center items-center"
              :style="{
                'background-image': `url(${row.evt_event_seller.gen_user.IMAGE})`,
                'background-position': 'center',
                'background-size': 'contain',
                'background-repeat': 'no-repeat',
              }"
            >
              <i
                v-if="!row.evt_event_seller.gen_user.IMAGE"
                class="fa fa-image"
              ></i>
            </div>
          </div>
        </template>

        <template #_NAME-data="{ row }">
          {{ row.evt_event_seller.gen_user.FIRST_NAME.trim() }}
          {{ row.evt_event_seller.gen_user.LAST_NAME.trim() }}
        </template>

        <template #DAY_OFF-data="{ row }">
          {{ dateServices.convertDays(row.DAY_OFF) }}
        </template>

        <template #status-data="{ row }">
          <UBadge
            size="xs"
            :label="row.STATUS === 'A' ? 'Ativo' : 'Inativo'"
            :color="row.STATUS === 'A' ? 'emerald' : 'orange'"
            variant="subtle"
          />
        </template>

        <template #status_app-data="{ row }">
          <UBadge
            size="xs"
            :label="row.STATUS_APP === 'A' ? 'Ativo' : 'Inativo'"
            :color="row.STATUS_APP === 'A' ? 'emerald' : 'orange'"
            variant="subtle"
          />
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)" :ui="{ width: 'w-64' }">
            <UButton color="gray" variant="ghost" icon="fa fa-ellipsis-h" />
          </UDropdown>
        </template>

        <template #INITIAL_DATE-data="{ row }"
          >{{ dateServices.formatDate(row.INITIAL_DATE) }}
        </template>

        <template #FINAL_DATE-data="{ row }"
          >{{ dateServices.formatDate(row.FINAL_DATE) }}
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
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import dateServices from "~/services/date-formatter.service";
import services from "~/services/services.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);

const accessToken = localStorage.getItem("authToken");
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const router = useRouter();
const isLoading = ref(false);
const isOpen = ref(false);
const isOpenEdit = ref(false);

const rowData = ref<any>(null);
const q = ref("");

definePageMeta({
  middleware: ["auth"],
});

interface Todo {
  ID: string;
  STATUS: string;
  TIMESHEET_NAME: string;
}

const openEdit = (row: any) => {
  console.log(row);
  state.ID = row.ID;
  state.FULL_NAME = `${row.evt_event_seller.gen_user.FIRST_NAME.trim()} ${row.evt_event_seller.gen_user.LAST_NAME.trim()}`;
  state.INITIAL_TIME = row.INITIAL_TIME;
  state.INITIAL_TIME_OLD = undefined;
  state.FINAL_TIME = row.FINAL_TIME;
  state.FINAL_TIME_OLD = undefined;
  state.DAY_OFF = row.DAY_OFF;
  isOpenEdit.value = true;
  rowData.value = row;
};

const backPage = () => {
  router.push({ name: "services-professional-reservation" });
};

const openModal = (row: any) => {
  isOpen.value = true;
  rowData.value = row;
};

const columns = [
  // {
  //   key: "evt_event_seller.gen_user.FIRST_NAME",
  //   label: "Nome",
  //   sortable: true,
  // },
  {
    key: "_IMAGE",
    label: "Imagem",
  },
  {
    key: "_NAME",
    label: "Nome",
    sortable: true,
  },
  {
    key: "DAY_OFF",
    label: "Dia de Folga",
    sortable: true,
  },
  {
    key: "INITIAL_TIME",
    label: "Horário inicial",
    sortable: true,
  },
  {
    key: "FINAL_TIME",
    label: "Horário final",
    sortable: true,
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

// Selected Rows
const selectedRows = ref([]);

// Actions
const actions = [
  [
    {
      label: "Ativo",
      icon: "fa fa-check pr-4",
      click: () => {
        updateStatus("A", "STATUS");
      },
    },
  ],
  [
    {
      label: "Inativo",
      icon: "fa fa-check pr-4",
      click: () => {
        updateStatus("I", "STATUS");
      },
    },
  ],
];

const listen = ref(0);

const schema = object({
  INITIAL_TIME: string().required("Horário inicial obrigatório"),
  FINAL_TIME: string().required("Horário final obrigatório"),
  DAY_OFF: string(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  ID: undefined,
  FULL_NAME: "",
  INITIAL_TIME: undefined,
  INITIAL_TIME_OLD: undefined,
  FINAL_TIME: undefined,
  FINAL_TIME_OLD: undefined,
  DAY_OFF: undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
});

const updateStatus = async (status: string, field: string) => {
  const userId = localStorage.getItem("userId");
  const selectIds = selectedRows.value.slice().map((item: any) => item.ID);
  isOpen.value = false;
  if (selectIds.length === 0) {
    return;
  }

  const response = await services.updateStatus(
    selectIds,
    status,
    userId,
    field
  );
  selectedRows.value = [];
  listen.value++;
  return response || [];
};

// Filters
const todoStatus = [
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

const options = [
  {
    label: "Domingo",
    value: "0",
  },
  {
    label: "Segunda",
    value: "1",
  },
  {
    label: "Terça",
    value: "3",
  },
  {
    label: "Quarta",
    value: "3",
  },
  {
    label: "Qunta",
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

const items = (row: any) => [
  [
    {
      label: "Editar",
      click: () => openEdit(row),
    },
  ],
  [
    {
      label: "Info",
      click: () => openModal(row),
    },
  ],
];

type SelectedStatus = { value: string }[];
const selectedStatus = ref<SelectedStatus>([]);
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return "active=A";
  }
  if (selectedStatus.value?.length === 2) {
    return "";
  }
  return `active=${selectedStatus.value[0].value}`;
});

// Pagination
const page = ref(1);
const pageCount = 5;
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

  return todos.value.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const data = {
    INITIAL_TIME: event.data.INITIAL_TIME,
    INITIAL_TIME_OLD: state.INITIAL_TIME_OLD,
    FINAL_TIME: event.data.FINAL_TIME,
    FINAL_TIME_OLD: state.FINAL_TIME_OLD,
    // STATUS: services.convertToString(event.data.STATUS),
    DAY_OFF: event.data.DAY_OFF,
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  console.log(state.ID, data);
  isOpenEdit.value = false;
  // if (state.SER_TIMESHEET_ID === undefined) {
  //   const response = await timeTimesheetServices.postTimeTimesheet(data);
  //   // console.log(response);
  //   if (response === "success") {
  //     isLoading.value = false;
  //     isOpen.value = false;
  //     listen.value++;
  //   } else {
  //     isLoading.value = false;
  //     return;
  //   }
  // } else if (timeTimesheetId.value !== "") {
  //   const response = await timeTimesheetServices.updateTimeTimesheet(
  //     data,
  //     timeTimesheetId.value
  //   );
  //   if (response === "success") {
  //     isLoading.value = false;
  //     isOpen.value = false;
  //     listen.value++;
  //   } else {
  //     isLoading.value = false;
  //     return;
  //   }
  // }

  isLoading.value = false;
}

// Data
const { data: todos, pending } = useLazyAsyncData<Todo[]>(
  "todos",
  () =>
    $fetch(
      `${apiBaseUrl}/services-evt-event/professionals?nrorg=${NumberOrg}&${searchStatus.value}&service-id=27&event-id=2008`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
  {
    default: () => [] as Todo[],
    watch: [searchStatus, pageTotal, listen],
  }
);

watchEffect(() => {
  console.log(todos);
});
</script>

<!-- "http://127.0.0.1:8000/api/v2/services-evt-event/professionals?service-id=27&event-id=2008&active=A" -->
