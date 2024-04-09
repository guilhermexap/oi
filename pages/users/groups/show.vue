<template>
  <UContainer>
    <UCard>
      <div class="row">
        <div class="col-10">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            Alterar <input type="text" v-model="userController.userGroup.NAME" autofocus />
          </h5>
        </div>
        <div class="col-2">
          <div class="row pe-md-1 d-flex align-items-center ms-md-auto float-right">
            <UButton color="primary" size="xl" @click.prevent="update()">Salvar
            </UButton>
          </div>
          <div class="row pe-md-1 d-flex align-items-center ms-md-auto float-left">
            <UButton color="black" size="xl" @click.prevent="goBack()">Voltar
            </UButton>
          </div>
        </div>
      </div>
      <UTable :columns="columns" :rows="jsonData">
        <template #status-data="{ row }">
          <input type="checkbox" :id="row.id" :value="row.status" v-model="row.status" />
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from "~~/controllers/User";
const router = useRouter();

const userController = useUser();

const columns = ref([
  { key: 'name', label: 'ÁREA' },
  { key: 'status', label: 'HABILITADO' }
]);

let jsonData = JSON.parse(userController.userGroup.APP_LAYOUT_CONFIG).slideNav;

const update = () => {
  userController.savePermission(jsonData)
}

const goBack = () => {
  if (userController.title == 'Membro') {
    router.push({ name: 'users-groups-members' });
  } else {
    router.push({ name: 'users-groups-followers' });
  }
}
</script>
  
<style scoped>
button {
  font-weight: bold;
}
</style>