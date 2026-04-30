"use client";

import { LanguageProvider } from "@/hooks/useTranslation";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
