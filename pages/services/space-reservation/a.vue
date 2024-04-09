<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import newsService from "~/services/news.service";

const schema = object({
  ACTIVE: string().required("Campo obrigatório"),
  USER_ID: string().required("Campo obrigatório"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  ACTIVE: undefined,
  USER_ID: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
  const accessToken = localStorage.getItem("authToken");

  // const response = await newsService.updateStatus(
  //   219150,
  //   event.data.ACTIVE,
  //   event.data.USER_ID
  // );

  const response = await useFetch(
    `http://127.0.0.1:8000/api/v2/news/update-status/219150`,
    {
      method: "PUT",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: event,
    }
  );
  console.log(response);
  if (response) {
    // alert("dados salvos");
    console.log("Dados salvos");
  } else {
    console.log("error");
  }
}
</script>

<template>
  <UContainer
    ><UCard>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="State" name="ACTIVE">
          <UInput v-model="state.ACTIVE" />
        </UFormGroup>

        <UFormGroup label="User ID" name="USER_ID">
          <UInput v-model="state.USER_ID" />
        </UFormGroup>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </UCard></UContainer
  >
</template>
