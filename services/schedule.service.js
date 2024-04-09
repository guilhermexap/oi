const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const apiBaseUrlSchedule = runtimeConfig.public.apiBaseUrlSchedule;
const apiCancelSchedule = runtimeConfig.public.apiCancelSchedule;
const toast = useToast();

const indexSpaces = async (nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/services?nrorg=${nrorg}&active=A&type=SPACE_SCHEDULE`,
    {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
  return response.data.value;
};

const getSchedule = async (data) => {
  // console.log(data);
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrlSchedule}/service/get-structures-timetimesheets-schedulings`,
    {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "X-Forwarded-Proto": "http",
        "Content-Type": "application/json",
        API_KEY: "base64:xOuWgoB1D9suLlfiey63mvsqKgobS/DfLLMQtIjDUhw=",
      },
      body: JSON.stringify({
        requestType: "Row",
        row: {
          NRORG: data.NRORG,
          GEN_USER_ID: data.GEN_USER_ID,
          STATUS: "A",
          TYPE: "SPACE_SCHEDULE",
          // SELECTED_DATE: "2024-01-12",
          SELECTED_DATE: data.SELECTED_DATE,
          // SERVICE_ID: 69,
          SERVICE_ID: data.SERVICE_ID,
          PAGE: 1,
        },
      }),
    }
  );
  if (!response.data.value) {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
  // console.log(response);
  return response.data.value;
};

const getUsersLikeName = async (partialName, nrorg) => {
  // console.log(data);
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrlSchedule}/users/get-user-like-name`,
    {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify({
        requestType: "Row",
        row: { PARTIAL_NAME: partialName, NRORG: nrorg },
      }),
    }
  );
  if (response.status.value === "success") {
    return response.data.value;
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
  return response.data.value;
};

const postReserve = async (data, type) => {
  // console.log(data);
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrlSchedule}/schedule/gen-schedule`,
    {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify({
        requestType: "Row",
        row: data,
      }),
    }
  );
  if (response.status.value === "success") {
    if (type === "BLOQUEAR") {
      toast.add({
        title: "Sucesso",
        description: "Os horários foram bloqueados",
      });
    } else {
      toast.add({
        title: "Sucesso",
        description: "Reserva feita com sucesso",
      });
    }

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

const putCheckInForAll = async (objects) => {
  const results = [];
  for (const obj of objects) {
    const result = await putCheckIn(obj);
    results.push(result);
  }
  const hasError = results.includes("error");

  if (hasError) {
    toast.add({
      title: "Erro",
      description:
        "Algo deu errado em pelo menos uma das operações, por favor, tente novamente mais tarde",
      color: "red",
    });
  } else {
    toast.add({
      title: "Sucesso",
      description: "O check-in foi realizado com sucesso",
    });
    return "success";
  }
};

const putCheckIn = async (obj) => {
  const accessToken = localStorage.getItem("authToken");
  const id = obj.ID;
  const data = {
    SCHEDULE_TOKEN: obj.SCHEDULE_TOKEN,
    GEN_USER_ID: obj.GEN_USER_ID,
    STATUS: "C",
  };

  // console.log(data);

  try {
    const response = await useFetch(
      `${apiBaseUrlSchedule}/schedule/gen-schedule-user-rel/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    if (response.status.value === "success") {
      return "success";
    } else {
      throw new Error("Erro ao fazer o check-in");
    }
  } catch (error) {
    console.error(error);
    return "error";
  }
};

const postCancelReservationsForAll = async (objects) => {
  const processedTokens = new Set();
  const results = [];
  for (const obj of objects) {
    const { SCHEDULE_TOKEN } = obj.GEN_SCHEDULE;
    if (processedTokens.has(SCHEDULE_TOKEN)) {
      continue; // Pula para o próximo objeto se o token já foi processado
    }

    const result = await putCancelReserve(obj);
    results.push(result);
    processedTokens.add(SCHEDULE_TOKEN);
  }
  const hasError = results.includes("error");
  if (hasError) {
    toast.add({
      title: "Erro",
      description:
        "Algo deu errado em pelo menos uma das operações, por favor, tente novamente mais tarde",
      color: "red",
    });
  } else if (results[0].message !== undefined) {
    toast.add({
      title: "Erro",
      description: results[0].message,
      color: "red",
    });
  } else {
    toast.add({
      title: "Sucesso",
      description: "As reservas foram canceladas com sucesso",
    });
    return "success";
  }
};

const putCancelReserve = async (obj) => {
  const accessToken = localStorage.getItem("authToken");
  const DATE = obj.GEN_SCHEDULE.INITIAL_DATE;
  const splitDate = DATE.split("T");
  const data = {
    requestType: "Row",
    row: {
      USER_ID: obj.GEN_SCHEDULE.users[0].GEN_USER_ID,
      SCHEDULE_ID: obj.GEN_SCHEDULE.ID,
      DATE_APPOINTMENT: `${splitDate[0]} ${obj.INITIAL_TIME}`,
      SERVICE_NAME: "Serviço",
      NRORG: obj.NRORG,
      TOKEN: `TK_USER_${obj.GEN_SCHEDULE.users[0].GEN_USER_ID}`,
      SCHEDULE_TOKEN: obj.GEN_SCHEDULE.users[0].SCHEDULE_TOKEN,
    },
  };
  // console.log(data);
  try {
    const response = await useFetch(`${apiCancelSchedule}/cancelSchedule`, {
      method: "POST",
      headers: {
        authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: data,
    });
    const responseData = JSON.parse(response.data.value);
    const message = responseData.dataset.response.message;
    if (message === "Não é possível cancelar após o horário agendado.") {
      // throw new Error("Erro ao cancelar a reserva");
      return { message };
    } else if (message[0] === "Successful cancellation") {
      return "success";
    } else {
      return "error";
    }
  } catch (error) {
    // console.error(error);
    return "error";
  }
};

const convertTimeToMinutes = (time) => {
  const [hour, minute] = time.split(":");
  return parseInt(hour) * 60 + parseInt(minute);
};

function capitalize(str) {
  if (typeof str === "string") {
    // console.log(typeof str === "string");
    const s = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    console.log(s);
    return s;
  } else {
    return "";
  }
}

function showErrorToast(message) {
  return toast.add({
    color: "red",
    title: "Erro",
    description: message,
  });
}

export default {
  indexSpaces,
  getSchedule,
  getUsersLikeName,
  postReserve,
  putCheckInForAll,
  postCancelReservationsForAll,
  convertTimeToMinutes,
  capitalize,
  showErrorToast,
};
