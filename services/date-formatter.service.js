export const formatDate = (dateString) => {
  if (dateString === null) {
    return "-";
  }
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", options);
};

export const formatDateWithoutSeconds = (dateString) => {
  if (dateString === null) {
    return "-";
  }
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", options);
};

export const formatDateWithoutHours = (dateString) => {
  if (dateString === null) {
    return "-";
  }
  const hasTime = dateString.includes(":");

  const date = hasTime
    ? new Date(dateString)
    : new Date(`${dateString}T00:00:00`);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("pt-BR", options);
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
  formatDate,
  formatDateWithoutHours,
  convertDays,
};
