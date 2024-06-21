// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "Xappa Admin",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.png",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
        },
      ],
      script: [
        {
          type: "text/javascript",
          src: "https://kit.fontawesome.com/42d5adcbca.js",
          async: true,
        },
        {
          type: "text/javascript",
          src: "https://buttons.github.io/buttons.js",
          async: true,
        },
      ],
    },
  },

  components: {
    global: true,
    dirs: ["~/components", "~/components/Icons"],
  },
  imports: {
    autoImport: true,
  },
  css: [
    "@/assets/css/nucleo-svg.css",
    "@/assets/css/nucleo-icons.css",
    "@/assets/css/main.css",
    "@/assets/css/inputs.css",
    "@/assets/scss/argon-dashboard.scss",
  ],
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  ui: {
    global: true,
    icons: ["mdi", "simple-icons", "heroicons"],
    safelistColors: [
      "@/assets/css/nucleo-svg.css",
      "@/assets/css/nucleo-icons.css",
      "@/assets/scss/argon-dashboard.scss",
    ],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiBaseUrlSchedule: process.env.API_BASE_URL_SCHEDULE,
      apiCancelSchedule: process.env.API_BASE_URL_CANCEL_SCHEDULE,
      isDemo: process.env.IS_DEMO,
      // FIREBASE
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeassurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
});
