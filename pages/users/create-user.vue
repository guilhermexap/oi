<template>
  <UContainer class="d-flow">
    <div id="modal1" class="multisteps-form__form">
      <UCard class="card shadow-lg mx-4 p-3 mt-4 col-10">
        <h4>Dados Pessoais</h4>
        <template> </template>
        <UForm :state="user">
          <div class="row">
            <div class="col-3 d-grid">
              <img :src="user.IMAGE" alt="Foto de Perfil" />
              <UInput
                type="file"
                label="Foto de Perfil"
                @change="handleFileUpload"
              />
            </div>
            <div class="col-9">
              <div class="row col-10">
                <UFormGroup
                  label="Primeiro Nome"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <UInput v-model="user.FIRST_NAME" type="text" autofocus />
                  <p v-if="firstName" class="text-sm text-red-600 #dc2626">
                    Campo obrigatório.
                  </p>
                </UFormGroup>
                <UFormGroup
                  label="Segundo Nome"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <UInput v-model="user.LAST_NAME" type="text" />
                  <p v-if="lastName" class="text-sm text-red-600 #dc2626">
                    Campo obrigatório.
                  </p>
                </UFormGroup>
              </div>
              <div class="row col-10">
                <UFormGroup
                  label="Tipo de Usuario"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <USelect
                    v-model="user.GROUP.GEN_USER_GROUP_ID"
                    select-class="px-2"
                    :options="userGroups"
                  />
                  <p v-if="genUserGroupId" class="text-sm text-red-600 #dc2626">
                    Campo obrigatório.
                  </p>
                </UFormGroup>
                <UFormGroup
                  label="Sexo"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <USelect
                    v-model="user.GENDER"
                    select-class="px-2"
                    :options="userController.genders"
                  />
                  <p v-if="gender" class="text-sm text-red-600 #dc2626">
                    Campo obrigatório.
                  </p>
                </UFormGroup>
              </div>
              <div class="row col-10">
                <UFormGroup
                  label="Data de nascimento"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <UInput v-model="user.BIRTH_DATE" type="date" />
                  <p v-if="birthDate" class="text-sm text-red-600 #dc2626">
                    Campo obrigatório.
                  </p>
                </UFormGroup>
                <UFormGroup
                  label="CPF"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <UInput v-model="user.CPF" type="text" />
                  <p v-if="cpf" class="text-sm text-red-600 #dc2626">
                    Campo obrigatório.
                  </p>
                </UFormGroup>
              </div>
              <div v-show="user.GEN_USER_TYPE_ID != 6" class="row col-10">
                <UFormGroup
                  label="Dependentes"
                  name="group-required"
                  class="w-100 pb-3"
                >
                  <USelectMenu
                    v-model="user.DEPENDENTS"
                    by="id"
                    :options="dependents"
                    option-attribute="name"
                    multiple
                    searchable
                    placeholder="Selecione seus dependentes"
                  />
                </UFormGroup>
              </div>
            </div>
          </div>
          <div class="mt-4 button-row d-flex justify-between">
            <UButton
              title="Prev"
              type="button"
              color="black"
              size="xl"
              class="m-1 float-right"
              @click.prevent="
                openModal(null, 1);
                goBack();
              "
              >Sair
            </UButton>
            <UButton
              title="Next"
              type="button"
              size="xl"
              class="m-1 float-right"
              :disabled="
                firstName ||
                lastName ||
                genUserGroupId ||
                gender ||
                birthDate ||
                cpf
              "
              @click.prevent="openModal(2, 1)"
              >Proximo
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
    <div id="modal2" class="multisteps-form__form">
      <UCard class="card shadow-lg mx-4 p-3 mt-4 col-10">
        <h4>Contatos</h4>
        <UForm :state="user">
          <div class="row">
            <div class="col-12">
              <div class="row col-10">
                <UFormGroup
                  label="E-mail"
                  required
                  name="group-required"
                  class="w-70 pb-3"
                >
                  <UInput v-model="user.EMAIL" type="text" />
                </UFormGroup>
                <UFormGroup
                  label="Telefone"
                  required
                  name="group-required"
                  class="w-30 pb-3"
                >
                  <UInput v-model="user.CONTACT.PHONE" type="text" />
                </UFormGroup>
              </div>
            </div>
          </div>
          <div class="mt-4 button-row d-flex">
            <UButton
              title="Prev"
              type="button"
              class="mb-0 btn bg-gradient-light js-btn-prev"
              @click.prevent="openModal(1, 2)"
              >Voltar
            </UButton>
            <UButton
              title="Next"
              type="button"
              class="mb-0 btn bg-gradient-dark ms-auto js-btn-next"
              :disabled="!user.CONTACT.PHONE || !user.EMAIL"
              @click.prevent="openModal(3, 2)"
              >Proximo
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
    <div id="modal3" class="multisteps-form__form">
      <UCard class="card shadow-lg mx-4 p-3 mt-4 col-10">
        <h4>Endereços</h4>
        <UForm :state="user.ADDRESS">
          <div class="row">
            <div class="col-12">
              <div class="row col-10">
                <UFormGroup
                  label="Rua"
                  required
                  name="group-required"
                  class="w-70 pb-3"
                >
                  <UInput v-model="user.ADDRESS.STREET" type="text" />
                </UFormGroup>
                <UFormGroup
                  label="Numero"
                  required
                  name="group-required"
                  class="w-30 pb-3"
                >
                  <UInput v-model="user.ADDRESS.STREET_NUMBER" type="text" />
                </UFormGroup>
              </div>
              <div class="row col-10">
                <UFormGroup
                  label="Complemento"
                  required
                  name="group-required"
                  class="w-70 pb-3"
                >
                  <UInput v-model="user.ADDRESS.COMPLEMENT" type="text" />
                </UFormGroup>
                <UFormGroup
                  label="CEP"
                  required
                  name="group-required"
                  class="w-30 pb-3"
                >
                  <UInput v-model="user.ADDRESS.CEP" type="text" />
                </UFormGroup>
              </div>
              <div class="row col-10">
                <UFormGroup
                  label="Bairro"
                  required
                  name="group-required"
                  class="w-50 pb-3"
                >
                  <UInput v-model="user.ADDRESS.NEIGHBORHOOD" type="text" />
                </UFormGroup>
                <UFormGroup
                  label="Cidade"
                  required
                  name="group-required"
                  class="w-40 pb-3"
                >
                  <UInput
                    v-model="user.ADDRESS.CITY"
                    type="text"
                    :class="{
                      'outline outline-1 outline-red-400 rounded-md':
                        !user.ADDRESS.CITY,
                    }"
                  />
                </UFormGroup>
                <UFormGroup
                  label="UF"
                  required
                  name="group-required"
                  class="w-10 pb-3"
                >
                  <UInput
                    v-model="user.ADDRESS.PROVINCY"
                    type="text"
                    :class="{
                      'outline outline-1 outline-red-400 rounded-md':
                        !user.ADDRESS.PROVINCY,
                    }"
                  />
                </UFormGroup>
              </div>
              <div class="row col-10">
                <UFormGroup label="Tipo" required name="ADDRESS_TYPE">
                  <ArgonRadio
                    id="1"
                    v-model="user.ADDRESS.TYPE"
                    name="ADDRESS_TYPE"
                    value="BILLING"
                  >
                    Trabalho
                  </ArgonRadio>
                  <ArgonRadio
                    id="2"
                    v-model="user.ADDRESS.TYPE"
                    name="ADDRESS_TYPE"
                    value="CORRESPONDENCE"
                    checked
                  >
                    Correspondência
                  </ArgonRadio>
                </UFormGroup>
              </div>
            </div>
          </div>
          <div class="mt-4 button-row d-flex">
            <UButton
              title="Prev"
              type="button"
              class="mb-0 btn bg-gradient-light js-btn-prev"
              @click.prevent="openModal(2, 3)"
              >Voltar
            </UButton>
            <UButton
              title="Next"
              type="button"
              class="mb-0 btn bg-gradient-dark ms-auto js-btn-next"
              :disabled="
                !user.ADDRESS.STREET ||
                !user.ADDRESS.STREET_NUMBER ||
                !user.ADDRESS.COMPLEMENT ||
                !user.ADDRESS.CEP ||
                !user.ADDRESS.NEIGHBORHOOD ||
                !user.ADDRESS.CITY ||
                !user.ADDRESS.PROVINCY
              "
              @click.prevent="
                openModal(null, 3);
                createGenUser();
              "
              >Finalizar
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup>
import { useUser } from "~~/controllers/User";

definePageMeta({
  middleware: ["auth"],
});

const userController = useUser();

const dependents = ref(
  userController.users.data.map((user) => ({
    id: user.ID,
    name: user.FULL_NAME,
  }))
);
const userGroups = await userController.filterAndMapperUseGroup();

onMounted(async () => {
  document.getElementById("modal" + 1).style.display = "contents";
  await userController.getGenUsers(1, 1, 15, "");
  // user.GEN_USER_TYPE_ID = userController.genUserTypeId;
});

const createGenUser = () => {
  userController.user = user;
  userController.createGenUser();
  navigateTo("/users/member-users");
};

const user = reactive({
  GENDER: "0",
  BIRTH_DATE: "",
  CPF: "",
  NRORG: localStorage.getItem("NRORG"),
  EMAIL: "",
  FIRST_NAME: "",
  LAST_NAME: "",
  STATUS: "A",
  IMAGE:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXaova-4IVX3jj2DvzkGfkSzhrWWMyzxDwxw&usqp=CAU",
  GEN_USER_TYPE_ID: null,
  GROUP: {
    GEN_USER_GROUP_ID: null,
    NRORG: localStorage.getItem("NRORG"),
  },
  CONTACT: {
    PHONE: null,
    NRORG: localStorage.getItem("NRORG"),
    STATUS: "A",
  },
  ADDRESS: {
    CEP: null,
    STREET: null,
    NEIGHBORHOOD: null,
    CITY: null,
    PROVINCY: null,
    NRORG: localStorage.getItem("NRORG"),
    STREET_NUMBER: null,
    COUNTRY: null,
    CREATE_DATE: null,
    TYPE: "CORRESPONDENCE",
    COMPLEMENT: null,
    STATUS: "A",
  },
  DEPENDENTS: [],
});

const openModal = (modalNumber, modalNumber1) => {
  const modals = document.getElementsByClassName("modal");

  for (let i = 0; i < modals.length; i++) {
    modals[i].style.display = "none";
  }
  if (modalNumber) {
    document.getElementById("modal" + modalNumber).style.display = "contents";
  }
  if (modalNumber1) {
    document.getElementById("modal" + modalNumber1).style.display = "none";
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.IMAGE = URL.createObjectURL(file);
  }
};

const goBack = () => {
  if (userController.title == "Membro") {
    navigateTo("/users/member-users");
  } else {
    navigateTo("/users/follower-users");
  }
};

const firstName = computed(() => {
  return user.FIRST_NAME.trim() === "";
});
const lastName = computed(() => {
  return user.LAST_NAME.trim() === "";
});
const genUserGroupId = computed(() => {
  return user.GROUP.GEN_USER_GROUP_ID === null;
});
const gender = computed(() => {
  return user.GENDER === "0";
});
const birthDate = computed(() => {
  return user.BIRTH_DATE.trim() === "";
});
const cpf = computed(() => {
  return user.CPF.trim() === "";
});
</script>

<style scoped>
/* Estilos para os modais */
.multisteps-form__form {
  display: none;
  position: fixed;
}

.multisteps-form__content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  width: 80%;
}

.modal.active {
  display: flex;
}
</style>
