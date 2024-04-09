<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <UContainer>
    <UCard v-if="table" class="relative">
      <UModal v-model="isOpenInfo">
        <div v-if="rowDataInfo" class="p-4 border">
          <h5 class="pb-2">Informações</h5>
          <p>Criado por {{ rowDataInfo.CREATED_BY_NAME }}</p>
          <p v-if="rowDataInfo.MODIFIED_BY">
            Modificado por {{ rowDataInfo.MODIFIED_BY_NAME }}
          </p>
          <p>
            Criado em
            {{ dateFormatterService.formatDate(rowDataInfo.CREATED_AT) }}
          </p>
          <p v-if="rowDataInfo.MODIFIED_AT">
            Modifcado em
            {{ dateFormatterService.formatDate(rowDataInfo.MODIFIED_AT) }}
          </p>
        </div>
      </UModal>
      <UModal v-model="isOpen" :transition="false">
        <div class="p-4">
          <div class="flex flex-col justify-between w-full h-full">
            <p class="py-4">
              Essa solicitação já foi atendida. Deseja refazer a solicitação?
            </p>
            <div class="flex justify-end gap-3">
              <UButton @click="isOpen = false">Cancelar</UButton>
              <UButton
                color="gray"
                variant="solid"
                @click="updateStatus(newStatus)"
                >Refazer</UButton
              >
            </div>
          </div>
        </div>
      </UModal>
      <!-- <div
        v-if="loading"
        class="z-50 bg-white/75 w-full h-full absolute inset-0 flex justify-center items-center transition-opacity duration-200"
      >
        <div class="text-gray-500 text-xl">
          <span class="fa fa-spinner fa-2x animate-spin" />
        </div>
      </div> -->
      <div class="flex h-16 mb-1 items-center justify-between">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Solicitações de Usuários
          </h5>
        </div>
        <div class="row pe-md-3 flex items-center ms-md-auto">
          <transition>
            <div v-if="selected.length > 0" class="flex gap-4 py-3.5">
              <UButton
                color="gray"
                variant="solid"
                size="xl"
                :disabled="loading"
                @click="verifyStatus('B')"
                >Reprovar Solicitação</UButton
              >

              <UButton size="xl" :disabled="loading" @click="verifyStatus('A')"
                >Aprovar Solicitação</UButton
              >
            </div>
          </transition>
        </div>
      </div>
      <div
        class="flex items-center justify-between px-3 mt-4 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filtrar usuários..." />
      </div>

      <UTable
        v-model="selected"
        :loading="loading"
        :rows="filteredRows"
        :columns="columns"
        :per-page="pageCount"
      >
        <template #DATE-data="{ row }"
          >{{ dateFormatterService.formatDate(row.DATE) }}
        </template>

        <template #DATE_APPROVAL-data="{ row }"
          >{{ dateFormatterService.formatDate(row.DATE_APPROVAL) }}
        </template>
        <!-- <template #STATUS-data="{ row }">
          <div :class="getStatusClass(row.STATUS)">
            {{ getStatusText(row.STATUS) }}
          </div>
        </template> -->
        <template #STATUS-data="{ row }">
          <div v-if="row.STATUS !== null">
            <UBadge
              size="xs"
              :label="row.STATUS === 'A' ? 'Aprovado' : 'Reprovado'"
              :color="row.STATUS === 'A' ? 'emerald' : 'orange'"
              variant="subtle"
            />
          </div>
          <div v-else>
            <UBadge size="xs" label="Pendente" color="gray" variant="subtle" />
          </div>
        </template>

        <template #MODIFIED_BY-data="{ row }">
          {{ row.MODIFIED_BY_NAME || "-" }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)" :ui="{ width: 'w-64' }">
            <UButton color="gray" variant="ghost" icon="fa fa-ellipsis-h" />
          </UDropdown>
        </template>
      </UTable>

      <div
        class="flex justify-end px-3 w- py-3.5 border-t border-gray-200 dark:border-gray-700 dark:text-black"
      >
        <UPagination
          v-if="user.length > 0"
          v-model="page"
          :page-count="pageCount"
          :total="user.length"
        />
      </div>
    </UCard>
    <!-- info -->
    <div v-else>
      <UCard>
        <div class="flex justify-between items-center w-full">
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
              Mais informações
            </h5>
          </div>

          <UButton
            type="submit"
            color="primary"
            size="xl"
            class="mr-2"
            @click="table = true"
            >Voltar
          </UButton>
        </div>
        <div class="gap-4">
          <div class="py-4 px-3 flex gap-4 flex-col col-span-3">
            <div class="flex gap-3">
              <UFormGroup label="Matrícula" name="EXTERNAL_ID" class="w-full">
                <UInput v-model="rowData.EXTERNAL_ID" />
              </UFormGroup>
            </div>
            <div class="flex gap-3">
              <UFormGroup label="Nome" name="FIRST_NAME" class="w-full">
                <UInput v-model="rowData.FULL_NAME" />
              </UFormGroup>
            </div>

            <div class="flex gap-3">
              <UFormGroup
                label="Data de nascimento"
                name="BIRTH_DATE"
                class="w-full"
              >
                <UInput v-model="rowData.BIRTH" type="date" readonly />
              </UFormGroup>
              <UFormGroup label="CPF" name="CPF" class="w-full">
                <UInput v-model="genUserdata.CPF" v-mask="'###.###.###-##'" />
              </UFormGroup>
            </div>
            <div class="flex gap-3 pb-3">
              <UFormGroup label="E-mail" name="EMAIL" class="w-full">
                <UInput v-model="genUserdata.EMAIL" />
              </UFormGroup>
            </div>

            <div class="flex gap-3 border-t pt-4">
              <UFormGroup
                v-if="rowData.DATE"
                label="Solicitado em"
                name="DATE"
                class="w-full"
              >
                <p class="text-black">
                  {{ dateFormatterService.formatDate(rowData.DATE) }}
                </p>
              </UFormGroup>
              <UFormGroup
                v-if="rowData.MODIFIED_BY_NAME"
                label="Aprovado por"
                name="MODIFIED_BY"
                class="w-full"
              >
                <p class="text-black">{{ rowData.MODIFIED_BY_NAME }}</p>
              </UFormGroup>
              <UFormGroup
                v-if="rowData.DATE_APPROVAL"
                label="Aprovado em"
                name="DATE_APPROVAL"
                class="w-full"
              >
                <p class="text-black">
                  {{ dateFormatterService.formatDate(rowData.DATE_APPROVAL) }}
                </p>
              </UFormGroup>

              <UFormGroup label="Status" name="STATUS" class="w-full">
                <!-- <p class="text-black">{{ rowData.STATUS }}</p> -->
                <div v-if="rowData.STATUS !== null">
                  <UBadge
                    size="xs"
                    :label="rowData.STATUS === 'A' ? 'Aprovado' : 'Reprovado'"
                    :color="rowData.STATUS === 'A' ? 'emerald' : 'orange'"
                    variant="subtle"
                  />
                </div>
                <div v-else>
                  <UBadge
                    size="xs"
                    label="Pendente"
                    color="gray"
                    variant="subtle"
                  />
                </div>
              </UFormGroup>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup>
import approvalServices from "~/services/approval.service";
import dateFormatterService from "~/services/date-formatter.service";

const user = ref([]);
const q = ref("");
const page = ref(1);
const pageCount = 20;
const selected = ref([]);
const isOpen = ref(false);
const isOpenInfo = ref(false);
const isOpenMore = ref(false);
const table = ref(true);
const rowData = ref(null);
const rowDataInfo = ref(null);
const genUserdata = ref(null);
let newStatus = null;
const loading = ref(false);

definePageMeta({
  middleware: ["auth"],
});

// const getStatusClass = (status) => {
//   return {
//     "bg-green-500 rounded text-white w-24 text-center": status === "A",
//     "bg-red-500 rounded text-white w-24 text-center": status === "B",
//     "bg-gray-500 rounded text-white w-24 text-center": status === null,
//   };
// };

// const getStatusText = (status) => {
//   switch (status) {
//     case "A":
//       return " Aprovado";
//     case "B":
//       return "Reprovado";
//     default:
//       return "Pendente";
//   }
// };

const columns = [
  {
    key: "ID",
    label: "SOLICITAÇÃO",
  },
  {
    key: "FULL_NAME",
    label: "USUÁRIO",
  },
  {
    key: "DATE",
    label: "DATA DA SOLICITAÇÃO",
  },

  {
    key: "STATUS",
    label: "STATUS",
  },
  {
    key: "DATE_APPROVAL",
    label: "DATA DA APROVAÇÃO",
  },
  {
    key: "MODIFIED_BY",
    label: "APROVADO POR",
  },
  {
    key: "actions",
    label: "Opções",
  },
];

const items = (row) => [
  [
    {
      label: "Info",
      click: () => openInfo(row),
    },
  ],
  [
    {
      label: "Mais informações",
      click: () => openMore(row),
    },
  ],
];

const openInfo = (row) => {
  isOpenInfo.value = true;
  rowDataInfo.value = row;
};

const openMore = async (row) => {
  const response = await approvalServices.getUser(row.GEN_USER_ID);
  if (response) {
    genUserdata.value = response;
  }
  isOpenMore.value = true;
  table.value = false;
  rowData.value = row;
};

async function fetchData() {
  loading.value = true;
  const nrOrg = localStorage.getItem("NRORG");
  const response = await approvalServices.getUsers(nrOrg);
  user.value = response || [];
  loading.value = false;
}

function verifyStatus(status) {
  const selectStatus = selected.value.slice().map((item) => item.STATUS);
  const hasNonNullStatus = selectStatus.some((status) => status !== null);
  if (hasNonNullStatus) {
    isOpen.value = true;
    newStatus = status;
  } else {
    updateStatus(status);
  }
}

async function updateStatus(status) {
  const userId = localStorage.getItem("userId");
  const selectIds = selected.value.slice().map((item) => item.ID);
  isOpen.value = false;

  if (selectIds.length === 0) {
    return;
  }

  if (status === "A") {
    selected.value.forEach(async (obj) => {
      await approvalServices.createGenUserTypeRel(obj, "A", userId);
    });
  }
  loading.value = true;

  const response = await approvalServices.updateApprovalStatus(
    selectIds,
    status,
    userId
  );
  selected.value = [];
  await fetchData();
  loading.value = false;
  return response || [];
}

onMounted(async () => {
  await fetchData();
});

// function select(row) {
//   const index = selected.value.findIndex((item) => item.ID === row.ID);
//   if (index === -1) {
//     selected.value.push(row);
//   } else {
//     selected.value.splice(index, 1);
//   }
// }

const filteredRows = computed(() => {
  if (!q.value) {
    return user.value.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  }

  return user.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
