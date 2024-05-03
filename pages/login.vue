<template>
  <NuxtLayout name="authentication">
    <template #navbar>
      <NavbarAuthentication
        is-blur="border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow-blur"
        btn-background="bg-gradient-success"
        :dark-mode="false"
      />
    </template>
    <div class="page-header min-vh-100" :style="headerStyle">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container mt-8 mb-4">
        <div class="row justify-content-center">
          <div class="text-center" style="margin-bottom: 5px">
            <h3 class="text-white"></h3>
            <p class="text-lead text-white"></p>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7 mt-2">
            <div class="card border-0 mb-0">
              <div class="card-header bg-transparent">
                <h5 class="text-dark text-center mt-2 mb-3">
                  Entre no Xappa Admin
                </h5>
              </div>
              <div class="card-body px-lg-5 pt-0">
                <div class="text-center text-muted mb-4">
                  <small> Informe seu email e senha</small>
                </div>
                <form
                  role="form"
                  class="text-start"
                  @submit.prevent="submitForm"
                >
                  <div class="mb-3">
                    <ArgonInput
                      id="email"
                      v-model="formData.email"
                      name="email"
                      type="text"
                      placeholder="Email"
                      aria-label="Email"
                      :error="isError('email', errorsRef)"
                      :error-message="getErrorMessage('email', errorsRef)"
                    />
                  </div>
                  <div class="mb-3">
                    <ArgonInput
                      id="password"
                      v-model="formData.password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      aria-label="Password"
                      :error="isError('password', errorsRef)"
                      :error-message="getErrorMessage('password', errorsRef)"
                    />
                  </div>
                  <ArgonSwitch id="rememberMe" name="rememberMe">
                    Relembrar meu acesso
                  </ArgonSwitch>
                  <div class="text-center">
                    <ArgonButton
                      type="submit"
                      color="success"
                      variant="gradient"
                      full-width
                      :disabled="isLoading"
                      class="my-4 mb-2"
                      ><span
                        v-if="isLoading"
                        class="fa fa-spinner animate-spin"
                      ></span
                      ><span v-else>Entrar</span></ArgonButton
                    >
                  </div>
                  <div class="mb-2 position-relative text-center">
                    <p
                      class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3"
                    >
                      or
                    </p>
                  </div>
                  <div class="text-center">
                    <ArgonButton
                      color="dark"
                      variant="gradient"
                      full-width
                      class="mt-2 mb-4"
                      :disabled="isLoading"
                      @click.prevent="router.push({ path: '/register' })"
                      >Registrar</ArgonButton
                    >
                  </div>
                </form>
              </div>
            </div>
            <div class="row mt-3">
              <NuxtLink to="/password-recover" class="text-white">
                <small>Esqueci minha senha ?</small>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <FooterCentered />
    </template>
  </NuxtLayout>
</template>

<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import bgImage from "@/assets/background.jpeg";
import FooterCentered from "@/examples/Footer/Centered.vue";
import NavbarAuthentication from "@/examples/Navbar/Authentication.vue";
import { useAuthStore } from "~~/stores/AuthStore";
import { getErrorMessage, isError } from "~~/helpers/errorHandler";

definePageMeta({
  layout: false,
  middleware: ["guest"],
});
const router = useRouter();
const authStore = useAuthStore();
const formData = reactive({});
const errorsRef = reactive([]);
const toast = useToast();
const isLoading = ref(false);

const headerStyle = {
  backgroundImage: `url(${bgImage})`,
};

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("O campo de email é obrigatório", required),
      email: helpers.withMessage("Formato email inválido.", email),
    },
    password: {
      required: helpers.withMessage("O campo senha é obrigatório.", required),
    },
  };
});
const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
  v$.value.$validate();

  if (v$.value.$error) {
    const errors = JSON.parse(JSON.stringify(v$.value.$errors));
    errorsRef.value = [...errors];
  } else {
    isLoading.value = true;
    try {
      await authStore.login(formData);
      localStorage.setItem("nuxt-color-mode", "light");
      router.push({ path: "/organizations" });
    } catch (error) {
      toast.add({
        color: "red",
        description: "O e-mail ou a senha estão incorretos.",
      });
      isLoading.value = false;
    }
  }
};
</script>
