<template>
  <UContainer>
    <UCard>
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <div
          class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="col-8">
            <h5 class="font-weight-bolder mb-0 py-4">
              Adicionar Local de atendimento
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
        <div
          v-for="(item, index) in spaces"
          :key="index"
          class="flex mt-4 gap-4 w-full items-end"
        >
          <UFormGroup label="Local" name="EVT_EVENT_ID" class="flex-grow w-1/2">
            <USelect
              v-model="item.EVT_EVENT_ID"
              placeholder="Selecione..."
              :options="optionsEvent"
            />
          </UFormGroup>
          <UFormGroup
            label="Quadro de horarios"
            name="SER_TIMESHEET_ID"
            class="flex-grow w-1/2"
          >
            <USelect
              v-model="item.SER_TIMESHEET_ID"
              placeholder="Selecione..."
              :options="optionsTimesheet"
            />
          </UFormGroup>
          <!-- <UFormGroup name="STATUS" class="pt-4">
            <UCheckbox
              :id="'nuxt-checkbox' + index"
              v-model="item.STATUS"
              label="Ativo"
            />
          </UFormGroup> -->
          <UButton
            type="button"
            color="gray"
            size="xl"
            class="flex justify-center"
            :disabled="isLoading"
            @click="removeSpace(index)"
          >
            Remover
          </UButton>
        </div>
        <div class="flex mt-5 items-center justify-end">
          <UButton
            type="button"
            color="primary"
            size="xl"
            class="flex justify-center"
            :disabled="isLoading"
            @click="addSpace"
          >
            Adicionar
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { number, object, string } from "yup";
import services from "~/services/services.service";
import eventServices from "~/services/event.service";
const NumberOrg = localStorage.getItem("NRORG");
const UsrId = localStorage.getItem("userId");
const NrOrg = parseInt(NumberOrg!);
const UserId = parseInt(UsrId!);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();

const optionsEvent = ref<{ label: string; value: number }[]>([]);
const optionsTimesheet = ref<{ label: string; value: number }[]>([]);

const backPage = () => {
  router.push({ name: "services-professional-reservation" });
};

onMounted(async () => {
  const responseEvent = await eventServices.indexEvents(NrOrg);
  if (Array.isArray(responseEvent)) {
    optionsEvent.value = responseEvent.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }

  const responseTimesheet = await services.indexTimesheet(NrOrg);
  if (Array.isArray(responseTimesheet)) {
    optionsTimesheet.value = responseTimesheet.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
  }
});

const createSchema = () => {
  return object({
    SER_SERVICE_ID: number(),
    EVT_EVENT_ID: number()
      .required("Selecione uma opção")
      .typeError("Valor inválido"),
    SER_TIMESHEET_ID: number()
      .required("Selecione uma opção")
      .typeError("Valor inválido"),

    STATUS: string(),
    NRORG: number().default(NrOrg),
    USER_ID: number().default(UserId),
  });
};

const spaces = ref([
  {
    STATUS: "A",
    SER_SERVICE_ID: route.query.ID?.toString() as string,
    EVT_EVENT_ID: undefined,
    SER_TIMESHEET_ID: undefined,
    NRORG: NrOrg,
    USER_ID: UserId,
    optionsEvent: [] as { label: string; value: number }[],
    optionsTimesheet: [] as { label: string; value: number }[],
    schema: createSchema(),
  },
]);

const addSpace = async () => {
  const responseStructure = await services.indexStructure(NrOrg);
  const responseTimesheet = await services.indexTimesheet(NrOrg);

  if (Array.isArray(responseStructure) && Array.isArray(responseTimesheet)) {
    const optionsEvent = responseStructure.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
    const optionsTimesheet = responseTimesheet.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));

    spaces.value.push({
      STATUS: "A",
      SER_SERVICE_ID: route.query.ID?.toString() as string,
      EVT_EVENT_ID: undefined,
      SER_TIMESHEET_ID: undefined,
      NRORG: NrOrg,
      USER_ID: UserId,
      optionsEvent,
      optionsTimesheet,
      schema: createSchema(),
    });
  }
};

const removeSpace = (index: number) => {
  spaces.value.splice(index, 1);
};

const state = reactive({
  STATUS: undefined,
  SER_SERVICE_ID: route.query.ID?.toString() as string,
  EVT_EVENT_ID: undefined,
  SER_TIMESHEET_ID: undefined,
  NRORG: NrOrg,
  USER_ID: UserId,
});

async function onSubmit() {
  isLoading.value = true;
  try {
    for (const item of spaces.value) {
      await item.schema.validate(item, { abortEarly: false });
    }

    for (const item of spaces.value) {
      // item.STATUS = services.convertToString(item.STATUS);

      const response = await eventServices.postEvent(item);
      if (response) {
        backPage();
      }
    }
  } catch (error) {
    isLoading.value = false;
    toast.add({
      color: "red",
      title: "Erro",
      description: "Todas as opções devem ser selecionadas",
    });
  }
}
</script>
