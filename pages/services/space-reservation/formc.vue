<template>
  <UContainer>
    <!-- TABELA -->
    <UCard class="mt-3">
      <div
        class="w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
      >
        <h5 class="py-3.5">Espaços</h5>
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
            @click="isOpen = true"
          >
            Adicionar espaço
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
    </UCard>
    <!-- TABELA -->

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
              Adicionar Espaço
            </h5>
            <UFormGroup
              label="Espaço"
              name="GEN_STRUCTURE_ID"
              class="flex-grow"
            >
              <USelect
                v-model="state.GEN_STRUCTURE_ID"
                placeholder="Selecione..."
                :options="optionsStructure"
              />
            </UFormGroup>
            <UFormGroup
              label="Quadro de horarios"
              name="SER_TIMESHEET_ID"
              class="flex-grow"
            >
              <USelect
                v-model="state.SER_TIMESHEET_ID"
                placeholder="Selecione..."
                :options="optionsTimesheet"
              />
            </UFormGroup>

            <UFormGroup name="STATUS" class="">
              <UCheckbox
                id="nuxt-checkbox"
                v-model="state.STATUS"
                label="Espaço ativo"
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
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
const isOpen = ref(false);

type SelectedStatus = { value: string }[];
const selectedStatus = ref<SelectedStatus>([]);

const searchStatus = computed(() => {
  if (
    selectedStatus.value?.length === 0 ||
    selectedStatus.value?.length === 2
  ) {
    return "";
  }
  console.log("select", selectedStatus.value[0].value);
  return `active=${selectedStatus.value[0].value}`;
});

const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);

const optionsStructure = ref<{ label: string; value: number }[]>([]);
const optionsTimesheet = ref<{ label: string; value: number }[]>([]);

const schema = object({
  SER_SERVICE_ID: number(),
  GEN_STRUCTURE_ID: number()
    .required("Selecione uma opção")
    .typeError("Valor inválido"),
  SER_TIMESHEET_ID: number()
    .required("Selecione uma opção")
    .typeError("Valor inválido"),

  STATUS: string(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

// NUMERO DO SERVIÇO
const serviceId = ref();

onMounted(async () => {
  listen.value++;
  serviceId.value = 105;
  const responseStructure = await services.indexStructure(NrOrg);
  const responseTimesheet = await services.indexTimesheet(NrOrg);

  if (Array.isArray(responseStructure)) {
    optionsStructure.value = responseStructure.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }

  if (Array.isArray(responseTimesheet)) {
    optionsTimesheet.value = responseTimesheet.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
});

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

const columns = [
  {
    key: "STRUCTURE_NAME",
    label: "Espaço",
    sortable: true,
  },
  {
    key: "TIMESHEET_NAME",
    label: "quadro de horários",
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
// const structureId = 0;
async function onSubmitStructure(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  state.SER_SERVICE_ID = serviceId.value.toString();
  event.data.STATUS = services.convertToString(state.STATUS);
  const data = {
    STATUS: event.data.STATUS,
    GEN_STRUCTURE_ID: event.data.GEN_STRUCTURE_ID,
    SER_SERVICE_ID: event.data.SER_SERVICE_ID,
    SER_TIMESHEET_ID: event.data.SER_TIMESHEET_ID,
    NRORG: NrOrg,
    USER_ID: UserId,
  };
  const response = await services.postStructure(data);
  if (response) {
    isLoading.value = false;
    isOpen.value = false;
    listen.value++;
    state.GEN_STRUCTURE_ID = undefined;
    state.SER_TIMESHEET_ID = undefined;
    return;
  }

  isLoading.value = false;
  isOpen.value = false;
}

// ESTADO DO MODAL

const state = reactive({
  STATUS: true,
  SER_SERVICE_ID: undefined,
  GEN_STRUCTURE_ID: undefined,
  SER_TIMESHEET_ID: undefined,
  NRORG: undefined,
  USER_ID: undefined,
});

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
      label: "Marcar como inativo",
      click: async () => {
        listen.value++;
        const userId = localStorage.getItem("userId");
        await services.updateStatusTimesheetRel(row.ID, "I", userId);
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

  const response = await services.updateStatusTimesheetRel(
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
    if (serviceId.value !== undefined) {
      const response = await $fetch(
        `${apiBaseUrl}/services-timesheet-rel?service-id=${serviceId.value}&${NumberOrg}&${searchStatus.value}`,
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
</script>
