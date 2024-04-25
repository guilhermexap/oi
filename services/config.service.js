const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
const toast = useToast();

const indexGenOrganization = async (nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/organization/get-by-nrorg/${nrorg}`,
    {
      method: "GET",
      headers: {
        authorization: `${accessToken}`,
      },
    }
  );
  return response.data.value;
};

const update = async (data, nrorg) => {
  const accessToken = localStorage.getItem("authToken");
  const response = await useFetch(
    `${apiBaseUrl}/organization/update/${nrorg}`,
    {
      method: "PUT",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: data,
    }
  );
  if (response.data.value) {
    if ("FIRST_TIME" in data) {
      return;
    }
    toast.add({
      title: "Sucesso",
      description: "O dados da comunidade foram salvos!",
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

const cleanCNPJ = (cnpj) => {
  return cnpj.replace(/\D/g, "");
};

const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight--;
    if (weight === 1) weight = 9;
  }
  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (parseInt(cnpj.charAt(12)) !== firstDigit) return false;

  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight--;
    if (weight === 1) weight = 9;
  }
  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (parseInt(cnpj.charAt(13)) !== secondDigit) return false;

  return true;
};

export default {
  indexGenOrganization,
  update,
  cleanCNPJ,
  validateCNPJ,
};
