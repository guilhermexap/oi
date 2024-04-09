// services/EditService.js
import { ref } from "vue";

const selectedData = ref(null);

function setSelectedData(data) {
  selectedData.value = data;
}

function getSelectedData() {
  return selectedData.value;
}

export { setSelectedData, getSelectedData };
