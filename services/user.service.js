const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const getGenUsers = async (userType, page, pageCount, search) => {
  const accessToken = localStorage.getItem("authToken");
  const nrorg = localStorage.getItem("NRORG");
  const response = await useFetch(
    `${apiBaseUrl}/users?_page=${page}&_limit=${pageCount}&status=A&userType=${userType}&filterUserTypes=true&nrorg=${nrorg}&q=${search}`,
    {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
  return response.data.value;
};

const createGenUser = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });

  return response.data.value;
};

const createGenUserGroup = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/groups`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });

  return response.data.value;
};

const updateGenUserGroup = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/groups`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });

  return response.data.value;
};

const updateGenUser = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });

  return response.data.value;
};

const savePermission = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/groups/${data.ID}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });

  return response.data.value;
};

const deleteContact = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/contacts`, {
    method: "DELETE",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });

  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "Registro apagado com sucesso",
    });
  } else {
    toast.add({
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const deleteAddress = async (data) => {
  try {
    const accessToken = localStorage.getItem("authToken");
    const response = await useFetch(`${apiBaseUrl}/users/addresses`, {
      method: "DELETE",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: data,
    });

    if (response.data.value) {
      toast.add({
        title: "Sucesso",
        description: "Registro apagado com sucesso",
      });
    } else {
      toast.add({
        title: "Erro",
        description: "Algo deu errado, por favor, tente mais tarde",
      });
    }
  } catch (error) {
    useToast("error", error.message);
  }
};

const deleteDepentent = async (_id) => {};

const getGenUserGroups = async () => {
  const accessToken = localStorage.getItem("authToken");
  const nrorg = localStorage.getItem("NRORG");
  const status = "A";

  const response = await useFetch(
    `${apiBaseUrl}/users/groups?STATUS=${status}&NRORG=${nrorg}`,
    {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );

  return response.data.value;
};

export default {
  getGenUsers,
  getGenUserGroups,

  createGenUser,
  createGenUserGroup,

  updateGenUser,
  updateGenUserGroup,

  deleteContact,
  deleteAddress,
  deleteDepentent,

  savePermission,
};
