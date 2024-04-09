<template>
  <UContainer class="d-flow">
    <UCard class="card shadow-lg mx-4 p-3 mt-4 col-10">
      <h4>Novo Tipo de Usuário {{ userController.title }}</h4>
      <template>
      </template>
      <UForm :state="userGroup">
        <div class="row">
          <div class="row col-12">
            <UFormGroup label="Descrição" required name="group-required" class="w-60 pb-3">
              <UInput type="text" v-model="userGroup.NAME" autofocus />
            </UFormGroup>
            <UFormGroup label="Tipo" required name="group-required" class="w-40 pb-3">
              <USelect v-model="userGroup.GEN_USER_TYPE_ID" :options="genUserTypes" option-attribute="name" />
            </UFormGroup>
          </div>
        </div>
        <div class="mt-4 button-row d-flex justify-between">
            <UButton title="Prev" type="button" color="black" size="xl" class="m-1 float-right"
              @click.prevent="goBack">Sair
            </UButton>
            <UButton title="Next" type="button" size="xl" class="m-1 float-right"
              @click.prevent="createGenUserGroup">Salvar
            </UButton>
          </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup>
import { useUser } from "~~/controllers/User";

definePageMeta({
  middleware: ["auth"]
});

const genUserTypes = [{
  name: 'Membro',
  value: 1
}, {
  name: 'Seguidor',
  value: 6
}];

let userGroup = reactive({
  NAME: null,
  GEN_USER_TYPE_ID: 1,
  APP_LAYOUT_CONFIG:'{"slideNav":[{"id":"0","name":"Perfil","icon":"user","status":true},{"id":"2","name":"Meios de pagto","icon":"wallet","status":true},{"id":"1","name":"Dependentes","icon":"user-friends","status":true},{"id":"3","name":"Documentos","icon":"file-alt","status":true},{"id":"5","name":"Boletos","icon":"file","status":false},{"id":"4","name":"Ouvidoria","icon":"volume","status":false},{"id":"8","name":"Sair","icon":"sign-out-alt","status":false}]}',
  NRORG: localStorage.getItem("NRORG"),
  STATUS: "A",
});

const userController = useUser();

const createGenUserGroup = () => {
  userController.userGroup = userGroup;
  userController.createGenUserGroup();
  navigateTo('/users/groups/members');
};

const goBack = () => {
  if (userController.title == 'Membro') {
    navigateTo('/users/groups/members');
  } else {
    navigateTo('/users/groups/followers');
  }
}
</script>