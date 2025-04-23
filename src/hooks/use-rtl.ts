import { useTranslation } from "react-i18next";

const RTL_LANGUAGES = ["ar", "he", "fa"];

export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = RTL_LANGUAGES.includes(i18n.language);

  return { isRTL };
}; 