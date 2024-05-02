<template>
  <div class="w-full px-2">
    <div class="px-4 pb-5">
      <UModal v-model="isOpen">
        <div class="p-4">
          <div class="flex flex-col gap-4">
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Filtrar
            </h5>
            <div class="flex flex-col justify-center gap-4">
              <UFormGroup label="Serviço" name="SERVICE" class="">
                <SelectMenu
                  v-model="state.SERVICE_ID"
                  :options="options"
                  searchable
                  placeholder="Selecione o serviço..."
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormGroup>
              <UFormGroup label="Data" name="SERVICE" class="">
                <UPopover>
                  <UButton
                    color="white"
                    icon="i-heroicons-calendar-days-20-solid"
                    class="w-full"
                    :label="label"
                  />

                  <template #panel="{ close }">
                    <LazyDatePicker v-model="date" @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
              <UCheckbox
                v-if="disabled === false"
                id="nuxt-checkbox"
                v-model="state.TIME_NOW"
                name="STATUS_APP"
                label="Trazer horarios a partir de agora"
              />
            </div>
            <UButton
              type="button"
              color="primary"
              size="xl"
              class="h-10 flex justify-center"
              :disabled="isLoading"
              @click="filterServices"
              ><span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Filtrar</span>
            </UButton>
          </div>
        </div>
      </UModal>

      <UModal v-model="isOpenInfo">
        <div class="p-4 border">
          <div class="flex justify-between items-center mb-2">
            <h5>Informações</h5>
            <div
              class="h-2 w-1/5 rounded-md"
              :class="{
                'bg-blue-500':
                  dataInfo.TYPES == '1' && dataInfo.GEN_SCHEDULE?.STATUS == 'A',
                'bg-orange-500':
                  dataInfo.TYPES == '1' &&
                  dataInfo.GEN_SCHEDULE?.STATUS == 'A' &&
                  dataInfo.GEN_SCHEDULE.users.length === 0,
                'bg-yellow-400':
                  dataInfo.TYPES == '1' && dataInfo.GEN_SCHEDULE?.STATUS == 'P',
                'bg-purple-500':
                  dataInfo.TYPES == '1' && dataInfo.GEN_SCHEDULE?.STATUS == 'C',
                'bg-green-500': dataInfo.TYPES == '1' && !dataInfo.GEN_SCHEDULE,
                'bg-red-500': dataInfo.TYPES == '0',
              }"
            ></div>
          </div>
          <div>
            <p>
              Horário: de {{ dataInfo.INITIAL_TIME }} às
              {{ dataInfo.FINAL_TIME }}
            </p>
            <p>Espaço: {{ dataInfo.STRUCTURE }}</p>
            <p v-if="dataInfo.TYPES === '1' && !dataInfo.GEN_SCHEDULE">
              Tipo: Livre
            </p>

            <p
              v-else-if="
                dataInfo.TYPES === '1' && dataInfo.GEN_SCHEDULE?.STATUS === 'C'
              "
            >
              Tipo: Check-in
            </p>
            <p v-else-if="dataInfo.TYPES === '1' && dataInfo.GEN_SCHEDULE">
              {{
                dataInfo.GEN_SCHEDULE.users.length === 0
                  ? "Tipo: Bloqueado"
                  : "Tipo: Reservado"
              }}
            </p>
            <p v-else>Tipo: Manutenção</p>
          </div>

          <p
            v-if="
              dataInfo.GEN_SCHEDULE?.users &&
              dataInfo.GEN_SCHEDULE.users.length > 0
            "
          >
            Agendado por:
            <!-- {{
            scheduleServices.capitalize(
              dataInfo.GEN_SCHEDULE?.users[0].user.FIRST_NAME
            )
          }} -->
            {{
              dataInfo.GEN_SCHEDULE?.users[0]?.user
                ? dataInfo.GEN_SCHEDULE.users[0].user.FIRST_NAME +
                  " " +
                  dataInfo.GEN_SCHEDULE.users[0].user.LAST_NAME
                : "Bloqueado"
            }}
          </p>

          <div v-if="dataInfo.GEN_SCHEDULE?.users.length > 1">
            <p>Outros participantes:</p>
            <div
              v-for="(user, index) in dataInfo.GEN_SCHEDULE?.users.slice(1)"
              :key="index"
              class="pl-3"
            >
              {{ user.user.FIRST_NAME + " " + user.user.LAST_NAME }}
            </div>
          </div>
        </div>
      </UModal>

      <UModal v-model="isOpenReserve">
        <div class="p-4">
          <div class="flex flex-col gap-4">
            <h5 class="py-3.5 border-b border-gray-200 dark:border-gray-700">
              Reservar
            </h5>
            <div class="flex flex-col justify-center">
              <UFormGroup label="Selecionar participantes" name="SERVICE">
                <SelectMenu
                  v-model="state.GEN_USER"
                  placeholder="Selecione..."
                  searchable
                  :options="optionsUser"
                  :disabled="selected.length > 3"
                />
              </UFormGroup>
              <p
                v-if="showError"
                class="text-red-500 dark:text-red-400 text-sm pt-2"
              >
                Pelo menos um participante deve ser selecionado
              </p>
              <div class="min-h-[12rem] text-black mt-3">
                <span class="font-bold"
                  >Selecionados ({{ selected.length }} de 4)</span
                >
                <div
                  v-for="(item, index) in selected"
                  :key="index"
                  class="pt-2"
                >
                  <div class="w-full flex justify-between">
                    <span>{{ item.label }}</span>
                    <button
                      type="button"
                      class="hover:opacity-80"
                      @click="deleteSelected(index)"
                    >
                      <i class="fa fa-close text-red-400 p-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <UButton
              type="button"
              color="primary"
              size="xl"
              class="h-10 flex justify-center"
              :disabled="isLoading"
              @click="postReserve"
              ><span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Salvar</span>
            </UButton>
          </div>
        </div>
      </UModal>

      <div class="fixed flex flex-col bottom-2 right-4 gap-3">
        <UButton
          v-if="state.SER_TIME_TIMESHEET_IDS.length > 0"
          type="button"
          title="Reservar"
          color="green"
          class="z-20 font-semibold rounded-full p-3"
          @click="newReserve"
        >
          <i class="fa fa-arrow-right"></i>
        </UButton>

        <UButton
          type="button"
          title="Filtrar serviços"
          color="primary"
          class="rounded-full p-3"
          @click="isOpen = true"
        >
          <i class="fa fa-filter"></i>
        </UButton>
        <!-- <UButton
          type="button"
          title="Voltar"
          class="z-20 font-semibold rounded-full p-3"
          @click="backPage"
        >
          <i class="fa fa-arrow-left"></i>
        </UButton> -->
      </div>

      <div
        v-if="isLoading === true"
        class="absolute top-0 left-0 bg-white h-screen z-10 w-full flex flex-col items-center justify-center"
      >
        <i class="fa fa-sync animate-spin mb-2"></i>
        <span>Carregando...</span>
      </div>
      <div
        v-if="isEmpty === true"
        class="absolute top-0 left-0 bg-white h-screen z-10 w-full flex flex-col items-center justify-center"
      >
        <span>Não existe reservas ainda</span>
        <button
          type="button"
          title="Voltar"
          class="hover:opacity-80 transition-opacity"
          @click="backPage"
        >
          <i class="fa fa-arrow-left"></i> Voltar
        </button>
      </div>
      <div v-else class="flex gap-2 justify-center">
        <div
          class="w-screen py-2 border-b text-center text-lg fixed bg-white flex items-center justify-center"
        >
          <button
            type="button"
            title="Voltar"
            class="z-20 absolute left-0 p-4 hover:opacity-80 transition-opacity"
            @click="backPage"
          >
            <i class="fa fa-arrow-left"></i> Voltar
          </button>
          <div class="flex gap-4 justify-center items-center">
            <button type="button" @click="previousDay">
              <i class="fa fa-chevron-left"></i>
            </button>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <button>
                <h4>{{ label }}</h4>
              </button>

              <template #panel="{ close }">
                <DatePicker v-model="date" @close="close" />
              </template>
            </UPopover>
            <button type="button" @click="nextDay">
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="overflow-auto flex gap-1">
          <div
            v-for="item in scheduleData"
            :key="item.GEN_STRUCTURE_ID"
            class="pt-6"
          >
            <div
              v-if="item.structure && item.structure.NAME"
              id="column"
              class="border="
            >
              <h5 class="text-center">{{ item.structure.NAME }}</h5>

              <div
                v-for="timeSheet in item.filteredTimeSheet"
                id="card"
                :key="timeSheet.ID"
                for="cb"
                :class="{
                  'w-56 h-24': scheduleData.length <= 6,
                  'w-64 h-28': scheduleData.length <= 4,
                  // 'w-48 h-24': scheduleData.length <= 8,
                  'w-56 h-20': scheduleData.length <= 10,
                  'w-36 h-20': scheduleData.length > 10,
                }"
                class="border rounded-md shadow-md mb-2 p-2 hover:bg-gray-200 cursor-pointer before-checked"
                @click="openInfo(timeSheet, item.structure.NAME)"
              >
                <div class="flex gap-2 items-center justify-start mb-auto">
                  <span
                    class="font-extrabold text-black"
                    :class="{
                      'text-2xl': scheduleData.length <= 4,
                      'text-xl': scheduleData.length <= 6,
                    }"
                    >{{ timeSheet.INITIAL_TIME }}</span
                  >
                  <div class="flex w-full items-center justify-end">
                    <div
                      class="h-2 w-1/2 rounded-md"
                      :class="{
                        'bg-blue-500':
                          timeSheet.TYPES == '1' &&
                          timeSheet.GEN_SCHEDULE?.STATUS == 'A',
                        'bg-orange-500':
                          timeSheet.TYPES == '1' &&
                          timeSheet.GEN_SCHEDULE?.STATUS == 'A' &&
                          timeSheet.GEN_SCHEDULE.users.length === 0,
                        'bg-yellow-400':
                          timeSheet.TYPES == '1' &&
                          timeSheet.GEN_SCHEDULE?.STATUS == 'P',
                        'bg-purple-500':
                          timeSheet.TYPES == '1' &&
                          timeSheet.GEN_SCHEDULE?.STATUS == 'C',
                        'bg-green-500':
                          timeSheet.TYPES == '1' && !timeSheet.GEN_SCHEDULE,
                        'bg-red-500': timeSheet.TYPES == '0',
                      }"
                    ></div>
                  </div>
                </div>
                <p
                  v-if="
                    timeSheet.TYPES == '1' &&
                    timeSheet.GEN_SCHEDULE &&
                    timeSheet.GEN_SCHEDULE.users.length > 0
                  "
                  :class="{
                    'text-2xl pt-3': scheduleData.length <= 4,
                    'text-xl': scheduleData.length <= 6,
                  }"
                  class="text-right my-auto text-black"
                >
                  {{
                    timeSheet.GEN_SCHEDULE.users.length === 1
                      ? timeSheet.GEN_SCHEDULE.users[0]?.user.FIRST_NAME[0].toUpperCase() +
                        timeSheet.GEN_SCHEDULE.users[0]?.user.FIRST_NAME.slice(
                          1
                        ).toLowerCase()
                      : timeSheet.GEN_SCHEDULE.users[0]?.user.FIRST_NAME[0].toUpperCase() +
                        timeSheet.GEN_SCHEDULE.users[0]?.user.FIRST_NAME.slice(
                          1
                        ).toLowerCase() +
                        " + " +
                        (timeSheet.GEN_SCHEDULE.users.length - 1)
                  }}
                  <i class="fa fa-mobile float-right py-1 pl-2"></i>
                </p>

                <label
                  v-else-if="timeSheet.TYPES == '1' && !timeSheet.GEN_SCHEDULE"
                  class="w-full h-full flex justify-end -mt-4 cursor-pointer"
                >
                  <!-- CHECKBOX -->
                  <input
                    id="cb"
                    v-model="state.SER_TIME_TIMESHEET_IDS"
                    type="checkbox"
                    :value="timeSheet"
                    class="sr-only peer"
                  />
                  <!-- CHECKBOX -->
                  <p
                    class="text-right my-auto text-black"
                    :class="{
                      'text-2xl pt-3': scheduleData.length <= 4,
                      'text-xl': scheduleData.length <= 6,
                    }"
                  >
                    Livre
                  </p>
                </label>
                <p
                  v-else-if="
                    timeSheet.TYPES == '1' &&
                    timeSheet.GEN_SCHEDULE &&
                    timeSheet.GEN_SCHEDULE.users.length === 0
                  "
                  :class="{
                    'text-2xl pt-3': scheduleData.length <= 4,
                    'text-xl': scheduleData.length <= 6,
                  }"
                  class="text-right my-auto text-black"
                >
                  Bloqueado
                </p>
                <p
                  v-else
                  :class="{
                    'text-2xl pt-3': scheduleData.length <= 4,
                    'text-xl': scheduleData.length <= 6,
                  }"
                  class="text-right my-auto text-black"
                >
                  Manutenção
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import userService from "../services/user.service";
import scheduleServices from "~/services/schedule.service";
const NumberOrg = localStorage.getItem("NRORG");
const NrOrg = parseInt(NumberOrg);
const UsrId = localStorage.getItem("userId");
const UserId = parseInt(UsrId);
const router = useRouter();
const scheduleData = ref([]);
const options = ref([]);
const optionsUser = ref([]);
const isLoading = ref(false);
const isEmpty = ref(false);
const isOpen = ref(false);
const isOpenInfo = ref(false);
const isOpenReserve = ref(false);
const showError = ref();
const dataInfo = ref({});
const disabled = ref(false);
const date = ref(new Date());
const selected = ref([]);
let intervalId;

const label = ref(() =>
  date.value.toLocaleDateString("pt-br", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

const previousDay = () => {
  date.value.setDate(date.value.getDate() - 1);
  updateLabel();
};

const nextDay = () => {
  date.value.setDate(date.value.getDate() + 1);
  updateLabel();
};

const updateLabel = () => {
  label.value = date.value.toLocaleDateString("pt-br", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const backPage = () => {
  router.push({ name: "dashboards-default" });
};

definePageMeta({
  layout: false,
  middleware: ["auth"],
});

const state = reactive({
  SERVICE_ID: undefined,
  TIME_NOW: true,
  SER_TIME_TIMESHEET_IDS: [],
  GEN_USER: undefined,
});

const updateSelected = () => {
  const user = state.GEN_USER;

  const index = selected.value.findIndex(
    (selectedUser) => selectedUser.value === user.value
  );
  if (index !== -1) {
    selected.value.splice(index, 1);
  } else {
    selected.value.push(user);
  }
};
const deleteSelected = (index) => {
  if (index >= 0 && index < selected.value.length) {
    selected.value.splice(index, 1);
  }
};

watch(() => state.GEN_USER, updateSelected);

watch(date, () => {
  updateLabel();
  fetchData();
});

watch(label, () => {
  fetchData();
});

const fetchOptions = async () => {
  const response = await scheduleServices.indexSpaces(NrOrg);
  if (Array.isArray(response) && response.length > 0) {
    options.value = response.map(({ NAME, ID }) => ({
      label: NAME,
      value: ID,
    }));
    state.SERVICE_ID = response[0].ID;
  } else {
    isLoading.value = false;
    isEmpty.value = true;
  }
};

const fetchOptionsUser = async () => {
  const response = await userService.getGenUsers(1);
  if (Array.isArray(response.data)) {
    optionsUser.value = response.data.map(
      ({ FULL_NAME, ID, FIRST_NAME, LAST_NAME }) => ({
        label: FULL_NAME,
        value: ID,
        ID,
        FIRST_NAME,
        LAST_NAME,
      })
    );
  }
};

const areGenStructureIdsEqual = () => {
  const structureIdsSet = new Set();
  for (const timesheet of state.SER_TIME_TIMESHEET_IDS) {
    structureIdsSet.add(timesheet.GEN_STRUCTURE_ID);
  }
  return structureIdsSet.size === 1;
};

const newReserve = () => {
  if (areGenStructureIdsEqual()) {
    isOpenReserve.value = true;
  } else {
    clearData();
    return scheduleServices.showErrorToast(
      "Por favor, selecione apenas os horários do mesmo espaço"
    );
  }
};

watchEffect(() => {
  updateLabel();
  if (selected.value.length > 0) {
    showError.value = false;
  }
  const today = new Date().toISOString().slice(0, 10);
  if (date.value.toISOString().slice(0, 10) === today) {
    state.TIME_NOW = true;
    disabled.value = false;
  } else {
    state.TIME_NOW = false;
    disabled.value = true;
  }
});

const json = {
  INITIAL_DATE: null,
  FINAL_DATE: null,
  NRORG: NrOrg,
  SER_SERVICE_ID: null,
  GEN_STRUCTURE_ID: null,
  SER_TIME_TIMESHEET_IDS: [],
  GEN_USER_IDS: [],
  STATUS: "A",
  TYPE: "SPACE_SCHEDULE",
  GEN_USER_ID: null,
};

const clearData = () => {
  json.INITIAL_DATE = null;
  json.FINAL_DATE = null;
  json.NRORG = NrOrg;
  json.SER_SERVICE_ID = null;
  json.GEN_STRUCTURE_ID = null;
  json.SER_TIME_TIMESHEET_IDS = [];
  json.GEN_USER_IDS = [];
  json.STATUS = "A";
  json.TYPE = "SPACE_SCHEDULE";
  json.GEN_USER_ID = null;
  selected.value = [];
  state.SER_TIME_TIMESHEET_IDS = [];
};

const openInfo = (data, structureName) => {
  if (data.TYPES === "1" && !data.GEN_SCHEDULE) {
    return null;
  } else {
    isOpenInfo.value = true;
    dataInfo.value = data;
    dataInfo.value.STRUCTURE = structureName;
  }
};

const postReserve = async () => {
  if (selected.value.length === 0) {
    return (showError.value = true);
  } else {
    const newArray = selected.value.map((item, index) => {
      return {
        ID: item.ID,
        FIRST_NAME: item.FIRST_NAME,
        LAST_NAME: item.LAST_NAME,
        PRINCIPAL: index === 0,
        STATUS: "A",
      };
    });

    json.INITIAL_DATE = `${date.value.toISOString().slice(0, 10)} ${
      state.SER_TIME_TIMESHEET_IDS[0].INITIAL_TIME
    }`;
    json.FINAL_DATE = `${date.value.toISOString().slice(0, 10)} ${
      state.SER_TIME_TIMESHEET_IDS[0].FINAL_TIME
    }`;
    json.NRORG = 1;
    json.SER_SERVICE_ID = state.SER_TIME_TIMESHEET_IDS[0].SER_SERVICE_ID;
    json.GEN_STRUCTURE_ID = state.SER_TIME_TIMESHEET_IDS[0].GEN_STRUCTURE_ID;
    json.GEN_USER_ID = newArray[0].ID;

    newArray.forEach((item) => {
      json.GEN_USER_IDS.push(item);
    });
    state.SER_TIME_TIMESHEET_IDS.forEach((item) => {
      json.SER_TIME_TIMESHEET_IDS.push(item);
    });

    isLoading.value = true;

    const response = await scheduleServices.postReserve(json);
    if (response) {
      // json.INITIAL_DATE = null;
      // json.FINAL_DATE = null;
      // json.NRORG = NrOrg;
      // json.SER_SERVICE_ID = null;
      // json.GEN_STRUCTURE_ID = null;
      // json.SER_TIME_TIMESHEET_IDS = [];
      // json.GEN_USER_IDS = [];
      // json.STATUS = "A";
      // json.TYPE = "SPACE_SCHEDULE";
      // json.GEN_USER_ID = null;

      // selected.value = [];
      // state.SER_TIME_TIMESHEET_IDS = [];
      clearData();
      isLoading.value = false;
      fetchData();
      isOpenReserve.value = false;
    }
    isLoading.value = false;
  }
};

async function fetchData() {
  const data = {
    NRORG: NrOrg,
    GEN_USER_ID: UserId,
    SELECTED_DATE: date.value.toISOString().slice(0, 10),
    SERVICE_ID: state.SERVICE_ID,
  };
  if (state.SERVICE_ID !== undefined) {
    const response = await scheduleServices.getSchedule(data);
    if (state.TIME_NOW === true) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      return (scheduleData.value = response
        .map((item) => ({
          ...item,
          filteredTimeSheet: item.time_timesheet.filter(
            (timeSheet) =>
              scheduleServices.convertTimeToMinutes(timeSheet.INITIAL_TIME) >
              currentTime
          ),
        }))
        .filter((item) => item.filteredTimeSheet.length > 0));
    } else {
      return (scheduleData.value = response.map((item) => ({
        ...item,
        filteredTimeSheet: item.time_timesheet,
      })));
    }
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchOptions();
  fetchOptionsUser();
  fetchData();

  intervalId = setInterval(() => {
    fetchData();
    // console.log("Intervalo de 10 segundos executado");
  }, 10000);
  isLoading.value = false;
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

const filterServices = async () => {
  isLoading.value = true;
  await fetchData();
  isLoading.value = false;
  isOpen.value = false;
};
</script>
