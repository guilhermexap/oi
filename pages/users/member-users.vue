<template>
  <UContainer>
    <UCard>
      <div class="row">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Usuarios Membros
          </h5>
        </div>
        <div class="col-4">
          <div
            class="row pe-md-3 d-flex align-items-center ms-md-auto"
            style="float: right"
          >
            <UButton
              type="submit"
              color="primary"
              size="xl"
              @click.prevent="openFormNewUser()"
              >Novo
            </UButton>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <div class="table-responsive">
          <div
            class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
          >
            <UInput v-model="q" placeholder="Filtrar usuários..." />
          </div>
          <UTable
            :columns="columns"
            :rows="filteredRows"
            :loading="pending"
            @select="showUser"
          >
            <template #FIRST_NAME-data="{ row }">
              {{ row.FIRST_NAME }} {{ row.LAST_NAME }}
            </template>
            <template #EXTERNAL_ID-data="{ row }">
              {{ row.user_types[0].EXTERNAL_ID }}
            </template>
            <template #USER_TYPE-data="{ row }">
              {{
                row.user_groups[0]
                  ? row.user_groups[0].gen_user_group.NAME
                  : "não tem"
              }}
            </template>
            <template #PHONE-data="{ row }">
              {{ row.contacts[0] ? row.contacts[0].PHONE : "não possui" }}
            </template>
          </UTable>
          <div
            class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
          >
            <UPagination
              v-if="pageTotal > 0"
              v-model="page"
              :page-count="pageCount"
              :total="pageTotal"
            />
          </div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "~~/controllers/User";
const router = useRouter();
const pending = ref(false);
const users = ref([]);
const userController = ref();
const pageTotal = ref(0);

definePageMeta({
  middleware: ["auth"],
});

onMounted(async () => {
  pending.value = true;
  userController.value = useUser();
  await userController.value.getGenUsers(1);
  users.value = await userController.value.users.data.filter(
    (value) => value.user_types.length > 0
  );
  pageTotal.value = users.value.length;
  pending.value = false;
});

const columns = [
  { key: "ID", label: "ID" },
  { key: "FIRST_NAME", label: "NOME" },
  { key: "USER_TYPE", label: "TIPO DE MEMBRO" },
  { key: "EMAIL", label: "E-MAIL" },
  { key: "CPF", label: "CPF" },
  { key: "EXTERNAL_ID", label: "IDENTIFICAÇÃO" },
  { key: "PHONE", label: "CELULAR" },
  { key: "STATUS", label: "STATUS" },
];
const showUser = (row) => {
  userController.value.setUser(JSON.stringify(row));
  userController.value.setTitle("Membro");
  userController.value.genUserTypeId = 1;

  router.push({ name: "users-show-user" });
};

const openFormNewUser = () => {
  userController.value.setTitle("Membro");
  userController.value.genUserTypeId = 1;

  router.push({ name: "users-create-user" });
};

const page = ref(1);
const pageCount = 300;

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return users.value.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  }
  return users.value.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>
