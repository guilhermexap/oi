import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        arapawa: {
          50: "#f1f4ff",
          100: "#e5e8ff",
          200: "#ced4ff",
          300: "#a7afff",
          400: "#767cff",
          500: "#413fff",
          600: "#2718ff", // trocada com 600
          700: "#1607fa",
          800: "#1105d2",
          900: "#1006ac",
          950: "#020059", // trocada com 950
        },
      },
    },
  },
  content: ["docs/content/**/*.md"],
};
