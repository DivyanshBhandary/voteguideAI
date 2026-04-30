"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

const translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.checklist": "Checklist",
    "nav.assistant": "Q&A Assistant",
    "nav.polling": "Polling Booth",
    "nav.settings": "Settings",
    "hero.title": "Your Intelligent Election Guide",
    "hero.subtitle": "Navigate the 2026 elections with confidence. Check eligibility, get real-time answers, and track your registration journey all in one place.",
    "hero.cta": "Start Your Journey",
    "search.placeholder": "Search FAQs...",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड",
    "nav.checklist": "चेकलिस्ट",
    "nav.assistant": "प्रश्न एवं उत्तर सहायक",
    "nav.polling": "मतदान केंद्र",
    "nav.settings": "सेटिंग्स",
    "hero.title": "आपका बुद्धिमान चुनाव मार्गदर्शक",
    "hero.subtitle": "2026 के चुनावों में आत्मविश्वास के साथ नेविगेट करें। अपनी पात्रता की जाँच करें, वास्तविक समय में उत्तर प्राप्त करें, और एक ही स्थान पर अपनी पंजीकरण यात्रा को ट्रैक करें।",
    "hero.cta": "अपनी यात्रा शुरू करें",
    "search.placeholder": "सामान्य प्रश्न खोजें...",
  }
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Optional: Read from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved === "en" || saved === "hi") {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: TranslationKey) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
