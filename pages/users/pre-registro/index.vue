<template>
  <UContainer>
    <UCard>
      <UModal v-model="isOpen">
        <div v-if="rowData" class="p-4 border">
          <h5 class="pb-2">Informações</h5>
          <p>Criado por {{ rowData.CREATED_BY }}</p>
          <p v-if="rowData.MODIFIED_BY">
            Modificado por {{ rowData.MODIFIED_BY }}
          </p>
          <p>Criado em {{ formatDate(rowData.CREATED_AT) }}</p>
          <p v-if="rowData.MODIFIED_AT">
            Modificado em {{ formatDate(rowData.MODIFIED_AT) }}
          </p>
        </div>
      </UModal>

      <UModal v-model="isOpenCreateFile">
        <ExcelUploader @submit-success-form="handleFormSubmit" />
      </UModal>

      <UModal v-model="isOpenCreate">
        <pre-register-form
          :row-edit-data="rowEditData"
          :is-editing="isEditing"
          @submit-success="handleFormSubmit"
        ></pre-register-form>
      </UModal>

      <div class="flex justify-between items-center">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Pré-registro
          </h5>
        </div>
        <div class="flex gap-4">
          <UButton color="primary" @click="openNewOnFile"
            >Adicionar por arquivo
          </UButton>

          <UButton
            type="submit"
            color="primary"
            size="xl"
            class="mr-2"
            @click="openNew"
            >Adicionar pré-registro
          </UButton>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="flex items-center justify-between px-3 mt-4 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filtrar registro..." />
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
        <template #CPF-data="{ row }">
          {{ preRegisterService.formatCpf(row.CPF) }}
        </template>
        <template #BIRTH-data="{ row }">
          {{ formatDateWithoutHours(row.BIRTH) }}
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
          <UDropdown :items="items(row)" :ui="{ width: 'w-64' }">
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
  </UContainer>
</template>

<script setup>
import {
  formatDate,
  formatDateWithoutHours,
} from "~/services/date-formatter.service";
import preRegisterService from "~/services/pre-register.service";
const NumberOrg = localStorage.getItem("NRORG");
const accessToken = localStorage.getItem("authToken");
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
// const router = useRouter();
const isOpen = ref(false);
const isOpenCreate = ref(false);
const isOpenCreateFile = ref(false);
const isEditing = ref(false);
const rowData = ref(null);
const rowEditData = ref(null);
const q = ref("");

definePageMeta({
  middleware: ["auth"],
});

const handleFormSubmit = () => {
  console.log("handleFormSubmit");
  listen.value++;
  isOpenCreate.value = false;
  isOpenCreateFile.value = false;
};

const openNewOnFile = () => {
  isOpenCreateFile.value = true;
};

const openNew = () => {
  isOpenCreate.value = true;
  isEditing.value = false;
};

const openEdit = (row) => {
  isOpenCreate.value = true;
  isEditing.value = true;
  rowEditData.value = row;
};

const openModal = (row) => {
  isOpen.value = true;
  rowData.value = row;
};

const columns = [
  {
    key: "EXTERNAL_ID",
    label: "Matricula",
    sortable: true,
  },
  {
    key: "CPF",
    label: "CPF",
    sortable: true,
  },
  {
    key: "EMAIL",
    label: "E-mail",
    sortable: true,
  },
  {
    key: "PHONE_NUMBER",
    label: "Telefone",
    sortable: true,
  },
  {
    key: "BIRTH",
    label: "Nascimento",
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

const updateStatus = async (status) => {
  const userId = localStorage.getItem("userId");
  const selectIds = selectedRows.value.slice().map((item) => item.ID);
  isOpen.value = false;
  if (selectIds.length === 0) {
    return;
  }
  const response = await preRegisterService.updateStatus(
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
const pageCount = 20;
const pageTotal = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount, pageTotal.value)
);

const filteredRows = computed(() => {
  if (!Array.isArray(todos.value)) {
    return [];
  }
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

// Data
const { data: todos, pending } = useLazyAsyncData(
  "todos",
  () =>
    $fetch(
      `${apiBaseUrl}/pre-register?nrorg=${NumberOrg}&${searchStatus.value}`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    ),
  {
    default: () => [],
    watch: [searchStatus, pageTotal, listen],
  }
);
</script>
