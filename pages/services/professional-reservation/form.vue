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
              {{ titlePage }} reserva
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
              <UFormGroup label="Nome" name="NAME">
                <UInput v-model="state.NAME" />
              </UFormGroup>

              <UFormGroup label="Menu" name="PARENT_ID">
                <SelectMenu
                  v-model="state.PARENT_ID"
                  placeholder="Selecione..."
                  searchable
                  :options="options"
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormGroup>

              <UFormGroup label="Preço" name="PRICE">
                <UInput v-model="state.PRICE" v-money="moneyOptions" />
              </UFormGroup>

              <div class="flex w-full gap-3">
                <UFormGroup name="STATUS">
                  <UCheckbox
                    id="nuxt-checkbox"
                    v-model="state.STATUS"
                    label="Reserva ativa"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-col p-4 col-span-2">
              <div
                class="bg-gray-200 border h-44 mb-4 mt-2 flex items-center justify-center rounded-md text-gray-500"
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
                  <UInput
                    v-model="state.IMAGE"
                    :disabled="!!state.ICON"
                    class="flex-grow"
                  />
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
              <UDivider label="Ou" class="py-2" />
              <UFormGroup label="Ícone" name="ICON">
                <div class="flex gap-3 items-center justify-center">
                  <AwesomeIconsSelect
                    v-model="state.ICON"
                    class="flex-grow"
                    placeholder="Selecione..."
                    :disabled="!!state.IMAGE"
                  ></AwesomeIconsSelect>
                  <div
                    v-if="state.ICON"
                    class="-m-3 text-red-600 flex items-center justify-center rounded-sm cursor-pointer hover:text-red-500 transition-opacity"
                    title="Remover ícone"
                    @click="state.ICON = undefined"
                  >
                    <i class="fa fa-close p-1"></i>
                  </div>
                  <div
                    class="w-9 h-10 bg-gray-200 border flex items-center justify-center rounded-sm"
                  >
                    <i :class="`fa fa-${state.ICON}`"></i>
                  </div>
                </div>
              </UFormGroup>
              <p
                v-if="showError"
                class="mt-2 text-red-500 dark:text-red-400 text-sm"
              >
                A url da Imagem ou Icone devem ser preenchidos
              </p>
            </div>
          </div>

          <div class="flex gap-4 flex-col">
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Cancelamento
            </h5>
            <UFormGroup label="Texto de cancelamento" name="DSCANCELLATION">
              <UTextarea v-model="state.DSCANCELLATION" />
            </UFormGroup>
            <div class="flex gap-4 w-1/2 pr-3">
              <UFormGroup
                label="Prazo cancelamento (Horas)"
                name="CANCELLATION_TIME"
                class="flex-grow"
              >
                <UInput v-model="state.CANCELLATION_TIME" v-mask="'###'" />
              </UFormGroup>
              <UFormGroup
                label="Multa (%)"
                name="CANCELLATION_FINE"
                class="flex-grow"
              >
                <UInput v-model="state.CANCELLATION_FINE" v-mask="'###'" />
              </UFormGroup>
            </div>

            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Permissões e limites
            </h5>
            <div class="grid grid-cols-2 gap-4">
              <UFormGroup
                label="Minutos para aceite convite"
                name="QTD_MINUTES_ACCEPT_INVITE"
              >
                <UInput
                  v-model="state.QTD_MINUTES_ACCEPT_INVITE"
                  v-mask="'###'"
                />
              </UFormGroup>
              <UFormGroup
                label=" Limite de horários seguidos por agendamento"
                name="QTD_SCHEDULING_POST"
              >
                <UInput v-model="state.QTD_SCHEDULING_POST" v-mask="'###'" />
              </UFormGroup>
              <UFormGroup
                label="Quantidade máxima de agendamentos por usuário"
                name="USER_SCHEDULING_LIMIT"
              >
                <UInput v-model="state.USER_SCHEDULING_LIMIT" v-mask="'###'" />
              </UFormGroup>
              <UFormGroup
                label="Quantidade de dias liberados para agendamento"
                name="FUTURE_DAYS_TO_SCHEDULE"
              >
                <UInput
                  v-model="state.FUTURE_DAYS_TO_SCHEDULE"
                  v-mask="'###'"
                />
              </UFormGroup>

              <UFormGroup
                label="Máximo de agendamentos por dia por usuário"
                name="QTD_MAX_SCHEDULING_DAY"
              >
                <UInput v-model="state.QTD_MAX_SCHEDULING_DAY" v-mask="'###'" />
              </UFormGroup>

              <UFormGroup
                label="Máximo de agendamentos por semana por usuário"
                name="QTD_MAX_SCHEDULING_WEEK"
              >
                <UInput
                  v-model="state.QTD_MAX_SCHEDULING_WEEK"
                  v-mask="'###'"
                />
              </UFormGroup>
              <UFormGroup label="Idade mínima" name="AGE_LIMIT">
                <UInput v-model="state.AGE_LIMIT" v-mask="'###'" />
              </UFormGroup>
            </div>
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Descrição
            </h5>
            <UFormGroup label="Descriçao do serviço" name="DECRIPTION">
              <UInput v-model="state.DECRIPTION" />
            </UFormGroup>
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Check-in
            </h5>
            <UFormGroup label="Observações do check-in" name="DSCHECKIN">
              <UInput v-model="state.DSCHECKIN" maxlength="255" />
            </UFormGroup>
          </div>
        </div>
      </UForm>
    </UCard>
    <!-- TABELA -->
    <EventTable v-if="route.query.ID" :serviceId="serviceId || ''" />
  </UContainer>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import services from "~/services/services.service";
const showError = ref();

const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
let titlePage = "Adicionar";

const options = ref<{ label: string; value: number }[]>([]);
const router = useRouter();
const route = useRoute();

// NUMERO DO SERVIÇO
const serviceId = ref(route.query.ID?.toString());

definePageMeta({
  middleware: ["auth"],
});

const moneyOptions = {
  precision: 2,
  thousands: ".",
  decimal: ",",
  prefix: "R$ ",
  masked: false,
};

if (route.query.ID !== undefined) {
  titlePage = "Editar";
}

const backPage = () => {
  router.push({ name: "services-professional-reservation" });
};

const schema = object({
  PARENT_ID: number()
    .required("Selecione uma opção")
    .typeError("Valor inválido"),
  NAME: string().required("O nome deve ser preenchido"),
  IMAGE: string().nullable(),
  ICON: string().nullable(),
  STATUS: string(),
  // STATUS_APP: string(),
  PRICE: string()
    // .notOneOf(["R$ 0,00"], "O valor não pode ser R$ 0,00")
    .typeError("Valor inválido"),
  DSCANCELLATION: string().required(
    "O texto de cancelamento deve ser preenchido"
  ),
  DSCHECKIN: string().max(255, "O texto não pode ter mais de 255 caracteres"),
  CANCELLATION_TIME: string().required(
    "O prazo de cancelamento deve ser preenchido"
  ),
  CANCELLATION_FINE: string().nullable(),

  QTD_MINUTES_ACCEPT_INVITE: string()
    .required("Esse campo deve ser preenchido")
    .typeError("Valor inválido"),
  QTD_SCHEDULING_POST: string()
    .required("Esse campo deve ser preenchido")
    .typeError("Valor inválido"),
  QTD_MAX_SCHEDULING_DAY: string(),
  QTD_MAX_SCHEDULING_WEEK: string(),
  USER_SCHEDULING_LIMIT: string()
    .required("Esse campo deve ser preenchido")
    .typeError("Valor inválido"),
  FUTURE_DAYS_TO_SCHEDULE: string()
    .required("Esse campo deve ser preenchido")
    .typeError("Valor inválido"),
  AGE_LIMIT: string()
    .required("A idade mínima deve ser preenchida")
    .typeError("Valor inválido"),

  NRORG: number().default(NrOrg),
  USER_ID: number().default(UserId),
}).test(
  "one-of-fields",
  "Preencha pelo menos um dos campos IMAGE ou ICON",
  function (value) {
    const { IMAGE, ICON } = value;
    const atLeastOneFieldFilled = !!IMAGE || !!ICON;
    showError.value = !(!!IMAGE || !!ICON);
    return atLeastOneFieldFilled;
  }
);

type Schema = InferType<typeof schema>;

const state = reactive({
  PARENT_ID: parseInt(route.query.PARENT_ID as string) || undefined,
  NAME: (route.query.NAME as string) || undefined,
  IMAGE: (route.query.IMAGE as string) || undefined,
  PRICE: services.convertToView(route.query.PRICE) || undefined,

  DSCANCELLATION: (route.query.DSCANCELLATION as string) || undefined,
  DSCHECKIN: (route.query.DSCHECKIN as string) || undefined,
  CANCELLATION_TIME: (route.query.CANCELLATION_TIME as string) || undefined,
  CANCELLATION_FINE: (route.query.CANCELLATION_FINE as string) || undefined,
  QTD_MINUTES_ACCEPT_INVITE:
    (route.query.QTD_MINUTES_ACCEPT_INVITE as string) || undefined,
  QTD_SCHEDULING_POST: (route.query.QTD_SCHEDULING_POST as string) || undefined,
  QTD_MAX_SCHEDULING_DAY:
    (route.query.QTD_MAX_SCHEDULING_DAY as string) || undefined,
  QTD_MAX_SCHEDULING_WEEK:
    (route.query.QTD_MAX_SCHEDULING_WEEK as string) || undefined,
  USER_SCHEDULING_LIMIT:
    (route.query.USER_SCHEDULING_LIMIT as string) || undefined,
  FUTURE_DAYS_TO_SCHEDULE:
    (route.query.FUTURE_DAYS_TO_SCHEDULE as string) || undefined,
  AGE_LIMIT: route.query.AGE_LIMIT as string | undefined,
  STATUS: services.convertToBoolean(route.query.STATUS?.toString()) || true,
  DECRIPTION: (route.query.DECRIPTION as string) || undefined,

  NRORG: NrOrg,
  USER_ID: UserId,
  ICON: (route.query.ICON as string) || undefined,
});

onMounted(async () => {
  const response = await services.indexOptions(NrOrg);

  if (Array.isArray(response)) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  showError.value = false;
  const data = {
    AGE_LIMIT: state.AGE_LIMIT,
    CANCELLATION_FINE: state.CANCELLATION_FINE,
    CANCELLATION_TIME: state.CANCELLATION_TIME,
    DECRIPTION: state.DECRIPTION,
    DSCANCELLATION: state.DSCANCELLATION,
    DSCHECKIN: state.DSCHECKIN,
    FUTURE_DAYS_TO_SCHEDULE: state.FUTURE_DAYS_TO_SCHEDULE,
    ICON: state.ICON,
    IMAGE: state.IMAGE,
    NAME: state.NAME,
    NRORG: state.NRORG,
    PARENT_ID: state.PARENT_ID,
    TYPE: "AGENDA",
    PRICE: services.convertToFloat(state.PRICE),
    QTD_MINUTES_ACCEPT_INVITE: state.QTD_MINUTES_ACCEPT_INVITE,
    QTD_SCHEDULING_POST: state.QTD_SCHEDULING_POST,
    QTD_MAX_SCHEDULING_DAY: state.QTD_MAX_SCHEDULING_DAY,
    QTD_MAX_SCHEDULING_WEEK: state.QTD_MAX_SCHEDULING_WEEK,
    STATUS: services.convertToString(event.data.STATUS),
    USER_ID: state.USER_ID,
    USER_SCHEDULING_LIMIT: state.USER_SCHEDULING_LIMIT,
  };
  isLoading.value = true;
  if (route.query.ID === undefined) {
    const response: any = await services.postService(data);
    if (response) {
      serviceId.value = response.ID;
      router.push({
        name: "services-professional-reservation-new",
        query: {
          ID: response.ID,
        },
      });
    } else {
      isLoading.value = false;
    }
  } else {
    const response = await services.updateService(data, route.query.ID);
    if (response) {
      router.push({ name: "services-professional-reservation" });
    } else {
      isLoading.value = false;
    }
  }
}
</script>
