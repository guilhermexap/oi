const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const postPreRegister = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/pre-register`, {
    method: "POST",
    headers: {
      authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.status.value === "success") {
    toast.add({
      title: "Sucesso",
      description: "O registro foi criado",
    });
    return response.status.value;
  } else {
    return toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const updatePreRegister = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/pre-register/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.status.value === "success") {
    toast.add({
      title: "Sucesso",
      description: "O registro foi editado",
    });
    return response.status.value;
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
  return response.data.value;
};

const updateStatus = async (selectIds, STATUS, USER_ID) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/pre-register/update-status/${selectIds}`,
    {
      method: "PUT",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: { STATUS, USER_ID },
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

function formatCpf(cpf) {
  const cpfFormatted = cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );

  return cpfFormatted;
}

export default {
  postPreRegister,
  updatePreRegister,
  updateStatus,
  formatCpf,
};
