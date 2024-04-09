import { defineStore } from "pinia";
import organizationService from "../services/organization.service";

export const useOrganization = defineStore("Organization", {
  // state
  state: () => {
    return {
      organizationUser: [],
      organizations: [],
      NRORG: null,
      categoryTitle: "Selecione Sua Organização",
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
          description: "",
          icon: {
            component: "ni ni-mobile-button",
            background: "dark",
          },
        });
      });
    },

    setOrganization(NRORG) {
      localStorage.setItem("NRORG", NRORG);
      navigateTo("/dashboards/default");
    },
  },
});
