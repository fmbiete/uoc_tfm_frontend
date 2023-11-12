import { loadTranslations } from '@angular/localize';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

export const initializeLanguage = (): Promise<void> | void => {
  const language = localStorage.getItem('language');
  if (language && language !== 'en-US') {
    return fetch(`/assets/i18n/${language}.json`)
      .then((response) => response.json())
      .then((response) => {
        loadTranslations(response.translations);
      })
      .catch(() => {
        console.error(`language ${language} not found, fallback to english`);
      });
  }
};

export const initializeSupportedLocales = () => {
  registerLocaleData(localeEs, 'es-ES');

  const language = localStorage.getItem('language');
  if (language == 'es-ES') {
    document.documentElement.lang = language;
  }
  return language ?? 'en-US';
};
