import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="glass-panel p-2.5 rounded-2xl shadow-lg border border-white/20 text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
      title={i18n.language.startsWith('en') ? "हिंदी में बदलें" : "Switch to English"}
    >
      <Languages className="w-4 h-4 text-blue-500" />
      <span className="text-[10px] font-bold uppercase hidden sm:inline">
        {i18n.language.startsWith('en') ? "EN" : "HI"}
      </span>
    </button>
  );
};
