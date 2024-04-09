<template>
    <UContainer>
        <UCard>
            <div class="row">
                <div class="col-8">
                    <h5 class="font-weight-bolder mb-0 p-4">
                        Tipo de Membro
                    </h5>
                </div>
                <div class="col-4">
                    <div class="row pe-md-3 d-flex align-items-center ms-md-auto" style="float: right">
                        <UButton type="submit" color="primary" size="xl" @click.prevent="openFormNewUser()">Novo
                        </UButton>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <div class="table-responsive">
                    <UTable v-model="selected" :columns="columns" :rows="userGroups">
                        <template #actions-data="{ row }">
                            <UButton color="gray" variant="ghost" icon="fas fa-pencil-alt" @click="show(row)" />
                        </template>
                    </UTable>
                </div>
            </div>
        </UCard>
    </UContainer>
</template>
<script setup>
import { ref } from 'vue'
import { useUser } from "~~/controllers/User";
import { useRouter } from "vue-router";

definePageMeta({
    middleware: ["auth"]
});

const router = useRouter();
const userController = useUser();
await userController.getGenUserGroups();

const userGroups = userController.userGroups.filter((value) => value.GEN_USER_TYPE_ID == 1);
const selected = ref([]);
const columns = ref([
    { key: 'NAME', label: 'TIPO' },
    { key: 'actions', label: 'PERMISSOES' },
]);

const show = (row) => {
    userController.setUserGroup(row);
    userController.setTitle("Membro");
    router.push({ name: 'users-groups-show' });
};

const openFormNewUser = () => {
  userController.setTitle("Membro");
  userController.genUserTypeId = 1;

  router.push({ name: 'users-groups-create' });
};

</script>