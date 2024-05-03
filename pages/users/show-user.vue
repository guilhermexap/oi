<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <UContainer>
    <UCard>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="flex justify-between items-center">
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">
              {{ userController.title }}
            </h5>
          </div>
          <div class="flex gap-3">
            <UButton
              type="button"
              color="gray"
              size="xl"
              class="mr-2"
              :disabled="isLoading"
              @click="backPage"
              >Voltar
            </UButton>
            <UButton
              type="submit"
              color="primary"
              size="xl"
              class="mr-2 w-48 flex justify-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
        <div class="mx-auto mt-4">
          <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
            Geral
          </h5>
          <div class="grid grid-cols-5 gap-4">
            <div class="py-4 flex gap-4 flex-col col-span-3">
              <div class="flex gap-3">
                <UFormGroup
                  label="Primeiro nome"
                  name="FIRST_NAME"
                  class="w-full"
                >
                  <UInput v-model="state.FIRST_NAME" />
                </UFormGroup>
              </div>
              <UFormGroup label="Segundo nome" name="LAST_NAME" class="w-full">
                <UInput v-model="state.LAST_NAME" />
              </UFormGroup>

              <div class="flex gap-3">
                <UFormGroup
                  label="Tipo de Usuario"
                  name="GEN_USER_GROUP_ID"
                  class="w-full"
                >
                  <SelectMenu
                    v-model="state.GEN_USER_GROUP_ID"
                    placeholder="Selecione..."
                    :options="UserTypeOptions"
                    option-attribute="label"
                    value-attribute="value"
                  />
                </UFormGroup>
                <UFormGroup label="Sexo" name="GENDER" class="w-full">
                  <SelectMenu
                    v-model="state.GENDER"
                    placeholder="Selecione..."
                    :options="GenderOptions"
                    option-attribute="label"
                    value-attribute="value"
                  />
                </UFormGroup>
              </div>

              <div class="flex gap-3">
                <UFormGroup
                  label="Data de nascimento"
                  name="BIRTH_DATE"
                  class="w-full"
                >
                  <UInput v-model="state.BIRTH_DATE" type="date" />
                </UFormGroup>
                <UFormGroup label="CPF" name="CPF" class="w-full">
                  <UInput v-model="state.CPF" />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-col p-4 col-span-2">
              <div
                class="bg-gray-200 border h-80 mb-4 mt-2 flex items-center justify-center rounded-md text-gray-500"
                :style="{
                  'background-image': `url(${state.IMAGE})`,
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                }"
              >
                <span v-if="!state.IMAGE" class="fa fa-image fa-3x"></span>
              </div>
              <UFormGroup label="Url da imagem" name="IMAGE">
                <div class="flex gap-2 items-center justify-center">
                  <UInput v-model="state.IMAGE" class="w-full" />
                  <div
                    v-if="state.IMAGE"
                    class="flex text-red-600 items-center justify-center rounded-sm cursor-pointer hover:text-red-500 transition-opacity"
                    title="Remover imagem"
                    @click="state.IMAGE = undefined"
                  >
                    <i class="fa fa-close p-1"></i>
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
        </div>
      </UForm>
    </UCard>

    <UCard v-if="dependents.length" class="mt-3">
      <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
        Dependentes
      </h5>
      <span>Essa conta e responsavel pelas pessoas listadas abaixo.</span>
      <div class="row">
        <UTable
          :columns="[
            { key: 'ID', label: 'ID' },
            { key: 'FIRST_NAME', label: 'Primeiro Nome' },
            { key: 'LAST_NAME', label: 'Segundo Nome' },
            { key: 'actions', label: 'Ações' },
          ]"
          :rows="dependents"
        >
          <template #actions-data="{ row }">
            <UDropdown :items="actions(row, 'dependent')">
              <UButton color="gray" variant="ghost" icon="fas fa-ellipsis-h" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </UCard>

    <UCard class="mt-3">
      <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
        Contatos
      </h5>
      <div class="row">
        <UTable
          :columns="[
            { key: 'ID', label: 'ID' },
            { key: 'TYPE', label: 'Tipo' },
            { key: 'PHONE', label: 'Telefone' },
            { key: 'actions', label: 'Ações' },
          ]"
          :rows="user.contacts"
        >
          <template #actions-data="{ row }">
            <UDropdown :items="actions(row, 'contact')">
              <UButton color="gray" variant="ghost" icon="fas fa-ellipsis-h" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </UCard>

    <UCard v-if="addresses.length" class="mt-3">
      <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
        Endereco
      </h5>
      <div class="row">
        <UTable
          :columns="[
            { key: 'ID', label: 'ID' },
            { key: 'TYPE', label: 'Tipo' },
            { key: 'CEP', label: 'Cep' },
            { key: 'ADDRESS', label: 'Endereço' },
            { key: 'actions', label: 'Ações' },
          ]"
          :rows="addresses"
        >
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

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
// import userService from "~/services/user.service";
import { useUser } from "~~/controllers/User";
const user = ref<any>({});
const dependents = ref([]);
const addresses = ref([]);
const userController = useUser();
const userGroups = await userController.filterAndMapperUseGroup();
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);

const UserTypeOptions = ref<{ label: string; value: number }[]>([]);
const GenderOptions = ref<{ label: string; value: string }[]>([]);

definePageMeta({
  middleware: ["auth"],
});

const actions = (row: any, type: any) => [
  [
    {
      label: "Delete",
      icon: "fas fa-trash",
      click: () => userController.deleteItem(row, type),
    },
  ],
];

const backPage = () => {
  if (userController.title === "Membro") {
    navigateTo("/users/member-users");
  } else {
    navigateTo("/users/follower-users");
  }
};

const schema = object({
  FIRST_NAME: string().required("O primeiro nome deve ser preenchido"),
  LAST_NAME: string().required("O segundo nome deve ser preenchido"),
  GEN_USER_GROUP_ID: string().required("O Tipo de usuáro deve ser selecionado"),
  GENDER: string().required("O sexo deve ser selecionado"),
  BIRTH_DATE: string().required("A data de nascimento"),
  CPF: string().required("O CPF deve ser preenchido"),
  IMAGE: string().required("O link da imagem deve ser preenchido"),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  FIRST_NAME: undefined,
  LAST_NAME: undefined,
  IMAGE: undefined,
  GEN_USER_GROUP_ID: undefined,
  GENDER: undefined,
  BIRTH_DATE: undefined,
  CPF: undefined,

  NRORG: NrOrg,
  USER_ID: UserId,
});

onMounted(async () => {
  await userController.getUser().then((rsp) => {
    // console.log(rsp);
    if (rsp.user_groups.length) {
      rsp.GROUP = {
        GEN_USER_GROUP_ID: rsp.user_groups[0]?.GEN_USER_GROUP_ID,
        GEN_USER_ID: rsp.ID,
        NRORG: localStorage.getItem("NRORG"),
      };
    } else {
      rsp.GROUP = {
        GEN_USER_GROUP_ID: userGroups[0]?.value,
        GEN_USER_ID: rsp.ID,
        NRORG: localStorage.getItem("NRORG"),
      };
    }
    if (rsp.dependents.length) {
      dependents.value = rsp.dependents.map(function (dependent: any) {
        return dependent.gen_user;
      });
    }
    if (rsp.addresses.length) {
      addresses.value = rsp.addresses.map(function (address: any) {
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

  state.FIRST_NAME = user.value.FIRST_NAME;
  state.LAST_NAME = user.value.LAST_NAME;
  state.BIRTH_DATE = user.value.BIRTH_DATE_F;
  state.CPF = user.value.CPF;
  state.GENDER = user.value.GENDER;
  state.IMAGE = user.value.IMAGE;
  UserTypeOptions.value = userGroups;
  GenderOptions.value = userController.genders;
  state.GEN_USER_GROUP_ID = user.value.GROUP.GEN_USER_GROUP_ID;
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  user.value.FIRST_NAME = event.data.FIRST_NAME;
  user.value.LAST_NAME = event.data.LAST_NAME;
  user.value.IMAGE = event.data.IMAGE;
  user.value.GROUP.GEN_USER_GROUP_ID = event.data.GEN_USER_GROUP_ID;
  user.value.GENDER = event.data.GENDER;
  user.value.BIRTH_DATE = event.data.BIRTH_DATE;
  user.value.CPF = event.data.CPF;
  user.value.NRORG = NrOrg;
  userController.user = user.value;
  isLoading.value = true;
  await userController.updateGenUser();
  goBack();
  // console.log(event.data);

  // const data = {
  //   ID: user.value.ID,
  //   FIRST_NAME: event.data.FIRST_NAME,
  //   LAST_NAME: event.data.LAST_NAME,
  //   IMAGE: event.data.IMAGE,
  //   GEN_USER_GROUP_ID: event.data.GEN_USER_GROUP_ID,
  //   GENDER: event.data.GENDER,
  //   BIRTH_DATE: event.data.BIRTH_DATE,
  //   CPF: event.data.CPF,
  //   STATUS: user.value.STATUS,
  //   EMAIL: user.value.EMAIL,

  //   NRORG: NrOrg,
  //   USER_ID: UserId,
  // };
  // isLoading.value = true;

  // const response: any = await userService.updateGenUser(data);
  // console.log(data);
  // if (response) {
  //   serviceId.value = response.ID;
  //   // router.push({
  //   //   name: "services-space-reservation-new",
  //   //   query: {
  //   //     ID: response.ID,
  //   //   },
  //   // });
  // } else {
  //   isLoading.value = false;
  // }
}

const goBack = () => {
  if (userController.title === "Membro") {
    navigateTo("/users/member-users");
  } else {
    navigateTo("/users/follower-users");
  }
};
</script>
