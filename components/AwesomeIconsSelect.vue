<template>
  <SelectMenu
    v-model="selectedValue"
    searchable
    class="flex-grow"
    placeholder="Selecione..."
    :options="icons"
    option-attribute="label"
    value-attribute="value"
    :disabled="disabled"
  />
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const selectedValue = ref(props.value);

const icons = [
  { label: "Academia", value: "dumbbell" },
  { label: "Acessíbilidade", value: "accessible-icon" },
  { label: "Agua", value: "water" },
  { label: "Avião", value: "plane-departure" },
  { label: "Banho", value: "bath" },
  { label: "Calendário", value: "calendar" },
  { label: "Competição", value: "medal" },
  { label: "Corrida", value: "running" },
  { label: "Envelope", value: "envelope" },
  { label: "Estacionamento", value: "car-garage" },
  { label: "Favoritos", value: "heart" },
  { label: "Fila de Espera", value: "graduation-cap" },
  { label: "Futebol", value: "futbol" },
  { label: "Jacuzzi", value: "hot-tub" },
  { label: "Livro aberto", value: "book-open" },
  { label: "Medicina", value: "user-md" },
  { label: "SPA", value: "spa" },
  { label: "Sino", value: "bell" },
  { label: "Telefone", value: "phone" },
  { label: "Tênis", value: "tennis-ball" },
  { label: "Troféu", value: "trophy" },
];
</script>

<!-- <template>
  <div class="flex gap-3 items-center justify-center">
    <USelect
      v-model="selectedIcon"
      class="flex-grow"
      placeholder="Selecione..."
      :options="icons"
      :disabled="!!props.selectedImage"
    >
      <template #option="{ option }">
        <i :class="option.value"></i>
      </template>
    </USelect>
    <div
      v-if="selectedIcon"
      class="-m-3 text-red-600 flex items-center justify-center rounded-sm cursor-pointer hover:text-red-500 transition-opacity"
      title="Remover ícone"
      @click="selectedIcon = undefined"
    >
      <i class="fa fa-close p-1"></i>
    </div>
    <div
      class="w-9 h-10 bg-gray-200 border flex items-center justify-center rounded-sm"
    >
      <i :class="`fa fa-${selectedIcon}`"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted } from "vue";

const props = defineProps({
  state: { type: String, default: "" },
  selectedImage: { type: String, default: "" },
});

const stateCopy = ref(props.state);
const selectedIcon = ref(props.state.ICON);

const icons = [
  {
    label: "SPA",
    value: "spa",
  },
  {
    label: "Fila de Espera",
    value: "graduation-cap",
  },
  {
    label: "Academia",
    value: "dumbbell",
  },
  {
    label: "Futebol",
    value: "futbol",
  },
  {
    label: "Competição",
    value: "medal",
  },
  {
    label: "Favoritos",
    value: "heart",
  },
  {
    label: "Livro aberto",
    value: "book-open",
  },
  {
    label: "Corrida",
    value: "running",
  },
  {
    label: "Telefone",
    value: "phone",
  },
  {
    label: "Tênis",
    value: "tennis-ball",
  },
  {
    label: "Agua",
    value: "water",
  },
  {
    label: "Jacuzzi",
    value: "hot-tub",
  },
  {
    label: "Banho",
    value: "bath",
  },
  {
    label: "Estacionamento",
    value: "car-garage",
  },
  {
    label: "Acessíbilidade",
    value: "accessible-icon",
  },
  {
    label: "Troféu",
    value: "trophy",
  },
  {
    label: "Sino",
    value: "bell",
  },
  {
    label: "Envelope",
    value: "envelope",
  },
  {
    label: "Medicina",
    value: "user-md",
  },
];

onMounted(() => {
  selectedIcon.value = props.state.ICON;
});

watch(
  () => selectedIcon,
  (newIcon) => {
    stateCopy.value.ICON = newIcon;
  }
);
</script> -->
