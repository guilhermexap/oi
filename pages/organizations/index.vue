<template>
  <div class="py-12 container-fluid relative" style="background-color: #020059">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div
          v-if="isLoading === true"
          class="z-50 h-screen w-full flex justify-center items-center bg-[#020059] absolute inset-0 overflow-hidden"
        >
          <span class="fa fa-spinner animate-spin fa-2x text-white"></span>
        </div>
        <div class="card">
          <div class="p-3 pb-0 card-header">
            <h6 class="mb-0">{{ organizationController.categoryTitle }}</h6>
          </div>
          <div class="p-3 card-body">
            <ul :class="`list-group ${isRTL && 'pe-0'}`">
              <li
                v-for="(
                  {
                    icon: { component, background },
                    index,
                    label,
                    isFirstTime,
                    description,
                  },
                  key
                ) of organizationController.organizations"
                :key="key"
                class="mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg"
                :class="isRTL ? 'pe-0' : 'ps-0'"
              >
                <div class="d-flex align-items-center">
                  <div
                    class="text-center shadow icon icon-shape icon-sm"
                    :class="`bg-gradient-${background} ${
                      isRTL ? 'ms-3' : 'me-3'
                    }`"
                  >
                    <i :class="`${component} text-white opacity-10`"></i>
                  </div>
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-sm text-dark">{{ label }}</h6>
                    <span class="text-xs" v-html="description"> </span>
                  </div>
                </div>
                <div class="d-flex">
                  <button
                    class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark icon-move-right"
                  >
                    <i
                      :class="`ni ${isRTL ? 'ni-bold-left' : 'ni-bold-right'}`"
                      aria-hidden="true"
                      @click="
                        organizationController.setOrganization(
                          index,
                          isFirstTime
                        )
                      "
                    ></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// import CategoriesList from "@/examples/cards/CategoriesList.vue";
import { useOrganization } from "~~/controllers/Organization";

definePageMeta({
  layout: false,
  middleware: ["auth"],
});
const organizationController = useOrganization();

const isLoading = ref(false);

const getData = async () => {
  isLoading.value = true;
  await organizationController.getOrganizations();
  isLoading.value = false;
};

onMounted(() => {
  getData();
});
</script>
