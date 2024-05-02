<template>
  <div class="w-screen h-screen">
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
          <div class="flex flex-col">
            <div
              v-for="timeSlot in state.SER_TIME_TIMESHEET_IDS"
              :key="timeSlot.ID"
            >
              <div class="rounded-md shadow-md px-3 py-1 text-center">
                <span
                  >Horário: de {{ timeSlot.INITIAL_TIME }} às
                  {{ timeSlot.FINAL_TIME }} em
                  {{ getStructureName(timeSlot.GEN_STRUCTURE_ID) }}</span
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center">
            <UFormGroup label="Selecionar participantes" name="SERVICE">
              <!-- <SelectMenu
                v-model="state.GEN_USER"
                placeholder="Selecione..."
                searchable
                :options="optionsUser"
                :disabled="selected.length > 3"
              /> -->
              <UInput v-model="state.SEARCH" placeholder="Buscar..." />
              <div
                v-if="optionsUser.length > 1 && state.SEARCH"
                class="rounded-lg mt-2 max-h-60 overflow-auto bg-white shadow-sm py-2 absolute w-full"
              >
                <ul class="p-1">
                  <li
                    v-for="user in optionsUser"
                    :key="user.ID"
                    class="cursor-pointer text-black py-2 px-2 scroll-px-36 text-sm hover:bg-gray-100 rounded-md"
                    @click="addUserToGenUser(user)"
                  >
                    {{ user.label }}
                  </li>
                </ul>
              </div>
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
              <div v-for="(item, index) in selected" :key="index" class="pt-2">
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

    <UModal v-model="isOpenLock" :transition="false">
      <div class="p-4">
        <div class="flex flex-col justify-between w-full h-full">
          <p class="pt-4 pb-2 text-center">
            Tem certeza que deseja bloquear esses horários?
          </p>
          <div
            v-for="timeSlot in state.SER_TIME_TIMESHEET_IDS"
            :key="timeSlot.ID"
          >
            <div class="rounded-md shadow-md px-3 py-1 text-center">
              <span
                >Horário: de {{ timeSlot.INITIAL_TIME }} às
                {{ timeSlot.FINAL_TIME }} em
                {{ getStructureName(timeSlot.GEN_STRUCTURE_ID) }}</span
              >
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <UButton size="xl" :disabled="isLoading" @click="isOpenLock = false"
              >Voltar</UButton
            >
            <UButton
              size="xl"
              color="gray"
              variant="solid"
              :disabled="isLoading"
              @click="postLock"
            >
              <span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Confirmar</span></UButton
            >
          </div>
        </div>
      </div>
    </UModal>

    <UModal v-model="isOpenCheckIn" :transition="false">
      <div class="p-4">
        <div class="flex flex-col justify-between w-full h-full">
          <p class="pt-4 pb-2 text-center">
            Tem certeza que deseja fazer check-in nesses horários?
          </p>
          <div v-for="timeSlot in state.RESERVE_IDS" :key="timeSlot.ID">
            <div class="rounded-md shadow-md px-3 py-1 text-center">
              <span
                >Horário: de {{ timeSlot.INITIAL_TIME }} às
                {{ timeSlot.FINAL_TIME }} em
                {{ getStructureName(timeSlot.GEN_STRUCTURE_ID) }}</span
              >
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <UButton
              size="xl"
              :disabled="isLoading"
              @click="isOpenCheckIn = false"
              >Voltar</UButton
            >
            <UButton
              size="xl"
              color="gray"
              variant="solid"
              :disabled="isLoading"
              @click="putCheckIn"
              ><span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Confirmar</span></UButton
            >
          </div>
        </div>
      </div>
    </UModal>

    <UModal v-model="isOpenCancel" :transition="false">
      <div class="p-4">
        <div class="flex flex-col justify-between w-full h-full">
          <p class="pt-4 pb-2 text-center">
            Tem certeza que deseja cancelar as reservas nesses horários?
          </p>
          <div v-for="timeSlot in state.RESERVE_IDS" :key="timeSlot.ID">
            <div class="rounded-md shadow-md px-3 py-1 text-center">
              <span
                >Horário: de {{ timeSlot.INITIAL_TIME }} às
                {{ timeSlot.FINAL_TIME }} em
                {{ getStructureName(timeSlot.GEN_STRUCTURE_ID) }}</span
              >
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <UButton
              size="xl"
              :disabled="isLoading"
              @click="isOpenCancel = false"
              >Voltar</UButton
            >
            <UButton
              size="xl"
              color="gray"
              variant="solid"
              :disabled="isLoading"
              @click="postCancelReservations"
              ><span v-if="isLoading" class="fa fa-spinner animate-spin" />
              <span v-else>Confirmar</span></UButton
            >
          </div>
        </div>
      </div>
    </UModal>

    <div
      class="fixed flex flex-col items-center inset-x-0 max-w-xs bottom-1 mx-auto gap-3 z-50"
    >
      <button
        v-if="
          (state.SER_TIME_TIMESHEET_IDS.length > 0 && showOverlay === true) ||
          (state.RESERVE_IDS.length > 0 && showOverlay === true)
        "
        type="button"
        class="z-20 font-bold text-lg rounded-lg px-6 py-3 flex items-center justify-center shadow-md text-white"
        :class="{
          'bg-blue-500 hover:bg-blue-400': typeOfButton == 'RESERVAR',
          'bg-red-500 hover:bg-red-400': typeOfButton == 'CANCELAR',
          'bg-orange-500 hover:bg-orange-400': typeOfButton == 'BLOQUEAR',
          'bg-purple-500 hover:bg-purple-400': typeOfButton == 'CHECKIN',
        }"
        @click="newRequest"
      >
        <!-- <i class="fa fa-arrow-right"></i> -->
        {{ typeOfButton }}
      </button>

      <!-- <UButton
        type="button"
        title="Filtrar serviços"
        color="primary"
        class="rounded-full p-3"
        @click="isOpen = true"
      >
        <i class="fa fa-filter"></i>
      </UButton> -->
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
    <div v-else>
      <div
        v-if="showOverlay"
        class="fixed top-0 left-0 bg-black bg-opacity-95 h-full w-full flex flex-col items-center justify-center z-10"
      >
        <div class="text-white font-semibold absolute left-4 top-28">
          <span>Selecione os horários </span>
          <i class="fa fa-arrow-right"></i>
        </div>
        <button
          title="Voltar"
          type="button"
          class="fixed z-50 bottom-1 left-3 px-6 py-3 hover:bg-red-400 bg-red-500 text-white font-bold rounded-md"
          @click="toggleOverlay"
        >
          <!-- <i class="fa fa-close fa-2x"></i> -->VOLTAR
        </button>
      </div>

      <div class="fixed top-0 bg-white z-[2]">
        <div
          class="w-screen py-2 border-b text-center text-lg flex items-center justify-between px-4"
        >
          <div class="w-72 text-left">
            <button
              type="button"
              title="Voltar"
              class="hover:opacity-80 transition-opacity"
              @click="backPage"
            >
              <i class="fa fa-arrow-left"></i> Voltar
            </button>
          </div>

          <div class="flex gap-4 justify-center items-center">
            <button type="button" @click="previousDay">
              <i class="fa fa-chevron-left"></i>
            </button>
            <UPopover :popper="{ placement: 'bottom-start' }" class="z-40">
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
          <div class="flex gap-3 items-center">
            <i class="fa fa-sync"></i>
            <SelectMenu
              v-model="state.SERVICE_ID"
              :options="options"
              searchable
              placeholder="Selecione o serviço..."
              option-attribute="label"
              value-attribute="value"
            />
          </div>
        </div>
        <!-- <div class="flex gap-5 justify-center pl-72 border-b">
          <div
            v-for="item in scheduleData"
            :key="item.GEN_STRUCTURE_ID"
            class="mt-2"
          >
            <div v-if="item.structure && item.structure.NAME" id="column">
              <div class="flex justify-center w-auto">
                <h5 class="text-center mx-4">{{ item.structure.NAME }}</h5>
              </div>
            </div>
          </div>
        </div> -->
      </div>

      <div class="flex">
        <div class="w-max pt-8 flex flex-col gap-5 px-3 fixed">
          <button
            type="button"
            class="font-bold bg-blue-500 px-6 py-3 text-white rounded-lg hover:opacity-80"
            @click="toggleOverlay('RESERVAR')"
          >
            RESERVAR
          </button>

          <button
            type="button"
            class="font-bold bg-red-500 px-6 py-3 text-white rounded-lg hover:opacity-80"
            @click="toggleOverlay('CANCELAR')"
          >
            CANCELAR
          </button>

          <button
            type="button"
            class="font-bold bg-orange-500 px-6 py-3 text-white rounded-lg hover:opacity-80"
            @click="toggleOverlay('BLOQUEAR')"
          >
            BLOQUEAR
          </button>

          <!-- <button
            disabled
            type="button"
            class="font-bold bg-orange-500 px-6 py-3 text-white rounded-lg hover:opacity-80"
          >
            BLOQUEAR ESPAÇO
          </button> -->

          <button
            type="button"
            class="font-bold bg-purple-500 px-6 py-3 text-white rounded-lg hover:opacity-80"
            @click="toggleOverlay('CHECKIN')"
          >
            CHECK IN
          </button>
        </div>

        <div
          class="flex w-full h-max overflow-auto justify-center ml-72"
          :class="zIndex"
        >
          <div
            v-for="item in scheduleData"
            :key="item.GEN_STRUCTURE_ID"
            class="mt-5 flex justify-center"
          >
            <div
              v-if="item.structure && item.structure.NAME"
              id="column"
              class="bg-white px-1 pt-2 pb-1 mb-6 rounded-sm"
            >
              <div
                class="fixed z-[1] bg-white rounded-md shadow-md"
                :class="{
                  'w-56': scheduleData.length <= 6,
                  'w-64': scheduleData.length <= 4,
                  'w-48': scheduleData.length <= 10,
                  'w-36': scheduleData.length > 10,
                }"
              >
                <h5 class="text-center mx-4 pt-2">{{ item.structure.NAME }}</h5>
              </div>
              <div class="h-14"></div>
              <div class="rounded-md">
                <div
                  v-for="timeSheet in item.filteredTimeSheet"
                  id="card"
                  :key="timeSheet.ID"
                  for="cb"
                  :class="{
                    'w-56 h-24': scheduleData.length <= 6,
                    'w-64 h-28': scheduleData.length <= 4,
                    'w-48 h-20': scheduleData.length <= 10,
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
                  <div
                    v-if="
                      timeSheet.TYPES == '1' &&
                      timeSheet.GEN_SCHEDULE &&
                      timeSheet.GEN_SCHEDULE.users.length > 0
                    "
                    class="w-full h-full"
                  >
                    <label
                      v-if="
                        (showOverlay === true &&
                          typeOfButton === 'CANCELAR' &&
                          timeSheet.GEN_SCHEDULE.STATUS === 'A') ||
                        (showOverlay === true &&
                          typeOfButton === 'CHECKIN' &&
                          timeSheet.GEN_SCHEDULE.STATUS === 'A')
                      "
                      class="w-full h-full flex justify-end cursor-pointer pr-1"
                      :class="{
                        '-mt-6': scheduleData.length < 8,
                        '-mt-4': scheduleData.length >= 8,
                      }"
                    >
                      <!-- CHECKBOX -->
                      <input
                        id="cb"
                        v-model="state.RESERVE_IDS"
                        type="checkbox"
                        :value="timeSheet"
                        class="sr-only peer"
                      />
                      <!-- CHECKBOX -->
                      <p
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
                    </label>

                    <p
                      v-else
                      :class="{
                        'text-2xl pt-3': scheduleData.length <= 4,
                        'text-xl': scheduleData.length <= 6,
                      }"
                      class="text-right my-auto text-black"
                    >
                      {{
                        timeSheet.GEN_SCHEDULE.users.length === 0
                          ? "Bloqueado"
                          : timeSheet.GEN_SCHEDULE.users.length === 1
                          ? timeSheet.GEN_SCHEDULE.users[0]?.user?.FIRST_NAME
                            ? timeSheet.GEN_SCHEDULE.users[0].user.FIRST_NAME[0].toUpperCase() +
                              timeSheet.GEN_SCHEDULE.users[0].user.FIRST_NAME.slice(
                                1
                              ).toLowerCase()
                            : "Bloqueado"
                          : (timeSheet.GEN_SCHEDULE.users[0]?.user?.FIRST_NAME
                              ? timeSheet.GEN_SCHEDULE.users[0].user.FIRST_NAME[0].toUpperCase() +
                                timeSheet.GEN_SCHEDULE.users[0].user.FIRST_NAME.slice(
                                  1
                                ).toLowerCase()
                              : "Bloqueado") +
                            " + " +
                            (timeSheet.GEN_SCHEDULE.users.length - 1)
                      }}

                      <i class="fa fa-mobile float-right py-1 pl-2"></i>
                    </p>
                  </div>

                  <label
                    v-else-if="
                      timeSheet.TYPES == '1' && !timeSheet.GEN_SCHEDULE
                    "
                    class="w-full h-full flex justify-end cursor-pointer"
                    :class="{
                      '-mt-6': scheduleData.length < 8,
                      '-mt-4': scheduleData.length >= 8,
                    }"
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
  </div>
</template>

<script setup>
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
const isOpenLock = ref(false);
const isOpenCheckIn = ref(false);
const isOpenCancel = ref(false);
const showOverlay = ref(false);
const typeOfButton = ref("RESERVAR");
const showError = ref();
const dataInfo = ref({});
const disabled = ref(false);
const date = ref(new Date());
const selected = ref([]);

const zIndex = ref("");

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
  TIME_NOW: false,
  SER_TIME_TIMESHEET_IDS: [],
  RESERVE_IDS: [],
  GEN_USER: undefined,
  SEARCH: undefined,
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
    // state.SEARCH = undefined;
    optionsUser.value = [];
  }
};
const deleteSelected = (index) => {
  if (index >= 0 && index < selected.value.length) {
    selected.value.splice(index, 1);
  }
};

const toggleOverlay = (type) => {
  if (showOverlay.value === false) {
    showOverlay.value = true;
    zIndex.value = "z-40";
    typeOfButton.value = type;
  } else {
    showOverlay.value = false;
    zIndex.value = "";
    clearData();
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

watch(
  () => state.SERVICE_ID,
  async (newValue, oldValue) => {
    if (newValue !== oldValue && newValue !== undefined) {
      await fetchData();
    }
  }
);

const fetchOptions = async () => {
  const response = await scheduleServices.indexSpaces(NrOrg);
  console.log(response.length > 0);
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

// const fetchOptionsUser = async () => {
//   const response = await userService.getGenUsers(1);
//   if (Array.isArray(response.data)) {
//     optionsUser.value = response.data.map(
//       ({ FULL_NAME, ID, FIRST_NAME, LAST_NAME }) => ({
//         label: FULL_NAME,
//         value: ID,
//         ID,
//         FIRST_NAME,
//         LAST_NAME,
//       })
//     );
//   }
// };

const addUserToGenUser = (user) => {
  state.GEN_USER = user;
};
const fetchOptionsUser = async () => {
  if (state.SEARCH.length > 2) {
    const response = await scheduleServices.getUsersLikeName(
      state.SEARCH,
      NrOrg
    );
    if (response && typeof response === "object") {
      optionsUser.value = Object.values(response).map(
        ({ ID, FIRST_NAME, LAST_NAME }) => ({
          label: `${FIRST_NAME} ${LAST_NAME}`,
          value: ID,
          ID,
          FIRST_NAME,
          LAST_NAME,
        })
      );
    }
    // console.log(optionsUser.value.length);
  }
};

watch(() => state.SEARCH, fetchOptionsUser);

const areGenStructureIdsEqual = () => {
  const structureIdsSet = new Set();
  for (const timesheet of state.SER_TIME_TIMESHEET_IDS) {
    structureIdsSet.add(timesheet.GEN_STRUCTURE_ID);
  }
  return structureIdsSet.size === 1;
};

const newRequest = () => {
  // FUNÇOES DOS BOTÕES
  if (areGenStructureIdsEqual() && state.SER_TIME_TIMESHEET_IDS.length > 0) {
    if (typeOfButton.value === "RESERVAR") {
      return (isOpenReserve.value = true);
    } else if (typeOfButton.value === "BLOQUEAR") {
      return (isOpenLock.value = true);
      // return alert("Bloquear");
    }
  } else if (state.RESERVE_IDS.length > 0) {
    if (typeOfButton.value === "CANCELAR") {
      // return alert("Cancelar");
      return (isOpenCancel.value = true);
    } else if (typeOfButton.value === "CHECKIN") {
      // return alert("Checkin");
      return (isOpenCheckIn.value = true);
    }
  } else {
    clearData();
    return scheduleServices.showErrorToast(
      "Por favor, selecione apenas os horários do mesmo espaço"
    );
  }
};

watchEffect(() => {
  // console.log(state.SER_TIME_TIMESHEET_IDS);
  // console.log(state.RESERVE_IDSGEN_SCHEDULE.users);
  // Verificar se state.RESERVE_IDS existe e é um array
  // console.log(selected.value);
  updateLabel();
  if (selected.value.length > 0) {
    showError.value = false;
  }
  if (state.SER_TIME_TIMESHEET_IDS.length > 0 && showOverlay.value === false) {
    return (state.SER_TIME_TIMESHEET_IDS = []);
  }
  // const today = new Date().toISOString().slice(0, 10);
  // if (date.value.toISOString().slice(0, 10) === today) {
  //   state.TIME_NOW = true;
  //   disabled.value = false;
  // } else {
  //   state.TIME_NOW = false;
  //   disabled.value = true;
  // }
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
  typeOfButton.value = "RESERVAR";
  selected.value = [];
  state.SER_TIME_TIMESHEET_IDS = [];
  state.RESERVE_IDS = [];
};

const openInfo = (data, structureName) => {
  if (data.TYPES === "1" && !data.GEN_SCHEDULE) {
    if (typeOfButton.value === "RESERVAR") {
      return null;
    } else if (
      typeOfButton.value === "CANCELAR" ||
      typeOfButton.value === "CHECKIN"
    ) {
      state.SER_TIME_TIMESHEET_IDS = [];
    }
  } else if (data.TYPES === "1" && data.GEN_SCHEDULE) {
    if (
      typeOfButton.value === "RESERVAR" ||
      typeOfButton.value === "BLOQUEAR"
    ) {
      isOpenInfo.value = true;
      dataInfo.value = data;
      dataInfo.value.STRUCTURE = structureName;
    } else if (
      (typeOfButton.value === "CHECKIN" && data.GEN_SCHEDULE.STATUS !== "A") ||
      (typeOfButton.value === "CANCELAR" && data.GEN_SCHEDULE.STATUS !== "A")
    ) {
      isOpenInfo.value = true;
      dataInfo.value = data;
      dataInfo.value.STRUCTURE = structureName;
    }
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
    const usersArray = selected.value.map((item, index) => {
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
    json.NRORG = localStorage.getItem("NRORG");
    json.SER_SERVICE_ID = state.SER_TIME_TIMESHEET_IDS[0].SER_SERVICE_ID;
    json.GEN_STRUCTURE_ID = state.SER_TIME_TIMESHEET_IDS[0].GEN_STRUCTURE_ID;
    json.GEN_USER_ID = usersArray[0].ID;

    usersArray.forEach((item) => {
      json.GEN_USER_IDS.push(item);
    });
    state.SER_TIME_TIMESHEET_IDS.forEach((item) => {
      json.SER_TIME_TIMESHEET_IDS.push(item);
    });

    isLoading.value = true;

    // console.log(json);

    const response = await scheduleServices.postReserve(json, "RESERVAR");
    if (response) {
      clearData();
      isLoading.value = false;
      fetchData();
      isOpenReserve.value = false;
    }
    isLoading.value = false;
  }
};

const postLock = async () => {
  json.INITIAL_DATE = `${date.value.toISOString().slice(0, 10)} ${
    state.SER_TIME_TIMESHEET_IDS[0].INITIAL_TIME
  }`;
  json.FINAL_DATE = `${date.value.toISOString().slice(0, 10)} ${
    state.SER_TIME_TIMESHEET_IDS[0].FINAL_TIME
  }`;
  json.NRORG = 1;
  json.SER_SERVICE_ID = state.SER_TIME_TIMESHEET_IDS[0].SER_SERVICE_ID;
  json.GEN_STRUCTURE_ID = state.SER_TIME_TIMESHEET_IDS[0].GEN_STRUCTURE_ID;
  json.GEN_USER_ID = 0;

  state.SER_TIME_TIMESHEET_IDS.forEach((item) => {
    json.SER_TIME_TIMESHEET_IDS.push(item);
  });

  isLoading.value = true;

  // console.log(json);

  const response = await scheduleServices.postReserve(json, "BLOQUEAR");
  if (response) {
    isOpenLock.value = false;
    clearData();
    isLoading.value = false;
    fetchData();
    isOpenReserve.value = false;
  }
  isLoading.value = false;
};

const putCheckIn = () => {
  if (Array.isArray(state.RESERVE_IDS)) {
    state.RESERVE_IDS.forEach(async (item) => {
      if (item.GEN_SCHEDULE && typeof item.GEN_SCHEDULE === "object") {
        // console.log(item.GEN_SCHEDULE.users);
        isLoading.value = true;
        const response = await scheduleServices.putCheckInForAll(
          item.GEN_SCHEDULE.users
        );
        if (response === "success") {
          clearData();
          isLoading.value = false;
          isOpenCheckIn.value = false;
          fetchData();
          isOpenReserve.value = false;
        } else {
          isLoading.value = false;
        }
      }
    });
  }
};

const postCancelReservations = async () => {
  if (Array.isArray(state.RESERVE_IDS)) {
    isLoading.value = true;
    const response = await scheduleServices.postCancelReservationsForAll(
      state.RESERVE_IDS
    );
    if (response === "success") {
      clearData();
      isLoading.value = false;
      isOpenCancel.value = false;
      fetchData();
      showOverlay.value = false;
    } else {
      isLoading.value = false;
    }
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
    console.log(response);
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

const getStructureName = (genStructureId) => {
  const structure = scheduleData.value.find(
    (item) => item.structure && item.structure.ID === genStructureId
  );
  return structure ? structure.structure.NAME : "";
};

onMounted(async () => {
  isLoading.value = true;
  await fetchOptions();
  fetchData();
  // fetchOptionsUser();
  isLoading.value = false;
});

const filterServices = async () => {
  isLoading.value = true;
  await fetchData();
  isLoading.value = false;
  isOpen.value = false;
};
</script>
