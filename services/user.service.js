const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const getGenUsers = async (userType) => {
  const access_token = localStorage.getItem("authToken");
  const nrorg = localStorage.getItem("NRORG");

  const response = await useFetch(
    `${apiBaseUrl}/users?limit=1000&status=A&userType=${userType}&nrorg=${nrorg}`,
    {
      method: "GET",
      headers: {
        Authorization: `${access_token}`
      }
    }
  );

  return response.data.value;
};

const createGenUser = async (data) => {
  const access_token = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users`, {
    method: "POST",
    headers: {
      Authorization: `${access_token}`
    },
    body: data
  });

  return response.data.value;
};

const createGenUserGroup = async (data) => {
  const access_token = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/groups`, {
    method: "POST",
    headers: {
      Authorization: `${access_token}`
    },
    body: data
  });

  return response.data.value;
};

const updateGenUserGroup = async (data) => {
  const access_token = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/groups`, {
    method: "PUT",
    headers: {
      Authorization: `${access_token}`
    },
    body: data
  });

  return response.data.value;
};

const updateGenUser = async (data) => {
  const access_token = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users`, {
    method: "PUT",
    headers: {
      Authorization: `${access_token}`
    },
    body: data
  });

  return response.data.value;
};

const savePermission = async (data) => {
  const access_token = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/groups/${data.ID}`, {
    method: "PUT",
    headers: {
      Authorization: `${access_token}`
    },
    body: data
  });

  return response.data.value;
}

const deleteContact = async (data) => {
  const access_token = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/users/contacts`, {
    method: "DELETE",
    headers: {
      Authorization: `${access_token}`
    },
    body: data
  });

  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "Registro apagado com sucesso"
    });
  } else {
    toast.add({
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde"
    });
  }
};

const deleteAddress = async (data) => {
  try {
    const access_token = localStorage.getItem("authToken");
    const response = await useFetch(`${apiBaseUrl}/users/addresses`, {
      method: "DELETE",
      headers: {
        Authorization: `${access_token}`
      },
      body: data
    });

    if (response.data.value) {
      toast.add({
        title: "Sucesso",
        description: "Registro apagado com sucesso"
      });
    } else {
      toast.add({
        title: "Erro",
        description: "Algo deu errado, por favor, tente mais tarde"
      });
    }
  } catch (error) {
    useToast("error", error.message);
  }
};

const deleteDepentent = async (id) => {};

const getGenUserGroups = async () => {
  const access_token = localStorage.getItem("authToken");
  const nrorg = localStorage.getItem("NRORG");
  const status = 'A';

  const response = await useFetch(
    `${apiBaseUrl}/users/groups?STATUS=${status}&NRORG=${nrorg}`,
    {
      method: "GET",
      headers: {
        Authorization: `${access_token}`
      }
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
