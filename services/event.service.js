const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const indexEvents = async (nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/services-evt-event/options?nrorg=${nrorg}`,
    {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
  return response.data.value;
};

const indexCategories = async (nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/events/gen-category?nrorg=${nrorg}`,
    {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
  return response.data.value;
};

const postEvent = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/services-evt-event`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O Local foi criado",
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

const postEvtE = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/events/e`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O Evento foi criado",
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

const postTicket = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/events/ticket`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O registro foi criado",
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

const postEtvTags = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/events/evt-tag-event`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    // toast.add({
    //   title: "Sucesso",
    //   description: "O registro foi criado",
    // });
    return response.data.value;
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const putTicket = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/events/ticket/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    toast.add({
      title: "Sucesso",
      description: "O  registro foi editado",
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

const updateTicketStatus = async (selectIds, status, userId) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/events/tickets/update-status/${selectIds}`,
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
  indexEvents,
  postEvent,
  postEvtE,
  indexCategories,
  postTicket,
  postEtvTags,
  putTicket,
  updateEvtE,
  updateTicketStatus,
  convertStatusToBoolean,
  convertStatusToString,
};
