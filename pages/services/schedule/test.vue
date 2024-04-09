<template>
  <div class="w-full h-full flex items-center justify-center bg-slate-300">
    <!-- Adicione a classe 'overflow-auto' para permitir rolagem -->
    <div class="w-full py-3 fixed top-0 border-b bg-white text-center">
      header
    </div>
    <div class="overflow-auto max-w-screen-md max-h-full p-4">
      <!-- Conteúdo dinâmico aqui -->
      <!-- Esta div pode rolar se o conteúdo for maior do que a altura definida -->
      <div class="w-full h-full flex left-0">
        <div class="w-96 h-96 bg-red-300 fixed left-0 top-7">side</div>
        <div class="flex flex-col gap-4 px-2 mt-6 flex-grow bg-blue-200">
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
          <div class="h-96 w-96 border"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: ["auth"],
});
</script>
