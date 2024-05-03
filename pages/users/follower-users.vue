<template>
  <UContainer>
    <UCard>
      <div class="row">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Usuarios Seguidores
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
                  : "não possui"
              }}
            </template>
            <template #PHONE-data="{ row }">
              {{ row.contacts[0] ? row.contacts[0].PHONE : "não possui" }}
            </template>
          </UTable>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-wrap justify-between items-center">
          <div v-if="pageTotal">
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
const pageCount = 15;
const pageFrom = computed(() => (page.value - 1) * pageCount + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount, pageTotal.value)
);

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return users.value;
  }
  return users.value.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const fetchData = async () => {
  pending.value = true;
  userController.value = useUser();
  await userController.value.getGenUsers(6, page.value, pageCount, "");
  users.value = userController.value.users.data;
  pageTotal.value = userController.value.users.total;
  pending.value = false;
};

onMounted(() => {
  fetchData();
});

watchEffect(() => {
  // console.log(page.value);
});

watch([page, pageTotal], ([_newValue, _newValue2], [_oldValue, _oldValue2]) => {
  fetchData();
});
</script>
