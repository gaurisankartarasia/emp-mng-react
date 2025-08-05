// src/components/Globewitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

const Globewitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={currentLang}>
      
      <SelectTrigger className="w-fit">

        <Globe/>
        <SelectValue placeholder="Select language" />
        
      </SelectTrigger>
      
      <SelectContent>
        
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="od">ଓଡ଼ିଆ (Odiya) </SelectItem>
         <SelectItem value="hn">हिंदी (Hindi) </SelectItem>
         <SelectItem value="cn">中国人 (Chinese)</SelectItem>
         <SelectItem value="ar">عربي (Arabic) </SelectItem>
         <SelectItem value="rs">русский (Russian) </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default Globewitcher;
