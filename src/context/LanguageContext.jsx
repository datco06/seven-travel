import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'travel-tour-language';
const SUPPORTED = ['vi', 'en'];

function detectInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'vi';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) {
    return stored;
  }
  const browser = navigator.language?.slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : 'vi';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => detectInitialLanguage());

  const changeLanguage = (next) => {
    setLanguage(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const value = useMemo(
    () => ({ language, setLanguage: changeLanguage }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

export const AVAILABLE_LANGUAGES = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
];
