import { defineStore } from "pinia";
import organizationService from "../services/organization.service";
import config from "../services/config.service";

export const useOrganization = defineStore("Organization", {
  // state
  state: () => {
    return {
      organizationUser: [],
      organizations: [],
      NRORG: null,
      categoryTitle: "Selecione Sua Comunidade",
    };
  },

  actions: {
    async getOrganizations() {
      this.organizations = [];
      this.organizationUser = await organizationService.getOrganizations();
      localStorage.setItem("nameUser", this.organizationUser[0].FULL_NAME);
      localStorage.setItem("userId", this.organizationUser[0].GEN_USER_ID);
      this.organizationUser.forEach((element) => {
        this.organizations.push({
          index: element.NRORG,
          label: element.NAME.toUpperCase(),
          isFirstTime: element.FIRST_TIME,
          description: "",
          icon: {
            component: "ni ni-mobile-button",
            background: "dark",
          },
        });
      });
    },

    async setOrganization(NRORG, FIRST_TIME) {
      localStorage.setItem("NRORG", NRORG);
      if (FIRST_TIME === null || FIRST_TIME === "true") {
        await config.update({ FIRST_TIME: "false" }, NRORG);
        localStorage.setItem("FIRST_TIME", "true");
        return navigateTo("/configuracoes");
      }
      navigateTo("/dashboards/default");
    },
  },
});
