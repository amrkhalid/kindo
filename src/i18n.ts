
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
import heTranslation from './locales/he/translation.json';

// Define language metadata including RTL information
const languages = {
  en: { dir: 'ltr' },
  ar: { dir: 'rtl' },
  he: { dir: 'rtl' }
};

// Function to set document direction
const setDocumentDirection = (language: string) => {
  const dir = languages[language as keyof typeof languages]?.dir || 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      },
      he: {
        translation: heTranslation
      }
    },
    lng: localStorage.getItem('preferredLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Set initial direction
setDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  setDocumentDirection(lng);
});

export default i18n;

