const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const indexTimesheet = async (nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/timesheet/options?nrorg=${nrorg}`,
    {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
  return response.data.value;
};

const postTimesheet = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/timesheet`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O quadro de horários foi publicado",
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

const updateTimesheet = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/timesheet/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O quadro de horários foi editado",
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

const updateStatus = async (selectIds, STATUS, USER_ID) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/timesheet/update-status/${selectIds}`,
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

export default {
  indexTimesheet,
  postTimesheet,
  updateTimesheet,
  updateStatus,
};
