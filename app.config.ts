export default defineAppConfig({
  colorMode: {
    preference: "light",
  },
  ui: {
    primary: "arapawa",
    pagination: {
      default: {
        prevButton: {
          icon: "fa fa-angle-left p-2 mx-auto",
        },
        nextButton: {
          icon: "fa fa-angle-right p-2 mx-auto",
        },
      },
    },
    checkbox: {
      base: "!form-checkbox",
      // border: "!border !border-gray-300 !dark:border-gray-700",
      // ring: "!focus-visible:ring-2 !focus-visible:ring-primary-500 !dark:focus-visible:ring-primary-400 !focus-visible:ring-offset-2 !focus-visible:ring-offset-white !dark:focus-visible:ring-offset-gray-900",
      // rounded: "rounded",
      // wrapper: "relative flex items-start",
    },
    select: {
      icon: {
        base: "!fa !fa-angle-left",
      },
    },
    table: {
      default: {
        sortAscIcon: "fa fa-arrow-up",
        sortDescIcon: "fa fa-arrow-down",
        sortButton: {
          icon: "fa fa-arrow-up",
        },
      },
    },
    modal: {
      overlay: {
        background: "bg-gray-200/95 dark:bg-gray-800/95",
      },
    },
  },
});
