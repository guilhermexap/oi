<template>
  <!-- TABELA -->
  <UCard class="mt-3">
    <div
      class="w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
    >
      <h5 class="py-3.5">Ingressos - Inscrições</h5>
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
          v-model="selectedStatus"
          :options="todoStatus"
          multiple
          placeholder="Status"
        />
        <UButton
          type="button"
          color="primary"
          size="xl"
          class="mr-2 w-48 flex justify-center"
          :disabled="isLoading"
          @click="openCreate"
        >
          Adicionar novo
        </UButton>
      </div>
    </div>
    <div v-if="todos.length === 0" class="w-full text-center pt-6">
      <p>Não existem registros ainda.</p>
    </div>

    <UTable
      v-else
      v-model="selectedRows"
      :rows="filteredRows"
      :columns="columns"
      :per-page="pageCount"
      :loading="pending"
      class="w-full"
    >
      <template #ALLOW_EXTERNAL_USERS-data="{ row }">
        <div>
          {{ row.ALLOW_EXTERNAL_USERS === 0 ? "Não permitir" : "Permitir" }}
        </div>
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
    <template v-if="todos.length > 0" #footer>
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
          v-if="todos.length > 0"
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
        />
      </div>
    </template>
  </UCard>

  <!-- MODAL TA TABELA -->
  <UModal v-model="isOpen">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 px-3"
      @submit="onSubmit"
    >
      <div class="p-4">
        <div class="flex flex-col gap-4">
          <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
            {{ state.ID ? "Editar" : "Adicionar novo" }}
          </h5>
          <UFormGroup label="Nome" name="NAME" class="flex-grow">
            <UInput v-model="state.NAME" />
          </UFormGroup>
          <UFormGroup
            label="Permitir usuários externos"
            name="ALLOW_EXTERNAL_USERS"
            class="flex-grow"
          >
            <SelectMenu
              v-model="state.ALLOW_EXTERNAL_USERS"
              placeholder="Selecione..."
              :options="options"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>
          <div class="flex w-full gap-2">
            <UFormGroup
              label="Início das vendas"
              name="START_SALE"
              class="w-1/2"
            >
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="format(state.START_SALE, 'd MMM, yyy  HH:mm')"
                  class="w-full bg-white text-black"
                />

                <template #panel="{ close }">
                  <DatePicker
                    v-model="state.START_SALE"
                    mode="dateTime"
                    is24hr
                    hide-time-header
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
            <UFormGroup
              label="Final das vendas"
              name="FINAL_SALE"
              class="w-1/2"
            >
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="format(state.FINAL_SALE, 'd MMM, yyy  HH:mm')"
                  class="w-full bg-white text-black"
                />

                <template #panel="{ close }">
                  <DatePicker
                    v-model="state.FINAL_SALE"
                    mode="dateTime"
                    is24hr
                    hide-time-header
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
          </div>
          <UFormGroup
            label="Quantidade de ingressos"
            name="AMOUNT"
            class="flex-grow"
          >
            <UInput v-model="state.AMOUNT" type="number" />
          </UFormGroup>
          <UFormGroup
            label="Quantidade de ingressos por compra"
            name="MIN_PURCHASE_AMOUNT"
            class="flex-grow"
          >
            <UInput v-model="state.MIN_PURCHASE_AMOUNT" type="number" />
          </UFormGroup>
          <UFormGroup label="Preço" name="PRICE" class="flex-grow">
            <UInput v-model="state.PRICE" v-money="moneyOptions" />
          </UFormGroup>

          <UFormGroup v-if="state.ID" name="STATUS" class="">
            <UCheckbox
              id="nuxt-checkbox"
              v-model="state.STATUS"
              label="Ativo"
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
  <!-- MODAL DA TABELA -->

  <UModal v-model="isOpenInfo">
    <div v-if="rowData" class="p-4 border">
      <h5 class="pb-2">Informações</h5>
      <p v-if="rowData.CREATED_BY_NAME">
        Criado por {{ rowData.CREATED_BY_NAME }}
      </p>
      <p v-if="rowData.MODIFIED_BY_NAME">
        Modificado por {{ rowData.MODIFIED_BY_NAME }}
      </p>
      <p v-if="rowData.CREATED_AT">
        Criado em {{ dateServices.formatDate(rowData.CREATED_AT) }}
      </p>
      <p v-if="rowData.MODIFIED_AT">
        Modifcado em {{ dateServices.formatDate(rowData.MODIFIED_AT) }}
      </p>
    </div>
  </UModal>
</template>

<script setup lang="ts" props="props">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import services from "~/services/services.service";
import eventServices from "~/services/event.service";
import dateServices from "~/services/date-formatter.service";
const isOpen = ref(false);
const isOpenInfo = ref(false);
const rowData = ref<any>(null);

type SelectedStatus = { value: string }[];
const selectedStatus = ref<SelectedStatus>([]);
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return "status=A";
  }
  if (selectedStatus.value?.length === 2) {
    return "";
  }
  return `status=${selectedStatus.value[0].value}`;
});

const moneyOptions = {
  precision: 2,
  thousands: ".",
  decimal: ",",
  prefix: "R$ ",
  masked: false,
};

const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);

const schema = object({
  ID: number(),
  NAME: string().required("O nome é obrigatório"),
  ALLOW_EXTERNAL_USERS: number()
    .required("Selecione uma opção")
    .typeError("Valor inválido"),
  AMOUNT: number().required("Campo obrigatório"),
  MIN_PURCHASE_AMOUNT: number().required("Campo obrigatório"),
  PRICE: string()
    .notOneOf(["R$ 0,00"], "O valor não pode ser R$ 0,00")
    .typeError("Valor inválido"),
  STATUS: string(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

// NUMERO DO SERVIÇO
const props = defineProps<{
  serviceId: string;
}>();

onMounted(async () => {});

// TABELA -------------------------------------------------------------------------------------
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

const options = [
  {
    label: "Permitir",
    value: 1,
  },
  {
    label: "Não permitir",
    value: 0,
  },
];

const columns = [
  {
    key: "NAME",
    label: "Nome",
    sortable: true,
  },
  {
    key: "ALLOW_EXTERNAL_USERS",
    label: "Permitir usuários externos",
    sortable: true,
  },
  {
    key: "MIN_PURCHASE_AMOUNT",
    label: "Número de ingressos por compra",
    sortable: true,
  },
  {
    key: "AMOUNT",
    label: "Quantidade de ingressos",
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

// Pagination
const q = ref("");
const page = ref(1);
const pageCount = 5;
const pageTotal = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount, pageTotal.value)
);

const filteredRows = computed(() => {
  pageTotal.value = todos.value?.length;
  if (!q.value) {
    return todos.value;
  }

  return todos.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const data = {
    EVT_EVENT_ID: Number(props.serviceId),
    NAME: state.NAME,
    ALLOW_EXTERNAL_USERS: state.ALLOW_EXTERNAL_USERS,
    _START_SALE: state.START_SALE.toLocaleString(),
    _FINAL_SALE: state.FINAL_SALE.toLocaleString(),
    AMOUNT: Number(state.AMOUNT),
    MIN_PURCHASE_AMOUNT: Number(state.MIN_PURCHASE_AMOUNT),
    PRICE: services.convertToFloat(state.PRICE),
    STATUS: services.convertToString(event.data.STATUS),
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  if (state.ID) {
    const response = await eventServices.putTicket(data, state.ID);
    if (response) {
      isLoading.value = false;
      isOpen.value = false;
      listen.value++;
      clearState();
    }
  } else {
    const response = await eventServices.postTicket(data);
    if (response) {
      isLoading.value = false;
      isOpen.value = false;
      listen.value++;
      clearState();
    }
  }
  isLoading.value = false;
}

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

// OPTIONS DA TABELA
const itemsActions = (row: any) => [
  [
    {
      label: "Info",
      click: () => openInfoModal(row),
    },
  ],
  [
    {
      label: "Editar",
      click: () => {
        openEdit(row);
      },
    },
  ],
];

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

  const response = await eventServices.updateTicketStatus(
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
        `${apiBaseUrl}/events/tickets/${props.serviceId}?${searchStatus.value}`,
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
    watch: [searchStatus, pageTotal, listen],
  }
);

// ESTADO DO MODAL
const state = reactive({
  ID: undefined,
  NAME: undefined,
  ALLOW_EXTERNAL_USERS: undefined,
  START_SALE: new Date(),
  FINAL_SALE: new Date(),
  AMOUNT: undefined,
  PRICE: "",
  MIN_PURCHASE_AMOUNT: undefined,
  NRORG: undefined,
  USER_ID: undefined,
  STATUS: true,
});

const clearState = () => {
  state.ID = undefined;
  state.NAME = undefined;
  state.ALLOW_EXTERNAL_USERS = undefined;
  state.START_SALE = new Date();
  state.FINAL_SALE = new Date();
  state.AMOUNT = undefined;
  state.PRICE = "";
  state.MIN_PURCHASE_AMOUNT = undefined;
};

const openCreate = () => {
  clearState();
  isOpen.value = true;
};

const openEdit = (row: any) => {
  state.ID = row.ID;
  state.NAME = row.NAME;
  state.ALLOW_EXTERNAL_USERS = row.ALLOW_EXTERNAL_USERS;
  state.START_SALE = new Date(row.START_SALE);
  state.FINAL_SALE = new Date(row.FINAL_SALE);
  state.AMOUNT = row.AMOUNT;
  state.PRICE = services.convertToView(row.PRICE);
  state.MIN_PURCHASE_AMOUNT = row.MIN_PURCHASE_AMOUNT;
  state.STATUS = services.convertToBoolean(row.STATUS);

  isOpen.value = true;
  // rowData.value = row;
};

const openInfoModal = (row: any) => {
  isOpenInfo.value = true;
  rowData.value = row;
};
</script>
