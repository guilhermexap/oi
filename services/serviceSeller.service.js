const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

// services-seller/evtEventSellerStore
// services-seller/serServiceSellerRel
const postServiceSeller = async (data, eventId, serviceId) => {
  const accessToken = localStorage.getItem("authToken");

  const dataEvtSeller = {
    EVT_EVENT_ID: eventId,
    GEN_USER_ID: data.GEN_USER_ID,
    NRORG: data.NRORG,
    USER_ID: data.USER_ID,
    STATUS: "A",
  };

  // console.log(data);
  // console.log(dataEvtSeller);
  // console.log(dataSerServiceSellerRel);
  const response = await useFetch(
    `${apiBaseUrl}/services-seller/evtEventSellerStore`,
    {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: dataEvtSeller,
    }
  );
  if (response.data.value) {
    const dataSerServiceSellerRel = {
      SER_SERVICE_ID: serviceId,
      INITIAL_TIME: data.INITIAL_TIME,
      FINAL_TIME: data.FINAL_TIME,
      DAY_OFF: data.DAY_OFF,
      EVT_EVENT_SELLER_ID: response.data.value.ID,
      NRORG: data.NRORG,
      USER_ID: data.USER_ID,
      STATUS: "A",
    };
    console.log(response.data.value);
    const res = await useFetch(
      `${apiBaseUrl}/services-seller/serServiceSellerRel`,
      {
        method: "POST",
        headers: {
          Authorization: `${accessToken}`,
        },
        body: dataSerServiceSellerRel,
      }
    );
    console.log(res.data.value);
    if (res.data.value) {
      toast.add({
        title: "Sucesso",
        description: "O profissional foi associado",
      });
      return res.status.value;
    } else {
      return toast.add({
        color: "red",
        title: "Erro",
        description: "Algo deu errado, por favor, tente mais tarde",
      });
    }
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
  return response.status.value;
};

const updateServiceSeller = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/services-seller/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.status.value === "success") {
    // console.log(response.data.value.ID);
    toast.add({
      title: "Sucesso",
      description: "As informações foram alteradas",
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
    `${apiBaseUrl}/services-seller/update-status/${selectIds}`,
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
  postServiceSeller,
  updateServiceSeller,
  updateStatus,
};
