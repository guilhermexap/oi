<template>
  <div class="px-4 w-full">
    <div class="flex h-[755px]">
      <div class="bg-white w-[330px] py-4 rounded-lg flex flex-col shadow-md">
        <h5 class="px-4 pb-2 text-md font-bold">Menu montagem app</h5>
        <AppMenu></AppMenu>
        <div class="px-4 pt-4">
          <UButton
            type="button"
            color="primary"
            size="md"
            class="w-full flex justify-center mx-auto"
            @click="redirectPage"
          >
            Novo botão
          </UButton>
        </div>
      </div>
      <div class="w-full mr-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const redirectPage = () => {
  router.push({ name: "services-appmenu-form" });
};
</script>
