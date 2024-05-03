<template>
  <UContainer class="d-flow">
    <UCard class="card shadow-lg mx-4 p-3 mt-4">
      <div class="row">
        <div class="col-8">
          <h5 class="font-weight-bolder mb-0" style="padding: 1rem">
            {{ userController.title }}
          </h5>
        </div>
        <div class="col-4 ms-md-auto" style="">
          <UButton
            v-if="user.user_types[0].GEN_USER_TYPE_ID == 6"
            class="m-1 float-right"
            color="red"
            size="xl"
            type="submit"
            @click.prevent="updateGenUser()"
          >
            Banir
          </UButton>

          <UButton
            class="m-1 float-right"
            size="xl"
            type="submit"
            @click.prevent="updateGenUser()"
          >
            Salvar
          </UButton>
          <UButton
            class="m-1 float-right"
            color="gray"
            size="xl"
            @click.prevent="goBack()"
          >
            Voltar
          </UButton>

          <UButton
            class="m-1 float-right"
            color="gray"
            size="xl"
            @click.prevent="goNew()"
          >
            nova tela
          </UButton>
        </div>
      </div>
      <UForm :state="user" class="row">
        <div class="col-3">
          <img :src="user.IMAGE" alt="Foto de Perfil" />
          <UInput
            type="file"
            label="Foto de Perfil"
            @change="handleFileUpload"
          />
        </div>
        <div class="col-9">
          <div class="mt-4">
            <div class="row">
              <div class="col-6 mt-sm-0">
                <UFormGroup
                  label="Primeiro Nome"
                  required
                  name="group-required"
                  class="w-90 pb-3"
                >
                  <UInput v-model="user.FIRST_NAME" type="text" autofocus />
                </UFormGroup>
              </div>
              <div class="col-6 mt-sm-0">
                <UFormGroup
                  label="Segundo Nome"
                  required
                  name="group-required"
                  class="w-90 pb-3"
                >
                  <UInput v-model="user.LAST_NAME" type="text" />
                </UFormGroup>
              </div>
            </div>
            <div class="row">
              <div class="col-6 mt-sm-0">
                <UFormGroup
                  label="Tipo de Usuario"
                  required
                  name="group-required"
                  class="w-90 pb-3"
                >
                  <USelect
                    v-model="user.GROUP.GEN_USER_GROUP_ID"
                    select-class="px-2"
                    :options="userGroups"
                  />
                </UFormGroup>
              </div>
              <div class="col-6 mt-sm-0">
                <UFormGroup
                  label="Sexo"
                  required
                  name="group-required"
                  class="w-90 pb-3"
                >
                  <USelect
                    v-model="user.GENDER"
                    select-class="px-2"
                    :options="userController.genders"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="row">
              <div class="col-6 mt-sm-0">
                <UFormGroup
                  label="Data de nascimento"
                  required
                  name="group-required"
                  class="w-90 pb-3"
                >
                  <UInput v-model="user.BIRTH_DATE_F" type="date" />
                </UFormGroup>
              </div>
              <div class="col-6 mt-sm-0">
                <UFormGroup
                  label="CPF"
                  required
                  name="group-required"
                  class="w-90 pb-3"
                >
                  <UInput v-model="user.CPF" type="text" />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
      </UForm>
    </UCard>

    <UCard
      v-if="user.user_types[0].GEN_USER_TYPE_ID != 6 && dependents.length"
      class="card shadow-lg mx-4 p-3 mt-4"
    >
      <h5 class="font-weight-bolder mb-0">Dependentes</h5>
      <span>Essa conta e responsavel pelas pessoas listadas abaixo.</span>
      <div class="row">
        <UTable
          v-model="selectedDenpendent"
          :columns="[
            { key: 'ID', label: 'ID' },
            { key: 'FIRST_NAME', label: 'Primeiro Nome' },
            { key: 'LAST_NAME', label: 'Segundo Nome' },
            { key: 'actions', label: 'Ações' },
          ]"
          :rows="dependents"
        >
          <template #name-data="{ row }">
            <span
              :class="[
                selectedDenpendent.find(
                  (dependent) => dependent.ID === row.ID
                ) && 'text-primary-500 dark:text-primary-400',
              ]"
            >
              {{ row.FIRST_NAME }}
            </span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="actions(row, 'dependent')">
              <UButton color="gray" variant="ghost" icon="fas fa-ellipsis-h" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </UCard>

    <UCard v-if="user.contacts.length" class="card shadow-lg mx-4 p-3 mt-4">
      <h5 class="font-weight-bolder mb-0">Contatos</h5>
      <div class="row">
        <UTable
          v-model="selectedContact"
          :columns="[
            { key: 'ID', label: 'ID' },
            { key: 'TYPE', label: 'Tipo' },
            { key: 'PHONE', label: 'Telefone' },
            { key: 'actions', label: 'Ações' },
          ]"
          :rows="user.contacts"
        >
          <template #name-data="{ row }">
            <span
              :class="[
                selectedContact.find((contact) => contact.ID === row.ID) &&
                  'text-primary-500 dark:text-primary-400',
              ]"
            >
              {{ row.PHONE }}
            </span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="actions(row, 'contact')">
              <UButton color="gray" variant="ghost" icon="fas fa-ellipsis-h" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </UCard>

    <UCard
      v-if="user.user_types[0].GEN_USER_TYPE_ID == 1 && addresses.length"
      class="card shadow-lg mx-4 p-3 mt-4"
    >
      <h5 class="font-weight-bolder mb-0">Endereco</h5>
      <div class="row">
        <UTable
          v-model="selectedAddress"
          :columns="[
            { key: 'ID', label: 'ID' },
            { key: 'TYPE', label: 'Tipo' },
            { key: 'CEP', label: 'Cep' },
            { key: 'ADDRESS', label: 'Endereço' },
            { key: 'actions', label: 'Ações' },
          ]"
          :rows="addresses"
        >
          <template #name-data="{ row }">
            <span
              :class="[
                selectedAddress.find((address) => address.ID === row.ID) &&
                  'text-primary-500 dark:text-primary-400',
              ]"
            >
              {{ row.ADDRESS }}
            </span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="actions(row, 'address')">
              <UButton color="gray" variant="ghost" icon="fas fa-ellipsis-h" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
import { useUser } from "~~/controllers/User";

definePageMeta({
  middleware: ["auth"],
});
const userController = useUser();

const user = ref({});
const dependents = ref([]);
const addresses = ref([]);

const actions = (row, type) => [
  [
    {
      label: "Delete",
      icon: "fas fa-trash",
      click: () => userController.deleteItem(row, type),
    },
  ],
];
const userGroups = await userController.filterAndMapperUseGroup();

await userController.getUser().then((rsp) => {
  // console.log(rsp);
  if (rsp.user_groups.length) {
    rsp.GROUP = {
      GEN_USER_GROUP_ID: rsp.user_groups[0].GEN_USER_GROUP_ID,
      GEN_USER_ID: rsp.ID,
      NRORG: localStorage.getItem("NRORG"),
    };
  } else {
    rsp.GROUP = {
      GEN_USER_GROUP_ID: userGroups[0].value,
      GEN_USER_ID: rsp.ID,
      NRORG: localStorage.getItem("NRORG"),
    };
  }
  if (rsp.dependents.length) {
    dependents.value = rsp.dependents.map(function (dependent) {
      return dependent.gen_user;
    });
  }
  if (rsp.addresses.length) {
    addresses.value = rsp.addresses.map(function (address) {
      return {
        ID: address.ID,
        TYPE: address.TYPE,
        CEP: address.CEP,
        ADDRESS:
          address.STREET +
          " Nº " +
          address.STREET_NUMBER +
          ", " +
          address.NEIGHBORHOOD +
          " " +
          address.CITY +
          "-" +
          address.PROVINCY,
      };
    });
  }

  user.value = rsp;
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.value.IMAGE = URL.createObjectURL(file);
  }
};

const updateGenUser = () => {
  user.value.BIRTH_DATE = user.value.BIRTH_DATE_F;
  user.value.NRORG = localStorage.getItem("NRORG");
  userController.user = user.value;
  userController.updateGenUser();
  goBack();
};

const goBack = () => {
  if (userController.title === "Membro") {
    navigateTo("/users/member-users");
  } else {
    navigateTo("/users/follower-users");
  }
};

const goNew = () => {
  navigateTo("/users/show-user3");
};
</script>
