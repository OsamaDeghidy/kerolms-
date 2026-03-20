"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold"
      title={t('switch_language')}
    >
      <Languages size={18} className="text-primary" />
      <span className="uppercase">{locale === 'ar' ? 'EN' : 'AR'}</span>
    </button>
  );
}
