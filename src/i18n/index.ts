import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import zh from './locales/zh.json';

const resources = {
    ru: { translation: ru },
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    es: { translation: es },
    zh: { translation: zh },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ru',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

export default i18n;