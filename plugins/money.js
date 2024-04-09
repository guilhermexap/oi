import money from "v-money";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(money, { precision: 2 });
});
