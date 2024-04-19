import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../asset/i18n/en';
import viTranslation from '../asset/i18n/vi';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            vi: {
                translation: viTranslation,
            },
            en: {
                translation: enTranslation,
            },
            // thêm các ngôn ngữ khác ở đây
        },
        fallbackLng: 'vi',
        debug: true,
        interpolation: {
            escapeValue: false, // không cần thiết cho React
        },
    });

export default i18n;
