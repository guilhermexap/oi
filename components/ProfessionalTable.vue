<template>
  <UCard class="mt-3">
    <UModal v-model="isOpen">
      <div v-if="rowData" class="p-4 border">
        <h5 class="pb-2">Informações</h5>
        <p>Criado por {{ rowData.CREATED_BY }}</p>
        <p>Modificado por {{ rowData.MODIFIED_BY }}</p>
        <p>Criado em {{ dateServices.formatDate(rowData.CREATED_AT) }}</p>
        <p>Modifcado em {{ dateServices.formatDate(rowData.MODIFIED_AT) }}</p>
      </div>
    </UModal>

    <!-- MODAL TA TABELA -->
    <!-- MODAL DE CRIAÇÃO -->
    <UModal v-model="isOpenCreate">
      <UForm
        :schema="schemaCreate"
        :state="state"
        class="space-y-4 px-3"
        @submit="onSubmitProfessional"
      >
        <div class="p-4">
          <div class="flex flex-col gap-4">
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Adicionar Profissional
            </h5>
            <UFormGroup
              label="Profissional"
              name="GEN_USER_ID"
              class="flex-grow"
            >
              <SelectMenu
                v-model="state.GEN_USER_ID"
                placeholder="Selecione..."
                :loading="loading"
                :searchable="fetchOptionsUser"
                :options="optionsUser"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormGroup>
            <UFormGroup label="Horário inicial" name="INITIAL_TIME">
              <UInput v-model="state.INITIAL_TIME" v-mask="'##:##'" />
            </UFormGroup>
            <UFormGroup label="Horário final" name="FINAL_TIME">
              <UInput v-model="state.FINAL_TIME" v-mask="'##:##'" />
            </UFormGroup>
            <UFormGroup label="Dia de folga" name="DAY_OFF" class="flex-grow">
              <SelectMenu
                v-model="state.DAY_OFF"
                placeholder="Selecione..."
                :options="options"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormGroup>

            <UButton
              type="submit"
              color="primary"
              size="xl"
              class="mr-2 flex justify-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
      </UForm>
    </UModal>

    <!-- MODAL DE EDIÇÃO -->
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
            <UFormGroup label="Dia de folga" name="DAY_OFF" class="flex-grow">
              <SelectMenu
                v-model="state.DAY_OFF"
                placeholder="Selecione..."
                :options="options"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormGroup>

            <UButton
              type="submit"
              color="primary"
              size="xl"
              class="mr-2 flex justify-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
      </UForm>
    </UModal>
    <div class="flex justify-between items-center">
      <div class="col-8">
        <h5 class="py-3.5">Profissionais</h5>
      </div>
      <div class="flex gap-3">
        <UButton
          type="submit"
          color="gray"
          size="xl"
          class="mr-2"
          @click="backPage"
          >Voltar
        </UButton>
        <UButton
          type="button"
          color="primary"
          size="xl"
          class="mr-2 w-48 flex justify-center"
          :disabled="isLoading"
          @click="openCreate"
        >
          Adicionar
        </UButton>
      </div>
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
          selected-icon="fa fa-check"
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
        <div class="!w-14 !h-14 -my-3">
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
</template>

<script setup lang="ts" props="props" emits="update-is-editing">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
// import userService from "../services/user.service";
import dateServices from "~/services/date-formatter.service";
import serviceSeller from "~/services/serviceSeller.service";
import scheduleServices from "~/services/schedule.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);

const accessToken = localStorage.getItem("authToken");
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const isLoading = ref(false);
const loading = ref(false);
const isOpen = ref(false);
const isOpenCreate = ref(false);
const isOpenEdit = ref(false);
const optionsUser = ref<{ label: string; value: number }[]>([]);

const rowData = ref<any>(null);
const q = ref("");

const props = defineProps<{
  serviceId: number;
  eventId: number;
}>();

const emit = defineEmits(["edit"]);

interface Todo {
  ID: string;
  STATUS: string;
  TIMESHEET_NAME: string;
}

const openCreate = () => {
  state.ID = undefined;
  state.FULL_NAME = "";
  state.GEN_USER_ID = undefined;
  state.INITIAL_TIME = undefined;
  state.INITIAL_TIME_OLD = undefined;
  state.FINAL_TIME = undefined;
  state.FINAL_TIME_OLD = undefined;
  state.DAY_OFF = undefined;
  isOpenCreate.value = true;
};

const openEdit = (row: any) => {
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
  emit("edit");
};

const openModal = (row: any) => {
  isOpen.value = true;
  rowData.value = row;
};

const columns = [
  {
    key: "_IMAGE",
    label: "Imagem",
  },
  {
    key: "FULL_NAME",
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
        updateStatus("A");
      },
    },
  ],
  [
    {
      label: "Inativo",
      icon: "fa fa-check pr-4",
      click: () => {
        updateStatus("I");
      },
    },
  ],
];

const listen = ref(0);

const schema = object({
  INITIAL_TIME: string().required("Horário inicial obrigatório"),
  FINAL_TIME: string().required("Horário final obrigatório"),
  DAY_OFF: string().required("Selecione um dia de folga"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const schemaCreate = object({
  GEN_USER_ID: string().required("Selecione um profissional"),
  INITIAL_TIME: string().required("Horário inicial obrigatório"),
  FINAL_TIME: string().required("Horário final obrigatório"),
  DAY_OFF: string().required("Selecione um dia de folga"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type SchemaCreate = InferType<typeof schemaCreate>;

const state = reactive({
  ID: undefined,
  FULL_NAME: "",
  GEN_USER_ID: undefined,
  INITIAL_TIME: undefined,
  INITIAL_TIME_OLD: undefined,
  FINAL_TIME: undefined,
  FINAL_TIME_OLD: undefined,
  DAY_OFF: undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
  SEARCH: "",
});

// interface UserData {
//   ID: number;
//   FULL_NAME: string;
// }

// onMounted(async () => {
//   const response: any = await userService.getGenUsers(1);
//   if (Array.isArray(response.data)) {
//     optionsUser.value = response.data.map((user: UserData) => ({
//       label: user.FULL_NAME,
//       value: user.ID,
//     }));
//   }
//   console.log(response.data.length);
// });

const fetchOptionsUser = async (q: string) => {
  state.SEARCH = q;
  if (state.SEARCH.length > 2) {
    loading.value = true;
    const response = await scheduleServices.getUsersLikeName(
      state.SEARCH,
      NrOrg
    );
    if (response && typeof response === "object") {
      optionsUser.value = Object.values(response).map(
        ({ ID, FIRST_NAME, LAST_NAME }) => ({
          label: `${FIRST_NAME} ${LAST_NAME}`,
          value: ID,
        })
      );
      loading.value = false;
    }
    loading.value = false;
    return optionsUser.value;
  }
};

const updateStatus = async (status: string) => {
  const userId = localStorage.getItem("userId");
  const selectIds = selectedRows.value.slice().map((item: any) => item.ID);
  isOpen.value = false;
  if (selectIds.length === 0) {
    return;
  }

  const response = await serviceSeller.updateStatus(selectIds, status, userId);
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

const items = (row: any) => [
  [
    {
      label: "Marcar como inativo",
      click: async () => {
        const userId = localStorage.getItem("userId");
        await serviceSeller.updateStatus(row.ID, "I", userId);
        listen.value++;
      },
    },
  ],
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
  pageTotal.value = professionals.value.length;
  if (!q.value) {
    return professionals.value.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  }

  return professionals.value.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

async function onSubmitProfessional(event: FormSubmitEvent<SchemaCreate>) {
  isLoading.value = true;
  const data = {
    GEN_USER_ID: event.data.GEN_USER_ID,
    INITIAL_TIME: event.data.INITIAL_TIME,
    FINAL_TIME: event.data.FINAL_TIME,
    DAY_OFF: event.data.DAY_OFF,
    NRORG: NrOrg,
    USER_ID: UserId,
  };

  const response = await serviceSeller.postServiceSeller(
    data,
    props.eventId,
    props.serviceId
  );

  if (response === "success") {
    listen.value++;
    isLoading.value = false;
    isOpenCreate.value = false;
    return;
  }
  isLoading.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const data = {
    INITIAL_TIME: event.data.INITIAL_TIME,
    FINAL_TIME: event.data.FINAL_TIME,
    DAY_OFF: event.data.DAY_OFF,
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  const response = await serviceSeller.updateServiceSeller(data, state.ID);
  if (response === "success") {
    listen.value++;
    isLoading.value = false;
    isOpenEdit.value = false;
    return;
  }
  isLoading.value = false;
}

// Data
const { data: professionals, pending } = useLazyAsyncData<Todo[]>(
  "professionals",
  () =>
    $fetch(
      `${apiBaseUrl}/services-evt-event/professionals?nrorg=${NumberOrg}&${searchStatus.value}&service-id=${props.serviceId}&event-id=${props.eventId}`,
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
</script>
