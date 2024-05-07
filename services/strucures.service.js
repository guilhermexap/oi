const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const postStructureUnit = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/structure/unit`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "A unidade foi criada",
    });
    return response.data.value;
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const postAddress = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/structure/unit/address`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    return response.data.value;
    // toast.add({
    //   title: "Sucesso",
    //   description: "O Evento foi criado",
    // });
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const updateStructureUnit = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/structure/unit/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "Os dados foram editados",
    });
    return response.data.value;
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const updateAddress = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/structure/unit/address/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: data,
    }
  );
  if (response.data.value) {
    return response.data.value;

    // toast.add({
    //   title: "Sucesso",
    //   description: "O  registro foi editado",
    // });
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
  return response.data.value;
};

const updateStatus = async (selectIds, status, userId) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/structure/update-status/${selectIds}`,
    {
      method: "PUT",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: { STATUS: status, USER_ID: userId },
    }
  );
  if (response.data.value) {
    return response.data.value;
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};
const updateEvtE = async (data, ID) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/events/e/${ID}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O Evento foi alterado",
    });
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
  return response.data.value;
};

const convertStatusToBoolean = (value) => {
  if (value === "A") {
    return true;
  } else if (value === "I") {
    return false;
  } else {
    return false;
  }
};

const convertStatusToString = (value) => {
  return value ? "A" : "I";
};

export default {
  postStructureUnit,
  postAddress,
  updateAddress,
  updateStructureUnit,
  updateEvtE,
  updateStatus,
  convertStatusToBoolean,
  convertStatusToString,
};
