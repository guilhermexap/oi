<template>
  <UContainer>
    <UCard>
      <UModal v-model="isOpen">
        <div v-if="rowData" class="p-4 border">
          <h5 class="pb-2">Informações</h5>
          <p v-if="rowData.CREATED_BY_NAME">
            Criado por {{ rowData.CREATED_BY_NAME }}
          </p>
          <p v-if="rowData.MODIFIED_BY_NAME">
            Modificado por {{ rowData.MODIFIED_BY_NAME }}
          </p>
          <p v-if="rowData.CREATED_AT">
            Criado em {{ formatDate(rowData.CREATED_AT) }}
          </p>
          <p v-if="rowData.MODIFIED_AT">
            Modifcado em {{ formatDate(rowData.MODIFIED_AT) }}
          </p>
        </div>
      </UModal>

      <div class="flex justify-between items-center">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Unidades
          </h5>
        </div>

        <UButton
          type="submit"
          color="primary"
          size="xl"
          class="mr-2"
          @click="openNew"
          >Adicionar unidade
        </UButton>
      </div>

      <!-- Filters -->
      <div
        class="flex items-center justify-between px-3 mt-4 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filtrar unidade..." />
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
              Marcar como
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
        <template #completed-data="{ row }">
          <UBadge
            size="xs"
            :label="row.STATUS === 'A' ? 'Ativo' : 'Inativo'"
            :color="row.STATUS === 'A' ? 'emerald' : 'orange'"
            variant="subtle"
          />
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)" :ui="{ width: 'w-64' }">
            <UButton color="gray" variant="ghost" icon="fa fa-ellipsis-h" />
          </UDropdown>
        </template>

        <template #INITIAL_DATE-data="{ row }"
          >{{ formatDateWithoutSeconds(row.INITIAL_DATE) }}
        </template>

        <template #FINAL_DATE-data="{ row }"
          >{{ formatDateWithoutSeconds(row.FINAL_DATE) }}
        </template>
      </UTable>

      <!-- Number of rows & Pagination -->
      <template v-if="pageTotal" #footer>
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
            v-if="pageTotal"
            v-model="page"
            :page-count="pageCount"
            :total="pageTotal"
          />
        </div>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup>
import {
  formatDate,
  formatDateWithoutSeconds,
} from "~/services/date-formatter.service";
import structureService from "~/services/strucures.service";
import { setSelectedData } from "~/services/editService";
const NumberOrg = localStorage.getItem("NRORG");
const accessToken = localStorage.getItem("authToken");
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const router = useRouter();
const isOpen = ref(false);
const rowData = ref(null);
const q = ref("");

definePageMeta({
  middleware: ["auth"],
});

const openEdit = (row) => {
  setSelectedData(row);
  router.push({
    name: "structures-form",
  });
};

const openNew = () => {
  router.push({ name: "structures-form" });
};

const openModal = (row) => {
  isOpen.value = true;
  rowData.value = row;
};

const columns = [
  {
    key: "NAME",
    label: "Nome",
    sortable: true,
  },
  {
    key: "EMAIL",
    label: "E-mail",
    sortable: true,
  },
  {
    key: "completed",
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

const listen = ref(0);

const updateStatus = async (status) => {
  const userId = localStorage.getItem("userId");
  const selectIds = selectedRows.value.slice().map((item) => item.ID);
  isOpen.value = false;
  if (selectIds.length === 0) {
    return;
  }

  const response = await structureService.updateStatus(
    selectIds,
    status,
    userId
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

const items = (row) => [
  [
    {
      label: "Info",
      click: () => openModal(row),
    },
  ],
  [
    {
      label: "Editar",
      click: () => openEdit(row),
    },
  ],
];
const selectedStatus = ref([]);
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return "status=A";
  }
  if (selectedStatus.value?.length === 2) {
    return "";
  }
  return `status=${selectedStatus.value[0].value}`;
});

// Pagination
const page = ref(1);
const pageCount = 10;
const pageTotal = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount, pageTotal.value)
);

const filteredRows = computed(() => {
  pageTotal.value = todos.value.total;
  if (!q.value) {
    return todos.value.data;
  }

  return todos.value.data.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

// Data
const { data: todos, pending } = useLazyAsyncData(
  "todos",
  () =>
    $fetch(
      `${apiBaseUrl}/structure/unit?nrorg=${NumberOrg}&${searchStatus.value}`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
        query: {
          _page: page.value,
          _limit: pageCount,
          _sort: "ID",
          _order: "desc",
        },
      }
    ),
  {
    default: () => [],
    watch: [page, searchStatus, pageTotal, listen],
  }
);
</script>
