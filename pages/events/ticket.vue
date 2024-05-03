<template>
  <UContainer>
    <UCard>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 px-3"
        @submit="onSubmit"
      >
        <div
          class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">
              Adicionar Ingressos - Inscrições
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
          <div class="flex flex-col gap-4">
            <div class="flex w-full gap-2">
              <UFormGroup label="Nome" name="NAME" class="w-2/3">
                <UInput v-model="state.NAME" />
              </UFormGroup>
              <UFormGroup
                label="Permitir usuários externos"
                name="ALLOW_EXTERNAL_USERS"
                class="w-1/3"
              >
                <SelectMenu
                  v-model="state.ALLOW_EXTERNAL_USERS"
                  placeholder="Selecione..."
                  :options="options"
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormGroup>
            </div>
            <div class="flex w-full gap-2">
              <UFormGroup
                label="Início das vendas"
                name="START_SALE"
                class="w-1/2"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="format(state.START_SALE, 'd MMM, yyy  HH:mm')"
                    class="w-full bg-white text-black"
                  />

                  <template #panel="{ close }">
                    <DatePicker
                      v-model="state.START_SALE"
                      mode="dateTime"
                      is24hr
                      hide-time-header
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
              <UFormGroup
                label="Final das vendas"
                name="FINAL_SALE"
                class="w-1/2"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="format(state.FINAL_SALE, 'd MMM, yyy  HH:mm')"
                    class="w-full bg-white text-black"
                  />

                  <template #panel="{ close }">
                    <DatePicker
                      v-model="state.FINAL_SALE"
                      mode="dateTime"
                      is24hr
                      hide-time-header
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="flex w-full gap-2">
              <UFormGroup
                label="Quantidade de ingressos"
                name="AMOUNT"
                class="w-1/3"
              >
                <UInput v-model="state.AMOUNT" type="number" />
              </UFormGroup>
              <UFormGroup
                label="Quantidade de ingressos por compra"
                name="MIN_PURCHASE_AMOUNT"
                class="w-1/3"
              >
                <UInput v-model="state.MIN_PURCHASE_AMOUNT" type="number" />
              </UFormGroup>
              <UFormGroup label="Preço" name="PRICE" class="w-1/3">
                <UInput v-model="state.PRICE" v-money="moneyOptions" />
              </UFormGroup>
            </div>
          </div>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts" props="props">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import services from "~/services/services.service";
import eventServices from "~/services/event.service";
const NumberOrg = localStorage.getItem("NRORG");
const router = useRouter();
const route = useRoute();
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const moneyOptions = {
  precision: 2,
  thousands: ".",
  decimal: ",",
  prefix: "R$ ",
  masked: false,
};

const schema = object({
  ID: number(),
  NAME: string().required("O nome é obrigatório"),
  ALLOW_EXTERNAL_USERS: number()
    .required("Selecione uma opção")
    .typeError("Valor inválido"),
  AMOUNT: number().required("Campo obrigatório"),
  MIN_PURCHASE_AMOUNT: number().required("Campo obrigatório"),
  PRICE: string()
    .notOneOf(["R$ 0,00"], "O valor não pode ser R$ 0,00")
    .typeError("Valor inválido"),
  STATUS: string(),
  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
});

const state = reactive({
  ID: undefined,
  NAME: undefined,
  ALLOW_EXTERNAL_USERS: undefined,
  START_SALE: new Date(),
  FINAL_SALE: new Date(),
  AMOUNT: undefined,
  PRICE: "",
  MIN_PURCHASE_AMOUNT: undefined,
  NRORG: undefined,
  USER_ID: undefined,
  STATUS: true,
});

type Schema = InferType<typeof schema>;

const options = [
  {
    label: "Permitir",
    value: 1,
  },
  {
    label: "Não permitir",
    value: 0,
  },
];

const backPage = () => {
  router.push({ name: "events" });
};

onMounted(() => {
  if (!route.query.ID) {
    backPage();
  }
});

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const data = {
    EVT_EVENT_ID: Number(route.query.ID),
    NAME: state.NAME,
    ALLOW_EXTERNAL_USERS: state.ALLOW_EXTERNAL_USERS,
    _START_SALE: state.START_SALE.toLocaleString(),
    _FINAL_SALE: state.FINAL_SALE.toLocaleString(),
    AMOUNT: Number(state.AMOUNT),
    MIN_PURCHASE_AMOUNT: Number(state.MIN_PURCHASE_AMOUNT),
    PRICE: services.convertToFloat(state.PRICE),
    STATUS: "A",
    NRORG: NrOrg,
    USER_ID: UserId,
  };

  const response = await eventServices.postTicket(data);
  if (response) {
    isLoading.value = false;
    return backPage();
  }
  isLoading.value = false;
}
</script>
