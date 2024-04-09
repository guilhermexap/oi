<template>
  <div class="col-12 text-start">
    <select :value="selectedOption" class="form-control">
        <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        >
        {{ option.label }}
        </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "Select",

  props: {
    selectedOption: {
      type: String,
      default: "option1"
    }, // valor selecionado
    options: {
      type: Array,
      default: [
        // lista de opções
        { value: "option1", label: "Opção 1" },
        { value: "option2", label: "Opção 2" },
        { value: "option3", label: "Opção 3" }
        // adicione mais opções conforme necessário
      ]
    }
  }
};
</script>
