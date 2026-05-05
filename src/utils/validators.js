export const validateEmail = (email) => /\S+@\S+\.\S+/.test(String(email).trim());

export const validatePassword = (password) => String(password).length >= 6;

export const getErrorMessage = (error, fallback = "Ocurrió un error inesperado") => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return error.message || error.error || error.data?.error || fallback;
};