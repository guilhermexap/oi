const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const apiBaseUrlSchedule = runtimeConfig.public.apiBaseUrlSchedule;
const toast = useToast();

const getUsers = async (nrOrg) => {
  const accessToken = localStorage.getItem("authToken");

  const response = await useFetch(`${apiBaseUrl}/approval?nrorg=${nrOrg}`, {
    method: "GET",
    headers: {
      Authorization: `${accessToken}`,
    },
  });

  return response.data.value;
};

const getUser = async (userId) => {
  const accessToken = localStorage.getItem("authToken");

  const response = await useFetch(`${apiBaseUrl}/users/get-user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `${accessToken}`,
    },
  });

  return response.data.value;
};

const createGenUserTypeRel = async (data, status, userId) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrlSchedule}/users/create-gen-user-type-rel`,
    {
      method: "POST",
      headers: {
        authorization: `${accessToken}`,
      },
      body: {
        GEN_USER_ID: data.GEN_USER_ID,
        GEN_USER_TYPE_ID: 1,
        NRORG: data.NRORG,
        EXTERNAL_ID: data.EXTERNAL_ID,
        STATUS: status,
        CREATED_BY: parseInt(userId),
      },
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

const updateApprovalStatus = async (selectIds, status, userId) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(`${apiBaseUrl}/approval/${selectIds}`, {
    method: "PUT",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: { STATUS: status, MODIFIED_BY: userId },
  });
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

// const getUserName = async (userId) => {
//   const response = await getUser(userId);

//   // console.log(response.FIRST_NAME, response.LAST_NAME);
//   return `${response.FIRST_NAME.trim()} ${response.LAST_NAME.trim()}` || "-";
// };

export default {
  createGenUserTypeRel,
  getUser,
  getUsers,
  updateApprovalStatus,
};
