<template>
  <AccordionMenu :items="menuItems" />

  <div
    v-if="isLoading"
    class="z-20 w-full h-full flex justify-center items-center"
  >
    <span class="fa fa-spinner animate-spin" />
  </div>
</template>

<script setup>
import appServices from "~/services/app.service";
const NumberOrg = localStorage.getItem("NRORG");
const NrOrg = parseInt(NumberOrg);
const isLoading = ref(false);
const menuItems = ref([]);

async function fetchMenuItems() {
  isLoading.value = true;
  const response = await appServices.indexMenuOptions(NrOrg);
  menuItems.value = organizeDataHierarchically(response);
  isLoading.value = false;
}
const { $bus } = useNuxtApp();
$bus.$on("create", () => {
  fetchMenuItems();
});

onMounted(() => {
  fetchMenuItems();
});

function organizeDataHierarchically(data) {
  const map = new Map();
  const result = [];

  data.forEach((item) => {
    item.expanded = false;
    map.set(item.ID, item);
  });

  data.forEach((item) => {
    if (item.PARENT_ID !== null) {
      const parent = map.get(item.PARENT_ID);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      } else {
        console.error(`Parent not found for item with ID: ${item.ID}`);
        result.push(item);
      }
    } else {
      result.push(item);
    }
  });

  return result;
}
</script>
