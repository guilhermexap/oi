import { defineStore } from "pinia";
import userService from "../services/user.service";

export const useUser = defineStore("User", {
  // state
  state: () => {
    return {
      users: [],
      userGroups: [],
      userGroup: {
        ID: null,
        NAME: null,
        NRORG: null,
        STATUS: "A",
        GEN_USER_TYPE_ID: null,
        APP_LAYOUT_CONFIG: null,
      },
      user: {
        ID: null,
        GENDER: "O",
        BIRTH_DATE: "",
        CPF: "",
        NRORG: localStorage.getItem("NRORG"),
        EMAIL: "",
        FIRST_NAME: "",
        STATUS: "A",
        IMAGE:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXaova-4IVX3jj2DvzkGfkSzhrWWMyzxDwxw&usqp=CAU",
        LAST_NAME: "",
        GEN_USER_TYPE_ID: null,
        GROUP: {
          GEN_USER_GROUP_ID: null,
          NRORG: localStorage.getItem("NRORG"),
        },
        CONTACT: {
          PHONE: "",
          NRORG: localStorage.getItem("NRORG"),
          STATUS: "A",
        },
        ADDRESS: {
          CEP: "",
          STREET: "",
          NEIGHBORHOOD: "",
          CITY: "",
          PROVINCY: "",
          NRORG: localStorage.getItem("NRORG"),
          STREET_NUMBER: "",
          COUNTRY: "",
          CREATE_DATE: "",
          TYPE: "",
          COMPLEMENT: "",
          STATUS: "A",
        },
        DEPENDENTS: [],
      },
      title: "Usuário",
      genUserTypeId: null,
      genders: [
        { label: "Nenhum", value: "0" },
        { label: "Masculino", value: "M" },
        { label: "Feminino", value: "F" },
        { label: "Outro", value: "O" },
      ],
      userTypes: [
        { label: "Membros", value: 1 },
        { label: "Seguidores", value: 6 },
      ],
      userGroups: [
        {
          GEN_USER_GROUP_ID: null,
        },
      ],
    };
  },

  actions: {
    async getGenUsers(userType, page, pageCount, search) {
      this.users = [];
      this.users = await userService.getGenUsers(
        userType,
        page,
        pageCount,
        search
      );
      await this.getGenUserGroups();
    },

    async getGenUserGroups() {
      this.userGroups = [];
      this.userGroups = await userService.getGenUserGroups();
    },

    async createGenUser() {
      await userService.createGenUser(this.user);
    },

    async createGenUserGroup() {
      await userService.createGenUserGroup(this.userGroup);
    },

    async updateGenUser() {
      await userService.updateGenUser(this.user);
    },

    async updateGenUserGroup() {
      await userService.updateGenUserGroup(this.user);
    },

    setUser(user) {
      this.user = user;
    },

    setUserGroup(userGroup) {
      this.userGroup = userGroup;
    },

    setTitle(title) {
      this.title = title;
    },

    async getUser() {
      return Object.keys(this.user).length > 0 ? JSON.parse(this.user) : null;
    },

    chooseFiles() {
      document.getElementById("fileUpload").click();
    },

    async deleteItem(row, type) {
      const data = {
        ID: row.ID,
      };

      if (type == "contact") {
        await userService.deleteContact(data);
      }
      if (type == "address") {
        await userService.deleteAddress(data);
      }
    },

    async savePermission(jsonData) {
      await new Promise((res) => setTimeout(res, 1000));
      this.userGroup.APP_LAYOUT_CONFIG = JSON.stringify({ slideNav: jsonData });

      await userService.savePermission(this.userGroup);
    },

    async filterAndMapperUseGroup() {
      const result = [];

      this.userGroups
        .filter((group) => group.GEN_USER_TYPE_ID == this.genUserTypeId)
        .map(function (group) {
          result.push({ label: group.NAME, value: group.ID });
        });

      return result;
    },
  },
});
