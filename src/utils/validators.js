export const getErrorMessage = (error, fallback = "Ocurrió un error inesperado") => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return error.message || error.error || error.data?.error || fallback;
};