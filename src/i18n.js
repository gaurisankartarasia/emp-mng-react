import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json'; 
import od from '@/locales/odiya.json'; 
import hn from '@/locales/hindi.json';
import cn from '@/locales/chinese.json';
import ar from '@/locales/arabic.json';
import rs from '@/locales/russian.json';

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      od: { translation: od },
       hn: { translation: hn },
         cn: { translation: cn },
         ar: { translation: ar },
          rs: { translation: rs }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
