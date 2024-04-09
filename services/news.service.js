const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const getTags = async (nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/news/tags?nrorg=${nrorg}`, {
    method: "GET",
    headers: {
      Authorization: `${accessToken}`,
    },
  });
  return response.data.value;
};

const postNews = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/news`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    // console.log("POST", response.data.value);
    toast.add({
      title: "Sucesso",
      description: "O comunicado foi publicado",
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

const updateNews = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/news/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.data.value) {
    // console.log("PUT", response.data.value);
    toast.add({
      title: "Sucesso",
      description: "O comunicado foi alterado",
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

const updateStatus = async (selectIds, status, userId) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/news/update-status/${selectIds}`,
    {
      method: "PUT",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: { ACTIVE: status, USER_ID: userId },
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

const convertToDate = (dateString) => {
  if (dateString === null || dateString === undefined) {
    return "";
  }
  const dateObject = new Date(dateString);
  return dateObject.toISOString().split("T")[0];
};

const convertToBoolean = (value) => {
  if (value === "1") {
    return true;
  } else if (value === "2") {
    return false;
  } else {
    return undefined;
  }
};

const convertToString = (value) => {
  return value ? "1" : "2";
};

export default {
  getTags,
  postNews,
  updateNews,
  updateStatus,
  convertToDate,
  convertToBoolean,
  convertToString,
};
