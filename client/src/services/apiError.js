import i18n from "../i18n";

export const getApiErrorMessage = (error, t, fallbackKey) => {
  if (i18n.language?.startsWith("ar")) return t(fallbackKey);
  return error?.response?.data?.error?.message || t(fallbackKey);
};
