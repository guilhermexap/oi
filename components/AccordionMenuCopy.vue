<template>
  <div class="overflow-y-auto pl-6 flex-grow">
    <UModal v-model="isOpen" :transition="false">
      <div class="p-4">
        <div class="flex flex-col justify-between w-full h-full">
          <p class="py-4">
            O item selecionado não é do tipo "link", "botão" ou "texto" e não
            pode ser editado nessa tela
          </p>
          <div class="flex justify-end gap-3">
            <UButton @click="isOpen = false">Fechar</UButton>
          </div>
        </div>
      </div>
    </UModal>
    <div v-for="item in items" :key="item.ID">
      <div class="py-1 pr-4 flex items-center justify-between">
        <div
          :class="{
            'text-primary-600 font-bold':
              item.ID.toString() === $route.query.ID,
          }"
          class="text-sm hover:opacity-70 transition-opacity cursor-pointer"
          @click="openEdit(item)"
        >
          {{ item.NAME }}
        </div>
        <button
          v-if="item.children"
          class="hover:opacity-50 transition-opacity px-2"
          @click="toggleAccordion(item)"
        >
          <i
            :class="{ 'rotate-180': item.expanded, 'rotate-0': !item.expanded }"
            class="fa fa-chevron-down text-xs transition-transform ease-out duration-200 transform"
          ></i>
        </button>
      </div>
      <AccordionMenu
        v-if="item.expanded && item.children"
        :items="item.children"
        class="!pl-2"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false);
    const selectedItem = ref(null);
    return {
      isOpen,
      selectedItem,
    };
  },
  methods: {
    toggleAccordion(item) {
      item.expanded = !item.expanded;
    },

    openEdit(item) {
      if (
        item.TYPE === "BUTTON" ||
        item.TYPE === "LINK" ||
        item.TYPE === "HTML"
      ) {
        const router = useRouter();
        router.push({
          name: "services-appmenu-form",
          query: {
            ID: item.ID,
            NAME: item.NAME,
            IMAGE: item.IMAGE,
            ICON: item.ICON,
            TYPE: item.TYPE,
            PARENT_ID: item.PARENT_ID,
            STATUS: item.STATUS,
            STATUS_APP: item.STATUS_APP,
            ORDENATION: item.ORDENATION,
            DECRIPTION: item.DECRIPTION,
          },
        });
      } else {
        const router = useRouter();
        this.selectedItem = item;
        this.isOpen = true;
        router.push({ name: "services-appmenu" });
      }
    },
  },
};
</script>
