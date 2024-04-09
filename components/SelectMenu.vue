<script setup lang="ts">
import SelectMenu from "~/node_modules/@nuxt/ui/dist/runtime/components/forms/SelectMenu.vue";

const props = defineProps(SelectMenu.props);
const emit = defineEmits(["update:modelValue", "open", "close", "change"]);

function onUpdate(event: any) {
  emit("update:modelValue", event);
}

function emitOpen() {
  emit("open");
}

function emitClose() {
  emit("close");
}

function emitChange() {
  emit("change");
}

const current = computed(() => {
  if (props.optionAttribute) {
    const selected: any = props.valueAttribute
      ? props.options.find(
          (option: any) => option[props.valueAttribute!] === props.modelValue
        )
      : props.options.find((option: any) => option === props.modelValue);
    if (selected) return selected[props.optionAttribute] || "...";
  }
  return props.modelValue || props.placeholder || "Select...";
});
</script>

<template>
  <USelectMenu
    v-bind="$props"
    selected-icon="fa fa-check"
    searchable-placeholder="Buscar..."
    @open="emitOpen"
    @close="emitClose"
    @change="emitChange"
    @update:model-value="onUpdate"
  >
    <template #label>{{ current }}</template>
  </USelectMenu>
</template>
