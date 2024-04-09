const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const postTimeTimesheet = async (data) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/time-timesheet`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.status.value === "success") {
    toast.add({
      title: "Sucesso",
      description: "O horário foi criado",
    });
    return response.status.value;
  } else if (response.status.value === "error") {
    const errorMessage =
      response.error.value.data.errors.SER_DAY_TIMESHEET_VALUES[0];
    toast.add({
      color: "red",
      title: "Erro",
      description:
        errorMessage || "Algo deu errado, por favor, tente mais tarde",
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

const updateTimeTimesheet = async (data, id) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/time-timesheet/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: data,
  });
  if (response.status.value === "success") {
    toast.add({
      title: "Sucesso",
      description: "O horário foi editado",
    });
    return response.status.value;
  } else if (response.error.value.data.errors) {
    const errorMessage =
      response.error.value.data.errors.SER_DAY_TIMESHEET_VALUES[0];
    toast.add({
      color: "red",
      title: "Erro",
      description:
        errorMessage || "Algo deu errado, por favor, tente mais tarde",
    });
  } else {
    toast.add({
      color: "red",
      title: "Erro",
      description: "Algo deu errado, por favor, tente mais tarde",
    });
  }
};

const updateStatus = async (selectIds, STATUS, USER_ID) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/time-timesheet/update-status/${selectIds}`,
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

const convertDays = (days) => {
  if (days !== null) {
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Fer"];
    const arrayFromDatabase = days.split(",").map(Number);
    arrayFromDatabase.sort((a, b) => a - b);
    const selectedDays = arrayFromDatabase.map(
      (dayIndex) => daysOfWeek[dayIndex]
    );

    return selectedDays.join(", ");
  } else {
    return "";
  }
};

export default {
  postTimeTimesheet,
  updateTimeTimesheet,
  updateStatus,
  convertDays,
};
