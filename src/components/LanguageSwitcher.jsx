// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={currentLang}>
      <SelectTrigger className="w-fit">
        <Languages/>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="od">ଓଡ଼ିଆ</SelectItem>
         <SelectItem value="hn">हिंदी</SelectItem>
         <SelectItem value="cn">中国人</SelectItem>
         <SelectItem value="ar">عربي</SelectItem>
         <SelectItem value="rs">русский</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
