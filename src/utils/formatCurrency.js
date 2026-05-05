export const formatCurrency = (value = 0) => {
  const amount = Number(value) || 0;
  return `$ ${amount.toLocaleString("es-AR")}`;
};