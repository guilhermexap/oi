<template>
  <NuxtLayout name="authentication">
    <div class="page-header min-vh-100"
      style="background-image: url('https://i.ibb.co/whQckm0/Background-Image.png');">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7">
            <div class="card z-index-0 mb-7">
              <div class="card-header text-center pt-4 pb-1">
                <h4 class="font-weight-bolder mb-1">Resetar sua senha</h4>
                <p class="mb-0">
                  Você receberá no seu email sua senha.
                </p>
              </div>
              <div class="card-body">
                <form role="form">
                  <ArgonInput id="email" type="email" placeholder="Email" aria-label="Email" />
                  <div class="text-center">
                    <ArgonButton color="dark" variant="gradient" class="my-4 mb-2" full-width
                      @click.prevent="handleRecover()">
                      Send
                    </ArgonButton>
                  </div>
                </form>
              </div>
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
import FooterCentered from "@/examples/Footer/Centered.vue";

definePageMeta({
    layout: false,
    middleware: ["guest"],
});

const handleRecover = () => {
  useToast('error', 'Password reset is disabled in the demo.');
}
</script>
