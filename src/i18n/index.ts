import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
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
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['ru', 'en', 'de', 'fr', 'es', 'zh'],
        nonExplicitSupportedLngs: true, // en-US → en
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'traceai-lang',
        },
    });

// Синхронизация <html lang> при смене языка
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
});

// Инициализация при первом рендере
if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.language;
}

export default i18n;