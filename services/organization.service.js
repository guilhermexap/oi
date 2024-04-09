import Jsona from "jsona";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const dataFormatter = new Jsona();

const getOrganizations = async () => {
  const access_token = localStorage.getItem("authToken");

  const response = await useFetch(`${apiBaseUrl}/get-user-organizations`, {
    method: "POST",
    headers: {
      Authorization: `${access_token}`
    }
  });

  if(response.data.value) {
    return response.data.value;
  } else {
    useToast("error", response.error.value.data.errors[0].detail);
    localStorage.clear();
  }
  
};

export default {
  getOrganizations
};
